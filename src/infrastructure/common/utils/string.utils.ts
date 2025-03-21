import { ArrayUtil } from './array.util';

export class StringUtil {
  private static LOWER_CHARSET = 'abcdefghijklmnopqrstuvwxyz';
  private static UPPER_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static NUMBER_CHARSET = '0123456789';
  private static SPECIAL_CHARSET = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  /**
   * Converts Vietnamese string to unsigned lowercase
   * @example
   * toVietnameseUnSignedLowerCase('Nguyễn Văn A') // => 'nguyen van a'
   */
  static normalize = (str: string): string => {
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

  static getRandomPassword = (length: number): string => {
    const charset =
      this.LOWER_CHARSET +
      this.UPPER_CHARSET +
      this.NUMBER_CHARSET +
      this.SPECIAL_CHARSET;
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    return ArrayUtil.shuffleArray(password.split('')).join('');
  };

  static generateOtpCode(length: number = 6): string {
    const otp = Math.floor(Math.random() * Math.pow(10, length)).toString();
    return otp.padStart(length, '0');
  }
}
