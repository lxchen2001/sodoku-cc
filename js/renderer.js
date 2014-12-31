(function(){
  "use strict";

  window.Sodoku = window.Sodoku || {};
  window.Sodoku.Renderers = window.Sodoku.Renderers || {};

  var SourceType = window.Sodoku.Models.SourceType;

  window.Sodoku.Renderers.jQueryRenderer = window.Sodoku.Renderers.jQueryRenderer || function jQueryRenderer(){

    return {
      initIfNeeded: function jQueryRenderer_initIfNeeded(element){
        if(element.initialized){
          return;
        }

        var $elem = $(element);
        $elem.empty();
        for(var i = 0; i < 9; i++){
          var $region = $('<div class="region"></div>');
          for(var j = 0; j < 9; j++){
            $region.append('<div class="cell"><span></span></div>');
          }
          $region.append('<div class="clearfix"></div>');
          $elem.append($region);
        }
        $elem.append('<div class="clearfix"></div>');
        element.initialized = true;
      },

      render: function jQueryRenderer_render(element, board){
        this.initIfNeeded(element);

        var regions = board.getRegions();
        var $regions = $(element).find(".region");
        if(regions.length != 9 || $regions.length != 9){
          // log error and save to server
          return;
        }

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
            }
            cell.val > 0 && $cell.find("span").text(cell.val);
          }
        }

      }
    };
  };
})();
