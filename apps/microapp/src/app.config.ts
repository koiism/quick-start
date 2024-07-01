export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/achievement/index',
    'pages/my/index',
    'pages/routeEdit/index',
  ],
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
  tabBar: {
    custom: true,
    color: '@tabBarTxtColor',
    selectedColor: '#DC143C',
    backgroundColor: '@tabBarBgColor',
    list: [
      {
        pagePath: 'pages/index/index',
        selectedIconPath: 'images/gym-selected.png',
        iconPath: 'images/gym.png',
        text: '岩馆',
      },
      {
        pagePath: 'pages/achievement/index',
        selectedIconPath: 'images/achievement-selected.png',
        iconPath: 'images/achievement.png',
        text: '成就',
      },
      {
        pagePath: 'pages/my/index',
        selectedIconPath: 'images/my-selected.png',
        iconPath: 'images/my.png',
        text: '我的',
      },
    ],
  },
  lazyCodeLoading: 'requiredComponents',
  componentFramework: 'glass-easel',
  darkmode: true,
  themeLocation: 'theme.json',
});
