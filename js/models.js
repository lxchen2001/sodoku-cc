var Sudoku;
(function(Sudoku){
  "use strict";

  Sudoku.Models = Sudoku.Models || {};
  Sudoku.Models.SourceType = Sudoku.Models.SourceType || {
    predefined: "P",
    userInput: "U",
    hint: "H"
  };

  Sudoku.Models.GameState = Sudoku.Models.GameState || {
    readyToStart: "R",
    started: "S",
    completed: "C",
    abandoned: "A",
  };

  var SourceType = Sudoku.Models.SourceType;
  var GameState = Sudoku.Models.GameState;

  Sudoku.Models.Board = Sudoku.Models.Board || function Board(stringRep){
    var s = stringRep;
    if(s == null || typeof s !== "string" || s.length != 81){
      return null;
    }

    var store = [];
    var invalid = [];
    var source = [];
    for(var i = 0; i < 9; i++){
      var row = [];
      var invalidRow = [];
      var sourceRow = [];
      store.push(row);
      invalid.push(invalidRow);
      source.push(sourceRow);
      for(var j = 0; j < 9; j++){
        var cell = s[i*9+j];
        if(cell == null || typeof cell !== "string"){
          return null;
        }

        var digit;
        if(cell === "."){
          digit = 0;
        } else {
          var digit = parseInt(cell);
          if(isNaN(digit) || digit < 1 || digit > 9){
            return null;
          }
        }
        row.push(digit);
        invalidRow.push(false);
        sourceRow.push(digit === 0 ? SourceType.userInput : SourceType.predefined);
      }
    }

    function Board_validateAll(){
      var valid = true;
      for(var i = 0; i < 9; i++){
        for(var j = 0; j < 9; j++){
          var cell = store[i][j];
          invalid[i][j] = false;
        }
      }

      for(var i = 0; i < 9; i++){
        var map = {};
        for(var j = 0; j < 9; j++){
          var cell = store[i][j];
          if(cell === 0){
            continue;
          }
          if(map[cell] == null){
            map[cell] = j;
          } else {
            var jo = map[cell];
            invalid[i][j] = true;
            invalid[i][jo] = true;
            valid = false;
          }
        }
      }

      for(var j = 0; j < 9; j++){
        var map = {};
        for(var i = 0; i < 9; i++){
          var cell = store[i][j];
          if(cell === 0){
            continue;
          }
          if(map[cell] == null){
            map[cell] = i;
          } else {
            var io = map[cell];
            invalid[i][j] = true;
            invalid[io][j] = true;
            valid = false;
          }
        }
      }

      for(var i = 0; i < 9; i+=3){
        for(var j = 0; j < 9; j+=3){
          var map = {};
          for(var ii=i;ii<i+3;ii++){
            for(var jj = j; jj < j+3; jj++){
              var cell = store[ii][jj];
              if(cell === 0){
                continue;
              }
              if(map[cell] == null){
                map[cell] = {i: ii, j: jj};
              } else {
                var cellConflict = map[cell];
                invalid[cellConflict.i][cellConflict.j] = true;
                invalid[ii][jj] = true;
                valid = false;
              }
            }
          }
        }
      }
      return valid;
    }

    Board_validateAll();

    return {
      store: store,
      invalid: invalid,
      source: source,
      validateAll: Board_validateAll,

      // update cell with value
      updateCell: function Board_updateCell(x, y, value, sourceType){
        if(value == null || typeof value !== "number" || value < 0 || value > 9){
          return false;
        }

        this.store[x][y] = value;
        this.source[x][y] = sourceType || SourceType.userInput;
        this.validateAll();
        return true;
      },

      // update cell with hint value
      updateCellHint: function Board_updateCellHint(x, y, value){
        return this.updateCell(x, y, value, SourceType.hint);
      },

      // get 9 3*3 regions to render in HTML
      getRegions: function Board_getRegions(){
        var regions = [];
        for(var i = 0; i < 9; i+=3){
          for(var j = 0; j < 9; j+=3){
            var region = [];
            for(var ii = i; ii < i+3; ii++){
              for(var jj = j; jj < j+3; jj++){
                var val = this.store[ii][jj];
                var inv = this.invalid[ii][jj];
                var src = this.source[ii][jj];
                region.push({val: val, inv: inv, src: src});
              }
            }

            regions.push(region);
          }
        }

        return regions;
      },

      // get empty cells to choose from when we want a hint
      getEmptyCells: function Board_getEmptyCells(){
        var emptyCells = [];
        for(var i = 0; i < 9; i++){
          for(var j = 0; j < 9; j++){
            if(store[i][j] === 0){
              emptyCells.push({x: i, y: j});
            }
          }
        }

        return emptyCells;
      },

      // check whether the board is complete thus the game is complete
      isComplete: function Board_isComplete(){
        for(var i = 0; i < 9; i++){
          for(var j = 0; j < 9; j++){
            var cell = this.store[i][j];
            if(cell == 0){
              return false;
            }
          }
        }

        return this.validateAll();
      }
    };
  };

  Sudoku.Models.Game = Sudoku.Models.Game || function Game(id, board){
    if(board == null){
      return null;
    }

    var startTime = null;
    var endTime = null;
    var state = GameState.readyToStart;

    if(board.isComplete()){
      startTime = new Date();
      endTime = startTime;
      state = GameState.completed;
    }

    return {
      id: id,
      board: board,
      state: state,
      startTime: startTime,
      endTime: endTime,

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

      // check whether the game is complete
      checkComplete: function Game_checkComplete(){
        if(this.board.isComplete()){
          this.state = GameState.completed;
          this.endTime = new Date();
          return true;
        }

        return false;
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
    };
  };

  if(typeof module !== "undefined"){
    module.exports = Sudoku.Models;
  }
})(Sudoku || (Sudoku = {}));
