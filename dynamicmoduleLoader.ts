import * as fs from 'fs';
import * as path from 'path';
import { Helpers } from '../../../../shared/shared-code/helpers';

const modules = {};

Promise.all(
  fs
    .readdirSync(__dirname)
    .filter((file) => file !== 'index.js')
    .map(async (file) => {
      const fullName = path.join(__dirname, file);

      if (file.toLowerCase().endsWith('.js')) {
        // Removes '.js' from the property name in 'modules' object
        const [filename] = file.split('.');
        const className = Helpers.convertKebabToCamel(filename, true);
        const loadedModule = await import(fullName);
        modules[className] = loadedModule[className];
      }
    }),
).catch((error) => {
  console.error(error);
});

export function getModules() {
  return modules;
}
