import { NPCsCharacterData } from "../core/character-data.js";

export class NPCsInitiativeTrackerCombatant {
  initiative: number;
  isNPC: boolean;
  isEnabled: boolean = true;
  relatedCharacterData?: NPCsCharacterData;

  HP?: number;

  isNameAutoGenerated: boolean = false;

  private _name: string;
  private _id: number;

  constructor(name: string, initiative: number, isNPC: boolean, isNameAutoGenerated: boolean, HP?: number) {
    this._name = name;
    this.initiative = initiative;
    this.isNPC = isNPC;
    this.isNameAutoGenerated = isNameAutoGenerated;
    if (HP) this.HP = HP;

    this._id = NPCsInitiativeTrackerCombatant.nextId++;
  }

  get id(): number {
    return this._id;
  }

  get hasAdditionalData() : boolean {
    return !!this.HP;
  }

  get name(): string {
    if (this.isNameAutoGenerated)
      return `Combatant ${this.id} - ${this._name}`;
    else return this._name;
  }

  set name(s: string) {
    this._name = s;
    this.isNameAutoGenerated = false;
  }

  get trueName(): string {
    return this._name;
  }

  private static nextId = 1;

  static get baseId() {
    return 1;
  }
}