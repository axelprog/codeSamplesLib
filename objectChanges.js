import {
  isObject, isDate, transform, isEqual
} from 'lodash';

function isNullBlankOrUndefined(o) {
  return (typeof o === 'undefined' || o == null || o === '');
}

export const objectChanges = (object, base, ignoreBlanks = false, isUndefEqualFalse = false) {
      if (!_.isObject(object) || _.isDate(object)) return object;

      return _.transform(object, (result, value, key) => {
        if (key === '$$hashKey') {
          return;
        }

        //compare removed items  in arrays
        if(_.isEmpty(result) && Array.isArray(result) &&  object.length < base.length) {
          result.push(base.slice(object.length));
        }

        let comparableValue = value;

        if (value instanceof Set) {
          comparableValue = Array.from(value);
        }

        //compare for moment.js objects
        if(moment.isMoment(comparableValue) || moment.isMoment(base[key])) {
          if(!moment.utc(comparableValue).isSame(base[key])) {
            result[key] = comparableValue;
          }
          return;
        }

        if (!_.isEqual(comparableValue, base[key])) {
          if (ignoreBlanks && isNullBlankOrUndefined(comparableValue) && isNullBlankOrUndefined(base[key])) {
            return;
          }

          if (isUndefEqualFalse
            && ((isNullBlankOrUndefined(comparableValue) && base[key] === false)
              || (comparableValue === false && isNullBlankOrUndefined(base[key])))) {
            return;
          }

          if (_.isObject(comparableValue) && _.isObject(base[key])) {
            const value = objectChanges(comparableValue, base[key], ignoreBlanks, isUndefEqualFalse);
            if(value && !_.isEmpty(value)) {
              result[key] = value;
            }
          } else {
            result[key] = comparableValue;
          }
        }
      }, null);
    };


