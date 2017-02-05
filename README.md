# js1k2017 - No Signal

Compo entry for http://js1k.com/2017-magic/, demo url: http://js1k.com/TODO

Random Notes:
- Build Process: Babili as minifier - Babili processed files compress better with Regpack
- Regpack options: `REGPACK_OPT5="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 4 --crushLengthFactor 1 --crushCopiesFactor 0"` - please see `minime.sh`

Features:
- HTML5 Audio (Noise, Gain, Oscillator, Merger)
- Adaptive audio gain
- UTF8 Fonts
- JPEG Glitcher using canvas.toDataURL
- Full screen Scanlines
- Full screen Color Glitcher (shift one channel)
- TV Testscreen (EBS) generator
