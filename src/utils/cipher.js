const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

function encrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
  const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
  const publicKey = fs.readFileSync(absolutePath, 'utf8');
  const buffer = Buffer.from(toEncrypt, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
}

function decrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
  const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
  const privateKey = fs.readFileSync(absolutePath, 'utf8');
  const buffer = Buffer.from(toDecrypt, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: '',
    },
    buffer
  );
  return decrypted.toString('utf8');
}

// const enc = encrypt('hello', `public.pem`);
// console.log('enc', enc);

// const dec = decrypt(enc, `private.pem`);
// console.log('dec', dec);
