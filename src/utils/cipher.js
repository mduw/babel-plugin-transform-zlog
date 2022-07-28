import crypto from 'crypto';

class Cipher {
  algorithm = 'aes-256-ctr';

  setSecrets(secrets) {
    this.secrets = secrets;
  }

  encrypt = text => {
    const iv = Buffer.from(this.secrets.iv, 'hex');
    const cipher = crypto.createCipheriv(this.algorithm, this.secrets.key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
  };
}

export const ZCipher = new Cipher();
