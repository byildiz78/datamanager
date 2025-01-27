import crypto from 'crypto';

// Use a fixed-length key by padding or truncating
const RAW_KEY = (process.env.ENCRYPTION_KEY || '9f2d7b8c4a3e563f0123456789abcdef0123456789abcdef0123456789abcdac').slice(0, 32);
const ENCRYPTION_KEY = Buffer.from(RAW_KEY.padEnd(32, '0'));
const IV_LENGTH = 16;

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
    const [ivHex, encryptedHex] = text.split(':');
    if (!ivHex || !encryptedHex) {
        throw new Error('Invalid encrypted text format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
