/**
 * 存储工具 - 处理扩展存储操作
 */

/**
 * 保存数据到本地存储
 * @param key 存储键名
 * @param value 要存储的值
 */
export function saveToStorage<T>(key: string, value: T): Promise<void> {
    return new Promise(resolve => {
        // @ts-ignore - browser全局变量会在运行时被wxt提供
        browser.storage.local.set({ [key]: value }, resolve);
    });
}

/**
 * 从本地存储获取数据
 * @param key 存储键名
 * @param defaultValue 默认值（如果键不存在）
 * @returns 存储的值或默认值
 */
export function getFromStorage<T>(key: string, defaultValue: T): Promise<T> {
    return new Promise(resolve => {
        // @ts-ignore - browser全局变量会在运行时被wxt提供
        browser.storage.local.get([key], result => {
            resolve(result[key] !== undefined ? result[key] : defaultValue);
        });
    });
}

/**
 * 从本地存储删除数据
 * @param key 存储键名
 */
export function removeFromStorage(key: string): Promise<void> {
    return new Promise(resolve => {
        // @ts-ignore - browser全局变量会在运行时被wxt提供
        browser.storage.local.remove(key, resolve);
    });
}

/**
 * 清除所有本地存储数据
 */
export function clearStorage(): Promise<void> {
    return new Promise(resolve => {
        // @ts-ignore - browser全局变量会在运行时被wxt提供
        browser.storage.local.clear(resolve);
    });
}

/**
 * 存储带有过期时间的数据到localStorage
 * @param key - 存储的键名
 * @param value - 存储的值
 * @param ttl - 过期时间（毫秒）
 */
export function setStorageWithExpiry(key: string, value: string, ttl: number): void {
  const item = {
    value: value,
    expiry: new Date().getTime() + ttl
  };
  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * 从localStorage获取带有过期时间的数据
 * @param key - 存储的键名
 * @returns 如果数据未过期，返回存储的值；否则返回null
 */
export function getStorageWithExpiry(key: string): string | null {
  const itemStr = localStorage.getItem(key);

  // 如果不存在该键，返回null
  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    // 检查是否已过期
    if (now > item.expiry) {
      // 如果已过期，删除该项并返回null
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (e) {
    // 如果解析JSON出错，返回null
    return null;
  }
}
