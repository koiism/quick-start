import Taro from '@tarojs/taro';
import { Ref, unref } from 'vue';
function isWindow(val: unknown): val is Window {
  return typeof window !== 'undefined' && val === window;
}

export interface rectTaro {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export const useTaroRectById = (id: string) => {
  return new Promise((resolve, reject) => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      const t = document ? document.querySelector(`#${id}`) : '';
      if (t) {
        resolve(t?.getBoundingClientRect());
      }
      reject();
    } else {
      const query = Taro.createSelectorQuery();
      query
        .select(`#${id}`)
        .boundingClientRect()
        .exec(function (rect: any) {
          if (rect[0]) {
            resolve(rect[0]);
          } else {
            reject();
          }
        });
    }
  });
};

export const useTaroRect = (
  elementRef: (Element | Window | any) | Ref<Element | Window | any>
): any => {
  // 小程序下需要 el 具有 id 属性才能查询
  let element = unref(elementRef);
  return new Promise((resolve, reject) => {
    if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
      if (element && element.$el) {
        element = element.$el;
      }
      if (isWindow(element)) {
        const width = element.innerWidth;
        const height = element.innerHeight;
        resolve({
          top: 0,
          left: 0,
          right: width,
          bottom: height,
          width,
          height,
        });
      }
      if (element && element.getBoundingClientRect) {
        resolve(element.getBoundingClientRect());
      }
      reject();
    } else {
      const query = Taro.createSelectorQuery();
      const id = element?.id;
      if (id) {
        query
          .select(`#${id}`)
          .boundingClientRect()
          .exec(function (rect: any) {
            console.log(`output->rect`, rect);
            if (rect[0]) {
              resolve(rect[0]);
            } else {
              reject();
            }
          });
      } else {
        reject(new Error('element id is required'));
      }
    }
  });
};
