/**
 * A library for computing tick mark intervals to optimize the numbers displayed for human readability.
 * Resulting tick mark intervals will be in the set {1 or 2 or 5}X10^n where n is an integer.
 * 
 * @author curran
 * 
 */
/**
 * These are the basis values, multiplied with 10^n, of nice tick marks.
 */
var niceIntervalBases = [ 1, 2, 5 ];

/**
 * Gets a nice tick mark interval for the given axis specification.
 * 
 * @param min
 *            the minimum value of the axis
 * @param max
 *            the maximum value of the axis
 * @param n
 *            the approximate number of tick marks desired
 * @return a nice interval size between tick marks.
 */
function TickMarks_getNiceInterval(min, max, n) {
  var span = max - min;
  var interval = span / n;
  var intervalExponent = Math.floor(log10(interval));
  var intervalBase = interval / Math.pow(10, intervalExponent);
  var bestIntervalBase = niceIntervalBases[0];
  for (var i = 1; i < niceIntervalBases.length; i++)
    if (Math.abs(intervalBase - niceIntervalBases[i])
                              <
        Math.abs(intervalBase - bestIntervalBase))
      bestIntervalBase = niceIntervalBases[i];
  var bestInterval = bestIntervalBase * Math.pow(10, intervalExponent);
  return bestInterval;
}

/**
 * Gets the value which should be used for the first tick mark for the given
 * minimum value and tick mark interval.
 * 
 * @param min (number) the minimum value for the tick mark set.
 * @param interval (number) the interval size between tick marks
 */
function TickMarks_getFirstTickValue(min, interval) {
  var v = Math.ceil(min / interval) * interval;
  if (v == -0)
    v = 0;
  return v;
}
function log10(x){
  return Math.log(x)/Math.LN10
};
/**
 * Gets the next smallest nice interval. For example, an input of 50 will
 * result in 10, and an input of 1 will result in .5.
 * 
 * @param interval
 *            a nice interval (returned by getNiceInterval())
 */
function TickMarks_getNextSmallerInterval(interval) {
  var intervalExponent = Math.floor(Math.log10(interval));
  var intervalBase = interval / Math.pow(10, intervalExponent);

  var closestNiceBase = niceIntervalBases[0];
  var closestNiceBaseIndex = 0;
  for (var i = 1; i < niceIntervalBases.length; i++)
    if (Math.abs(intervalBase - niceIntervalBases[i]) 
                              < 
        Math.abs(intervalBase - closestNiceBase))
      closestNiceBase = niceIntervalBases[closestNiceBaseIndex = i];

  if (closestNiceBase == niceIntervalBases[0])
    return niceIntervalBases[niceIntervalBases.length - 1]
      * Math.pow(10, intervalExponent - 1);
  else
    return niceIntervalBases[closestNiceBaseIndex - 1]
      * Math.pow(10, intervalExponent);
}

