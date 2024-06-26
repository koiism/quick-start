// @ts-nocheck
import Components from 'unplugin-vue-components/webpack';
import NutUIResolver from '@nutui/auto-import-resolver';
import path from 'path';

const config = {
  projectName: 'microapp',
  date: '2024-6-2',
  designWidth(input) {
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
      return 375;
    }
    return 375;
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    'taro-plugin-fetch',
    '@tarojs/plugin-html',
    '@taro-hooks/plugin-vue',
    '@taro-hooks/plugin-auto-import',
    '@dcasia/mini-program-tailwind-webpack-plugin/dist/taro',
  ],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false },
  },
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
  },
  mini: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        Components({
          resolvers: [
            NutUIResolver({
              importStyle: 'sass',
              taro: true,
            }),
          ],
        })
      );
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: false,
          // selectorBlackList: ['nut-']
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(
        Components({
          resolvers: [
            NutUIResolver({
              importStyle: 'sass',
              taro: true,
            }),
          ],
        })
      );
    },
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-taro', 'icons-vue-taro'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/queries': path.resolve(__dirname, '..', 'src/queries'),
    '@/stores': path.resolve(__dirname, '..', 'src/stores'),
  },
};

export default async function (merge) {
  if (process.env.NODE_ENV === 'development') {
    const devConfig = await import('./dev');
    return merge({}, config, devConfig.default);
  }
  const prodConfig = await import('./prod');
  return merge({}, config, prodConfig.default);
}
