export function invertObjectKeyValue(obj) {
  const invertedObj = {};
  Object.keys(obj).forEach(key => {
    invertedObj[parseInt(obj[key])] = key;
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