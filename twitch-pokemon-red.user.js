// ==UserScript==
// @name       Twitch GM jQuery
// @namespace  https://github.com/SonOfLysander
// @version    0.463
// @description  Fight for anarchy!
// @match      http://www.twitch.tv/twitchplayspokemon
// @copyright  2012+, You
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadUrl https://raw.github.com/SonOfLysander/TwitchPlaysPokemon-FightForAnarchy/master/twitch-pokemon-red.user.js
// ==/UserScript==

var controller = {
    _timeLatencyMark: 0,
    _intervalId: null,
    _intervalMin: 3200,
    _intervalMax: 15000,
    _interval: null,
    humanOptions: [    'Why am I still awake?', 'I wish I went to bed.', 'I need to go to bed.',
                        'T_T', 'stop being so newb, gaiz.', 'Helix, save us from these spambots.'/*Not including me.*/,
                        'Stop voting Democracy!', 'HELIXANDMOUNTAINDEWWILLSAVEMYGPA!!!',
                        'Maybe you should go to the pokecenter for that BURN', 'Sleeeeeeeeeeeeeeeep'],
    go: function(timeout){
        this._intervalId = setTimeout(function(){controller._sendMessage();}, timeout === undefined ? this._randomIntRange(this._intervalMin, this._intervalMax) : timeout);
    },
    stop: function(){
        if (this._intervalId !== null){
            clearTimeout(this._intervalId);
        }
    }
    _sendMessage: function() {
        var newInterval =
            this._findString(/this\sroom\sis\s(?:now\s|)in\sslow\smode/i, 'li.line.fromjtv').length ? // http://rubular.com/r/OyTeAqnboA
            30500 : this._randomIntRange(this._intervalMin, this._intervalMax);
        if (controller._isChatConnected()){
            var msg = controller._playerMessage();
            $('#chat_speak').click(); //makes sure that you don't have anything in the "buffer" that will interfere with what we want to bot-in.
            $('#chat_text_input').val(msg);
            $('#chat_speak').click();
        }
        this.go(newInterval);
        this._interval = newInterval;
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
        // This is an odd condictional structure, but it's really due to the
        // fact Twitch has an odd flow that I can't access directly by API with
        // out putting more effort into this script, and less effort into my home-
        // work that matters.
        if ($('#chat_text_input').prop('disabled') == true){
            return false;
        } else if ($('.js-chat_countdown').length == 0){
            return true;
        } else if (parseInt($('.js-chat_countdown:last').text(), 10) == 0 && Date.now() - this._timeLatencyMark >= 9000){
            return true;               
        } else {
            this._timeLatencyMark = Date.now();
            return false;
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