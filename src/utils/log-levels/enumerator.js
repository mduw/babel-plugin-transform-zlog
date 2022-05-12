const prefix = 'zlg_';
const loglevels = ['info', 'warn', 'debug', 'error'];
const variants = ['', 'R', 'F', 'RF', 'RC'];

function enumerateLevels() {
  let counter = 0;
  const enumlvl = {};
  loglevels.forEach(level => {
    variants.forEach(variant => {
      enumlvl[`${prefix}${level}${variant}`] = counter;
      counter += 1;
    });
  });
  return enumlvl;
}

const EnumeratedLevels = enumerateLevels();

export { EnumeratedLevels };
