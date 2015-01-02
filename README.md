#Problem and Solution
This is a code challenge project, to build a frontend only Sudoku game. As requested, I have used nothing except jQuery. Hosted at: http://sudokucc.azurewebsites.net

My LinkedIn Profile: http://www.linkedin.com/pub/lei-hooray-hu/23/b15/5a8


###Features
<ol>
  <li>User can start playing the game right away
  <li>User can choose from multiple predefined games
  <li>User gets realtime validation after each actions
  <li>User can get hints
  <li>User can switch among three skins, based on theme colors of three popular web sites
  <li>User can see equally good UI no matter whether his device is in portrait or landscape mode
  <li>User can picking number from a roulette wheel, with clicking center meaning cancel the picking
</ol>

###Dependencies
* [jQuery] - to operate the DOM. This is replaceable, since all of the usage is encapsulated in jQueryView.
* [jasmine] - unit tests
* [jasmine-npm] - command line jasmine test runner

###Project Structure
#####HTML
* index.html: the only HTML file

#####CSS
* css/site.css: The site level stylesheet, could be used for other games / pages
* css/sudoku.css: The stylesheet specifically for the game
* css/skins: The stylesheet and resources for different skins

#####JavaScript
* js/models.js: Game and Board classes which would be used by controllers and views
* js/controllers.js: GameController, the controller which will refer models and views
* js/view.js: jQueryView, an replaceable view for
* js/services.js: Service mock up to show the interface designed between frontend and backend.

#####Tests
* spec/support/jasmine.json: test file list for [jasmine-npm]
* tests/modelstests.js: unit test cases for models

Note: We could also create unit test cases for view and controllers with mockups for models.

###Further ideas
* Major Features:
  * VS game: two people solving the same board, view side by side, one could see everything for his own cell, but could only see which cell is solved on the opponent's board
  * Provide interface for record and replay
  * Enable multiple (possible) numbers in one cell
  * Show progress of solving
  * Friends and Leaderboards
  * Making the hint as an purchasable item
* Minor Improvements:
  * More Accessible - keyboard access
    * Up, Down, Left, Right to focus
    * Type to input number
  * "Rotating scan and show" animation on the roulette wheel to choose numbers

###References
* The predefined questions come from "Hardest 20": http://attractivechaos.github.io/plb/kudoku.html

[jQuery]:http://jquery.com
[jasmine]:https://github.com/jasmine/jasmine
[jasmine-npm]:https://github.com/jasmine/jasmine-npm
