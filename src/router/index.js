import Vue from 'vue'
import Router from 'vue-router'

import Home from '../pages/home/index.vue'
import Trade from '../pages/trade/index.vue'
import User from '../pages/user/index.vue'

Vue.use(Router)

const routerMap = [{
    path: '/',
    name: 'home',
    component: Home
}, {
    path: '/trade',
    name: 'trade',
    component: Trade
}, {
    path: '/user',
    name: 'user',
    component: User
}]

export default new Router({
    mode: 'history',
    // base: process.env.BASE_URL,
    // scrollBehavior: () => ({
    //     y: 0
    // }),
    routes: routerMap
})