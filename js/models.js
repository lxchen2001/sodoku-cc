(function(){
  "use strict";

  window.Sodoku = window.Sodoku || {};
  window.Sodoku.Models = window.Sodoku.Models || {};
  window.Sodoku.Models.SourceType = window.Sodoku.Models.SourceType || {
    predefined: "P",
    userInput: "U",
    hint: "H"
  };

  var SourceType = window.Sodoku.Models.SourceType;

  window.Sodoku.Models.Board = window.Sodoku.Models.Board || function Board(stringRep){
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
        sourceRow.push(digit === 0 ? SourceType.predefined : SourceType.userInput);
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
          if(map[cell] == null){
            map[cell] = i;
          } else {
            var io = map[cell];
            invalid[io][j] = true;
            invalid[io][j] = true;
            valide = false;
          }
        }
      }

      for(var i = 0; i < 9; i+=3){
        for(var j = 0; j < 9; j+=3){
          var map = {};
          for(var ii=i;ii<i+3;ii++){
            for(var jj = j; jj < j+3; jj++){
              var cell = store[ii][jj];
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

      updateCell: function Board_updateCell(x, y, value, sourceType){
        if(value == null || typeof value !== "number" || value < 0 || value > 9){
          return;
        }

        this.store[x][y] = value;
        this.source[x][y] = sourceType || SourceType.userInput;
        this.validateAll();
      },

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
})();
