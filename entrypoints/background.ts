// @ts-ignore - defineBackground和browser全局变量会在运行时被wxt提供
export default defineBackground(() => {
    // @ts-ignore
    console.log('Delete Repos 扩展已加载', { id: browser.runtime.id });

    // 提前预加载弹出窗口资源
    function preloadPopupResources() {
        // 获取popup页面URL
        // @ts-ignore
        const popupURL = browser.runtime.getURL('entrypoints/popup/index.html');

        // 预加载popup页面
        fetch(popupURL).catch(() => {
            // 忽略错误，这只是预加载
        });

        // 预加载图标
        const iconSizes = ['16', '32', '48', '128'];
        iconSizes.forEach(size => {
            // @ts-ignore
            const iconURL = browser.runtime.getURL(`icons/icon-${size}.png`);
            fetch(iconURL).catch(() => {
                // 忽略错误
            });
        });
    }

    // 初始加载时预加载资源
    preloadPopupResources();

    // 优化浏览器动作点击响应
    // @ts-ignore
    browser.action.onClicked.addListener(() => {
        // 这个事件在manifest中设置了default_popup时通常不会触发
        // 但添加它可以作为备用，以防popup不能正常打开
        // @ts-ignore
        browser.action.openPopup();
    });

    // 监听消息，允许popup请求后台操作
    // @ts-ignore
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'preloadResources') {
            preloadPopupResources();
            sendResponse({ success: true });
        }
        return true; // 表示将异步发送响应
    });
});
