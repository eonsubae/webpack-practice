# Section8. Integration with Jquery, Bootstrap, FontAwesome and ESLint

프로젝트 설정하기
```terminal
git clone https://github.com/vp-online-courses/webpack-tutorial.git
cd webpack-tutorial
git checkout -b starting-point-for-use-cases remotes/origin/starting-point-for-use-cases
rm -rf node_modules
npm install
```
* Jquery, Bootstrap, FontAwesome, ESLint를 각각 다른 폴더에서 연습해보고 싶다면 각각의 폴더를 만들고 위 과정을 반복하면 된다

Jquery로 기존에 작성했던 코드들을 재작성하고 웹팩으로 빌드하기
* 우선 jquery를 설치하자

```terminal
$ npm i --save jquery
```

heading.js를 jquery코드로 수정하기
```js
import './heading.scss';
import $ from 'jquery';

class Heading {
    render(pageName) {
        const h1 = $('<h1>');
        const body = $('body');
        h1.text('Webpack is awesome. This is "' + pageName + '" page');
        body.append(h1);
    }
}

export default Heading;
```

빌드 후 서버를 재시작해 확인해보기
```js
$ npm run build
$ npm start
```

---

Bootstrap 사용하기
* Bootstrap은 jquery와 popper.js에 의존하므로 두 패키지는 반드시 필요하다
```terminal
$ npm i --save bootstrap jquery popper.js
```

모든 페이지에 bootstrap을 사용하므로 src/index.js에 bootstrap을 import하기
```js
// src/index.js
import HelloWorldButton from './components/hello-world-button/hello-world-button.js';
import Heading from './components/heading/heading.js';
import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';

const heading = new Heading();
heading.render('hello world');
const helloWorldButton = new HelloWorldButton();
helloWorldButton.render();

if (process.env.NODE_ENV === 'production') {
    console.log('Production mode');
} else if (process.env.NODE_ENV === 'development') {
    console.log('Development mode');
}

console.log(_.upperFirst('index module'));
```

src/page-template.hbs에 alert와 dropdown추가하기
```hbs
<!-- src/page-template.hbs -->
<!doctype html>

<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{htmlWebpackPlugin.options.description}}">
    <title>{{htmlWebpackPlugin.options.title}}</title>
</head>
<body>
  <div class="alert alert-primary" role="alert">
    This is a primary alert—check it out!
  </div>

  <div class="dropdown my-dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Dropdown button
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a class="dropdown-item" href="#">Action</a>
      <a class="dropdown-item" href="#">Another action</a>
      <a class="dropdown-item" href="#">Something else here</a>
    </div>
  </div>
</body>
</html>
```

src폴더에 index.scss파일을 추가하기
```scss
/* src/index.scss */

.my-dropdown {
  float: right;
  position: relative;
  top: 7px;
  right: 40px;
}
```

빌드 후 서버를 시작해 확인해보기
```terminal
$ npm run build
$ npm start
```

Bootstrap을 불러오는 또 다른 방법
* 앞서서는 자바스크립트 파일 내부에서 Bootstrap을 불러와서 사용했다
* 이번에는 Sass파일 안에서 Bootstrap을 불러와서 사용하는 방법을 알아보자
* webpack설정에 로더를 추가한다
```js
// webpack.prod.js

// (...)

module.exports = {
  // (...)
  module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader', 
                    /* 추가된 부분 */
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    },
                    /* 추가된 부분 */
                    'sass-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ 'stage-0' ]
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [
                    'handlebars-loader'
                ]
            }
        ]
    },
  // (...)
};
```
* Sass를 사용할 때 css-loader와 sass-loader 사이에 postcss-loader를 추가했다
  - postcss-loader는 Modern css문법을 대부분의 브라우저가 이해할 수 있도록 도와준다
  - postcss에는 다양한 플러그인이 있다
* 여기서는 postcss-loader에서 precss와 autoprefixer라는 두 플러그인을 불러오고 있다
* precss
  - 최신 css기능들을 사용할 수 있게 해준다
  - ex. color functions, logical and custom properties, media query, image set 
* autoprefixer
  - autoprefixer는 css를 파싱해 vendor prefix를 자동으로 붙여준다

postcss-loader와 플러그인 설치하기
```terminal
$ npm i --save-dev postcss-loader autoprefixer precss
```

src/index.scss파일에서 Bootstrap불러오기
```scss
@import "~bootstrap/scss/bootstrap";

.my-dropdown {
  float: right;
  position: relative;
  top: 7px;
  right: 40px;
}
```

src/index.js파일에서 Bootstrap불러오는 라인 삭제하기
```js
import HelloWorldButton from './components/hello-world-button/hello-world-button.js';
import Heading from './components/heading/heading.js';
import _ from 'lodash';
import 'bootstrap'; // 이 부분은 javascript관련된 것도 있기 때문에 남긴다
import './index.scss';

const heading = new Heading();
heading.render('hello world');
const helloWorldButton = new HelloWorldButton();
helloWorldButton.render();

if (process.env.NODE_ENV === 'production') {
    console.log('Production mode');
} else if (process.env.NODE_ENV === 'development') {
    console.log('Development mode');
}

console.log(_.upperFirst('index module'));
```

빌드 후 서버를 재시작해 확인해보기
```terminal
$ npm run build
$ npm start
```
* 똑같이 작동하는 것을 확인할 수 있을 것이다

---

FontAwesome 적용하기
* FontAwesome은 웹에서 가장 많이 사용되는 icon라이브러리다
* 지금까지 FontAwesome은 주로 CDN link를 head안에 넣는 방식으로 사용해왔다
  - ex. <link rel="stylesheet" ...>
* 여기서는 webpack을 사용해서 FontAwesome을 사용하는 방법을 알아본다
```terminal
$ npm i --save-dev @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons
```

```js
// src/index.js
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import HelloWorldButton from './components/hello-world-button/hello-world-button.js';
import Heading from './components/heading/heading.js';
import _ from 'lodash';

library.add(faSpinner);
dom.watch();

const heading = new Heading();
heading.render('hello world');
const helloWorldButton = new HelloWorldButton();
helloWorldButton.render();

if (process.env.NODE_ENV === 'production') {
    console.log('Production mode');
} else if (process.env.NODE_ENV === 'development') {
    console.log('Development mode');
}

console.log(_.upperFirst('index module'));
```

```hbs
<!-- src/page-template.hbs -->
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="{{htmlWebpackPlugin.options.description}}">
    <title>{{htmlWebpackPlugin.options.title}}</title>
</head>
<body>
  <i class="fas fa-spinner fa-spin"></i>
</body>
</html>
```

빌드 후 확인해보기
```terminal
$ npm run build
$ npm start
```
* 브라우저에서 확인해보면 화면 상단에 Spinner가 생긴것을 확인할 수 있을 것이다

---

ESLint 적용하기
* Lint는 문법 에러, 정의되지 않은 변수, deprecated된 함수, 공백과 형식의 컨벤션 등의 잘못된 부분을 지적해준다
* 우선 ESLint를 설치해보자
```terminal
$ npm i --save-dev eslint
```

package.json에 eslint를 사용하는 스크립트 작성하기
```json
{
  /* (...) */
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack --config webpack.production.config.js",
    "dev": "webpack-dev-server --config webpack.dev.config.js --hot",
    "start": "node src/server.js",
    "lint": "eslint ."
  },
  /* (...) */
}
```

.eslintrc파일로 규칙설정하기
* 프로젝트 폴더 위치(package.json파일이 있는 위치)에 생성하고 다음 코드를 추가해보자
```json
{
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  }
}
```
* ES6를 기준으로 파싱하고 ES6모듈을 기본으로 사용하는 것을 규칙으로 정했다
* npm run lint로 등록했던 스크립트를 실행해보면 ES6모듈을 사용하지 않고 require를 사용한 부분들을 비롯해 수많은 에러가 발생하는 것을 확인할 수 있다

```json
{
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "browser": true
  }
}
```
* env에 node프로퍼티를 true로 설정하면 require을 사용한 것에 대해 더 이상 에러를 발생시키지 않는다
* env의 browser프로퍼티는 document변수를 에러로 인식하지 않게 만들어준다

class property를 eslint가 에러로 취급하지 않도록 babel-eslint 설치하기
```terminal
$ npm i --save-dev babel-eslint
```

```json
{
  "extends": "eslint:recommended",
  "parser": "babel-eslint", // 추가
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "browser": true
  }
}
```

eslint가 console을 에러로 인식하지 않도록 설정하기
```json
{
  "extends": "eslint:recommended",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "browser": true
  },
  "rules": {
    "no-console": 0
  }
}
```
* 이 외에도 많은 규칙을 추가하거나 제거할 수 있다
* lint는 팀 단위의 프로젝트에서 코딩 컨벤션을 만드는 데에도 유용하다
* 사소한 것이라고 생각할 수도 있지만 코드를 작성하는 스타일이 프로그래머마다 다르다면 역할을 나눠 작업한 코드를 나중에 합쳤을 때 이해하는 것이 어려워질 것이다

---