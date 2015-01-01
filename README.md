Features Planned:
1. User can start playing the game right away.
2. User can choose from multiple predefined games.
2. User gets realtime validation after each actions.
3. User can use in-game item: Hint to get a hint.
4. User can switch among three skins, based on design of three popular web sites.
5. User can see equally good UI no matter whether his device is in portrait or landscape mode - even a square!
6. User can choose number from a roulette wheel, with clicking center meaning cancel the selection.

Implementation Details:
1. js/services.js: Service mock up to see the interface designed between frontend and backend.
2. js/renderers.js: Different renderers can provide different implementation for rendering, we're having jQuery for instance.

Further ideas:
1. VS game: two people solving the same board, view side by side, one could see everything for his own cell, but could only see which cell is solved on the opponent's board.
2. Provide interface for record and replay.
3. Enable multiple (possible) numbers in a cell.
4. With 2 and 3, provide interface for solver: show how the possible numbers get reduced.
5. Provide keyboard access
  4.1 Up, Down, Left, Right to focus
  4.2 Type to input number
6. Friends and Leaderboards
7. Purchase of the in-game item
8. Better animation on the roulette wheel to choose numbers, implementing an new effect for jQuery.show()

References:
1.The predefined questions come from "Hardest 20": http://attractivechaos.github.io/plb/kudoku.html.
