sprintboard-booster
===================

DESCRIPTION
-----------

Boost Y! Sprintboard:
* Add user profile picture to the sticky notes
* Change sticky note size from square to rectangular
* Hide empty story rows when user is in focus
* Reduce the opacity of the unfocussed sticky notes
* Quick sprint members dashboard + the switch panel (WIP)

Tested on Chrome, may work on other browsers with similar plugins.

SETUP GUIDE
-----------

1. Install Tampermonkey chrome extension:

    https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo

2. Download sprintboard-booster.css and sprintboard-booster.js from:
    * https://raw.github.com/jugend/sprintboard-booster/master/sprintboard-booster.js
    * https://raw.github.com/jugend/sprintboard-booster/master/sprintboard-booster.css
  
   Or you can also git clone from:
    git clone https://github.com/jugend/sprintboard-booster
  
3. Create a new script in Tampermonkey with the content of sprintboard-booster.js

    http://d.pr/i/nWHl
    
4. Configure Update URL for the Sprint Booster script in Tampermonkey, so you can get new updates easily:
    
    https://raw.github.com/jugend/sprintboard-booster/master/sprintboard-booster.js
  
5. That's it, press F5 to refresh the Sprintboard page and your sprintboard is boosted!!

REPOSITORY
----------

https://github.com/jugend/sprintboard-booster

Patch submissions are gladly welcome.

CONTRIBUTORS
------------
* Thanks to Herry Leonard for the on user focus patch to hide the empty rows