// @ts-ignore - defineContentScript全局变量会在运行时被wxt提供
export default defineContentScript({
  matches: ['*://*.github.com/*', '*://*.gitee.com/*'],
  main() {
    console.log('Content script loaded for repository management.');
  },
});
