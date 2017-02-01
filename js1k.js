//logo filler gradient
z = c.createLinearGradient(0, 0, 0, 200);
z.addColorStop(0, '#000');
z.addColorStop(1, '#fff');

//glitch factor
f = 1;

var ac = new AudioContext();
var gain = ac.createGain();
gain.gain.value = 0;
gain.connect(ac.destination);

var l = 0.0;
var n = ac.createScriptProcessor(4096, 1, 1);
n.connect(gain);

setInterval(function() {
  var t=0;
  var w = a.width;
  var h = a.height;

  function generateVirtualImage() {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = 200;
    var c2 = canvas.getContext('2d');
    c2.fillStyle = z;
    c2.font = '160px Arial';
  //  c2.textAlign='center';
    var i=Math.random();
    if (i < .05) {
      c2.fillText('𝟦 𝟪 𝟣𝟧 𝟣𝟨 𝟤𝟥 𝟦𝟤', 0, 180);
      t=3;
    } else if (i < .9) {
      c2.fillText('🅴🅱🆂 🅸🅽🅵🅾', 50, 180);
      t=1;
    } else {
      c2.fillText('🅽🅾🆃 🅰 🆃🅴🆂🆃', 50, 180);
      t=2;
    }
    return canvas.toDataURL('image/jpeg');
  }

  function glitchImage(imageData) {
    //unescape data part of the image -> get string
    var arr = Array.from(atob(imageData.split(',')[1]));
    for (var i = 0; i < 3; i++) {
      var ofs = 4 + ~~(Math.random() * (arr.length - 4));
      arr[ofs] = ofs%255;
    }
    return 'data:image/jpeg;base64,' + btoa(arr.join(''))
  }

  function drawImage(imageData, pos) {
    var img = new Image();
    img.onload = function() {


      //DRAW BACKGROUND IMAGE START
      for (var i = 0; i < 7; i++) {
        //white, yellow, cyan, green, magenta, red, blue
        c.fillStyle = '#'+['fff', 'ff0', '0ff', '0f0', 'f0f', 'f00', '00f'][i];
        c.fillRect(0.143*i*w, 0, w, h);

        //blue, black, magenta, black, cyan, black, white
        c.fillStyle = '#'+['00f', '000', 'f0f', '000', '0ff', '000', 'eee'][i];
        c.fillRect(0.143*i*w, h*.7, w, h);

        //greyscale
        c.fillStyle = '#'+['000', '222', '444', '666', '888', 'aaa', 'ccc'][i];
        c.fillRect(0.143*i*w, h*.75, w, h);
      }
      //DRAW BACKGROUND IMAGE END

      c.drawImage(this, 0, pos);
    };
    img.src = imageData;
  }

  gain.gain.value = f;
  n.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < 4096; i++) {
      var white = Math.random() * (2*t) - 1;
      output[i] = (l + (.02 * white)) / 1.02;
      l = output[i];
      //output[i] *= 3.5;
    }
  };


  if (Math.random() < f) {
    drawImage(glitchImage(generateVirtualImage()), 200);//(h-200)/2);

    if (f < 0.45) {
      f *= 2;
    }

    f = (f>0.1) ? f-0.1 : 0.3;
  }

}, 99);
