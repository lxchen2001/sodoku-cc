(function(){
  window.Sodoku = window.Sodoku || {};
  window.Sodoku.Controllers = window.Sodoku.Controllers || {};
  window.Sodoku.Controllers.GameController = window.Sodoku.Controllers.GameController || function GameController(renderer, userService, gameService){

    return {
      renderer: renderer,
      userService: userService,
      gameService: gameService,
      game: null,

      init: function GameController_init(){
        this.renderer.initIfNeeded();
      },

      newGame: function GameController_newGame(id){
        var stringRep = this.gameService.getNewGame(id);
        var board = new Sodoku.Models.Board(stringRep);
        var game = new Sodoku.Models.Game(id, board);
        this.game = game;
        this.renderer.renderGame(game);
      },

      newRandomGame: function GameController_newRandomGame(){
        var stringRepWithId = gameService.getNewRandomGame();
        var board = new Sodoku.Models.Board(stringRepWithId.stringRep);
        var game = new Sodoku.Models.Game(stringRepWithId.id, board);
        this.game = game;
        this.renderer.renderGame(game);
      },

      setNumber: function GameController_setNumber(x, y, num){
        if(this.game && this.game.setNumber(x, y, num)){
          this.renderer.renderGame(this.game, true);
        }
      },

      hint: function GameController_hint(){
        if(this.game && this.game.hint(this.gameService)){
          this.renderer.renderGame(this.game, true);
        }
      },

      abandonGame: function GameController_abandonGame(){
        if(this.game && this.game.abandon()){
          this.renderer.renderGame(this.game, true);
        }
      },

      showGamePicker: function GameController_showGamePicker(){
        var that = this;
        this.renderer.renderGamePicker(this.gameService, function(id){
          if(id != null && typeof id === "number" && id >= 0){
            that.newGame(id);
          }
        });
      },

      hideGamePicker: function GameController_hideGamePicker(){
        this.renderer.hideGamePicker();
        return true;
      },

      hideCompleteMessage: function GameController_hideCompleteMessage(){
        this.renderer.hideCompleteMessage();
        return true;
      },

      hideAbandonMessage: function GameController_hideAbandonMessage(){
        this.renderer.hideAbandonMessage();
        return true;
      },
    }
  };
})();
