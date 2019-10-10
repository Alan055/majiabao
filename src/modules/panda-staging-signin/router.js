import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
    routes: [

        {
            path: "/signin",
            name: "signin",
            component: r => require.ensure([], () => r(require("./pages/signin/index")), 'signin')
        }
    ]
});