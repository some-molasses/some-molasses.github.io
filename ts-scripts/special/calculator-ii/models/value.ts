import { cws } from "../../../cws.js";
import { MathFrac } from "../../../tools/math/fraction.js";
import { MathNum } from "../../../tools/math/number.js";
import { CalculatorSingular } from "./singular.js";
import { CalculatorTerm } from "./term.js";

export class CalculatorValue extends CalculatorSingular {
  value: MathNum;

  constructor(value: number | MathNum) {
    super(value + '');
    this.value = value instanceof MathNum ? value : new MathNum(MathFrac.createFromInt(value), MathFrac.ZERO);
  }

  get integerValue() {
    if (!this.value.isRealInteger()) throw new Error(`Not an integer: ${this.value.prettyPrint()}`);

    return this.value.toRealNumber().nearestInteger;
  }

  clone(): CalculatorTerm {
    return new CalculatorValue(this.value.clone());
  }

  containsVariable(): boolean {
    return false;
  }

  getVariables(): string[] {
    return [];
  }

  equals(other: CalculatorTerm): boolean {
    return other instanceof CalculatorValue && this.value.isEqualTo(other.value);
  }

  print(): string {
    if (this.value.prettyPrint().length > 25 && this.value.Im.isEqualTo(MathFrac.ZERO))
      return cws.roundToNthDigit(this.value.Re.decimalValue, -5) + '';
    else
      return this.value.prettyPrint() + '';
  }

  printHTML(): string {
    return `<span class="value">${this.value.prettyPrint()}</span>`;
  }
}