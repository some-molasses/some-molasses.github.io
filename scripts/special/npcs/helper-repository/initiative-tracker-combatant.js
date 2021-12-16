export class NPCsInitiativeTrackerCombatant {
    constructor(name, initiative, isNPC, isNameAutoGenerated, HP) {
        this.isEnabled = true;
        this.isNameAutoGenerated = false;
        this._name = name;
        this.initiative = initiative;
        this.isNPC = isNPC;
        this.isNameAutoGenerated = isNameAutoGenerated;
        if (HP)
            this.HP = HP;
        this._id = NPCsInitiativeTrackerCombatant.nextId++;
    }
    get id() {
        return this._id;
    }
    get hasAdditionalData() {
        return !!this.HP;
    }
    get name() {
        if (this.isNameAutoGenerated)
            return `Combatant ${this.id} - ${this._name}`;
        else
            return this._name;
    }
    set name(s) {
        this._name = s;
        this.isNameAutoGenerated = false;
    }
    get trueName() {
        return this._name;
    }
    static get baseId() {
        return 1;
    }
}
NPCsInitiativeTrackerCombatant.nextId = 1;
//# sourceMappingURL=initiative-tracker-combatant.js.map