const prefix = 'z';
const loglevels = ['info', 'warn', 'debug', 'error'];
const variants = ['', 'F', 'C', 'T', 'FT', 'CT'];

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

function enumerateLevelsName() {
  const enumlvl = {};
  loglevels.forEach(level => {
    variants.forEach(variant => {
      enumlvl[`${prefix}${level}${variant}`] = `${prefix}${level}${variant}`;
    });
  });
  return enumlvl;
}

const EnumeratedLevels = enumerateLevels();
const EnumeratedLevelsName = enumerateLevelsName();

export { EnumeratedLevels, EnumeratedLevelsName };
