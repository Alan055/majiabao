# 极速熊猫马甲包 vue mpa

> this is a vue mpa(multi-page-application) project

## config 文件夹注释

- actest.env 马甲包本地开发/actest 测试环境配置，对应 king-actest wifi
- test.env 测试环境(原极速熊猫)，对应 king-test wifi
- box.env sdk 沙箱环境
- prod.env.js 生产环境配置
- webpack.proxy.config.js webpack 跨域代理配置

## 开始使用

```bash
# 更改npm来源
npm config set registry https://registry.npm.taobao.org

# 安装依赖
npm install

# 本地开发环境运行独立模块
npm run dev -- --env=actest --open=panda-staging

# 生产环境单个马甲包打包（测试环境env=actest/test）

npm run build -- --env=actest --open=panda-plus --vs=v1.1.0
npm run build -- --env=actest --open=panda-larger --vs=v1.1.0
npm run build -- --env=actest --open=panda-larger-welfare --vs=v1.1.0
npm run build -- --env=actest --open=panda --vs=v1.1.0
npm run build -- --env=actest --open=panda-loan --vs=v1.1.0
npm run build -- --env=actest --open=panda-easy --vs=v1.1.0
npm run build -- --env=actest --open=panda-flash --vs=v1.1.0
npm run build -- --env=actest --open=speed-panda --vs=v1.1.0
npm run build -- --env=actest --open=panda-android --vs=v1.1.0
npm run build -- --env=actest --open=panda-news --vs=v1.1.0
npm run build -- --env=actest --open=panda-common --vs=v1.1.0
npm run build -- --env=actest --open=panda-first --vs=v1.1.0
npm run build -- --env=actest --open=panda-agreements --vs=v1.1.0
npm run build -- --env=actest --open=panda-staging-drawLottery --vs=v1.1.0

npm run build -- --env=actest --open=panda-staging  放根目录
npm run build -- --env=actest-panda-staging --open=panda-staging

npm run build -- --env=actest --open=panda-credit  放根目录
npm run build -- --env=actest-panda-credit --open=panda-credit

============================================ 生产环境分割线

npm run build -- --env=prod --open=panda-plus --vs=v1.1.0
npm run build -- --env=prod --open=panda-larger --vs=v1.1.0
npm run build -- --env=prod --open=panda-larger-welfare --vs=v1.1.0
npm run build -- --env=prod --open=panda --vs=v1.1.0
npm run build -- --env=prod --open=panda-loan --vs=v1.1.0
npm run build -- --env=prod --open=panda-easy --vs=v1.1.0
npm run build -- --env=prod --open=panda-flash --vs=v1.1.0
npm run build -- --env=prod --open=speed-panda --vs=v1.1.0
npm run build -- --env=prod --open=panda-android --vs=v1.1.0
npm run build -- --env=prod --open=panda-news --vs=v1.1.0
npm run build -- --env=prod --open=panda-common --vs=v1.1.0
npm run build -- --env=prod --open=panda-agreements --vs=v1.1.0
npm run build -- --env=prod --open=panda-staging-drawLottery --vs=v1.1.0
npm run build -- --env=prod --open=panda-first --vs=v1.1.0

npm run build -- --env=prod --open=panda-staging  放根目录
npm run build -- --env=prod-panda-staging --open=panda-staging

npm run build -- --env=prod --open=panda-credit  放根目录
npm run build -- --env=prod-panda-credit --open=panda-credit
```

## 目录结构

```bash
┏━ dist                         //输出目录
┣━ node_modules                 //包依赖
┣━ build                        //webpack相关配置
┣━ config                       //环境配置
┣━ sina-agreement               //协议
┣━ sina-ui                      //动态生成页面
┣━ static                       //静态资源
┣━ src
┃  ┣━ assets
┃  ┃   ┣━ images                //图片资源
┃  ┃   ┣━ sass/less             //样式文件
┃  ┣━ components
┃  ┃   ┣━ common                //公共组件
┃  ┃   ┣━ view                  //项目组件
┃  ┣━ modules
┃  ┃   ┣━ huiyi                 //惠义贷款
┃  ┃   ┣━ qianbao               //大王钱包
┃  ┃   ┣━ panda-agreements      //所有协议单独模块 用户登录注册和关于我们 等
┃  ┃   ┣━ qianbao-android       //大王钱包安卓专用马甲包  [后更名为-熊猫钱包]
┃  ┃   ┣━ mxk                   //猛下款
┃  ┃   ┣━ panda                 //极速熊貓 【IOS别名：熊猫花呗】
┃  ┃   ┣━ panda-larger          //极速熊猫大额版
┃  ┃   ┣━ panda-larger-welfare  //极速熊猫大额版 - tab3是福利页面
┃  ┃   ┣━ panda-plus            //极速熊猫plus 后更名熊猫花花
┃  ┃   ┣━ panda-loan            //熊猫普惠
┃  ┃   ┣━ speed-panda           //极速熊貓（0516）
┃  ┃   ┣━ panda-android         //极速熊貓安卓版
┃  ┃   ┣━ panda-news            //极速熊猫资讯版
┃  ┃   ┣━ panda-staging         //熊猫分期(极速熊猫贷款) /熊猫有钱（安卓）
┃  ┃   ┣━ panda-staging-drawLottery  //抽奖活动模块   单独模块
┃  ┃   ┣━ panda-credit          //熊猫信用
┃  ┃   ┣━ panda-flash           //熊猫闪贷
┃  ┃   ┣━ panda-easy            //熊猫容易贷
┃  ┃   ┣━
┃  ┃   ┣━ dictionary.js         //数据字典
┃  ┃   ┣━ directives.js         //自定义vue全局指令
┃  ┃   ┣━ filter.js             //注册全局过滤器
┃  ┃   ┣━ hooks.js              //扩展vue钩子函数
┃  ┃   ┣━ validate.js           //表单验证
┃  ┣━ services                  //数据通信
┃  ┣━ store                     //vuex
┃  ┣━ template                  //页面模板
┃  ┣━ utils                     //工具库
┣━ test                         //伪协议和原生端交互调试
```

## 马甲包访问地址

- 详情见 excel-马甲包 h5 页面地址

## 说明

1. `/modules/*`中每个`entry.js`会生成一个单独的`index.html`，例如页面`/modules/hello/index.vue`，实际访问路径为，`/pages/hello`
2.

## 伪协议和原生端交互调试页面

1. npm run dev -- --env=k8s-dev --open=test
2. 浏览器访问http://localhost:XXXX/pages/test#/

## 本地 mock 数据

浏览器访问http://localhost:XXXX/setting 进入代理和 mock 数据配置，
请选择本地部分 mock 功能，当本地没有 mock 数据，默认代理到http://192.168.1.25:10000/app

## 切换主题样式

主题样式文件存放在 `/assets/sass/theme/`
`index.scss`是文件入口，`base.scss`会注入到 vue-style-loader

#### 两种切换方式：

1. 通过更改`cliConfig.js`的 theme 配置
2. 命令行参数 `--define=theme:xxx`

## 开发指引

- [Vue 2.0](https://cn.vuejs.org/)
- [Mint UI](http://mint-ui.github.io/#!/zh-cn)
- [Vue-router](https://router.vuejs.org/zh/)
