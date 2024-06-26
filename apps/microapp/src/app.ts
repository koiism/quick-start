import { createApp } from 'vue';
import './app.scss';
import 'windi.css';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/authorization';

const pinia = createPinia();

const App = createApp({
  onShow(options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  onLaunch() {
    const { initAuthorization } = useUserStore();
    initAuthorization();
  },
});

App.use(pinia);

export default App;
