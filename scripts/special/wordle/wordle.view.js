var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cws } from "../../cws.js";
import { WordleAnswerTile } from "./components/answer-tile.component.js";
import { WordleKeyTile } from "./components/keyboard-tile.component.js";
export class WordleView {
    constructor(creator) {
        this.alertMessageBox = null;
        this.grid = {
            container: null,
            rows: [],
        };
        this.keyboard = {
            container: null,
            rows: []
        };
        this.WORD_LENGTH = 5;
        this.currentWordAttempt = [];
        this.currentRowIndex = 0;
        const me = this;
        window.addEventListener('keydown', (event) => {
            if (me.isValidLetter(event.key))
                me.addLetter(event.key);
            else if (event.key === 'Backspace')
                me.deleteLetter();
            else if (event.key === 'Enter' && me.currentWordAttempt.length === 5)
                me.submitWord(creator);
        });
    }
    get currentRow() {
        return this.grid.rows[this.currentRowIndex];
    }
    get endOfCurrentWordCell() {
        const currentRow = this.currentRow;
        for (let i = 0; i < currentRow.length; i++) {
            if (currentRow[i].letter === '')
                return currentRow[i - 1];
        }
        return currentRow[currentRow.length - 1];
    }
    get nextEmptyCharacterCell() {
        const currentRow = this.currentRow;
        for (let i = 0; i < currentRow.length; i++) {
            if (currentRow[i].letter === '')
                return currentRow[i];
        }
        return null;
    }
    addLetter(letter) {
        if (this.currentWordAttempt.length >= 5)
            return;
        this.currentWordAttempt.push(letter);
        this.nextEmptyCharacterCell.letter = letter;
    }
    deleteLetter() {
        if (this.currentWordAttempt.length <= 0)
            return;
        this.currentWordAttempt.pop();
        const cell = this.endOfCurrentWordCell;
        if (cell)
            cell.letter = '';
    }
    getKey(key) {
        return this.keyboard.rows.map(row => {
            return row.filter((tile) => tile.letter.toLowerCase() === key.toLowerCase())[0];
        }).filter(rowResult => rowResult)[0];
    }
    lose(correctWord) {
        alert(`You lose: the correct word was ${correctWord}.`);
    }
    isValidLetter(key) {
        return ('a'.charCodeAt(0) <= key.toLowerCase().charCodeAt(0) &&
            'z'.charCodeAt(0) >= key.toLowerCase().charCodeAt(0) &&
            key.length === 1);
    }
    rebuild(container) {
        // alert message
        this.alertMessageBox = cws.createElement({
            type: 'div',
            classList: 'wordle-message-box'
        });
        container.appendChild(this.alertMessageBox);
        // grid
        const elementRows = [];
        for (let i = 0; i < 6; i++) {
            const row = [];
            this.grid.rows.push([]);
            for (let j = 0; j < 5; j++) {
                const tile = new WordleAnswerTile();
                this.grid.rows[i].push(tile);
                row.push(tile.element);
            }
            elementRows.push(row);
        }
        const table = cws.createTable({
            body: elementRows,
            id: 'wordle-answers-grid'
        });
        if (this.grid.container)
            this.grid.container.replaceWith(table);
        else
            container.appendChild(table);
        this.grid.container = table;
        // keyboard
        const keys = [
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm'
        ].map(s => s.split(''));
        const keyboardContainer = cws.createElement({
            type: 'div',
            id: 'wordle-keyboard-container'
        });
        keys.forEach(rowData => {
            const interior = cws.createElement({
                type: 'div',
                classList: 'key-row-interior',
            });
            const row = cws.createElement({
                type: 'div',
                classList: 'key-row',
                children: [interior],
            });
            const rowKeys = [];
            rowData.forEach(letter => {
                rowKeys.push(new WordleKeyTile(interior, letter));
            });
            keyboardContainer.appendChild(row);
            this.keyboard.rows.push(rowKeys);
        });
        if (this.keyboard.container)
            this.keyboard.container.replaceWith(keyboardContainer);
        else
            container.appendChild(keyboardContainer);
        this.keyboard.container = keyboardContainer;
    }
    rejectWithMessage(message) {
        this.alertMessageBox.innerText = message;
        this.alertMessageBox.classList.add('visible');
        setTimeout(() => {
            this.alertMessageBox.classList.remove('visible');
        }, 3000);
    }
    submitWord(receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            const me = this, response = yield receiver.receiveWord(this.currentWordAttempt.join(''));
            if (response.error)
                this.rejectWithMessage(response.errorMessage);
            else {
                response.characterValidities.forEach((character, index) => {
                    if (character.state.inPosition) {
                        this.getKey(character.letter).setSuccess();
                        this.currentRow[index].setSuccess();
                    }
                    else if (character.state.inWord) {
                        this.getKey(character.letter).setCorrectLetter();
                        this.currentRow[index].setCorrectLetter();
                    }
                    else {
                        this.getKey(character.letter).setWrongLetter();
                        this.currentRow[index].setWrongLetter();
                    }
                });
                this.currentWordAttempt = [];
                me.currentRowIndex++;
                if (response.success)
                    me.win(receiver.word);
                else if (me.currentRowIndex >= me.grid.rows.length)
                    me.lose(receiver.word);
            }
        });
    }
    win(word) {
        alert(`You win!`);
    }
}
//# sourceMappingURL=wordle.view.js.map