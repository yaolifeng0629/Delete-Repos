import { createApp } from 'vue';
import '../../assets/base.css';
import './style.css';
import App from './App.vue';

// 创建并挂载应用
const app = createApp(App);
app.mount('#app');

// 通知后台脚本页面已加载，可以准备下一次加载的资源
// @ts-ignore - browser是WXT提供的全局变量
try {
    // @ts-ignore
    browser.runtime.sendMessage({ action: 'preloadResources' }).catch(() => {
        // 忽略错误
    });
} catch (e) {
    // 忽略错误，这只是优化加载
}
