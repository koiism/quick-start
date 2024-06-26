import Taro from '@tarojs/taro';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useStorage } from 'taro-hooks';
import { client } from '@/queries';

export const useUserStore = defineStore('user', () => {
  const [_storage, { set }] = useStorage();

  const authorization = ref<number>(
    Number(Taro.getStorageSync('Authorization')) || 0
  );

  const isLogin = computed(() => {
    return !!authorization.value;
  });

  const setAuthorization = (id: number) => {
    authorization.value = id;
    set('Authorization', id);
  };

  const initAuthorization = async () => {
    const code = (await Taro.login()).code;
    const loginResponse = await client.user.login.query({ code });

    const authorization = loginResponse.data.id;

    if (authorization) {
      setAuthorization(authorization);
    }
  };

  return {
    authorization,
    isLogin,
    initAuthorization,
  };
});
