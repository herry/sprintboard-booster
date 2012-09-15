// ==UserScript==
// @name       Sprintboard Booster
// @namespace  http://siatono.com/
// @version    0.3
// @description Sprintboard booster
// @match      http://ci.media.corp.yahoo.com:9999/sprintboard
// @require    http://yui.yahooapis.com/combo?3.6.0/yui/yui-min.js&3.6.0/attribute-core/attribute-core-min.js&3.6.0/oop/oop-min.js&3.6.0/event-custom-base/event-custom-base-min.js&3.6.0/event-custom-complex/event-custom-complex-min.js&3.6.0/attribute-events/attribute-events-min.js&3.6.0/attribute-extras/attribute-extras-min.js&3.6.0/attribute-base/attribute-base-min.js&3.6.0/attribute-complex/attribute-complex-min.js&3.6.0/base-core/base-core-min.js&3.6.0/base-base/base-base-min.js&3.6.0/pluginhost-base/pluginhost-base-min.js&3.6.0/pluginhost-config/pluginhost-config-min.js&3.6.0/base-pluginhost/base-pluginhost-min.js&3.6.0/classnamemanager/classnamemanager-min.js&3.6.0/dom-core/dom-core-min.js&3.6.0/dom-base/dom-base-min.js&3.6.0/selector-native/selector-native-min.js&3.6.0/selector/selector-min.js&3.6.0/node-core/node-core-min.js&3.6.0/node-base/node-base-min.js&3.6.0/event-base/event-base-min.js&3.6.0/event-synthetic/event-synthetic-min.js&3.6.0/event-focus/event-focus-min.js&3.6.0/dom-style/dom-style-min.js&&3.6.0/build/node-screen/node-screen-min.js&3.6.0/build/node-style/node-style-min.js
// @copyright  2012, Herryanto Siatono
// ==/UserScript==

YUI().use('base', 'node', function(Y) {
    function SprintboardBooster() {
        SprintboardBooster.superclass.constructor.apply(this, arguments);
    }
    
    Y.extend(SprintboardBooster, Y.Base, {
        initializer: function() {
            this._turnOn();
            this._bindUI();
        },
        
        _turnOn: function() {
            var isOn = this._isOn;
            
            if (!this._isSprintboardLoaded()) {
                return Y.later(1000, this, this._turnOn);
            }
            
            if (isOn) {
                return;
            }
                        
            this._loadUserAvatars();
            this._updateBoardRowsHeight();
            this._isOn = true;
        },
        
        _bindUI: function() {
            var focusNode = Y.one('#focus_change'),
                sprintNode = Y.one('#sprint_change');
            
            focusNode.on('change', this._onFocusChange, this); 
            sprintNode.on('change', this._onSprintChange, this);
        },
        
        _isSprintboardLoaded: function() {
            var stickyNode = Y.Node.one('.sticky');
            
            if (stickyNode) {
                return true;
            }
        },
    
        _loadUserAvatars: function() {
            var userImageUrl = 'http://backyard.yahoo.com/isweb-icons/staff/[username]_square.jpg',
                userUrl = 'http://bugsearch.corp.yahoo.com/user/[username]/owner',
                stickyNodes = Y.Node.all('.sticky'),
                self = this,
                classNames, username, avatarMarkup, boardRowNode;
            
            stickyNodes.each(function(stickyNode) {            
                classNames = stickyNode.get('className').split(' ');
                username = classNames[0].split('-')[1];
            
                if (classNames.length === 2) {
                    stickyNode.addClass('sticky-default');
                }
            
                imageUrl = userImageUrl.replace('[username]', username);
                linkUrl = userUrl.replace('[username]', username);
                
                avatarMarkup = '<a class="avatar" href="' + linkUrl + '" target="_blank"><img src="' + imageUrl + 
                         ' " width="40" height="40" alt="' + username + '"></a>';
                stickyNode.prepend(avatarMarkup);
                
                // add boardNode that the current user being displayed
                if (!self._userBoards[username]) {
                    self._userBoards[username] = new Y.NodeList();
                }
                boardRowNode = stickyNode.ancestor('.board_row');
                self._userBoards[username].push(boardRowNode);
            });

            this._isOn = true;
        },

        /** 
         * Rows height is reset by existing script, sticky node height is changed, thus the resize is needed.
         */
        _updateBoardRowsHeight: function() {
            var rowNodes = Y.Node.all('#content .board_row'),
                boardNodes, stickyNodes, rowHeight;
            
            rowNodes.each(function(rowNode) {
                rowHeight = 0;

                // Get tallest board
                tallestBoardCount = 0;
                tallestBoardIndex = 0;
                boardNodes = rowNode.all('.board');
                boardNodes.each(function(boardNode, i) {
                    stickyNodes = boardNode.all('.sticky');
                    
                    if (stickyNodes.size() > tallestBoardCount) {
                        tallestBoardIndex = i;
                        tallestBoardCount = stickyNodes.size();
                    }                    
                });
                
                // Calculate tallest board height
                stickyNodes = boardNodes.item(tallestBoardIndex).all('.sticky');
                stickyNodes.each(function(stickyNode) {
                    rowHeight += stickyNode.get('offsetHeight') + 10;
                });
                                
                rowNode.setStyle('height', (rowHeight + 10 + 'px'));
            });
        },
        
        _reset: function() {
            this._isOn = false;
        },
        
        // Event Handlers
        
        _onFocusChange: function(e) {
            var focusSelectorNode = e.getTarget(),
                rowNodes = Y.Node.all('#content .board_row'),
                currentUsername = focusSelectorNode.get('value');
            
            if (currentUsername === 'none') {
                rowNodes.setStyle('display', 'block');
            } else {
                rowNodes.setStyle('display', 'none');
                self._userBoards[currentUsername].setStyle('display', 'block');
            }
        },
        
        _onSprintChange: function() {
            this._reset();
            Y.later(3000, this, this._turnOn);
        },
        
        // Private Variables
        
        _isOn: false,
        
        _userBoards: []
    });
    
    Y.later(3000, this, function() {
        new SprintboardBooster();
    });
});