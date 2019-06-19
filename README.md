# 大王贷款马甲包 vue mpa

> this is a vue mpa(multi-page-application) project

## config 文件夹注释

-   k8s-dev.env.js 本地开发环境配置
-   k8s.env.js 测试环境配（dev、test 打包）
-   prod.env.js 生产环境配置
-   webpack.proxy.config.js webpack 跨域代理配置

## 开始使用

```bash
# 更改npm来源
npm config set registry https://registry.npm.taobao.org

# 安装依赖
npm install

# 本地开发环境运行独立模块
npm run dev -- --env=k8s --open=panda-staging
# 如需调试测试环境数据，打开webpack.proxy.config line3注释后重启
# 如需调试个人中心的接口（如帮助中心），打开webpack.proxy.config line26注释后重启
# 如需调试测试环境数据（如福利模块、商业化地址等），将本地dns设置192.168.1.92

# 协议运行
gulp build --env=k8s-dev 协议打包
gulp agreement --env=k8s-dev  协议运行

# 开发、测试环境打包
npm run build-quick -- k8s

# 生产环境打包（sina-ui补件项除外）
npm run build-quick -- prod
# 生产环境打包
npm run build-all -- prod

# 版本号打包
## 开发测试环境
npm run build-quick -- k8s --vs=v1.1.0
## 生产环境
npm run build-all -- prod --vs=v1.1.0

# 分模块打包
npm run build -- --env=k8s --open=moduleName
npm run build -- --env=prod --open=moduleName

npm run build -- --env=prod --open=panda-plus
npm run build -- --env=prod --open=panda-larger

npm run build -- --env=prod --open=panda-staging  放根目录

npm run build -- --env=prod --open=panda --vs=v1.1.0
npm run build -- --env=prod --open=panda-loan --vs=v1.1.0
npm run build -- --env=prod --open=speed-panda --vs=v1.1.0
npm run build -- --env=prod --open=panda-android --vs=v1.1.0
npm run build -- --env=prod --open=panda-news --vs=v1.1.0
目前只有panda ，panda-loan，speed-panda 加 --vs=v1.1.0
```

## 自动化构建:

1. 将打包生成的 dist 替换 svn 对应文件，
    - 地址：svn://192.168.1.29/dev/king-dev/prod
    - 账号：king
    - 密码：king_123
2. 登录自动化构建网站：
    - 地址：http://192.168.1.123:8080/jenkins/login
    - 账号 1：king-h5-user
    - 密码：123456
3. k8s-static-static.sinawallent.com-大王贷款开发环境静态发布 --> Build with Parameters --> deploy_env:deploy --> version:上面 svn 提交的版本号 --> 开始构建

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
┃  ┃   ┣━ qianbao-android       //大王钱包安卓专用马甲包
┃  ┃   ┣━ mxk                   //猛下款
┃  ┃   ┣━ panda                 //极速熊貓
┃  ┃   ┣━ panda-larger          //极速熊猫大额版
┃  ┃   ┣━ panda-plus            //极速熊猫plus 后更名熊猫花花
┃  ┃   ┣━ panda-loan            //熊猫普惠
┃  ┃   ┣━ speed-panda           //极速熊貓（0516）
┃  ┃   ┣━ panda-android         //极速熊貓安卓版
┃  ┃   ┣━ panda-news            //极速熊猫资讯版
┃  ┃   ┣━ panda-staging         //熊猫分期(极速熊猫贷款)
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

## 官网地址

-   极速熊猫官网 www.huiyidaikuan.com
-   极速熊猫资讯版 www.jisuxmsdk.com/

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

-   [Vue 2.0](https://cn.vuejs.org/)
-   [Mint UI](http://mint-ui.github.io/#!/zh-cn)
-   [Vue-router](https://router.vuejs.org/zh/)

## 极速熊猫贷款上线摘要

1. 代码 svn: svn://svn.iask.com/svn/projects/king/app/code/html/trunk/sinaifloan-majiabao/src/modules/panda-staging
2. actest 环境打包命令：npm run build -- --env=k8s --open=panda-staging
3. actest 环境 svn 存放地址： http://192.168.1.58/svn/king-ac-static/panda-staging

4. 生产环境打包命令：npm run build -- --env=panda-staging-prod --open=panda-staging //注意目前域名还没有定暂时写的 static.baidu.... 一定记得换域名后打包！！！！！
5. svn://192.168.1.152/king_static/ //本次 h5 为了跟以前马甲包更多区分，地址为根目录下，目录我已建好，并放了一个 favicon.ico

6. 产品文件地址：\\192.168.1.77\02 极速熊猫\V1.0 大版本截止 2019 年\极速熊猫贷款（熊猫分期）
7. UI 地址： \\192.168.1.77\iOS 上架组\5 月份\极速熊猫贷款(新)

8. 官网地址代码：svn://svn.iask.com/svn/projects/opt/base/code/html/trunk/majiabao-website/jquery/src/modules/panda-staging
9. 官网本地启动： cd 到上面目录 jquery 这级，npm run start
10. 官网上线： 直接复制 panda-staging 目录给运维手动发
