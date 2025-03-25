// @ts-ignore - defineBackground和browser全局变量会在运行时被wxt提供
export default defineBackground(() => {
    console.log('Hello background!', { id: browser.runtime.id });
});
