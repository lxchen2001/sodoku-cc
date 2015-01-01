#Problem and Solution
This is a code challenge project, to build a Sudoku game.

###Features
<ol>
  <li>User can start playing the game right away
  <li>User can choose from multiple predefined games
  <li>User gets realtime validation after each actions
  <li>User can get a hint
  <li>User can switch among three skins, based on theme colors of three popular web sites
  <li>User can see equally good UI no matter whether his device is in portrait or landscape mode
  <li>User can picking number from a roulette wheel, with clicking center meaning cancel the picking
</ol>

###Dependencies
* [jQuery] - to operate the DOM. This is replaceable, since all of the usage is encapsulated in jQueryView.

###Project Structure
#####HTML
* index.html: The only HTML that shows

#####CSS
* css/site.css: The site level stylesheet, could be used for other games / pages
* css/sudoku.css: The stylesheet specifically for the game
* css/skins: The stylesheet and resources for different skins

#####JavaScript
* js/models.js: Models mock up to see the interface designed between frontend and backend.
* js/controllers.js: Service mock up to see the interface designed between frontend and backend.
* js/view.js: Service mock up to see the interface designed between frontend and backend.
* js/services.js: Service mock up to see the interface designed between frontend and backend.

#####Tests
* tests/modelsmockup.js: Mock up for models
* tests/modelstests.js: Test cases for models
* tests/viewmockup.js: Mock up for view
* tests/viewtests.js: Test cases for view
* tests/controllertests.js: test cases for controllers, with mockup for models and view

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
