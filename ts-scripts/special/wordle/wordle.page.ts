import { WordleController } from "./wordle.controller.js";

new WordleController().build(document.body.querySelector('#wordle-container'));