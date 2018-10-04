import Vue from 'vue'
import Router from 'vue-router';
import Cookies from 'js-cookie';
import Main from '@/views/main/main';
import Detail from '@/views/detail/detail';
import User from '@/views/user/user';
import Publish from '@/views/publish/publish';
import topNav from '@/router/topNav';
import userChildren from '@/router/user-children';

Vue.use(Router);

const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        // savedPosition is only available for popstate navigations.
        //console.log(savedPosition);
        return savedPosition;
    } else {
        const position = {}
            // new navigation.
            // scroll to anchor by returning the selector
        if (to.hash) {
            position.selector = to.hash
        }
        // check if any matched route config has meta that requires scrolling to top
        if (to.matched.some(m => m.meta.scrollToTop)) {
            // cords will be used if no selector is provided,
            // or if the selector didn't match any element.
            position.x = 0
            position.y = 0
        }
        // if the returned position is falsy or an empty object,
        // will retain current scroll position.
        //console.log(position);
        return position;
    }
};

let router = new Router({
    mode: 'history',
    scrollBehavior,
    routes: [
        ...topNav,
        {
            path: '/main/:tab?',
            name: 'Main',
            component: Main
        },
        /* {
          path: '/detail/:id:hash?',
          name: 'Detail',
          component: Detail
        }, */
        {
            path: '/detail/:id',
            name: 'Detail',
            component: Detail,
            meta: {
                scrollToTop: true
            }
        },
        {
            path: '/publish',
            name: 'Publish',
            component: Publish,
            meta: { isLogin: true }
        },
        {
            path: '/edit',
            name: 'Edit',
            component: Publish,
            meta: { isLogin: true }
        },
        {
            path: '/user/:loginname',
            name: 'User',
            component: User,
            meta: {
                scrollToTop: true
            },
            children: [...userChildren]
        },
        /* {
            path: '/login',
            name: 'Login',
            component: Login
        }, */
        {
            path: '*',
            redirect: '/'
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(item => item.meta.isLogin)) {
        //需要登录
        //let userName = Cookies.get('cnode-user');
        let isLogin = Cookies.get('success');

        if (isLogin) {
            //登录了
            //console.log(22222);
            next();
        } else {
            //没登录
            next({
                name: 'Login',
                query: { ref: to.name }
            });
        }
    } else {
        //不需要登录
        next();
    }
});

export default router;