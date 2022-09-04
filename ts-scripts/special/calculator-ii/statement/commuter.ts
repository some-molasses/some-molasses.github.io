import { CalculatorComponent } from "../calculator-component.js";
import { CalculatorFunction, CalculatorOperator } from "../models/function.js";
import { CalculatorSingular } from "../models/singular.js";
import { CalculatorTerm } from "../models/term.js";
import { CalculatorValue } from "../models/value.js";
import { CalculatorVariable } from "../models/variable.js";
import { CalculatorParser } from "../parser.js";
import { CalculatorTester } from "../tester.js";

export class CalculatorCommuter extends CalculatorComponent {
  /**
   * Pulls all variables to the right side of their disjunctive clause
   */
  static commute(input: CalculatorTerm, debug?: boolean): CalculatorTerm {
    this.log(debug, `---------- COMMUTE ----------`);
    return this.buildCommutedTerm(input, debug);
  }

  private static buildCommutedTerm(input: CalculatorTerm, debug: boolean): CalculatorTerm {
    const singulars = this.getValuesOfDisjuctiveClause(input);

    this.log(debug, `building commuted term from ${input.print()}`);

    const values = {
      factors: [],
      divisors: [],
    };
    const variables = {
      factors: [],
      divisors: [],
    };
    const miscTerms = {
      factors: [],
      divisors: [],
    };

    // filter values/variables into arrays
    for (const f of singulars.factors) {
      if (f instanceof CalculatorValue) values.factors.push(f);
      else if (f instanceof CalculatorVariable) variables.factors.push(f);
      else if (f instanceof CalculatorFunction) miscTerms.factors.push(f);
    }
    for (const d of singulars.divisors) {
      if (d instanceof CalculatorValue) values.divisors.push(d);
      else if (d instanceof CalculatorVariable) variables.divisors.push(d);
      else if (d instanceof CalculatorFunction) miscTerms.divisors.push(d);
    }

    this.log(debug, `values factors: ${values.factors.map((f) => f.print()).join(', ')}, value divisors: ${values.divisors.map((f) => f.print()).join(', ')}`);
    this.log(debug, `variable factors: ${variables.factors.map((f) => f.print()).join(', ')}, variable divisors: ${variables.divisors.map((f) => f.print()).join(', ')}`);
    this.log(debug, `term factors: ${miscTerms.factors.map((f) => f.print()).join(', ')}, term divisors: ${miscTerms.divisors.map((f) => f.print()).join(', ')}`);

    const valuesTerm = this.buildTermFromFactorsAndDivisors(values.factors, values.divisors, debug);
    const variablesTerm = this.buildTermFromFactorsAndDivisors(variables.factors, variables.divisors, debug);
    const miscTerm = this.buildTermFromFactorsAndDivisors(miscTerms.factors, miscTerms.divisors, debug);

    this.log(debug, `values term generated: ${valuesTerm ? valuesTerm.print() : 'none'}, variables term generated: ${variablesTerm ? variablesTerm.print() : 'none'}`);

    let coreResult: CalculatorTerm;
    if (valuesTerm && variablesTerm) {
      coreResult = new CalculatorFunction(valuesTerm, variablesTerm, CalculatorOperator.multiply);
    } else if (valuesTerm && !variablesTerm) {
      coreResult = valuesTerm;
    } else if (!valuesTerm && variablesTerm) {
      coreResult = variablesTerm;
    }

    if (miscTerm) {
      if (coreResult) {
        return new CalculatorFunction(coreResult, miscTerm, CalculatorOperator.multiply);
      } else {
        return miscTerm;
      }
    } else {
      return coreResult;
    }
  }

  private static buildTermFromFactorsAndDivisors(factors: CalculatorSingular[], divisors: CalculatorSingular[], debug: boolean): CalculatorTerm | null {
    this.log(debug, `building term from factors ${factors.map((f) => f.print()).join(', ')} and divisors ${divisors.map((d) => d.print()).join(', ')}`);

    const divisor = divisors.length > 0 ? this.buildTermFromFactorsAndDivisors(divisors, [], debug) : null;
    let dividend: CalculatorTerm;

    if (factors.length === 0) dividend = null;
    else if (factors.length === 1) dividend = factors[0];
    else {
      const variableCounts = {};

      for (const f of factors) {
        if (variableCounts[f.print()]) variableCounts[f.print()]++;
        else variableCounts[f.print()] = 1;
      }

      let current: CalculatorTerm = null;
      for (const f of factors) {
        if (!variableCounts[f.print()]) continue; // already included

        let nextTerm: CalculatorTerm;
        if (variableCounts[f.print()] === 1)
          nextTerm = f;
        else nextTerm = new CalculatorFunction(f, new CalculatorValue(variableCounts[f.print()]), CalculatorOperator.exponent);

        if (current) current = new CalculatorFunction(current, nextTerm, CalculatorOperator.multiply);
        else current = nextTerm;

        delete variableCounts[f.print()];
      }

      dividend = current;
    }

    this.log(debug, `dividend: ${dividend?.print()}, divisor: ${divisor?.print()}`);

    if (dividend && divisor) return new CalculatorFunction(dividend, divisor, CalculatorOperator.divide);
    else if (dividend && !divisor) return dividend;
    else if (!dividend && divisor) return new CalculatorFunction(new CalculatorValue(1), divisor, CalculatorOperator.divide);
    else return null;
  }

  private static getValuesOfDisjuctiveClause(input: CalculatorTerm, debug?: boolean): { factors: CalculatorTerm[], divisors: CalculatorTerm[] } {
    function exit(factors: CalculatorTerm[], divisors: CalculatorTerm[]) {
      return {
        factors: factors,
        divisors: divisors,
      }
    }

    this.log(debug, `getting values of disj clause ${input.print()}`);

    if (input instanceof CalculatorValue || input instanceof CalculatorVariable)
      return exit([input], []); // treat self as single multiplied clause
    else if (input instanceof CalculatorFunction) {
      switch (input.operator) {
        case CalculatorOperator.add:
        case CalculatorOperator.subtract:
          input.leftTerm = this.buildCommutedTerm(input.leftTerm, debug);
          input.rightTerm = this.buildCommutedTerm(input.rightTerm, debug);
          return exit([input], []); // treat self as single multiplied clause
        case CalculatorOperator.multiply: {
          const leftResult = this.getValuesOfDisjuctiveClause(input.leftTerm);
          const rightResult = this.getValuesOfDisjuctiveClause(input.rightTerm);

          return exit(
            leftResult.factors.concat(rightResult.factors),
            leftResult.divisors.concat(rightResult.divisors)
          );
        } case CalculatorOperator.divide: {
          const leftResult = this.getValuesOfDisjuctiveClause(input.leftTerm);
          const rightResult = this.getValuesOfDisjuctiveClause(input.rightTerm);

          return exit(
            leftResult.factors.concat(rightResult.divisors),
            leftResult.divisors.concat(rightResult.factors)
          );
        } case CalculatorOperator.exponent:
          input.leftTerm = this.buildCommutedTerm(input.leftTerm, debug);
          input.rightTerm = this.buildCommutedTerm(input.rightTerm, debug);
          return exit([input], []); // treat self as single multiplied clause
      }
    }

    throw new Error('Bad input type given');
  }

  static log(debug: boolean, message: any) {
    if (debug) console.log(message);
  }

  static test() {
    const tester: CalculatorTester<string> = new CalculatorTester<string>('Commuter', (input: string, debug?: boolean) => {
      return CalculatorCommuter.commute(new CalculatorParser(input).output, debug).print();
    });

    tester.test('x/7', '((1 / 7) * x)');

    tester.test('2*3*4*x', '(((2 * 3) * 4) * x)');
    tester.test('((2*x)*(3*y))', '((2 * 3) * (x * y))');
    tester.test('((2*x)/(3*y))', '((2 / 3) * (x / y))');
    tester.test('((2*x)/(3/y))', '((2 / 3) * (x * y))');

    tester.test('x*7', '(7 * x)');
    tester.test('x/7', '((1 / 7) * x)');

    tester.test('3*(x*y)', '(3 * (x * y))');
    tester.test('3*(x*4)', '((3 * 4) * x)');
    tester.test('3*2*(x*4)', '(((3 * 2) * 4) * x)');

    tester.test('(x*(4+5))', '(x * (4 + 5))');

    tester.test('3*2*(x*4)+x*7', '((((3 * 2) * 4) * x) + (7 * x))');
    tester.test('(2*3)*4*x', '(((2 * 3) * 4) * x)');

    tester.test('(2/3)*4*x', '(((2 * 4) / 3) * x)');

    tester.test('1/(x*2)', '((1 / 2) * (1 / x))');

    tester.test('1/2^x', '(1 * (1 / (2 ^ x)))');
    tester.test('(3^(4*x*3*(x+4)*4)/(2*3))*5',
      '((5 / (2 * 3)) * (3 ^ ((((4 ^ 2) * 3) * x) * (x + 4))))');

    tester.test('((3 * 4) * x)', '((3 * 4) * x)');

    tester.test('3*(x*x)', '(3 * (x ^ 2))');
    tester.test('x*((3*x)*4)', '((3 * 4) * (x ^ 2))');

    tester.test('x*x*x', '(x ^ 3)');
    tester.test('x*((3*x)*4*x)*x', '((3 * 4) * (x ^ 4))');
  }
}