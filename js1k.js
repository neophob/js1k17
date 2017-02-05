//v temporary variable
v = new AudioContext();

//g access to gain control
g = v.createGain();
g.connect(v.destination);

l = v.createChannelMerger(1);
l.connect(g);

// n: variable to access sound buffer
n = v.createScriptProcessor(2048, 1, 1);
n.connect(l);

m = v.createGain();
m.connect(l);

v = v.createOscillator();
//v.frequency.value = 500; // value in hertz
v.connect(m);
v.start();

// l : last volume setting
l = 1;


function p() {
    // GENERATE VIRTUAL IMAGE START

    //v is CANVAS
    v = document.createElement('canvas');
    v.width = a.width;
    v.height = 256;
    var ofs = v.getContext('2d');
    ofs.font = '160px arial';
    ofs.fillStyle = '#ccc';

    var i = Math.random();
    if (i < .7) {
      ofs.fillText('🅽🅾 🆂🅸🅶🅽🅰🅻', 40, 200);
    } else {
//      ofs.fillText(' 🅽🅾 🅼🅰🅶🅸🅲', 0, 200);
      ofs.fillText(i, 40, 200);
    }

    g.gain.value =(i+l)/2;
    m.gain.value = (i+l)/10;

    // GENERATE VIRTUAL IMAGE END

    n.onaudioprocess = function(e) {
      for (i = 0; i < 2048; i++) {
        l = e.outputBuffer.getChannelData(0)[i] = (l + .02 * (Math.random() * 2 - 1)) / 1.02;
      }
    };

    // GLITCH IMAGE START
    //v variable is canvas
    var arr = Array.from(atob(v.toDataURL('image/jpeg').split(',')[1]));
    for (i = 0; i < 3; i++) {
      arr[(Math.random() * arr.length)|0] = i;
    }
    // GLITCH IMAGE END

    // DRAW IMAGE START
    var img = new Image();
    img.onload = function() {
      //DRAW BACKGROUND IMAGE START - must by sync with glitch image to prevent flickering
      for (i = 0; i < 7; i++) {
        //white, yellow, cyan, green, magenta, red, blue
        c.fillStyle = '#'+['fff', 'ff0', '0ff', '0f0', 'f0f', 'f00', '00f'][i];
        c.fillRect(.143*i*a.width, 0, a.width, a.height);

        //blue, black, magenta, black, cyan, black, white
        //OPTION: replace [i] with [~~(Math.random() * 7)];
        c.fillStyle = '#'+['00f', '000', 'f0f', '000', '0ff', '000', 'eee'][i];
        c.fillRect(.143*i*a.width, a.height*.75, a.width, a.height);

        //greyscale
        c.fillStyle = '#'+['000', '222', '444', '666', '888', 'aaa', 'ccc'][i];
        c.fillRect(.143*i*a.width, a.height*.8, a.width, a.height);
      }
      //DRAW BACKGROUND IMAGE END
      c.drawImage(this, 0, 100);

      // POST PROCESSING WHOLE IMAGE

      //FLIP OF RANDOM COLOR CHANNEL
      ofs = (Math.random() * 8)|0;
      if (ofs < 3) {
        img = 16+4*((Math.random() * 48)|0);
  			v = c.getImageData(0, 0, a.width, a.height);
        for (i=a.width*a.height*4-ofs; i>3; i-=4) {
          v.data[i] = v.data[i-img];
        }
        c.putImageData(v, 0, 0);
      }
      //DRAW SCANLINES
      for (i = 0; i < a.height; i+=3) {
        c.fillStyle = '#224';
  			c.fillRect(0, i, a.width, 1);
      }
    };
    img.src = 'data:image/jpeg;base64,' + btoa(arr.join(''));
    // DRAW IMAGE END

    setTimeout(p, 80+Math.random()*150);
}
setTimeout(p, 0);
