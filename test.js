/* eslint-disable */

const clearLastLine = k => {
process.stdout.clearLine();
process.stdout.cursorTo(0); };

let i = 0;
setInterval(() => {
  clearLastLine();
  console.log(`hello there ${++i}`);
  console.log(`hello there2 ${++i}`);
  console.log(`hello there3 ${++i}`);
}, 500);
