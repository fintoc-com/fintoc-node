const fieldsubs = [['id', 'id_'], ['type', 'type_']];
const invertedFieldsubs = [['id_', 'id'], ['type_', 'type']];

/**
 * Get a flat array out of an array of arrays.
 * Works only in two-dimensional arrays.
 *
 * @param {array} sequence Array to be flattened
 * @returns {array}
 */
const flatten = (sequence) => [].concat(...sequence);

/**
 * Return an object with only the specified property if
 * it exists within the object. Otherwise, return
 * an empty object.
 *
 * @param {Object} object Object from which to pick the property
 * @param {string} property Property to get from the object
 * @returns {Object}
 */
const pick = (object, property) => (property in object ? { [property]: object[property] } : {});

/**
 * Get a pluralized noun with its appropriate quantifier.
 *
 * @param {number} amount Amount of @noun to pluralize
 * @param {string} noun Noun to pluralize
 * @param {string} suffix Suffix for plural nouns
 * @returns {string}
 */
const pluralize = (amount, noun, suffix = 's') => {
  const quantifier = amount || 'no';
  return `${quantifier} ${amount === 1 ? noun : noun + suffix}`;
};

/**
 * Replace all the dictionary keys in place inside @dist (a nested
 * structure).
 *
 * @param {Object|array} dist The object to replace the properties from
 * @param {array} properties An array with two elements. The first being
 *     the old property name and the second being the new property name
 * @returns {Object}
 */
const renameProperties = (dist, properties) => {
  if (Array.isArray(dist)) {
    return [...dist].map((item) => renameProperties(item, properties));
  } if (typeof dist === 'object' && dist !== null) {
    const obj = { ...dist };
    const [oldKey, newKey] = properties;

    if (Object.prototype.hasOwnProperty.call(obj, oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }

    Object.entries(obj).forEach(([key, value]) => {
      obj[key] = renameProperties(value, properties);
    });

    return obj;
  }

  return dist;
};

/**
 * Transform a snake-cased name to its pascal-cased version.
 *
 * @param {string} string String in snake case to transform to pascal case
 * @returns {string}
 */
const snakeToPascal = (string) => string.toLowerCase().split('_').map((word) => {
  const lower = word.slice(1);
  return word.charAt(0).toUpperCase() + lower;
}).join('');


module.exports = {
  fieldsubs,
  invertedFieldsubs,
  flatten,
  pick,
  pluralize,
  renameProperties,
  snakeToPascal,
};
