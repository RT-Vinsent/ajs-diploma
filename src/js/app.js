/**
 * Entry point of app: don't change this
 */
import GamePlay from './services/GamePlay';
import GameController from './services/GameController';
import GameStateService from './services/GameStateService';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
