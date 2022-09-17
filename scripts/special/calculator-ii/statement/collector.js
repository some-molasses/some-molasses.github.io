import { MathNum } from "../../../tools/math/number.js";
import { CalculatorComponent } from "../calculator-component.js";
import { CalculatorFunction, CalculatorOperator } from "../models/function.js";
import { CalculatorUnaryFunction } from "../models/unary-function.js";
import { CalculatorValue } from "../models/value.js";
import { CalculatorVariable } from "../models/variable.js";
import { CalculatorParser } from "../parser.js";
import { CalculatorTester } from "../tester.js";
import { CalculatorUtil } from "./util.js";
export class CalculatorCollector extends CalculatorComponent {
    /**
     * Invariant: input has been commuted
     */
    static collect(input, debug) {
        this.log(debug, `---- COLLECTION ----`);
        this.log(debug, `original input: ${input.print()}`);
        return this.collectRecurse(input, debug);
    }
    static collectRecurse(input, debug) {
        var _a;
        this.log(debug, `collecting recurse: ${input.print()}`);
        const terms = CalculatorUtil.getDisjunctiveTerms(input, debug, (input, debug) => { return this.collectAnyDisjunctions(input, debug); });
        this.log(debug, `
    input: ${input.print()},
    + terms: ${terms.positives.map((t) => t.print()).join(', ')};
    - terms: ${terms.negatives.map((t) => t.print()).join(', ')} `);
        const filteredTerms = {
            _values: {
                positives: [],
                negatives: [],
                coefficient: new CalculatorValue(1),
                result: null
            }
        };
        const filter = (type) => {
            terms[type].forEach((t) => {
                if (t instanceof CalculatorValue)
                    filteredTerms._values[type].push(t);
                else if (t instanceof CalculatorVariable) { // just 'x'
                    if (!filteredTerms[t.print()])
                        filteredTerms[t.print()] = { positives: [], negatives: [], coefficient: t, result: null };
                    filteredTerms[t.print()][type].push(new CalculatorValue(1));
                }
                else if (t instanceof CalculatorUnaryFunction) {
                    if (t.containsVariable()) {
                        if (!filteredTerms[t.print()]) // create entry for newly-encountered variable
                            filteredTerms[t.print()] = { positives: [], negatives: [], coefficient: t, result: null };
                        filteredTerms[t.print()][type].push(new CalculatorValue(MathNum.ONE));
                    }
                    else {
                        filteredTerms._values[type].push(t);
                    }
                }
                else if (t instanceof CalculatorFunction) {
                    if (t.containsVariable()) {
                        if (t.operator === CalculatorOperator.exponent) {
                            if (!filteredTerms[t.print()]) // create entry for newly-encountered variable
                                filteredTerms[t.print()] = { positives: [], negatives: [], coefficient: t, result: null };
                            filteredTerms[t.print()][type].push(new CalculatorValue(MathNum.ONE));
                        }
                        else {
                            if (!filteredTerms[t.rightTerm.print()]) // create entry for newly-encountered variable
                                filteredTerms[t.rightTerm.print()] = { positives: [], negatives: [], coefficient: t.rightTerm, result: null };
                            filteredTerms[t.rightTerm.print()][type].push(t.leftTerm);
                        }
                    }
                    else {
                        filteredTerms._values[type].push(t);
                    }
                }
                else
                    throw new Error(`Bad input: ${t.print()}`);
            });
        };
        this.log(debug, `filtered terms:`);
        this.log(debug, filteredTerms);
        filter('positives');
        filter('negatives');
        let output = null;
        const keys = Object.keys(filteredTerms);
        const filteredEntries = keys.map((key) => filteredTerms[key]);
        filteredEntries.push(filteredEntries.splice(keys.indexOf('_values'), 1)[0]); // move values to the back
        for (const filteredEntry of filteredEntries) {
            let evaluatorTerm = null;
            let firstTermIsNegative = false;
            for (const p of filteredEntry.positives) {
                if (!evaluatorTerm)
                    evaluatorTerm = p;
                else
                    evaluatorTerm = new CalculatorFunction(evaluatorTerm, p, CalculatorOperator.add);
            }
            for (const n of filteredEntry.negatives) {
                if (!evaluatorTerm) {
                    firstTermIsNegative = true;
                    evaluatorTerm = n;
                }
                else if (firstTermIsNegative)
                    evaluatorTerm = new CalculatorFunction(evaluatorTerm, n, CalculatorOperator.add);
                else
                    evaluatorTerm = new CalculatorFunction(evaluatorTerm, n, CalculatorOperator.subtract);
            }
            this.log(debug, `evaluatorTerm: ${evaluatorTerm ? evaluatorTerm.print() : 'none'}`);
            this.log(debug, `for value ${filteredEntry.coefficient.print()}, firstTermIsNegative: ${firstTermIsNegative ? 'yes' : 'no'}`);
            if (!evaluatorTerm)
                continue; // no data for this coefficient (e.g. (x * y) has no data for numerical values)
            let result;
            if (filteredEntry.coefficient instanceof CalculatorValue) // values coefficient of 1
                result = evaluatorTerm;
            else {
                if (!output && firstTermIsNegative)
                    evaluatorTerm = new CalculatorFunction(new CalculatorValue(0), evaluatorTerm, CalculatorOperator.subtract);
                result = new CalculatorFunction(evaluatorTerm, filteredEntry.coefficient, CalculatorOperator.multiply);
            }
            this.log(debug, `${filteredEntry.coefficient.print()}: ${result.print()}`);
            if (!output)
                output = result;
            else
                output = new CalculatorFunction(output, result, firstTermIsNegative ? CalculatorOperator.subtract : CalculatorOperator.add);
        } // end for loop
        this.log(debug, `output: ${(_a = output === null || output === void 0 ? void 0 : output.print()) !== null && _a !== void 0 ? _a : 'none'}`);
        return output;
    }
    /**
     * Runs collectRecurse on any + or - functions
     */
    static collectAnyDisjunctions(input, debug) {
        if (input instanceof CalculatorFunction) {
            if (input.operator === CalculatorOperator.add || input.operator === CalculatorOperator.subtract)
                return this.collectRecurse(input, debug);
            else {
                input.leftTerm = this.collectAnyDisjunctions(input.leftTerm, debug);
                input.rightTerm = this.collectAnyDisjunctions(input.rightTerm, debug);
                return input;
            }
        }
        else
            return input;
    }
    static test() {
        const tester = new CalculatorTester('Collector', (input, debug) => {
            var _a, _b;
            return (_b = (_a = CalculatorCollector.collect(new CalculatorParser(input).output, debug)) === null || _a === void 0 ? void 0 : _a.printSimple()) !== null && _b !== void 0 ? _b : 'no output';
        });
        tester.test('(3 * x)', '3x');
        tester.test('((3 * x) + (4 * x))', '(3 + 4)x');
        tester.test('((1 * x) + (1 * x))', '(1 + 1)x');
        tester.test('(x + x)', '(1 + 1)x');
        tester.test('(2 + 2)', '2 + 2');
        tester.test('(((3 * x) + (4 * x)) + (5 * x))', '(3 + 4 + 5)x');
        tester.test('(((3 * x) - (4 * x)) + (5 * x))', '(3 + 5 - 4)x');
        tester.test('(1 * x)', '1x');
        tester.test('(((3 * x) + (4 * y)) + (5 * x))', '(3 + 5)x + 4y');
        tester.test('(((3 * x) - (4 * y)) + (5 * x))', '(3 + 5)x - 4y');
        tester.test('((3 * 4) * x)', '3 * 4x');
        tester.test('(1 * (x ^ y))', '1x^y');
        tester.test('(x ^ y)', '1x^y');
        tester.test('(((3 * (x ^ y)) - (5 * (y ^ x))) + (4 * (x ^ y)))', '(3 + 4)x^y - 5y^x');
        tester.test('5 + 3*a - 3', '3a + 5 - 3');
        tester.test('5 + 3*x - 3', '3x + 5 - 3');
        tester.test('x - x', '(1 - 1)x');
        tester.test('(x - x)^2', '1((1 - 1)x)^2');
        tester.test('3*(x - x)^2', '3((1 - 1)x)^2');
        tester.test('((((x ^ 2) - (3 * x)) - ((4 * x) - (3 * 4))) - 0)', '1x^2 - (3 + 4)x + 3 * 4 - 0');
        tester.test('(34 - (d ^ 3))', '(0 - 1)d^3 + 34');
        tester.test('((1 * (x ^ 4)) - (2 * (x ^ 3)))', '1x^4 - 2x^3');
        tester.test('((1 / log(5)) * log(x))', '(1/log(5)) * log(x)');
        tester.test('(1 / log(5)) * (1 / log(x))', '(1/log(5))(1/log(x))');
    }
}
//# sourceMappingURL=collector.js.map