export function invertObjectKeyValue(obj) {
  const invertedObj = {};
  Object.keys(obj).forEach(value => {
    const key = obj[value];
    try {
      invertedObj[key] = JSON.parse(value);
    } catch {
      invertedObj[key] = value;
    }
  });
  return invertedObj;
}

export function invertObjectKeyValueAsArray(obj) {
  const arr = new Array(Object.keys(obj).length);
  Object.keys(obj).forEach(key => {
    arr[parseInt(obj[key])] = key;
  });
  return arr;
}
