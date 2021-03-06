var Sudoku;
(function(Sudoku){
  "use strict";

  Sudoku.Services = Sudoku.Services || {};
  Sudoku.Services.UserService = Sudoku.Services.UserService || function UserService(){
    return {
      getUserInfo: function UserService_getUserInfo(){
        return {
          name: "Hooray Hu",
          avatar: "hooray.png",
        }
      },
    };
  };

  Sudoku.Services.GameService = Sudoku.Services.GameService || function GameService(){
    var games = [
      "98765432124617398535192874612853769463489215779546183251928647347231956886374521.",
      "..............3.85..1.2.......5.7.....4...1...9.......5......73..2.1........4...9",
      ".......12........3..23..4....18....5.6..7.8.......9.....85.....9...4.5..47...6...",
      ".2..5.7..4..1....68....3...2....8..3.4..2.5.....6...1...2.9.....9......57.4...9..",
      "........3..1..56...9..4..7......9.5.7.......8.5.4.2....8..2..9...35..1..6........",
      "12.3....435....1....4........54..2..6...7.........8.9...31..5.......9.7.....6...8",
      "1.......2.9.4...5...6...7...5.9.3.......7.......85..4.7.....6...3...9.8...2.....1",
      ".......39.....1..5..3.5.8....8.9...6.7...2...1..4.......9.8..5..2....6..4..7.....",
      "12.3.....4.....3....3.5......42..5......8...9.6...5.7...15..2......9..6......7..8",
      "..3..6.8....1..2......7...4..9..8.6..3..4...1.7.2.....3....5.....5...6..98.....5.",
      "1.......9..67...2..8....4......75.3...5..2....6.3......9....8..6...4...1..25...6.",
      "..9...4...7.3...2.8...6...71..8....6....1..7.....56...3....5..1.4.....9...2...7..",
      "....9..5..1.....3...23..7....45...7.8.....2.......64...9..1.....8..6......54....7",
      "4...3.......6..8..........1....5..9..8....6...7.2........1.27..5.3....4.9........",
      "7.8...3.....2.1...5.........4.....263...8.......1...9..9.6....4....7.5...........",
      "3.7.4...........918........4.....7.....16.......25..........38..9....5...2.6.....",
      "........8..3...4...9..2..6.....79.......612...6.5.2.7...8...5...1.....2.4.5.....3",
      ".......1.4.........2...........5.4.7..8...3....1.9....3..4..2...5.1........8.6...",
      ".......12....35......6...7.7.....3.....4..8..1...........12.....8.....4..5....6..",
      "1.......2.9.4...5...6...7...5.3.4.......6........58.4...2...6...3...9.8.7.......1",
      ".....1.2.3...4.5.....6....7..2.....1.8..9..3.4.....8..5....2....9..3.4....67.....",
    ];

    var solves = [
      "987654321246173985351928746128537694634892157795461832519286473472319568863745219",
      "987654321246173985351928746128537694634892157795461832519286473472319568863745219",
      "839465712146782953752391486391824675564173829287659341628537194913248567475916238",
      "123456789457189236869273154271548693346921578985637412512394867698712345734865921",
      "562987413471235689398146275236819754714653928859472361187324596923568147645791832",
      "126395784359847162874621953985416237631972845247538691763184529418259376592763418",
      "174385962293467158586192734451923876928674315367851249719548623635219487842736591",
      "751846239892371465643259871238197546974562318165438927319684752527913684486725193",
      "125374896479618325683952714714269583532781649968435172891546237257893461346127958",
      "123456789457189236896372514249518367538647921671293845364925178715834692982761453",
      "123456789456789123789123456214975638375862914968314275591637842637248591842591367",
      "239187465675394128814562937123879546456213879798456312367945281541728693982631754",
      "743892156518647932962351748624589371879134265351276489496715823287963514135428697",
      "468931527751624839392578461134756298289413675675289314846192753513867942927345186",
      "728946315934251678516738249147593826369482157852167493293615784481379562675824931",
      "317849265245736891869512473456398712732164958981257634174925386693481527528673149",
      "621943758783615492594728361142879635357461289869532174238197546916354827475286913",
      "693784512487512936125963874932651487568247391741398625319475268856129743274836159",
      "673894512912735486845612973798261354526473891134589267469128735287356149351947628",
      "174835962293476158586192734957324816428961375361758249812547693635219487749683521",
      "869571324327849516145623987952368741681497235473215869514982673798136452236754198",
    ];

    var ids = [];
    for(var i = 0; i < 20; i++){
      ids.push(i);
    }

    return {
      games: games,
      solves: solves,
      gameIds: ids,

      getNewGame: function GameService_getNewGame(id){
        if(id == null || typeof id !== "number" || id < 0 || id > 19){
          return null;
        }

        return this.games[id];
      },

      getGameIds: function GameServices_getGameIds(){
        return this.gameIds;
      },

      getNewRandomGame: function GameService_getNewRandomGame(){
        var rd = Math.floor(Math.random()*20);
        return {
          id: rd,
          stringRep: this.games[rd]
        }
      },

      // this is the special case since all of them has only one solution each
      // if not, we should introduce a solver to solve the current board
      hint: function GameService_hint(game){
        if(game == null){
          // log error and save to server
          return false;
        }

        var id = game.id;
        if(id == null || typeof id !== "number" || id < 0 || id > 19){
          // log error and save to server
          return false;
        }
        var board = game.board;

        var solve = this.solves[id];
        var emptyCells = board.getEmptyCells();
        if(emptyCells.length === 0){
          return false;
        }

        var rd = Math.floor(Math.random() * emptyCells.length);
        var emptyCell = emptyCells[rd];
        var x = emptyCell.x;
        var y = emptyCell.y;
        return board.updateCellHint(x, y, parseInt(solve[x * 9 + y]));
      }
    };
  };

  if(typeof module !== "undefined"){
    module.exports = Sudoku.Services;
  }
})(Sudoku || (Sudoku = {}));
