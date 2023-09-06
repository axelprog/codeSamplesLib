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

/*
Make promise cancalable with call reject

Code Sample

const cancalabale = HelperUtils.cancelablePromise(new Promise(<some long process>)) //create cancalable promise
.then(() => console.log("resolve"), (e) => console.log("reject", e)); 
...
cancalabale.cancel();

*/

    static cancelablePromise = function(promise) {
      let rejector;
    
      const extended = new Promise((resolve, reject) => {
        rejector = reject;
        promise.then(() => resolve());
      });
    
      extended.cancel = () => {
        rejector("cancel");
      };
    
      return extended;
    }
}

export {
  HelperUtils,
}
