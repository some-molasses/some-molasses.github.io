import { Molasses } from "../../molasses";
import { Button } from "../../components/button.component";
import { NPCsName } from "./helper-repository/name";
import { NPCsRace, NPCsRaceArchetype } from "./core/race";

export class NPCsNamesList {
  pageContent: HTMLDivElement = document.body.querySelector('.content');
  tableContainer: HTMLDivElement = null;
  tables = {
    firstNames: HTMLTableElement = null,
    lastNames: HTMLTableElement = null,
  };
  submitButton: Button = null;
  outputField: HTMLTextAreaElement = null;

  constructor() {
    const me = this;

    this.tableContainer = Molasses.createElement({
      type: 'div',
    });
    this.pageContent.appendChild(this.tableContainer);

    me.generateTables();

    this.submitButton = Button.createByAppending(me.pageContent, () => {
      me.generateJSON();
    }, 'Submit', true);

    this.outputField = Molasses.createElement({
      type: 'textarea',
      id: 'npcs-names-output',
    });
    this.pageContent.appendChild(this.outputField);
  }

  private generateJSON() {
    const me = this;

    me.outputField.value = '{';
    generateTableJSON(this.tables.firstNames, 'firstNames');
    generateTableJSON(this.tables.lastNames, 'lastNames', true);
    me.outputField.value += '}';

    function generateTableJSON(table: HTMLTableElement, attributeName: string, last?: boolean) {
      const rows: HTMLTableRowElement[] = Array.from(table.querySelector('tbody').querySelectorAll('tr'));
      const archetypesList: NPCsRaceArchetype[] = NPCsRace.archetypes;

      me.outputField.value += `"${attributeName}": [`;

      const names: NPCsName[] = rows.map((row: HTMLTableRowElement) => {
        const selectedArchetypes: NPCsRaceArchetype[] = [];

        for (let i = 1; i < row.cells.length; i++) {
          if (row.cells[i].querySelector('button').classList.contains('selected'))
            selectedArchetypes.push(archetypesList[i - 1]);
        }

        return new NPCsName({ name: row.cells[0].innerText, owners: selectedArchetypes });
      }).sort((a, b) => {
        return a.name < b.name ? -1 : 1;
      });

      for (let i = 0; i < names.length; i++) {
        me.outputField.value += ` ${JSON.stringify(names[i])}`;
        if (i < names.length - 1)
          me.outputField.value += ',\n';
      }

      me.outputField.value += ']';
      if (!last)
        me.outputField.value += ',';
    }
  }

  private async generateTables() {
    const namesList = await NPCsName.getList();
    this.tables.firstNames = await this.generateTable(Molasses.Array.distinct(namesList.firstNames.all, (a: NPCsName, b: NPCsName) => { return a.name === b.name }), 'first-names');
    this.tables.lastNames = await this.generateTable(Molasses.Array.distinct(namesList.lastNames.all, (a: NPCsName, b: NPCsName) => { return a.name === b.name }), 'last-names');
  }

  private async generateTable(namesList: NPCsName[], id: string): Promise<HTMLTableElement> {
    const
      tableHeadMainRow: HTMLTableRowElement = Molasses.createElement({
        type: 'tr',
        children: [Molasses.createElement({
          type: 'th',
          innerText: 'name',
        })]
      }),
      tableBody: HTMLTableSectionElement = Molasses.createElement({
        type: 'tbody',
      }),
      table: HTMLTableElement = Molasses.createElement({
        type: 'table',
        id: id,
        children: [
          Molasses.createElement({
            type: 'thead',
            children: [tableHeadMainRow]
          }),
          tableBody
        ]
      });

    const archetypesList = NPCsRace.archetypes;
    archetypesList.forEach((archetype: NPCsRaceArchetype) => {
      tableHeadMainRow.appendChild(Molasses.createElement({
        type: 'th',
        innerText: archetype,
      }));
    });

    namesList.forEach((name: NPCsName) => {
      const newRow: HTMLTableRowElement = Molasses.createElement({
        type: 'tr',
        children: [Molasses.createElement({
          type: 'td',
          innerText: name.name,
        })],
      });

      archetypesList.forEach((archetype: NPCsRaceArchetype) => {
        const selector: HTMLButtonElement = Molasses.createElement({
          type: 'button',
          innerText: archetype,
          classList: Molasses.Array.includes(name.owners, archetype) ? 'selected' : '',
        });
        const newCell: HTMLTableCellElement = Molasses.createElement({
          type: 'td',
          children: [selector],
        });
        selector.addEventListener('click', () => {
          if (selector.classList.contains('selected')) selector.classList.remove('selected')
          else selector.classList.add('selected');
        });

        newRow.appendChild(newCell);
      });

      tableBody.appendChild(newRow);
    });

    this.tableContainer.appendChild(table);

    return table;
  }
}

new NPCsNamesList();
