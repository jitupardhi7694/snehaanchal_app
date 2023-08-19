/**
 * Creates nicely looking string representation of object.
 *
 * @param {Object} objectToFormat the object to format into a string.
 */
exports.prettyString = function prettyString(objectToFormat) {
   return JSON.stringify(objectToFormat, undefined, 2);
};

/**
 * Tests if x is of wanted type.
 *
 * @param {*} x the thing to check for
 * @param {String} wantedType the expected or wanted type
 */
exports.isType = function isType(x, wantedType) {
   return Object.prototype.toString.call(x) === `[object ${wantedType}]`;
};

exports.getCurrentDate = function getCurrentDate() {
   let today = new Date();
   let dd = today.getDate();
   let mm = today.getMonth() + 1; // January is 0!
   const yyyy = today.getFullYear();
   if (dd < 10) {
      dd = `0${dd}`;
   }
   if (mm < 10) {
      mm = `0${mm}`;
   }
   today = `${yyyy}-${mm}-${dd}`;
   return today;
};
