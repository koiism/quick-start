import Taro from '@tarojs/taro';

const goBack = () => {
  Taro.navigateBack();
};

const goHome = () => {
  Taro.reLaunch({
    url: '/pages/index/index',
  });
};

const goRouteEdit = () => {
  Taro.navigateTo({
    url: '/pages/routeEdit/index',
  });
};

export { goBack, goHome, goRouteEdit };
