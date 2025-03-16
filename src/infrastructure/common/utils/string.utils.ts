import { shuffleArray } from './array.util';

/**
 * Converts Vietnamese string to unsigned lowercase
 * @example
 * toVietnameseUnSignedLowerCase('Nguyễn Văn A') // => 'nguyen van a'
 */
export const toVietnameseUnSignedLowerCase = (str: string): string => {
  str = str.toLowerCase();

  // Replace Vietnamese characters with unsigned equivalents
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  str = str.replace(/[ìíịỉĩ]/g, 'i');
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
  str = str.replace(/[ỳýỵỷỹ]/g, 'y');
  str = str.replace(/đ/g, 'd');

  return str;
};

const LOWER_CHARSET = 'abcdefghijklmnopqrstuvwxyz';
const UPPER_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER_CHARSET = '0123456789';
const SPECIAL_CHARSET = '!@#$%^&*()-_=+[]{}|;:,.<>?';

export const getRandomPassword = (length: number): string => {
  const charset =
    LOWER_CHARSET + UPPER_CHARSET + NUMBER_CHARSET + SPECIAL_CHARSET;
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return shuffleArray(password.split('')).join('');
};
