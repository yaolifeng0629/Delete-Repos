/**
 * 通用辅助函数
 */

/**
 * 格式化日期
 * @param dateString ISO日期字符串
 * @param format 日期格式（默认为'yyyy-MM-dd'）
 * @returns 格式化后的日期字符串
 */
export function formatDate(
    dateString: string,
    format: string = 'yyyy-MM-dd'
  ): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return '无效日期';
    }

    const options: Intl.DateTimeFormatOptions = {};

    if (format.includes('yyyy')) {
      options.year = 'numeric';
    } else if (format.includes('yy')) {
      options.year = '2-digit';
    }

    if (format.includes('MM')) {
      options.month = '2-digit';
    } else if (format.includes('M')) {
      options.month = 'numeric';
    }

    if (format.includes('dd')) {
      options.day = '2-digit';
    } else if (format.includes('d')) {
      options.day = 'numeric';
    }

    return date.toLocaleDateString('zh-CN', options);
  }

  /**
   * 延迟执行
   * @param ms 延迟毫秒数
   * @returns Promise
   */
  export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 克隆对象
   * @param obj 要克隆的对象
   * @returns 克隆后的对象
   */
  export function cloneObject<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 获取随机字符串
   * @param length 字符串长度
   * @returns 随机字符串
   */
  export function getRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
