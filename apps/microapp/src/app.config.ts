export default defineAppConfig({
  pages: ['pages/index/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
  },
  rendererOptions: {
    skyline: {
      defaultDisplayBlock: true,
      defaultContentBox: true,
    },
  },
  renderer: 'skyline',
  lazyCodeLoading: 'requiredComponents',
  componentFramework: 'glass-easel',
});
