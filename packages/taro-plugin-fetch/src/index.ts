import { isArray, isString } from './utils';
import path from 'path';

import { name as packageName } from '../package.json';

import type { IPluginContext, TaroPlatformBase } from '@tarojs/service';

export default (ctx: IPluginContext) => {
  ctx.modifyWebpackChain(({ chain }) => {
    if (process.env.TARO_PLATFORM === 'mini') {
      chain.plugin('definePlugin').tap((args) => {
        return args;
      });

      const runtimeAlias = `${packageName}/dist/runtime`;
      chain.resolve.alias.set(runtimeAlias, path.join(__dirname, 'runtime.js'));
      // 注入相关全局BOM对象
      chain.plugin('providerPlugin').tap((args) => {
        args[0].fetch = [runtimeAlias, 'fetch'];

        return args;
      });
    }
  });

  ctx.registerMethod({
    name: 'onSetupClose',
    fn(platform: TaroPlatformBase) {
      if (process.env.TARO_PLATFORM === 'mini') {
        const injectedPath = `post:${packageName}/dist/runtime`;
        if (isArray(platform.runtimePath)) {
          platform.runtimePath.push(injectedPath);
        } else if (isString(platform.runtimePath)) {
          platform.runtimePath = [platform.runtimePath, injectedPath];
        }
      }
    },
  });
};
