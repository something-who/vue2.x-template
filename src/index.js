// 入口文件
import Vue from 'vue'
import App from './app.vue'
import router from './router'

import './assets/styles/base.css'

import './assets/images/fe.png'

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')