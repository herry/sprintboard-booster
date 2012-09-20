// ==UserScript==
// @name       Sprintboard Booster
// @namespace  http://siatono.com/
// @version    0.4.0
// @description Sprintboard booster
// @match      http://ci.media.corp.yahoo.com:9999/sprintboard
// @require    http://yui.yahooapis.com/combo?3.7.1/build/yui-base/yui-base-min.js&3.7.1/build/oop/oop-min.js&3.7.1/build/event-custom-base/event-custom-base-min.js&3.7.1/build/features/features-min.js&3.7.1/build/dom-core/dom-core-min.js&3.7.1/build/dom-base/dom-base-min.js&3.7.1/build/selector-native/selector-native-min.js&3.7.1/build/selector/selector-min.js&3.7.1/build/node-core/node-core-min.js&3.7.1/build/node-base/node-base-min.js&3.7.1/build/event-base/event-base-min.js&3.7.1/build/event-delegate/event-delegate-min.js&3.7.1/build/node-event-delegate/node-event-delegate-min.js&3.7.1/build/pluginhost-base/pluginhost-base-min.js&3.7.1/build/pluginhost-config/pluginhost-config-min.js&3.7.1/build/node-pluginhost/node-pluginhost-min.js&3.7.1/build/dom-style/dom-style-min.js&3.7.1/build/dom-screen/dom-screen-min.js&3.7.1/build/node-screen/node-screen-min.js&3.7.1/build/node-style/node-style-min.js&3.7.1/build/attribute-core/attribute-core-min.js&3.7.1/build/base-core/base-core-min.js
// @require    http://yui.yahooapis.com/combo?3.7.1/build/event-custom-complex/event-custom-complex-min.js&3.7.1/build/attribute-events/attribute-events-min.js&3.7.1/build/attribute-extras/attribute-extras-min.js&3.7.1/build/attribute-base/attribute-base-min.js&3.7.1/build/base-base/base-base-min.js&3.7.1/build/base-pluginhost/base-pluginhost-min.js&3.7.1/build/base-build/base-build-min.js&3.7.1/build/event-simulate/event-simulate-min.js&3.7.1/build/async-queue/async-queue-min.js&3.7.1/build/gesture-simulate/gesture-simulate-min.js&3.7.1/build/node-event-simulate/node-event-simulate-min.js
// @copyright  2012, Herryanto Siatono
// ==/UserScript==

YUI().use('base', 'node', 'node-event-delegate', 'node-event-simulate', function(Y) {

    function SprintboardBooster() {
        SprintboardBooster.superclass.constructor.apply(this, arguments);
    }
    
    SprintboardBooster.ATTRS = {
        cssUrl: {
            value: 'https://dl.dropbox.com/u/9373461/yahoo/sprintboard-booster/sprintboard-booster.css'
        }
    };
        
    Y.extend(SprintboardBooster, Y.Base, {
        
        initializer: function() {
            this._loadCSS();
            this._turnOn();
        },
        
        _loadCSS: function() {
            var cssUrl = this.get('cssUrl'),
                cssMarkup = '<link rel="stylesheet" type="text/css" href="' + cssUrl + '?sprintboard">',
                cssNode = Y.Node.create(cssMarkup),
                headNode = Y.Node(document).one('head');

            headNode.appendChild(cssNode);
        },
        
        _turnOn: function() {
            var isOn = this._isOn;
            
            if (!this._isSprintboardLoaded()) {
                return Y.later(1000, this, this._turnOn);
            }
            
            if (isOn) {
                return;
            }
            
            this._actionBarPadOriginalHeight = Y.one('#action_bar_pad').getStyle('height');

            this._loadUserAvatars();
            this._updateRowHeights();
            this._addBoardLinks();
            this._addSummaryToggle();

            this._bindUI();

            this._isOn = true;
        },
        
        _bindUI: function() {
            var focusNode = Y.one('#focus_change'),
                sprintNode = Y.one('#sprint_change'),
                summaryToggleNode = Y.one('#toggle_summary');
            
            focusNode.on('change', this._onFocusChange, this); 
            sprintNode.on('change', this._onSprintChange, this);
            summaryToggleNode.on('click', this._onSummaryToggle, this);
        },
        
        _isSprintboardLoaded: function() {
            var stickyNode = Y.Node.one('.sticky');
            
            if (stickyNode) {
                return true;
            }

            return false;
        },
    
        _loadUserAvatars: function() {
            var userImageUrl = 'http://backyard.yahoo.com/isweb-icons/staff/[username]_square.jpg',
                userUrl = 'http://bugsearch.corp.yahoo.com/user/[username]/owner',
                stickyNodes = Y.Node.all('.sticky'),
                classNames, username, avatarMarkup, boardRowNode, taskState;
            
            stickyNodes.each(function(stickyNode) {
                
                // Add avatar        
                classNames = stickyNode.get('className').split(' ');
                username = classNames[0].split('-')[1];
                imageUrl = userImageUrl.replace('[username]', username);
                linkUrl = userUrl.replace('[username]', username);
                avatarMarkup = '<a class="avatar" href="' + linkUrl + '" target="_blank">' + 
                    '<img src="' + imageUrl + '" data-username="' + username +
                    '" width="40" height="40" class="avatar-img" title="' + username + '" alt="' + username + 
                    '" onerror="this.src=\'http://backyard.yahoo.com/isweb-icons/ybang.jpg\'"></a>';
                stickyNode.prepend(avatarMarkup);
                
                // Cache user boards
                if (!this._userBoards[username]) {
                    this._userBoards[username] = new Y.NodeList();
                }

                // Cache user total new/wip/verify/done state tasks
                if (!this._userTaskState[username]) {
                    this._userTaskState[username] = { 'new': 0, wip: 0, verify: 0, done: 0, username: username };
                }
                taskState = stickyNode.ancestor('.board_content').getAttribute('id').split('-')[1];
                this._userTaskState[username][taskState]++;
                
                boardRowNode = stickyNode.ancestor('.board_row');
                this._userBoards[username].push(boardRowNode);
            }, this);

            this._isOn = true;
        },

        _updateRowHeights: function() {
            Y.all('div.yui3-g').each(function(node) {
                node.setStyle('height', null);
            });
            
            Y.all('div.yui3-g').each(function(node) {
                node.setStyle('height', node.get('offsetHeight') + 'px');
            });
        },

        _addBoardLinks: function() {
            var boardHeaderNodes = Y.all('.board_row .board_header'),
                storyUrl = 'http://sprint.corp.yahoo.com/case/[storyid]/edit',
                boardId, boardContentNode, storyId;
            
            boardHeaderNodes.each(function(boardHeaderNode) {                
                boardContentNode = boardHeaderNode.ancestor('.board_content');

                if (boardContentNode) {
                    boardId = boardContentNode.getAttribute('id');
                    
                    if (boardId) {
                        storyId = (/story(\d+)-story/g.exec(boardId));
                        
                        if (storyId) {
                            if (storyId[1]) {
                                boardHeaderNode.setHTML(['<a href="', 
                                    storyUrl.replace('[storyid]', storyId[1]), '" target="_blank">',
                                    boardHeaderNode._node.innerText, '</a>'].join(''));
                            }
                        }
                    }
                }
            });
        },
        
        _addSummaryToggle: function() {
            var floatBarNode = Y.one('#float_bar');

            floatBarNode.appendChild('<a id="toggle_summary" href="#">Toggle User Summary</a>');
        },

        _createAvatarSummaryMarkup: function(userTaskStateArr, state) {
            var userImageUrl = 'http://backyard.yahoo.com/isweb-icons/staff/[username]_square.jpg',
                fullMarkup = [],
                imageUrl, avatarMarkup, username, ticketCount;
            
            // sort the array based on its given state value (i.e. new, wip, verify, done)
            userTaskStateArr.sort(function(a, b) {
                return b[state] - a[state];
            });
            
            for (var i = 0; i < userTaskStateArr.length; i++) {
                username = userTaskStateArr[i].username;
                ticketCount = userTaskStateArr[i][state];
                
                if (ticketCount > 0) {
                    imageUrl = userImageUrl.replace('[username]', username);
                    avatarMarkup = ['<span class="avatar-img-container">',
                        '<img data-username="', username ,'" class="avatar-img" src="', imageUrl, 
                            ' " width="40" height="40" title="', username, '" alt="',
                            username, '" onerror="this.src=\'http://backyard.yahoo.com/isweb-icons/ybang.jpg\'">', 
                        '<span class="avatar-img-totaltask">',
                        userTaskStateArr[i][state],'</span></span>'].join('');

                    fullMarkup.push(avatarMarkup);
                }
            }
            return fullMarkup.join('');
        },


        _reset: function() {
            this._isOn = false;
            this._userBoards = [];
        },
        
        // Event Handlers
        
        _onFocusChange: function(e) {
            var focusSelectorNode = e.currentTarget,
                rowNodes = Y.Node.all('#content .board_row'),
                username = focusSelectorNode.get('value');
            
            if (username === 'none') {
                rowNodes.setStyle('display', 'block');
            } else {
                rowNodes.setStyle('display', 'none');
                this._userBoards[username].setStyle('display', 'block');
            }
        },
        
        _onSprintChange: function() {
            this._reset();
            Y.later(3000, this, this._turnOn);
        },

        _onSummaryToggle: function(e) {
            e.preventDefault();

            var userTaskStateArr = [],
                startColMarkup = '<div class="yui3-u-1-5 board">' +
                    '<div class="avatar-summary-content">',
                endColMarkup = '</div></div>';

            if (this._isAvatarSummaryInit) {
                var avatarSummaryNode = Y.one('#avatar_summary'),
                    actionBarPadNode = Y.one('#action_bar_pad');
                
                if ('none' === avatarSummaryNode.getStyle('display')) {
                    avatarSummaryNode.setStyle('display', 'block');
                    actionBarPadNode.setStyle('height', 
                        (parseInt(this._actionBarPadOriginalHeight, 10) +
                        parseInt(avatarSummaryNode.getComputedStyle('height'), 10)) + 'px');
                } else {
                    avatarSummaryNode.setStyle('display', 'none');
                    actionBarPadNode.setStyle('height', this._actionBarPadOriginalHeight);
                }

                return;
            }
            
            var i = 0;
            for (var username in this._userTaskState) {
                userTaskStateArr[i] = this._userTaskState[username];
                i++;
            }
            
            var template = [
                '<div id="avatar_summary" class="yui3-g board_row">',
                startColMarkup, '<a id="avatar_clear" data-username="none" ',
                'class="dimmed" href="#">Clear Focus</a>', endColMarkup,
                startColMarkup, this._createAvatarSummaryMarkup(userTaskStateArr, 'new') , endColMarkup,
                startColMarkup, this._createAvatarSummaryMarkup(userTaskStateArr, 'wip'), endColMarkup,
                startColMarkup, this._createAvatarSummaryMarkup(userTaskStateArr, 'verify'), endColMarkup,
                startColMarkup, this._createAvatarSummaryMarkup(userTaskStateArr, 'done'), endColMarkup,
                '</div>'].join('');              
            
            Y.Node.one('#float_bar').appendChild(template);
                    
            Y.one('#action_bar_pad').setStyle('height', 
                (parseInt(this._actionBarPadOriginalHeight, 10) +
                 parseInt(Y.one('#avatar_summary').getComputedStyle('height'), 10)) + 'px');
            
            Y.one('#focus_change').on('change', function(e) {
                var username = e.currentTarget.get('value'),
                    avatarSummaryNode = Y.one('#avatar_summary'),
                    avatarClearNode = Y.one('#avatar_clear');
                
                if ('none' === username) {
                    avatarSummaryNode.all('.avatar-img').removeClass('dimmed');
                    avatarClearNode.addClass('dimmed');
                    return;
                }
                avatarSummaryNode.all('.avatar-img').addClass('dimmed');
                avatarSummaryNode.all('.avatar-img[data-username="' + username + '"]').removeClass('dimmed');
                avatarClearNode.removeClass('dimmed');
            });
            
            Y.one('#avatar_clear').on('click', this._onAvatarSelect);
            Y.one('#avatar_summary').delegate('click', this._onAvatarSelect, '.avatar-img');
            
            var avatarColNodes = Y.Node.all('#avatar_summary .avatar-summary-content'),
                maxHeight = 0,
                tmpHeight;            

            // readjust all the height based on the highest column in avatar summary
            // so the border appears nicely
            avatarColNodes.each(function(colNode) {
                tmpHeight = parseInt(colNode.getComputedStyle('height'), 10);
                if (tmpHeight > maxHeight) {
                   maxHeight = tmpHeight;
                } 
            });                                
            avatarColNodes.setStyle('height', maxHeight + 'px');         
                    
            this._isAvatarSummaryInit = true;
        },

        _onAvatarSelect: function(e) {
            e.preventDefault();

            var selectedNode = e.currentTarget,
                focusChangeNode = Y.one('#focus_change'),
                username = selectedNode.getAttribute('data-username');

            if (!selectedNode.hasClass('dimmed') && 'none' !== focusChangeNode.get('value')) {
                // toggle back show all avatar
                username = 'none';
            }
                
            focusChangeNode.set('value', username);
            focusChangeNode.simulate("change");
        },

        // Private Variables
        
        _isOn: false,
        
        _userBoards: [],

        _isAvatarSummaryInit: false,

        _actionBarPadOriginalHeight: 0,

        _userTaskState: {}
    });
    
    Y.later(3000, this, function() {
        new SprintboardBooster();
    });
});
