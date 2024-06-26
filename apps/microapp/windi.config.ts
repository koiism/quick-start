import { defineConfig } from 'windicss/helpers';
export default defineConfig({
  prefixer: false,
  extract: {
    // 忽略部分文件夹
    exclude: ['node_modules', '.git', 'dist'],
  },
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--app-bg)',
        'nav-bg': 'var(--nav-bg)',
        default: 'var(--text-color)',
        primary: 'var(--primary-color)',
        icon: 'var(--icon-color)',
        'icon-active': 'var(--icon-color-active)',
        'card-bg': 'var(--card-bg)',
        'primary-text': 'var(--primary-text)',
      },
    },
  },
  corePlugins: {
    // 禁用掉在小程序环境中不可能用到的 plugins
    container: false,
  },
});
