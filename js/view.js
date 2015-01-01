(function(){
  "use strict";

  window.Sudoku = window.Sudoku || {};
  window.Sudoku.View = window.Sudoku.View || {};
  window.Sudoku.View.showDialog = window.Sudoku.View.showDialog || function showDialog($elem, options){
    options = options || {};
    var $dialog = $("#dialog");
    $dialog.css("top", document.body.scrollTop + "px")
      .css("left", document.body.scrollLeft + "px")
      .css("width", window.innerWidth + "px")
      .css("height", window.innerHeight + "px");
    $dialog.show();
  };

  window.Sudoku.View.hideDialog = window.Sudoku.View.hideDialog || function hideDialog($elem){
    $elem[0].hide();
  };

  var SourceType = window.Sudoku.Models.SourceType;
  var GameState = window.Sudoku.Models.GameState;

  window.Sudoku.View.jQueryView = window.Sudoku.View.jQueryView || function jQueryView(boardSelector, numberPickerSelector, gamePickerSelector, completeMessageSelector, abandonMessageSelector, timeSelector){
    var $boardElement = $(boardSelector);
    var $numberPickerElement = $(numberPickerSelector);
    var $gamePickerElement = $(gamePickerSelector);
    var $completeMessageElement = $(completeMessageSelector);
    var $abandonMessageElement = $(abandonMessageSelector);
    var $timeElement = $(timeSelector);

    function getNumberFontSize(){
      var height = document.offsetHeight;
      if(height >= 1000){
        return 60;
      } else if(height >= 800){
        return 50;
      } else if(height >= 600){
        return 40;
      } else if(height >= 400){
        return 30;
      } else if(height >= 300){
        return 20;
      } else if(height >= 200){
        return 14;
      } else {
        return 12;
      }
    }

    function showNumberPicker(cellIndex, oldNumber, posX, posY, onNumberSelected){
      var min = Math.min(document.body.scrollWidth, document.body.scrollHeight);
      var r = min / 5;
      var d = r * 2;

      var x = posX - r, y = posY - r;
      if(posX > min - r){
        x = min - d;
      } else if(posX < r){
        x = 0;
      }

      if(posY > min - r){
        y = min - d;
      } else if(posY < r){
        y = 0;
      }

      var $elem = $numberPickerElement;
      var $svg = $elem.find("svg");
      $svg.attr("width", d + "px").attr("height", d + "px");
      var $paths = $svg.find("path");

      $svg.find("g.all").attr("transform", "translate(" + r + "," + r + ")");
      // to make sure the circle is not cut off by the div boundary
      r = r - 1;

      var $paths = $svg.find("path");
      var $texts = $svg.find("text");
      var $circle = $svg.find("circle");
      $circle.attr("r", r*2/5);
      $circle.off();
      $circle.on("click", function(){
        $elem.hide();
      });
      var $text = $($texts[0]);
      $text.text(oldNumber);

      for(var i = 0; i < 9; i++){
        var $path = $($paths[i]);
        var angle = Math.PI * i * 2 / 9;
        var nextAngle = Math.PI * (i+1) * 2 / 9;
        $path.attr("d", "M0,0 L" + (r * Math.sin(angle)) + "," + (-r * Math.cos(angle)) + " A" + r + "," + r + " 0 0,1 " + (r * Math.sin(nextAngle)) + "," + (- r * Math.cos(nextAngle)));
        $path.attr("name", i+1);
        $path.off();
        $path.on("click", function(e){
          e = e || window.event;
          e = jQuery.event.fix(e);
          var index = parseInt(e.target.attributes["name"].value);
          onNumberSelected(Math.floor(cellIndex / 9), cellIndex % 9, index);
          $elem.hide();
        });
        var $text = $($texts[i+1]);
        var centerAngle = Math.PI * (i * 2 + 1) / 9;
        $text.attr("x", r*3/4 * Math.sin(centerAngle)).attr("y", -r*3/4* Math.cos(centerAngle));
      }

      $elem.css("left", x+"px").css("top", y+"px").css("width", d+"px").css("height", d+"px");
      $elem.show();
      var offset = getNumberFontSize() / 2 + 2;
      $svg.find("g.text").attr("transform", "translate(0," + offset + ")");
    }

    function showDialog($elem, options){
      hideDialog();

      var $dialog = $("#dialog");
      $elem.detach();
      $dialog.append($elem);
      $elem.show();
      $dialog.show();
    }

    function hideDialog(){
      var $dialog = $("#dialog");
      var $children = $dialog.children();
      $children.detach();
      $(document.body).append($children);
      $children.hide();
      $dialog.hide();
    }

    function renderCompleteMessage(game){
      showDialog($completeMessageElement);
    }

    function renderAbandonMessage(game){
      showDialog($abandonMessageElement);
    }

    return {
      $boardElement: $boardElement,
      $numberPickerElement: $numberPickerElement,
      $gamePickerElement: $gamePickerElement,
      $completeMessageElement: $completeMessageElement,
      $abandonMessageElement: $abandonMessageElement,
      $timeElement: $timeElement,
      timeRendering: false,
      startTime: null,

      initIfNeeded: function jQueryView_initIfNeeded(){
        var $elem = this.$boardElement;
        if($elem[0].initialized){
          return;
        }

        $elem.empty();
        for(var i = 0; i < 9; i++){
          var $region = $('<div class="region"></div>');
          for(var j = 0; j < 9; j++){
            var $cell = $('<div class="cell"><span></span></div>');
            var index = (Math.floor(i/3)*3 + Math.floor(j/3)) * 9 + (i%3*3 + j%3);
            $cell.attr("name", index);
            $region.append($cell);
          }
          $region.append('<div class="clearfix"></div>');
          $elem.append($region);
        }
        $elem.append('<div class="clearfix"></div>');

        $elem[0].initialized = true;
      },

      renderTime: function jQueryView_renderTime(game){
        var $elem = this.$timeElement;
        var that = this;
        this.timeRendering = true;
        this.startTime = game.startTime;
        function render(){
          if(that.timeRendering){
            var diff = new Date() - that.startTime;
            diff /= 1000;
            var sec = Math.floor(diff % 60);
            var hour = Math.floor(diff / 3600);
            var min = Math.floor(diff / 60 - hour * 60);
            $elem.text(hour + ":" + (min < 10 ? '0' : '') + min + ":" + (sec < 10 ? '0' : '') + sec);
            setTimeout(render, 200);
          }
        }

        render();
      },

      stopRenderingTime: function jQueryView_stopRenderingTime(){
        this.timeRendering = false;
      },

      renderGamePicker: function jQueryView_renderGamePicker(gameService, onGamePicked){
        var that = this;
        var $elem = this.$gamePickerElement;
        if(!$elem[0].init){
          var gameIds = gameService.getGameIds();
          for(var i = 0; i < gameIds.length; i++){
            var id = gameIds[i];
            $elem.append('<button name="' + id + '">' + gameIds[i] + '</button>');
          }
          $elem[0].init = true;
        }

        var $buttons = $elem.find("button");
        $buttons.off();
        $buttons.on("click", function(e){
          e = e || window.event;
          e = jQuery.event.fix(e);
          var id = parseInt(e.target.attributes["name"].value);
          onGamePicked(id);
          that.hideGamePicker();
        });

        showDialog($elem);
      },

      hideGamePicker: function jQueryView_hideGamePicker(){
        hideDialog();
      },

      hideCompleteMessage: function jQueryView_hideCompleteMessage(){
        hideDialog();
      },

      hideAbandonMessage: function jQueryView_hideAbandonMessage(){
        hideDialog();
      },

      renderGame: function jQueryView_renderGame(game){
        var $elem = this.$boardElement;
        this.initIfNeeded();

        if(game.state === GameState.started){
          this.renderTime(game);
        } else if(game.state === GameState.completed){
          this.stopRenderingTime(game);
          renderCompleteMessage(game);
        } else if(game.state === GameState.abandoned){
          this.stopRenderingTime(game);
          renderAbandonMessage(game);
        }

        var that = this;

        function onCellClicked(e){
          e = e || window.event;
          e = jQuery.event.fix(e);
          var target = e.target;
          if(target.tagName === "SPAN"){
            target = target.parentNode;
          }
          var index = parseInt(target.attributes["name"].value);
          if(isNaN(index)){
            return;
          }

          showNumberPicker(index, target.innerText, e.pageX, e.pageY, function(x, y, num){
            game.setNumber(x, y, num);
            that.renderGame(game);
          });
        }

        var board = game.board;
        var regions = board.getRegions();
        var $regions = $elem.find(".region");
        if(regions.length != 9 || $regions.length != 9){
          // log error and save to server
          return;
        }

        var playable = game.state === GameState.started || game.state === GameState.readyToStart;
        for(var i = 0; i < 9; i++){
          var cells = regions[i];
          var $cells = $($regions[i]).find(".cell");
          if(cells.length != 9 || $cells.length != 9){
            // log error and save to server
            return;
          }

          for(var j = 0; j < 9; j++){
            var cell = cells[j];
            var $cell = $($cells[j]);
            if(cell.inv){
              $cell.addClass("invalid");
            } else {
              $cell.removeClass("invalid");
            }
            $cell.off();
            if(cell.src === SourceType.predefined){
              $cell.addClass("predefined");
              $cell.removeClass("hint");
              $cell.removeClass("userInput");
            } else if(cell.src === SourceType.hint){
              $cell.removeClass("predefined");
              $cell.addClass("hint");
              $cell.removeClass("userInput");
            } else if(cell.src === SourceType.userInput){
              $cell.removeClass("predefined");
              $cell.removeClass("hint");
              $cell.addClass("user-input");
              playable && $cell.on("click", onCellClicked);
            }
            if(cell.val > 0){
              $cell.find("span").text(cell.val);
            }else {
              $cell.find("span").text("");
            }
          }
        }

      },

    };
  };
})();
