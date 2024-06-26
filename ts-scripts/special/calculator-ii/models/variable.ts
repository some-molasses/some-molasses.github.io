import { CalculatorSingular } from "./singular";
import { CalculatorTerm } from "./term";

export class CalculatorVariable extends CalculatorSingular {
  constructor(name: string) {
    super(name);
  }

  clone(): CalculatorTerm {
    return new CalculatorVariable(this.displayName);
  }

  containsVariable(variable?: string): boolean {
    if (variable) return variable === this.displayName;
    else return true;
  }

  getVariables(): string[] {
    return [this.displayName];
  }

  equals(other: CalculatorTerm): boolean {
    return other instanceof CalculatorVariable && this.displayName === other.displayName;
  }
  
  printHTML(): string {
    return `<span class="variable">${this.displayName}</span>`;
  }

  printSimple(): string {
    return this.print();
  }
}
