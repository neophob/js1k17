w = a.width;
h = a.height;

//logo filler gradient
z = c.createLinearGradient(0, 0, 0, 200);
z.addColorStop(0, '#000');
z.addColorStop(1, '#fff');

c.rect(0, 0, w, h);
c.fillStyle = 0;
c.fill();

//glitch factor
f = 1;

var ac = new AudioContext();
var gain = ac.createGain();
gain.gain.value = 0;
gain.connect(ac.destination);

var l = 0.0;
var n = ac.createScriptProcessor(4096, 1, 1);
n.connect(gain);

var t=0;
setInterval(function() {

  function generateVirtualImage() {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = 200;
    var c2 = canvas.getContext('2d');

    c2.fillStyle = z;
    c2.font = '180px arial';
  //  c2.textAlign='center';
    i=Math.random();
    if (i < .05) {
      //c2.fillText('𝟦 𝟪 𝟣𝟧 𝟣𝟨 𝟤𝟥 𝟦𝟤', 0, 180);
      c2.fillText(decodeURI('%F0%9D%9F%A6%20%F0%9D%9F%AA%20%F0%9D%9F%A3%F0%9D%9F%A7%20%F0%9D%9F%A3%F0%9D%9F%A8%20%F0%9D%9F%A4%F0%9D%9F%A5%20%F0%9D%9F%A6%F0%9D%9F%A4'), 50, 180);
      t=3;
    } else if (i < .9) {
      //c2.fillText('✪🅼🅰🅶🅸🅲✪', 0, 180,w);
      c2.fillText(decodeURI('%E2%9C%AA%F0%9F%85%BC%F0%9F%85%B0%F0%9F%85%B6%F0%9F%85%B8%F0%9F%85%B2%E2%9C%AA'), 50, 180);
      t=1;
    } else {
      //c2.fillText('✪🅼🅼🅲🅼🅺★', 0, 180);
      c2.fillText(decodeURI('%E2%9C%AA%F0%9F%85%BC%F0%9F%85%BC%F0%9F%85%B2%F0%9F%85%BC%F0%9F%85%BA%E2%98%85'), 50, 180);
      t=2;
    }
    return canvas.toDataURL('image/jpeg');
  }

  function glitchImage(imageData) {
    //unescape data part of the image -> get string
    var arr = Array.from(atob(imageData.split(',')[1]));
    var len = arr.length - 4;
    for (var i = 0; i < 3; i++) {
      var ofs = 4 + ~~(Math.random() * len);
      arr[ofs] = ~~(Math.random() * 255);
    }
    return 'data:image/jpeg;base64,' + btoa(arr.join(''))
  }

  function drawImage(imageData) {
    var img = new Image();
    img.onload = function() {
      c.drawImage(this, 0, (h-200)/2);
    };
    img.src = imageData;
  }

  gain.gain.value = f;
  n.onaudioprocess = function(e) {
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < 4096; i++) {
      var white = Math.random() * (2*t) - 1;
      output[i] = (l + (0.02 * white)) / 1.02;
      l = output[i];
      //output[i] *= 3.5;
    }
  };


  if (Math.random() < f) {
    drawImage(glitchImage(generateVirtualImage()));

    if (f < 0.45) {
      f *= 2;
    }

    f = (f>0.1) ? f-0.1 : 0.3;
  }

}, 160);
