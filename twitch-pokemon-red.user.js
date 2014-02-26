// ==UserScript==
// @name       Twitch GM jQuery
// @namespace  https://github.com/SonOfLysander
// @version    0.467
// @description  Fight for anarchy!
// @match      http://www.twitch.tv/twitchplayspokemon
// @copyright  2012+, You
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadUrl https://raw.github.com/SonOfLysander/TwitchPlaysPokemon-FightForAnarchy/master/twitch-pokemon-red.user.js
// ==/UserScript==

var controller = {
    _slowRoomIntervalIdA: null,
    _slowRoomIntervalIdB: null,
    _slowRoomDetected: false,
    _intervalId: null,
    _intervalMin: 3200,
    _intervalMax: 15000,
    _interval: null,
    _slowModeRegex: /.*this\sroom\sis\s(?:now\s|)in\sslow\smode.*/i,
    humanOptions: [    'Why am I still awake?', 'I wish I went to bed.', 'I need to go to bed.',
                        'T_T', 'stop being so newb, gaiz.', 'Helix, save us from these spambots.'/*Not including me.*/,
                        'Stop voting Democracy!', 'HELIXANDMOUNTAINDEWWILLSAVEMYGPA!!!',
                        'Maybe you should go to the pokecenter for that BURN', 'I don wannna sleeeeeeeeeeeeeeeep'],
    go: function(timeout){
        this._interval =
            typeof timeout === 'undefined' ? this._randomIntRange(this._intervalMin, this._intervalMax) : timeout
             + this._slowRoomDetected ? 30 : 0;
        this._intervalId = setTimeout(function(){
            controller._sendMessage();
        }, this._interval);

        if (this._slowRoomIntervalIdA === null){
            this._slowRoomIntervalIdA = setInterval(function(){
                // http://rubular.com/r/OyTeAqnboA
                controller._slowRoomDetected = controller._slowRoomDetected || controller._findString(controller._slowModeRegex, 'li.line.fromjtv').length > 0;
            }, 2500);
        }
        if (this._slowRoomIntervalIdB === null){
            this._slowRoomIntervalIdB = setInterval(function(){controller._slowRoomDetected = false}, 45000);
        }
    },
    stop: function(){
        if (this._intervalId !== null){
            clearTimeout(this._intervalId);
        }
    },
    _sendMessage: function() {
        var newInterval = this._randomIntRange(this._intervalMin, this._intervalMax);
        if (controller._isChatConnected()){
            var msg = controller._playerMessage();
            $('#chat_speak').click(); //makes sure that you don't have anything in the "buffer" that will interfere with what we want to bot-in.
            $('#chat_text_input').val(msg);
            $('#chat_speak').click();
        }
        this.go(newInterval);
        console.log(this);
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
        element = (typeof element === 'undefined') ? '*' : element;
        var x = $(element).filter(function () {
            return search.test($(this).text());
        });
        return x;
    },
    _randomIntRange: function(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

function initializeDocument(){ //Adds CSS styles for myself and one of my friends so I can see the chats as they wiz by.
    hideall();
    // should iterate over JSON, but it's just me and Brian so it's not important.
    // (Maybe if we had our REST server fully setup and needed dynamic content then
    // I'd change my mind.)
    user('sonoflysander');          //me
    user('bjwyxrs', '#BBF');        //my friend brian
}

function hideall(){
    var hdstl = $('<style>ul#chat_line_list li{ display: none; } li.line.fromjtv{ display: block!important; }</style>').appendTo($('html > head')); //hides all the chats.
}
function user(usrnm, hxclr){
    var stl = $('<style>li[data-sender="' + usrnm + '"] { display: block!important;'  + (hxclr !== undefined ? 'background-color: ' + hxclr + ';' : '' ) +  '}</style>');
    $('html > head').append(stl);
}

$(document).ready(function(){
    initializeDocument();
    controller.go();
});