import Taro from '@tarojs/taro';

const goBack = () => {
  Taro.navigateBack();
};

const goHome = () => {
  Taro.reLaunch({
    url: '/pages/index/index',
  });
};

export { goBack, goHome };
