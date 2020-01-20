## 前言

本文将向大家分享一波搭建一个自动版本管理的Vue组件库的过程，偏基础向，如有不足之处恳请指出。

为了让读者更清晰的了解每一步的步骤，有兴趣的盆友可以将demo克隆到本地（[demo地址](https://github.com/suhangdev/vue-component-lib-demo)）使用git reset [commitId] --hard切换到每一个commit查看细节。

commitId给出如下：

| # | 描述 | commitId |
|---|------|----------|
|1|搭建项目|02a4880146675adc902592b74248a0e3526df053|
|2|配置项目|598f4592c043eeb44aea840237c1a7726de3acfd|
|3|编写组件|ec9cc302317c1eded6eab9beda206c9ae51c88e5|
|4|打包组件|238a414231e926ec91feef5b9c501f339fedb0d6|
|5|发布npm包|1738eac3e0b8876bf6261ffd2255758100c6481b|

## 搭建项目

首先我们基于@vue/cli创建一个vue项目，我的cli当前版本是4.1.2
```
npm i -g @vue/cli
vue create vue-component-lib-demo
```
我们的构建目标是个组件库，把Babel、TS、CSS预处理、Linter、单元测试勾上就成，安装依赖大概需要几分钟时间。
![](https://user-gold-cdn.xitu.io/2020/1/16/16faa62619c885f6?w=473&h=288&f=png&s=12570)

## 配置项目

项目创建好之后我们需要进行一些配置：
1. 修改项目目录，删除src、public文件夹，新增example、packages、types文件夹。example用于存放我们组件库的开发调试文件，packages用于存放组件、公共样式和方法，types文件夹用于存放ts的声明文件。
2. 在example文件夹中新增模版index.html、入口文件main.ts、根组件app.tsx。
```html
<!--index.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>vue-component-lib-demo</title>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but vue-component-lib-demo doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

```
```javascript
// main.ts
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

```
```javascript
// App.tsx
/** 
*  这里我使用了tsx来写vue组件
*  主要原因是vue的tamplate对ts的支持不够
*  不习惯的同学还是可以用.vue文件,没有什么区别
*/
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        TestA
    }
})

export default class App extends Vue {

    protected render() {
        return (
            <div>
                hello world
            </div>
        );
    }

}
```
3. 将vue的两个声明文件（shims-tsx-d.ts和shims-vue.d.ts）移入types文件夹。
4. 修改tsconfig.json中的path选项：（默认是指向src的）
```
"path": {
    "@/*": [
        "./*"
    ]
}
```
5. 新增vue.config.js
```javascript
// vue.config.js
const path = require('path')
module.exports = {
    // sourceMap
    productionSourceMap: false,
    devServer: { // 本地服务配置
        host: "localhost",
        port: 3000,
        hot: true,
        compress: true,
        hotOnly: true,
        open: false,
        https: false,
        overlay: {
            warning: false,
            error: true
        },
        public: "0.0.0.0:3000"
    },
    // 指向example中的模版和入口文件
    pages: {
        index: {
            entry: 'example/main.ts',
            template: 'example/index.html',
            filename: 'index.html'
        }
    },
    css: { 
        extract: false // 将css内联，js和css希望分开打包的同学这里设置为true
    },
    configureWebpack: {
        output: {
            libraryExport: 'default'
        },
    },
    // 插件选项
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.resolve(__dirname, './packages/common/style/common.less')
            ]
        }
    },
    // webpack配置项
    chainWebpack: config => {
        config.externals({
            'vue': 'Vue' // 我们不希望把vue的源码打包
        })
    }
}
```
最终我们的项目目录长这样：
![](https://user-gold-cdn.xitu.io/2020/1/20/16fc1d6ee25ca92c?w=470&h=930&f=png&s=86822)

## 编写组件
编写一个组件我们需要创建：组件、组件的样式、组件的入口文件、组件的文档。
接下来以TestA为例我们创建一个简单的组件，目录结构如下：

![](https://user-gold-cdn.xitu.io/2020/1/20/16fc20901aa878a9?w=350&h=440&f=png&s=40503)

css使用了css module：
```javascript
// TestA.tsx
import style from './TestA.module.less'
```
直接在TestA.tsx中引入style会引起tslint报错找不到模块“./TestA.module.less”，这时候我们需要在shims-vue.d.ts文件中对less文件添加一个描述：
```javascript
// shims-vue.d.ts
declare module "*.less" {
  const less: any;
  export default less;
}
```
接下来我们来编写TestA组件：
```javascript
// TestA.tsx
import { Component, Vue } from 'vue-property-decorator';
import style from './TestA.module.less'

@Component({
    name: 'TestA',
})

export default class TestA extends Vue {

    protected render() {
        return (
            <span class={style.text}>
                TestA
            </span>
        );
    }
}
```
TestA.module.less
```
.text{
    color: purple;
}
```
实现了TestA组件后我们需要为他编写一个入口文件index.ts，用于按需加载：
```javascript
// index.ts
import TestA from './TestA'
import { VueConstructor } from 'vue'

// 为TestA组件新增install方法，可以将TestA注册为全局组件
TestA['install'] = (Vue: VueConstructor): void => {
    Vue.component(TestA.name, TestA)
}

export default TestA
```
接下来我们在/example/App.tsx里引入一下TestA组件看看效果：
```javascript
import { Component, Vue } from 'vue-property-decorator';
import TestA from '../packages/components/TestA';

@Component({
    components: {
        TestA
    }
})

export default class App extends Vue {

    protected render() {
        return (
            <div>
                hello <TestA/>
            </div>
        );
    }

}
```
看起来还8错：

![](https://user-gold-cdn.xitu.io/2020/1/20/16fc2238bc0fb797?w=204&h=86&f=png&s=7535)

## 打包组件

按照编写组件的流程又新增了一个TestB组件，这时候我们需要打包组件，需要提供一个总的入口文件，于是在/packages/下新增index.ts和config.ts，config.ts用于引入组件，可将组件重命名后导出到index.ts：
```javascript
// packages/config.ts
import TestA from './components/TestA/TestA';
import TestB from './components/TestB/TestB';

export default {
    TestA,
    TestB
}
```
```javascript
// packages/index.ts
import config from './config'
import { VueConstructor } from 'vue'

interface compList {
    [componentsName: string]: VueConstructor
}

const components: compList = config
const install = (Vue: VueConstructor): void => {
    Object.keys(components).forEach((name) => Vue.component(name, components[name]))
}

export default {
    install,
    ...components,
}

```
index.ts文件导出一个install方法，将组件遍历注册到全局

接下来我们在package.json中新增一条npm script:
```
"lib": "vue-cli-service build --target lib --name base-lib --dest lib packages/index.ts"
```
这条命令的意思是vue-cli-service打包目标是组件库，入口文件是packages/index.ts，目标目录是lib，组件库的名字是base-lib，执行npm run lib后我们得到了构建产物：

![](https://user-gold-cdn.xitu.io/2020/1/20/16fc26875449ff86?w=918&h=288&f=png&s=48204)

## 版本管理

如果我们每次组件库版本更新都需要手动更改package.json的version字段，很容易出错，而且人工维护版本也非常累，我们可以使用npm version命令来为我们自动升级版本。

先安装一些相关依赖：
```
npm i -D cross-var shelljs inquirer
```
- cross-var：npm script跨平台兼容
- shelljs：在node中执行shell命令
- inquirer：终端用户交互

接下来修改package.json:
```
"config": {
    "target": "lib/$npm_package_version"
  },
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "test:unit": "vue-cli-service test:unit",
    "lint": "vue-cli-service lint",
    "lib": "cross-var vue-cli-service build --target lib --name base-lib --dest $npm_package_config_target packages/index.ts"
  },
```
新增了自定义变量config，其中target是我们打包的目标目录，$npm_package_version是当前package.json的版本号，修改lib命令，将config.target指定为输出文件。

接下来我们在根目录创建一个release.js，用于实现终端用户交互，询问用户这次发布要升级什么版本，npm version 遵循semver版本号，我们可以使用npm version方便的管理版本而不用手动管理
- npm version major  升级大版本
- npm version minor  升级小版本
- npm version patch  更新小补丁

```javascript
// release.js
const { exec } = require('shelljs')
const inquirer = require('inquirer')

inquirer.prompt([
    {
        type: 'list',
        name: 'selected',
        message: '请选择版本升级类型',
        choices: [
            'major',
            {
                name: '大版本更新',
                disabled: '较大版本更新时选择此项'
            }, 
            'minor',
            {
                name: '小版本更新',
                disabled: '较小版本更新时选择此项'
            }, 
            'patch',
            {
                name: '更新补丁',
                disabled: '修复bug选择此项'
            },
            new inquirer.Separator(),
            'cover',
            {
                name: '覆盖当前版本',
                disabled: '危险操作！请勿覆盖线上运行版本！'
            },
            new inquirer.Separator(),
        ]
    }
]).then(answer => {
    if (answer.selected === 'cover') {
        exec(`npm run lib`)
    } else {
        exec(`npm version ${answer.selected} && npm run lib`)
    }
})
```
然后新增一条npm script命令release：
```
"release": "node release.js"
```
在我们使用npm run release后我们可以看到：

![](https://user-gold-cdn.xitu.io/2020/1/20/16fc29a1e1dd8852?w=594&h=312&f=png&s=55434)

选择版本后会使用相应的npm version更新版本，打出来的包也在相应版本号文件夹里了：

![](https://user-gold-cdn.xitu.io/2020/1/20/16fc29c8df691eaf?w=938&h=268&f=png&s=45151)

## 发布npm包

修改package.json：

```
"private": false,
"main": "lib/baselib.umd.min.js",
"files": [
  "packages",
  "lib"
],
```
将包改为非私有，指定入口文件和上传的文件。

接下来使用npm login登陆账号，使用npm publish即可发布到npm。

> 我是suhangdev，邮箱17816876697@163.com，欢迎与我交流前端相关话题，如果文章对你有帮助，请点赞支持噢👍～