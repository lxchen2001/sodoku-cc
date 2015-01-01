(function(){
  "use strict";

  window.Sudoku = window.Sudoku || {};
  window.Sudoku.Models = window.Sudoku.Models || {};
  window.Sudoku.Models.GameState = window.Sudoku.Models.GameState || {
    readyToStart: "R",
    started: "S",
    completed: "C",
    abandoned: "A",
  };

  var GameState = window.Sudoku.Models.GameState;

  window.Sudoku.Models.Game = window.Sudoku.Models.Game || function Game(id, board){
    return {
      id: id,
      board: board,
      state: GameState.readyToStart,
      startTime: null,
      endTime: null,

      // returns whether starting succeeded
      start: function Game_start(){
        switch(this.state){
          case GameState.completed:
          case GameState.abandoned:
            return false;
          case GameState.readyToStart:
            this.startTime = new Date();
            this.state = GameState.started;
            break;
        }

        return true;
      },

      checkComplete: function Game_checkComplete(){
        if(this.board.isComplete()){
          this.state = GameState.completed;
          this.endTime = new Date();
        }
      },

      // returns whether abandoning succeeded
      abandon: function Game_abandon(){
        switch(this.state){
          case GameState.readyToStart:
          case GameState.completed:
          case GameState.abandoned:
            return false;
          case GameState.started:
            this.endTime = new Date();
            this.state = GameState.abandoned;
            break;
        }

        return true;
      },

      // returns whether re-render is needed
      setNumber: function Game_setNumber(x, y, num){
        if(!this.start()){
          return false;
        }

        this.board.updateCell(x, y, num);
        this.checkComplete();
        return true;
      },

      // returns whether re-render is needed
      hint: function Game_hint(service){
        if(!this.start()){
          return;
        }

        service.hint(this);
        this.checkComplete();
        return true;
      }
    };
  };

})();
