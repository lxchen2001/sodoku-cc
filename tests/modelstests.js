var Sudoku = Sudoku || {};
Sudoku.Models = require('../js/models');

describe("Sudoku.Models.Tests", function(){
  "use strict";

  var Board = Sudoku.Models.Board;
  var Game = Sudoku.Models.Game;
  var GameState = Sudoku.Models.GameState;
  var SourceType = Sudoku.Models.SourceType;

  var validBoardString = "98765432124617398535192874612853769463489215779546183251928647347231956886374521.";
  var validFullBoardString = "987654321246173985351928746128537694634892157795461832519286473472319568863745219";
  var invalidBoardString = "9876543212461739853519287461285376946348921577954618325192864734723195688637452.1";
  var invalidFullBoardString = "987654321246173985351928746128537694634892157795461832519286473472319568863745211";

  it("Board.ctor.empty", function(){
    var board = new Board("");
    expect(board.getRegions).toBeUndefined();
  });

  it("Board.ctor.wrong size", function(){
    var board = new Board("123456789");
    expect(board.getRegions).toBeUndefined();
  });

  it("Board.ctor.illegal letters", function(){
    var board = new Board("A");
    expect(board.getRegions).toBeUndefined();
  });

  it("Board.ctor.illegal letters2", function(){
    var board = new Board("0");
    expect(board.getRegions).toBeUndefined();
  });

  it("Board.ctor.valid", function(){
    var board = new Board(validBoardString);
    expect(board.getRegions).toBeDefined();
  });

  it("Board.validateAll.valid", function(){
    var board = new Board(validBoardString);
    expect(board.validateAll()).toBe(true);
  });

  it("Board.validateAll.invalid", function(){
    var board = new Board(invalidBoardString);
    expect(board.validateAll()).toBe(false);
  });

  it("Board.validateAll.valid full",function(){
    var board = new Board(validFullBoardString);
    expect(board.validateAll()).toBe(true);
  });

  it("Board.validateAll.invalid full",function(){
    var board = new Board(invalidFullBoardString);
    expect(board.validateAll()).toBe(false);
  });

  it("Board.isComplete.valid", function(){
    var board = new Board(validBoardString);
    expect(board.isComplete()).toBe(false);
  });

  it("Board.isComplete.invalid", function(){
    var board = new Board(invalidBoardString);
    expect(board.isComplete()).toBe(false);
  });

  it("Board.isComplete.valid full",function(){
    var board = new Board(validFullBoardString);
    expect(board.isComplete()).toBe(true);
  });

  it("Board.isComplete.invalid full",function(){
    var board = new Board(invalidFullBoardString);
    expect(board.isComplete()).toBe(false);
  });

  it("Board.getEmptyCells.valid", function(){
    var board = new Board(validBoardString);
    expect(board.getEmptyCells().length).toBe(1);
  });

  it("Board.getEmptyCells.invalid", function(){
    var board = new Board(invalidBoardString);
    expect(board.getEmptyCells().length).toBe(1);
  });

  it("Board.getEmptyCells.valid full",function(){
    var board = new Board(validFullBoardString);
    expect(board.getEmptyCells().length).toBe(0);
  });

  it("Board.getEmptyCells.invalid full",function(){
    var board = new Board(invalidFullBoardString);
    expect(board.getEmptyCells().length).toBe(0);
  });

  function validateRegions(string, regions){
    expect(regions).not.toBeNull();
    expect(regions.length).toBe(9);
    for(var i = 0; i < 9; i++){
      var region = regions[i];
      expect(region.length).toBe(9);
      for(var j = 0; j < 9; j++){
        var index = (Math.floor(i/3)*3 + Math.floor(j/3)) * 9 + (i%3*3 + j%3);
        var cell = region[j].val;
        var digit = string[index];
        if(cell === 0){
          expect(digit).toBe(".");
        } else {
          expect(digit).toBe(cell.toString());
        }
      }
    }
  }

  it("Board.getRegions.valid", function(){
    var board = new Board(validBoardString);
    var regions = board.getRegions();
    validateRegions(validBoardString, regions);
  });

  it("Board.getRegions.invalid", function(){
    var board = new Board(invalidBoardString);
    var regions = board.getRegions();
    validateRegions(invalidBoardString, regions);
  });

  it("Board.getRegions.valid full", function(){
    var board = new Board(validFullBoardString);
    var regions = board.getRegions();
    validateRegions(validFullBoardString, regions);
  });

  it("Board.getRegions.invalid Full", function(){
    var board = new Board(invalidFullBoardString);
    var regions = board.getRegions();
    validateRegions(invalidFullBoardString, regions);
  });

  if("Board.updateCell.valid", function(){
    var board = new Board(validBoardString);
    board.updateCell(8, 8, 9);
    expect(board.store[8][8]) = 9;
  });

  if("Board.updateCell.invalid", function(){
    var board = new Board(invalidBoardString);
    board.updateCell(8, 8, 9);
    expect(board.store[8][8]) = 9;
  });

  if("Board.updateCell.valid full", function(){
    var board = new Board(validFullBoardString);
    board.updateCell(8, 8, 9);
    expect(board.store[8][8]) = 9;
  });

  if("Board.updateCell.invalid full", function(){
    var board = new Board(invalidFullBoardString);
    board.updateCell(8, 8, 9);
    expect(board.store[8][8]) = 9;
  });

  it("Game.ctor.null board", function(){
    var game = new Game(0, null);
    expect(game.id).toBeUndefined();
  });

  it("Game.ctor.valid board", function(){
    var game = new Game(0, new Board(validBoardString));
    expect(game.id).toBe(0);
  });

  it("Game.ctor.invalid board", function(){
    var game = new Game(0, new Board(invalidBoardString));
    expect(game.id).toBe(0);
  });

  it("Game.ctor.completed board", function(){
    var game = new Game(0, new Board(validFullBoardString));
    expect(game.id).toBe(0);
    expect(game.state).toBe(GameState.completed);
    expect(game.startTime).toBe(game.endTime);
    expect(game.startTime).not.toBeLessThan(new Date());
  });

  it("Game.ctor.invalid full board", function(){
    var game = new Game(0, new Board(invalidFullBoardString));
    expect(game.id).toBe(0);
    expect(game.state).toBe(GameState.readyToStart);
    expect(game.startTime).toBeNull();
    expect(game.endTime).toBeNull();
  });

  it("Game.start.readyToStart", function(){
    var game = new Game(0, new Board(validBoardString));
    var date = new Date();
    expect(game.start()).toBe(true);
    var date2  = new Date();
    expect(game.state).toBe(GameState.started);
    expect(game.startTime).not.toBeLessThan(date);
    expect(game.startTime).not.toBeGreaterThan(date2);
    expect(game.endTime).toBeNull();
  });

  it("Game.start.started", function(){
    var game = new Game(0, new Board(validBoardString));
    game.state = GameState.started;
    expect(game.start()).toBe(true);
    expect(game.state).toBe(GameState.started);
  });

  it("Game.start.completed", function(){
    var game = new Game(0, new Board(validBoardString));
    game.state = GameState.completed;
    expect(game.start()).toBe(false);
    expect(game.state).toBe(GameState.completed);
  });

  it("Game.start.abandoned", function(){
    var game = new Game(0, new Board(validBoardString));
    game.state = GameState.abandoned;
    expect(game.start()).toBe(false);
    expect(game.state).toBe(GameState.abandoned);
  });

  it("Game.checkComplete.not completed", function(){
    var game = new Game(0, new Board(validBoardString));
    expect(game.checkComplete()).toBe(false);
    expect(game.state).not.toBe(GameState.completed);
  })

  it("Game.checkComplete.completed", function(){
    var game = new Game(0, new Board(validFullBoardString));
    expect(game.checkComplete()).toBe(true);
    expect(game.state).toBe(GameState.completed);
  })

  it("Game.setNumber.valid", function(){
    var game = new Game(0, new Board(validBoardString));
    expect(game.state).toBe(GameState.readyToStart);
    expect(game.setNumber(8, 8, 9)).toBe(true);
    expect(game.state).toBe(GameState.completed);
  });

  it("Game.setNumber.invalid", function(){
    var game = new Game(0, new Board(invalidBoardString));
    expect(game.state).toBe(GameState.readyToStart);
    expect(game.setNumber(8, 7, 1)).toBe(true);
    expect(game.state).toBe(GameState.started);
    expect(game.setNumber(8, 8, 9)).toBe(true);
    expect(game.state).toBe(GameState.completed);
  });

  it("Game.setNumber.valid full", function(){
    var game = new Game(0, new Board(validFullBoardString));
    expect(game.state).toBe(GameState.completed);
    expect(game.setNumber(8, 8, 1)).toBe(false);
    expect(game.state).toBe(GameState.completed);
  });

  it("Game.setNumber.invalid full", function(){
    var game = new Game(0, new Board(invalidFullBoardString));
    expect(game.state).toBe(GameState.readyToStart);
    expect(game.setNumber(8, 8, 9)).toBe(true);
    expect(game.state).toBe(GameState.completed);
  });

  it("Game.abandon.readyToStart", function(){
    var game = new Game(0, new Board(validBoardString));
    expect(game.abandon()).toBe(false);
    expect(game.state).toBe(GameState.readyToStart);
  });

  it("Game.abandon.started", function(){
    var game = new Game(0, new Board(validBoardString));
    game.state = GameState.started;
    expect(game.abandon()).toBe(true);
    expect(game.state).toBe(GameState.abandoned);
  });

  it("Game.abandon.completed", function(){
    var game = new Game(0, new Board(validBoardString));
    game.state = GameState.completed;
    expect(game.abandon()).toBe(false);
    expect(game.state).toBe(GameState.completed);
  });

  it("Game.abandon.abandoned", function(){
    var game = new Game(0, new Board(validBoardString));
    game.state = GameState.abandoned;
    expect(game.abandon()).toBe(false);
    expect(game.state).toBe(GameState.abandoned);
  });
});
