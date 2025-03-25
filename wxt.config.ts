import { defineConfig } from 'wxt';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    manifest: {
        name: 'Delete Repos',
        description: '批量删除GitHub和Gitee仓库的Chrome扩展',
        version: '1.0.0',
        permissions: ['storage'],
        action: {
            default_popup: 'entrypoints/popup/index.html',
            default_icon: {
                '16': 'icons/icon-16.png',
                '32': 'icons/icon-32.png',
                '48': 'icons/icon-48.png',
                '128': 'icons/icon-128.png',
            },
        },
        icons: {
            '16': 'icons/icon-16.png',
            '32': 'icons/icon-32.png',
            '48': 'icons/icon-48.png',
            '128': 'icons/icon-128.png',
        },
        web_accessible_resources: [
            {
                resources: ['icons/*', 'entrypoints/popup/*'],
                matches: ['<all_urls>']
            }
        ],
    },
    vite: () => ({
        plugins: [vue()],
        build: {
            target: 'esnext',
            minify: true,
            cssCodeSplit: false,
            rollupOptions: {
                output: {
                    manualChunks: undefined
                }
            }
        },
        server: {
            hmr: {
                overlay: false
            }
        }
    }),
});
