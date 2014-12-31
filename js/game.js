(function(){
  "use strict";

  window.Sodoku = window.Sodoku || {};
  window.Sodoku.GameState = window.Sodoku.GameState || {
    notInitialized: "N",
    initialized: "I",
    readyToStart: "R",
    playStarted: "P",
    completed: "C",
    abandoned: "A",
  };

  var GameState = window.Sodoku.GameState;

  window.Sodoku.Game = window.Sodoku.Game || function Game(element, renderer, services){
    var userService = new services.UserService();
    var gameService = new services.GameService();

    var gameId = null;
    var state = GameState.notInitialized;
    var board = null;
    var startTime = null;
    var completeTime = null;

    return {
      renderer: renderer,
      userService: userService,
      gameService: gameService,
      gameId: gameId,
      element: element,
      state: state,
      board: board,
      startTime: startTime,
      completeTime: completeTime,

      init: function Game_init(){
        this.renderer.initIfNeeded(this.element);
        this.state = GameState.initialized;
      },

      newGame: function Game_newGame(id){
        this.board = this.gameService.getNewGame(id);
        this.gameId = id;
        this.state = GameState.readyToStart;
        this.renderer.render(this.element, this.board);
      },

      newRandomGame: function Game_newRandomGame(){
        var randomGame = gameService.getNewRandomGame();
        this.gameId = randomGame.id;
        this.board = randomGame.game;
        this.state = GameState.readyToStart;
        this.renderer.render(this.element, this.board);
      },

      setNumber: function Game_setNumber(x, y, num){
        this.board.updateCell(x, y, num);
        if(this.board.isComplete()){
          this.state = GameState.completed;
          this.competeTime = new Date() - startTime;
        } else if(state !== GameState.playStarted){
          this.state = GameState.playStarted;
          this.startTime = new Date();
        }
        this.renderer.render(this.element, this.board);
      },

      hint: function Game_hint(){
        if(this.state !== GameState.playStarted){
          return;
        }

        this.board.hint();
        if(this.board.isComplete()){
          this.state = GameState.completed;
          this.competeTime = new Date() - startTime;
        }
      }
    };
  };


})();
