import CryptoJS from 'crypto-js';
import SmCrypto from 'sm-crypto';

/**
 * Aes 加密工具
 */
export function getAesCryptoTool(preset: { key: string }) {
  const { key } = preset;

  const AES_Dencrypt = (word: string) => {
    try {
      if (!word) return '';
      const keys = CryptoJS.enc.Utf8.parse(key);
      const decrypt = CryptoJS.AES.decrypt(word, keys, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      return decryptedStr.toString();
    } catch (e) {
      console.error(e);
      return word;
    }
  };

  const AES_Encrypt = (word: string) => {
    try {
      if (!word) return '';
      const srcs = CryptoJS.enc.Utf8.parse(word);
      const keys = CryptoJS.enc.Utf8.parse(key);
      const encrypted = CryptoJS.AES.encrypt(srcs, keys, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      const hexStr = encrypted.ciphertext.toString().toUpperCase();
      const oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
      return CryptoJS.enc.Base64.stringify(oldHexStr);
    } catch (e) {
      console.error(e);
      return word;
    }
  };

  return { AES_Dencrypt, AES_Encrypt };
}

/**
 * sm4 加密工具
 */
const { sm4 } = SmCrypto;
export function getSm4CryptoTool(preset: { key: string }) {
  const { key } = preset;
  const SM4_Encrypt = (word: string) => {
    try {
      if (!word) return '';
      return sm4.encrypt(word, key);
    } catch (err) {
      console.error('SM4_Encrypt 加密出错:', err);
      return word;
    }
  };
  const SM4_Dencrypt = (word: string) => {
    try {
      if (!word) return '';
      return sm4.decrypt(word, key);
    } catch (err) {
      console.error('SM4_Dencrypt 解密出错', err);
      return word;
    }
  };

  return { SM4_Encrypt, SM4_Dencrypt };
}

/**
 *  对字符串脱敏的工具函数
 */
export type TMaskShowStrPayload = {
  str: string;
  front: number;
  end: number;
  placeholder?: string;
};
export function maskShowStr(p: TMaskShowStrPayload): string {
  const { str, front, end, placeholder = '*' } = p;
  if (str.length < front + end) {
    throw new Error('字符串长度不足以进行脱敏');
  }

  const frontPart = str.slice(0, front);
  const backPart = str.slice(-end);
  const maskedPart = placeholder.repeat(str.length - front - end);

  return `${frontPart}${maskedPart}${backPart}`;
}

/**
 * 暴露依赖的原始工具
 */
export { CryptoJS, SmCrypto };
