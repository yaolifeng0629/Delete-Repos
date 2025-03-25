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
