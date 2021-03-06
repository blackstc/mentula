$(document).ready(function () {
    $('#controls').hide();
    $('#error-message').hide();
    $('#orientation').hide();
    var socket = io();
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();
    var left = 1;
    var right = 1;
    var fire = false;
    var player = null;
    var playerColor;
    var colors = ['#00cc00', '#1a1aff', '#ffff00', '#ffa31a'];

    // $('#controls').webkitRequestFullscreen();

    socket.on('invalid-room', function() {
        $('#error-message').show();
    });

    //** JOIN GAME ROOM **//
    $('#join').on('click', function() {


        var gameRoom = $('#user-input').val();

        // sends new-player event to server to join controller to game room
        socket.emit('new-player', {gameRoom: gameRoom});

        // listens for success-join from server and assigns controller a player number
        socket.on('success-join', function(playerNum) {


            window.addEventListener('orientationchange', handleOrientationChange);


            handleOrientationChange();
            player = playerNum;

            //set color on controller to player
            playerColor = colors[playerNum];
            $('#left-track').css('border-color', playerColor);
            $('#right-track').css('border-color', playerColor);

            //show and hide relevant divs
            $('#error-message').hide();
            $('#game-room-input').hide();
            setInterval(updateGame, 30);

        });

        // if mobile has full screen mode, enable it after they successfully join
        document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

        if (document.fullscreenEnabled) {
            var el = document.getElementById('controls');
            el.webkitRequestFullscreen();
        }
    });


    //** CONTROLLER **//
    $('#fire').on('touchstart', function (event) {
        event.preventDefault();
        fire = true;
    });

    $('#fire').on('touchend', function (event) {
        event.preventDefault();
        fire = false;
    });

    $('#left-track').on('touchmove', function (event) {
        event.preventDefault();
        left = (event.originalEvent.targetTouches[0].clientY);
        var center = $('#left-track').height() / 2;
        if (left > center + 50) {
            left = 0;
        } else if (left < center - 50){
            left = 2;
        } else {
            left = 1;
        }
    });

    $('#left-track').on('touchend', function (event) {
        event.preventDefault();
        left = 1;
    });

    $('#right-track').on('touchmove', function (event) {
        event.preventDefault();
        right = (event.originalEvent.targetTouches[0].clientY);
        var center = $('#right-track').height() / 2;
        if (right > center + 50) {
            right = 0;
        } else if (right < center - 50){
            right = 2;
        } else {
            right = 1;
        }
    });

    $('#right-track').on('touchend', function (event) {
        event.preventDefault();
        right = 1;
    });



    function updateGame() {
        // sends game-update to server with the players input and player number
        socket.emit('game-update', {right: right, left: left, fire: fire, player: player});
    }

    function handleOrientationChange() {
     switch(window.orientation) {
        case -90:
        case 90:
            if (player === null) {
                $('#game-room-input').show();
            }
            $('#orientation').hide();
            $('#controls').show();
            break;
        default:
            $('#game-room-input').hide();
            $('#orientation').show();
            $('#controls').hide();
            break;
        }
    }

});
