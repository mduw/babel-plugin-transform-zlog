const prefix = 'zlg_';
const loglevels = ['info', 'warn', 'debug', 'error'];
const variants = ['','F', 'C', 'T', 'FT', 'CT'];

function enumerateLevels() {
  let counter = 0;
  const enumlvl = {};
  loglevels.forEach(level => {
    variants.forEach(variant => {
      enumlvl[`${prefix}${level}${variant}`] = counter;
      counter += 1;
    });
  });
  console.log('checking loglev', enumlvl)

  return enumlvl;
}

const EnumeratedLevels = enumerateLevels();

export { EnumeratedLevels };
