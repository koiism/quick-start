export default defineAppConfig({
  pages: ['pages/index/index'],
  window: {
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarBackgroundColor: '@navBgColor',
    backgroundTextStyle: '@bgTxtStyle',
    backgroundColor: '@bgColor',
    navigationBarTitleText: 'WeChat',
    navigationStyle: 'custom',
  },
  rendererOptions: {
    skyline: {
      defaultDisplayBlock: true,
      defaultContentBox: true,
    },
  },
  lazyCodeLoading: 'requiredComponents',
  componentFramework: 'glass-easel',
  darkmode: true,
  themeLocation: 'theme.json',
});
