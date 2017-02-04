//glitch factor
f = 1;

v = new AudioContext();
g = v.createGain();
g.connect(v.destination);

// l : last volume setting
l = 0;
n = v.createScriptProcessor(2048, 1, 1);
n.connect(g);

setInterval(function() {
  g.gain.value = f;

  if (Math.random() < f) {
    // GENERATE VIRTUAL IMAGE START
    var canvas = document.createElement('canvas');
    canvas.width = a.width;
    canvas.height = 240;
    var c2 = canvas.getContext('2d');
    c2.fillStyle = '#ccc';
    c2.font = '160px arial';
    var i=Math.random();

    //amplifier for audio noise
    var t = 0;
    if (i < .05) {
      c2.fillText(' 𝟦 𝟪 𝟣𝟧 𝟣𝟨 𝟤𝟥 𝟦𝟤', 0, 180);
      t=3;
    } else if (i < .8) {
      c2.fillText(' 🅽🅾 🆂🅸🅶🅽🅰🅻', 0, 180);
      t=1;
    } else {
      c2.fillText(' 🅽🅾 🅼🅰🅶🅸🅲', 0, 180);
      t=2;
    }
    //var imageData = canvas.toDataURL('image/jpeg');
    // GENERATE VIRTUAL IMAGE END

    n.onaudioprocess = function(e) {
      for (i = 0; i < 2048; i++) {
        l = e.outputBuffer.getChannelData(0)[i] = (l + 0.02 * (Math.random() * 2 * t - 1)) / 1.02;
      }
    };

    // GLITCH IMAGE START
    var arr = Array.from(atob(canvas.toDataURL('image/jpeg').split(',')[1]));
    for (i = 0; i < 3; i++) {
      var ofs =  ~~(Math.random() * arr.length);
      arr[ofs] = ofs%255;
    }
    //imageData = 'data:image/jpeg;base64,' + btoa(arr.join(''))
    // GLITCH IMAGE END


    // DRAW IMAGE START
    var img = new Image();
    img.onload = function() {
      //DRAW BACKGROUND IMAGE START - must by sync with glitch image to prevent flickering
      for (i = 0; i < 7; i++) {
        //white, yellow, cyan, green, magenta, red, blue
        c.fillStyle = '#'+['fff', 'ff0', '0ff', '0f0', 'f0f', 'f00', '00f'][i];
        c.fillRect(0.143*i*a.width, 0, a.width, a.height);

        //blue, black, magenta, black, cyan, black, white
        //OPTION: replace [i] with [~~(Math.random() * 7)];
        c.fillStyle = '#'+['00f', '000', 'f0f', '000', '0ff', '000', 'eee'][i];
        c.fillRect(0.143*i*a.width, a.height*.75, a.width, a.height);

        //greyscale
        c.fillStyle = '#'+['000', '222', '444', '666', '888', 'aaa', 'ccc'][i];
        c.fillRect(0.143*i*a.width, a.height*.8, a.width, a.height);
      }
      //DRAW BACKGROUND IMAGE END
      c.drawImage(this, 0, 100);


      // POST PROCESSING WHOLE IMAGE
      //image
      var ofs = ~~(Math.random() * 20);
      if (ofs < 3) {
  			var pic = c.getImageData(0, 0, a.width, a.height);
        for (i=ofs; i<a.width*a.height*4; i+=4) pic.data[i] = 0;
        c.putImageData(pic, 0, 0);
      }

      //Scanline
      for (i = 0; i < a.height; i+=3) {
        //c.fillStyle = '#0007';
        c.fillStyle = 'rgba(0,0,0,0.5)';
  			c.fillRect(0, i, a.width, 1);
      }
    };
    img.src = 'data:image/jpeg;base64,' + btoa(arr.join(''));
    // DRAW IMAGE END

    if (f < 0.45) {
      f *= 2;
    }
    f = (f>0.1) ? f-0.1 : 0.3;
  }

}, 100);
