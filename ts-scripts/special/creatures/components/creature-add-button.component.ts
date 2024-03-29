import { Molasses } from "../../../molasses";
import { Button } from "../../../components/button.component";
import { SummonsCreatureFactory } from "../creature-factory";
import { SummonsCreature } from "../creature";

export class SummonsCreatureAddButton {
  private table: HTMLTableElement;
  private addButton: Button;
  private selector: HTMLSelectElement;

  private static readonly NEW_CREATURE_NAME = 'NEW';

  constructor(parentElement: HTMLElement, addNewViewComponent: (creature: SummonsCreature) => void, addNewCreature: () => void) {
    const me = this;

    // create select
    this.selector = Molasses.createElement({
      type: 'select',
      classList: 'create-select'
    });

    // fill select options
    const names: string[] = Molasses.Object.values(SummonsCreatureFactory.creatures).map((c) => { return c.name; });
    names.forEach((name: string) => {
      me.selector.appendChild(Molasses.createElement({
        type: 'option',
        innerText: name.toUpperCase(),
      }));
    });
    me.selector.appendChild(Molasses.createElement({
      type: 'option',
      innerText: SummonsCreatureAddButton.NEW_CREATURE_NAME.toUpperCase(),
    }));

    // create table
    this.table = Molasses.createTable({
      body: [[Molasses.createElement({
        type: 'div',
        classList: 'create-button'
      }), this.selector]]
    });

    parentElement.appendChild(this.table);
    this.addButton = Button.createByReplacement(this.table.querySelector('.create-button'), () => {
      const selectedCreature: string = this.selector.value;

      if (selectedCreature == SummonsCreatureAddButton.NEW_CREATURE_NAME.toUpperCase()) {
        addNewCreature();
      } else {
        const createdCreature: SummonsCreature = Array.from(Molasses.Object.values(SummonsCreatureFactory.creatures)).filter((c) => {
          return c.name.toUpperCase() === selectedCreature;
        })[0].creator();

        addNewViewComponent(createdCreature);
      }
    }, 'Add: ', false, null, 'create-button');
  }
}
