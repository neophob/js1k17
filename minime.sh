#!/bin/bash

WAIT_FOR_BG_JOBS() {
  FAIL=0
  for job in `jobs -p`
  do
      wait $job || let "FAIL+=1"
  done

  if [ "$FAIL" == "0" ];
  then
      echo "[JOBS LGTM] NO ERRORS DETECTED"
  else
      echo "[JOBS ERROR] FAILED JOBS DETECTED ($FAIL), EXIT NOW"
      exit 1
  fi
}

UGLIFY=./node_modules/.bin/uglifyjs
BABILI=./node_modules/.bin/babili
REGPACK=./node_modules/.bin/regpack
OUT=./dist

UGLIFY_OPT="--compress --screw-ie8 -v --mangle --"
#REGPACK_OPT_MATH="- --hash2DContext --withMath --contextVariableName 'c' --crushGainFactor 0 --crushLengthFactor 0 --crushCopiesFactor 0"
REGPACK_OPT1="- --hash2DContext --contextVariableName 'c' --crushGainFactor 0 --crushLengthFactor 0 --crushCopiesFactor 0"
REGPACK_OPT2="- --hash2DContext --contextVariableName 'c' --crushGainFactor 3 --crushLengthFactor 2 --crushCopiesFactor 1"
REGPACK_OPT3="- --hash2DContext --contextVariableName 'c' --crushGainFactor 4 --crushLengthFactor 4 --crushCopiesFactor 1"
REGPACK_OPT4="- --hash2DContext --contextVariableName 'c' --crushGainFactor 1 --crushLengthFactor 1 --crushCopiesFactor 1"
REGPACK_OPT5="- --hash2DContext --contextVariableName 'c' --crushGainFactor 4 --crushLengthFactor 1 --crushCopiesFactor 0"
REGPACK_OPT6="- --hash2DContext --contextVariableName 'c' --crushGainFactor 5 --crushLengthFactor 1 --crushCopiesFactor 0"
REGPACK_OPT7="- --hash2DContext --contextVariableName 'c' --crushGainFactor 5 --crushLengthFactor 4 --crushCopiesFactor 3"
REGPACK_OPT8="- --hash2DContext --contextVariableName 'c' --crushGainFactor 4 --crushLengthFactor 4 --crushCopiesFactor 0"

mkdir -p $OUT

BAB_PACK() {
  OPT=$1
  $BABILI js1k.js | $REGPACK $OPT > $OUT/js1k-babili-regpacked-$2.js
}

echo "[MINIME] START"

$UGLIFY $UGLIFY_OPT js1k.js | $REGPACK $REGPACK_OPT1 > $OUT/js1k-uglify-regpacked.js&
$REGPACK js1k.js $REGPACK_OPT1 > $OUT/js1k-regpacked-1.js&
BAB_PACK "$REGPACK_OPT1" 1&
BAB_PACK "$REGPACK_OPT2" 2&
BAB_PACK "$REGPACK_OPT3" 3&
BAB_PACK "$REGPACK_OPT4" 4&
BAB_PACK "$REGPACK_OPT5" 5&
BAB_PACK "$REGPACK_OPT6" 6&
BAB_PACK "$REGPACK_OPT7" 7&
BAB_PACK "$REGPACK_OPT8" 8&
WAIT_FOR_BG_JOBS

ls -alS $OUT/* | sort -k 5 -n
