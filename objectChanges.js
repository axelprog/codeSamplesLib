import {
  isObject, isDate, transform, isEqual
} from 'lodash';

function isNullBlankOrUndefined(o) {
  return (typeof o === 'undefined' || o == null || o === '');
}

export default function (object, base, ignoreBlanks = false) {
  if (!isObject(object) || isDate(object)) return object;

  return transform(object, (result, value, key) => {
    let comparableValue = value;

    if (value instanceof Set) {
      comparableValue = Array.from(value);
    }

    if (!isEqual(comparableValue, base[key])) {
      if (ignoreBlanks && isNullBlankOrUndefined(comparableValue) && isNullBlankOrUndefined(base[key])) {
        return;
      }
      // eslint-disable-next-line no-param-reassign
      result[key] = isObject(comparableValue) && isObject(base[key])
        ? objectChanges(comparableValue, base[key], ignoreBlanks)
        : comparableValue;
    }
  });
};
