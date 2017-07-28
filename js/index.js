var colors = {
    blue: ['#1565c0', '#90caf9'],
    green: ['#00c853', '#a5d6a7'],
    red: ['#f50057', '#ef9a9a'],
    yellow: ['#ffa000', '#ffe082']
  },
  btn, state = 0,
  strict = false,
  sequence = [],
  compare = [],
  buttons = Object.keys(colors),
  yourTurn = false,
  initial = true,
  gameOn = true;

$('#switch-1').prop('checked', false);

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript by Francisc

function off() {
  $('#c2').css('display', 'initial')
  $('.button').css('fill', 'black')
}

$('#switch-2').click(function() {
  if (gameOn === true) {
    gameOn = false;
    off()
  } else {
    gameOn = true;
    ton()
  }
})

$('#switch-1').click(function() {
  if (strict === true) {
    strict = false;
  } else {
    strict = true;
  }
})

function ton(i = buttons.length - 1) {
  $('text.start').text('Start');
  $('#screen').text('Simon')
  sequence = [];
  compare = [];
  state = 0;
  yourTurn = false
  if (i >= 0) {
    $('#' + buttons[i]).css('fill', colors[buttons[i]][0])
    setTimeout(function() {
      ton(i - 1)
    }, 25)
  } else {
    $('#c2').css('display', 'none')
  }
}

function mistake(t) {
  console.log('mistake')
  setTimeout(function() {
    $('#state').css('transition', 'fill 0.1s linear').css('fill', '#ff5252')
    setTimeout(function() {
      $('#state').removeAttr("style").css('transition', 'fill 0.1s linear').css('fill', '#263238')
    }, 200)
    $('#wrong').get(0).play();
  }, 400)
  compare = [];
  yourTurn = false;
  if (strict === true) {
    sequence = [];
    state = 0;
    initial = true;
    $('#screen, text.start').fadeOut(200).delay(200).fadeIn(100);
    setTimeout(function() {
      $('text.start').text('Start');
      $('#screen').text('Simon')
    }, 300)
  } else {
    setTimeout(function() {
      playSequence(400, 1000)
    }, t)
  }
}

function playSequence(t, t2, i = 0) {
  if (i < sequence.length) {
    move(t, sequence[i])
    setTimeout(function() {
      playSequence(t, t2, i + 1)
    }, t2)
  } else {
    yourTurn = true;
  }
}

function move(t, button) {
  $('#' + button).css('fill', colors[button][1]);
  $('#' + button + 's').get(0).play()
  setTimeout(function() {
    $('#' + button).css('fill', colors[button][0]);
  }, t)
}

String.prototype.toHex = function() {
  return '#' + this.match(/\d+/g).map(
    function(x) {
      let a = Number(x).toString(16);
      return a.length === 1 ? '0' + a : a;
    }
  ).join('')

}
$('.button').mouseup(function() {
  if (yourTurn === true && gameOn === true) {
    btn = $(this).attr('id')
    $(this).css('fill', colors[btn][0]);
    $('#' + btn + 's').get(0).play();
    compare.push(btn)
    if (sequence.slice(0, compare.length).join('') !== compare.join('')) {
      mistake(2000)
    } else {
      if (compare.join('') === sequence.join('')) {
        if (sequence.length < 20) {
          compare = []
          sequence.push(buttons[random(0, buttons.length)])
          state++;
          yourTurn = false;
          $('#screen').text(state)
          setTimeout(function() {
            playSequence(400, 800)
          }, 1500)
        } else {
          setTimeout(function() {
            compare = []
            sequence = []
            initial = true;
            yourTurn = false
            gameOn = false
            $('text.start').fadeOut(200).delay(1800).fadeIn(100)
            $('#state, #start').css('transition', 'fill 0.5s linear').css('fill', '#1de9b6')
            $('.start').css('cursor', 'default')
            $("#screen").fadeOut()
            $("#win").fadeIn()
            setTimeout(function() {
              $('text.start').text('Start')
              $('#screen').text('Simon')
              $('#state').removeAttr("style").css('transition', 'fill 0.5s linear').css('fill', '#263238')
              $('#start').removeAttr("style").css('transition', 'fill 0.5s linear').css('fill', '##bdbdbd')
              $('.start').css('cursor', 'pointer')
              $("#screen").fadeIn()
              $("#win").fadeOut()
              gameOn = true
            }, 2000)
          }, 400)
        }

      }
    }
  }
})
$('.button').mousedown(function() {
  if (yourTurn === true && gameOn === true) {
    btn = $(this).attr('id')
    $(this).css('fill', colors[btn][1]);
  }
}).mouseleave(function() {
  btn = $(this).attr('id')
  let color = $(this).css('fill')
  if (color.toHex() === colors[btn][1] && gameOn === true) {
    $(this).css('fill', colors[btn][0]);
  }
})

$('.start').click(function() {
  if (gameOn === true) {
    $('#screen').fadeOut(200).delay(200).fadeIn(100)
    $('text.start').fadeOut(200).delay(200).fadeIn(100)
    gameOn = false
    setTimeout(function() {
      $('text.start').text('Restart')
      $('#screen').text(0)
      if (initial === true) {
        initial = false;
      } else {
        sequence = [];
        compare = [];
        state = 0;
        yourTurn = false
      }
      sequence.push(buttons[random(0, buttons.length)])
      setTimeout(function() {
        gameOn = true
        playSequence(500, 800)
      }, 300)
    }, 200)
  }
})