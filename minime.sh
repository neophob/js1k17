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
REGPACK_OPT1="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 5 --crushLengthFactor 1 --crushCopiesFactor 0 --crushTiebreakerFactor 0"
REGPACK_OPT2="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 3 --crushLengthFactor 2 --crushCopiesFactor 1"
REGPACK_OPT3="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 4 --crushLengthFactor 4 --crushCopiesFactor 1"
REGPACK_OPT4="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 4 --crushLengthFactor 0 --crushCopiesFactor 0 --crushTiebreakerFactor 0"
REGPACK_OPT5="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 4 --crushLengthFactor 1 --crushCopiesFactor 0"
REGPACK_OPT6="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 5 --crushLengthFactor 1 --crushCopiesFactor 0"
REGPACK_OPT7="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 5 --crushLengthFactor 4 --crushCopiesFactor 3"
REGPACK_OPT8="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 5 --crushLengthFactor 0 --crushCopiesFactor 0 --crushTiebreakerFactor 0"
REGPACK_OPT9="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 4 --crushLengthFactor 1 --crushCopiesFactor 0 --crushTiebreakerFactor 0"
REGPACK_OPTA="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 5 --crushLengthFactor 1 --crushCopiesFactor 0 --crushTiebreakerFactor 0"
REGPACK_OPTB="- --useES6 true --hash2DContext --contextVariableName 'c' --crushGainFactor 16 --crushLengthFactor 8 --crushCopiesFactor 0 --crushTiebreakerFactor 0"

mkdir -p $OUT

BAB_PACK() {
  OPT=$1
  $BABILI js1k.js | $REGPACK $OPT > $OUT/js1k-babili-regpacked-$2.js
}

UGLIFY_PACK() {
  $UGLIFY $UGLIFY_OPT js1k.js | $REGPACK $REGPACK_OPT1 > $OUT/js1k-uglify-regpacked.js
}

REGPACK_PACK() {
  $REGPACK js1k.js $REGPACK_OPT1 > $OUT/js1k-regpacked-1.js
}

echo "[MINIME] START"
#UGLIFY_PACK&
#REGPACK_PACK&
BAB_PACK "$REGPACK_OPT1" 1&
BAB_PACK "$REGPACK_OPT2" 2&
BAB_PACK "$REGPACK_OPT3" 3&
BAB_PACK "$REGPACK_OPT4" 4&
BAB_PACK "$REGPACK_OPT5" 5&
BAB_PACK "$REGPACK_OPT6" 6&
BAB_PACK "$REGPACK_OPT7" 7&
BAB_PACK "$REGPACK_OPT8" 8&
BAB_PACK "$REGPACK_OPT9" 9&
BAB_PACK "$REGPACK_OPTA" A&
BAB_PACK "$REGPACK_OPTB" B&
WAIT_FOR_BG_JOBS

ls -alS $OUT/* | sort -k 5 -n
