export function invertObjectKeyValue(obj) {
  const invertedObj = {};
  const map = new Map();
  Object.keys(obj).forEach(key => {
    invertedObj[obj[key]] = key;
    map.set(obj[key], key);
  });
  return {
    obj: invertedObj,
    map,
  };
}
