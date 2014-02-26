// ==UserScript==
// @name       Twitch GM jQuery
// @namespace  https://github.com/SonOfLysander
// @version    0.434
// @description  Fight for anarchy!
// @match      http://www.twitch.tv/twitchplayspokemon
// @copyright  2012+, You
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadUrl https://github.com/SonOfLysander/TwitchPlaysPokemon-FightForAnarchy/raw/master/twitch-pokemon-red.user.js
// ==/UserScript==

var controller = {
    messageInterval = null;
    selfControllingInterval = null;
    createInterval: function() {
        if(!this.messageInterval){
            this.messageInterval = setInterval(function(){
                if (isChatConnected()){
                    var msg = playerMessage();
                    $('#chat_speak').click(); //makes sure that you don't have anything in the "buffer" that will interfere with what we want to bot-in.
                    $('#chat_text_input').val(msg);
                    $('#chat_speak').click();
                }
            }, Math.floor(Math.random() * 12000) + 3000);
        }
        if (!this.selfControllingInterval){
            this.selfControllingInterval = setInterval(function(){this.resetInterval()}, 3400);
        }
    },
    destroyInterval: function(){
        if (this.messageInterval){
            clearInterval(this.messageInterval);
        }
    },
    resetInterval:  function() {
        this.destroyInterval();
        this.createInterval();
    }
}

$(document).ready(function(){
    initializeDocument();
    controller.createInterval();
});

function playerMessage(){
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
        var options = [ 'Why am I still awake?', 'I wish I went to bed.', 'I need to go to bed.',
                        'T_T', 'stop being so newb, gaiz.', 'Helix, save us from these spambots.'/*Not including me.*/,
                        'Stop voting Democracy!', 'HELIXANDMOUNTAINDEWWILLSAVEMYGPA!!!',
                        'Maybe you should go to the pokecenter for that BURN', 'Sleeeeeeeeeeeeeeeep'];
        rnd = Math.floor(Math.random() * options.length);
        msg = options[rnd];
    }
    return msg;
}

var timeLatencyMark = 0;

function isChatConnected(){
    // This is an odd condictional structure, but it's really due to the
    // fact Twitch has an odd flow that I can't access directly by API with
    // out putting more effort into this script, and less effort into my home-
    // work that matters.
    if ($('#chat_text_input').prop('disabled') == true){
        return false;
    } else if ($('.js-chat_countdown').length == 0){
        return true;
    } else if (parseInt($('.js-chat_countdown:last').text(), 10) == 0 && Date.now() - timeLatencyMark >= 9000){
        return true;               
    } else {
        timeLatencyMark = Date.now();
        return false;
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