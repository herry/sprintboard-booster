sprintboard-booster
===================

DESCRIPTION
-----------

Boost Y! Sprintboard:
* Add user profile picture to the sticky notes
* Change sticky note size from square to rectangular
* Hide empty story rows when a member is in focus
* Reduce the opacity of the unfocussed sticky notes when a member is in focus
* Quick sprint member dashboard cum switch panel (WIP)

Tested on Chrome, may work on other browsers with similar plugins.

SETUP GUIDE
-----------

1. Install Tampermonkey chrome extension:

    https://chrome.google.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo

2. Install Stylebot chrome extension:

    https://chrome.google.com/webstore/detail/oiaejidbmkiecgbjeifoejpgmdaleoha
 
3. Download sprintboard-booster.css and sprintboard-booster.js from:
    * https://raw.github.com/jugend/sprintboard-booster/master/sprintboard-booster.js
    * https://raw.github.com/jugend/sprintboard-booster/master/sprintboard-booster.css
  
   Or you can also git clone from:
    git clone https://github.com/jugend/sprintboard-booster
  
4. Create a new script in Tampermonkey with the content of sprintboard-booster.js

    http://d.pr/i/nWHl
    
5. Configure Update URL for the Sprint Booster script in Tampermonkey, so you can get the new update easily:
    
    https://raw.github.com/jugend/sprintboard-booster/master/sprintboard-booster.js
  
5. Visit Sprint Board page and configure Stylebot page styling with the content of sprintboard-booster.css.
   Mouse right click on the page > Click on Style Element, then click on Edit CSS button

    http://d.pr/i/eRJX
  
6. That's it, press F5 to refresh the Sprintboard page and your sprintboard is boosted!!

REPOSITORY
----------

https://github.com/jugend/sprintboard-booster

Patch submissions are gladly welcome.

CONTRIBUTORS
------------
* Thanks to Herry Leonard for the on focus change, hide empty row patch