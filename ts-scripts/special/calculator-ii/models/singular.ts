import { CalculatorTerm } from "./term.js";

export class CalculatorSingular implements CalculatorTerm {
  displayName: string;

  constructor(name: string) {
    this.displayName = name;
  }

  clone(): CalculatorTerm {
    return undefined;
  }

  containsVariable(): boolean {
    return undefined;
  }

  getVariables(): string[] {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  equals(other: CalculatorTerm): boolean {
    return undefined;
  }

  print(): string {
    return this.displayName;
  }

  printHTML(): string {
    return undefined;
  }
}