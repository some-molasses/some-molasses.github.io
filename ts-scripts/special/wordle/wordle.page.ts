import { DarkModeService } from "../../services/dark-mode.service.js";
import { WordleController } from "./wordle.controller.js";

class WordlePage {
  static init() {
    this.initStyle();
    this.initController();
  }

  static initController() {
    const controller = new WordleController();
    controller.build(document.body.querySelector('#wordle-container'));
    controller.init();
  }

  static initStyle() {
    DarkModeService.registerStylesheet.light('/stylesheets/wordle/wordle-light.css');
  }
}

WordlePage.init();
