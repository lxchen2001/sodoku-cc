var Sudoku;
(function(Sudoku){
  "use strict";
  
  Sudoku.Controllers = Sudoku.Controllers || {};
  Sudoku.Controllers.GameController = Sudoku.Controllers.GameController || function GameController(view, userService, gameService){

    return {
      view: view,
      userService: userService,
      gameService: gameService,
      game: null,

      init: function GameController_init(){
        this.view.initIfNeeded();
      },

      newGame: function GameController_newGame(id){
        var stringRep = this.gameService.getNewGame(id);
        var board = new Sudoku.Models.Board(stringRep);
        var game = new Sudoku.Models.Game(id, board);
        this.game = game;
        this.view.renderGame(game);
      },

      newRandomGame: function GameController_newRandomGame(){
        var stringRepWithId = gameService.getNewRandomGame();
        var board = new Sudoku.Models.Board(stringRepWithId.stringRep);
        var game = new Sudoku.Models.Game(stringRepWithId.id, board);
        this.game = game;
        this.view.renderGame(game);
      },

      setNumber: function GameController_setNumber(x, y, num){
        if(this.game && this.game.setNumber(x, y, num)){
          this.view.renderGame(this.game, true);
        }
      },

      hint: function GameController_hint(){
        if(this.game && this.gameService && this.gameService.hint(this.game)){
          this.view.renderGame(this.game, true);
        }
      },

      abandonGame: function GameController_abandonGame(){
        if(this.game && this.game.abandon()){
          this.view.renderGame(this.game, true);
        }
      },

      showGamePicker: function GameController_showGamePicker(){
        var that = this;
        this.view.renderGamePicker(this.gameService, function(id){
          if(id != null && typeof id === "number" && id >= 0){
            that.newGame(id);
          }
        });
      },

      hideGamePicker: function GameController_hideGamePicker(){
        this.view.hideGamePicker();
        return true;
      },

      hideCompleteMessage: function GameController_hideCompleteMessage(){
        this.view.hideCompleteMessage();
        return true;
      },

      hideAbandonMessage: function GameController_hideAbandonMessage(){
        this.view.hideAbandonMessage();
        return true;
      },
    }
  };

  if(typeof module !== "undefined"){
    module.exports = Sudoku.Controllers;
  }
})(Sudoku || (Sudoku = {}));
