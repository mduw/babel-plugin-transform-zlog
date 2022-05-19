// const { writeFileSync } = require('fs');
// const { generateKeyPairSync } = require('crypto');

// export function generateKeys() {
//   const { privateKey, publicKey } = generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     publicKeyEncoding: {
//       type: 'pkcs1',
//       format: 'pem',
//     },
//     privateKeyEncoding: {
//       type: 'pkcs1',
//       format: 'pem',
//       cipher: 'aes-256-cbc',
//       passphrase: '',
//     },
//   });

//   writeFileSync('private.pem', privateKey);
//   writeFileSync('public.pem', publicKey);
// }