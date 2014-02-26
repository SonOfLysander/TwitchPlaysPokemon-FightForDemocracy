// ==UserScript==
// @name       Twitch GM jQuery
// @namespace  https://github.com/SonOfLysander
// @version    0.477
// @description  Fight for anarchy!
// @match      http://www.twitch.tv/twitchplayspokemon
// @copyright  2012+, SonOfLysander
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadUrl https://raw.github.com/SonOfLysander/TwitchPlaysPokemon-FightForAnarchy/master/twitch-pokemon-red.user.js
// ==/UserScript==

var controller = {
    _interval: null,
    _intervalMin: 3200,
    _intervalMax: 15000,
    _slowRoomDetected: false,
    _slowRoomInterval: 30000,
    _intervalId: null,
    _slowRoomIntervalIdA: null,
    _slowRoomIntervalIdB: null,
    _pageResetId: null,
    _slowModeRegex: /.*this\sroom\sis\s(?:now\s|)in\sslow\smode.*/i,
    humanOptions: [    'Why am I still awake?', 'I wish I went to bed.', 'I need to go to bed.',
                        'T_T', 'stop being so newb, gaiz.', 'Helix, save us from these spambots.'/*Not including me.*/,
                        'Stop voting Democracy!', 'HELIXANDMOUNTAINDEWWILLSAVEMYGPA!!!', 'In case anyone was lost: http://goo.gl/xBmwY5',
                        'Maybe you should go to the pokecenter for that BURN', 'I really wanna go to bed... but I don\'t.'],
    go: function(timeout, resetPage){
        if (resetPage == true && this._pageResetId === null){
            this._pageResetId = setTimeout(function(){location.reload();}, 30000);
        }

        this._interval =
            (timeout === undefined ? this._randomHelper() : timeout)
             + (this._slowRoomDetected ? this._slowRoomInterval : 0);

        if (this._slowRoomIntervalIdA === null){
            this._slowRoomIntervalIdA = setInterval(function(){
                // http://rubular.com/r/OyTeAqnboA
                controller._slowRoomDetected = controller._slowRoomDetected || controller._findString(controller._slowModeRegex, 'li.line.fromjtv').length > 0;
            }, 2500);
        }
        if (this._slowRoomIntervalIdB === null){
            this._slowRoomIntervalIdB = setInterval(function(){controller._slowRoomDetected = false;}, 45000);
        }

        this._intervalId = setTimeout(function(){
            controller._sendMessage();
        }, this._interval);

        console.log(this);
    },
    stop: function(){
        if (this._intervalId !== null){
            clearTimeout(this._intervalId);
        }
    },
    _sendMessage: function() {
        if (controller._isChatConnected()){
            var msg = controller._playerMessage();
            $('#chat_speak').click(); //makes sure that you don't have anything in the "buffer" that will interfere with what we want to bot-in.
            $('#chat_text_input').val(msg);
            $('#chat_speak').click();
        }
        console.log(msg);
        this.go();
    },
    _playerMessage: function(){
        // I refactored because of the recent bot raid. I decided that even though I'm not doing
        // anything particularly malicious, it would be best to put on a good face.
        var msg = 'select';
        var rnd = Math.random();
        if (rnd < 0.97){ //97 percent of the time, we'll input a game command
            rnd = Math.random(); //reroll for clear-er sub percentages
            msg = rnd >= 0.50 ? 'anarchy' :
            rnd >= 0.10 ? 'b' :
            rnd >= 0.05 ? 'a' : 'select';
        } else { //3 percent of the time
            rnd = Math.floor(Math.random() * this.humanOptions.length);
            msg = this.humanOptions[rnd];
        }
        return msg;
    },
    _isChatConnected: function(){
        if ($('#chat_text_input').prop('disabled') == true){
            return false;
        } else if ($('.js-chat_countdown').length > 0 && parseInt($('.js-chat_countdown:last').text(), 10) > 0){
            return false;
        } else {
            return true;
        }
    },
    _findString: function(search, element) {
        search = (typeof search === 'RegExp') ? search : new RegExp('^\\s*' + String(search) + '\\s*$');
        element = (element === undefined) ? '*' : element;
        var x = $(element).filter(function () {
            return search.test($(this).text());
        });
        return x;
    },
    _randomIntRange: function(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    },
    _randomHelper: function(){
        return this._randomIntRange(this._intervalMin, this._intervalMax);
    }
};


function hideall(){
    var hdstl = $('<style>ul#chat_line_list li{ display: none; } li.line.fromjtv{ display: block!important; }</style>').appendTo($('html > head')); //hides all the chats.
}
function user(usrnm, hxclr){
    var stl = $('<style>li[data-sender="' + usrnm + '"] { display: block!important;'  + (hxclr !== undefined ? 'background-color: ' + hxclr + ';' : '' ) +  '}</style>');
    $('html > head').append(stl);
}

function initializeDocument(){ //Adds CSS styles for myself and one of my friends so I can see the chats as they wiz by.
    hideall();
    user('sonoflysander');          //me
    user('bjwyxrs', '#BBF');        //my friend brian
}

$(document).ready(function(){
    initializeDocument();
    controller.go(undefined, true);
});