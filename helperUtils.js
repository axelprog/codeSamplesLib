/**
 * Class representing list of usefull functions. 
 */
class HelperUtils {

/*
Make tag string as formattableString with format method

Code Sample

const taggedString = HelperUtils.formattableString`test: Hello ${0}! -> ${1}`; //create formattable string
...
console.log(taggedString.format("world", "work")); // will write in console: 'test: Hello world! -> work'

*/
    static formattableString = function(literals, ...substitutions) {
        return {
            format: function(...values) {
                let out = '';
                literals.forEach((item, index) => {
                    out += item;
                    out += arguments[substitutions[index]] || '';
                });

                return out;
            },
        };
    }
}

export {
  HelperUtils,
}
