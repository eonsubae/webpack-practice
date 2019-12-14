# Section3. Loaders

Loader의 필요성
* 앞서 배웠듯이 Webpack은 의존하는 여러 자바스크립트 파일들을 하나의 파일로 합쳐준다
* 그런데 웹팩은 CSS(SASS, LESS), handlebars, XML, image 등의 파일도 자바스크립트에서 불러올 수 있게 해준다
  - 이 때 사용하는 기능이 Loader다
* 한마디로 다시 정리하자면 Webpack의 Loader들은 자바스크립트 라이브러리로, 자바스크립트가 아닌 여러 파일들을 자바스크립트에서 불러와 사용할 수 있게끔 도와준다

src 파일에 사진 하나를 저장하고 js파일에서 불러오기
```js
// add-image.js
import Kiwi from './kiwi.jpg';

function addImage() {
  const img = document.createElement('img');
  img.alt = 'Kiwi';
  img.width = 300;
  img.src = Kiwi;

  const body = document.querySelector('body');
  body.appendChild(img);
};

export default addImage;
```
* add-image.js는 img태그를 생성해 사진을 집어넣고 body태그에 추가하는 addImage함수를 가지고 있다

Entry인 index.js에서 불러오기
```js
// index.js
import helloWorld from './hello-world';
import addImage from './add-image';

helloWorld();
addImage();
```
* 실행해보면 파일을 제대로 불러오지 못하는 것을 확인할 수 있다
* 웹팩이 만든 번들 파일이 아직 image를 인식하지 못하기 때문이다

Webpack이 이미지를 인식하도록 가르쳐주기
* 웹팩이 자바스크립트가 아닌 다른 파일을 불러오려면 module을 지정해야 한다
* module프로퍼티 안에는 또 다른 프로퍼티인 rules이 있다
  - rules는 특정 규칙들을 담은 배열이다
  - 각각의 rule은 Object형태로 작성한다
  - 각각의 rule에는 2가지 옵션이 있다
  - 우선 test는 정규표현식을 사용하며 어떤 형식의 파일에 해당하는 규칙인지를 지정한다
    ```js
    const path = require('path');
    
    module.exports = {
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
      },
      mode: 'none',
      module: {
        rules: [
          {
            test: /\.(png|jpg)$/,
          }
        ]
      }
    };
    ```
    - 위 코드에서는 png와 jpg형식의 파일에 해당하는 규칙을 작성하고 있음을 알 수 있다
  - use에는 어떤 Loader를 사용할 것인지를 지정한다
    ```js
    const path = require('path');

    module.exports = {
      entry: './src/index.js',
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
      },
      mode: 'none',
      module: {
        rules: [
          {
            test: /\.(png|jpg)$/,
            use: [
              'file-loader'
            ]
          }
        ]
      }
    };
    ```
    - 이제 webpack 번들 파일에서 png나 jpg파일을 불러올때는 file-loader라는 Loader를 사용한다
    - 이렇게 file-loader에 의해 번들된 파일은 MD5라는 해쉬 방법에 의해 파일이름이 변경되어 output경로에 저장된다

위에서 작성한 Loader를 설치하기
```terminal
$ npm i file-loader --save-dev
```

설치가 완료됐으면 다시 빌드해서 확인해보자
```terminal
$ npm run build
```

브라우저에서 결과를 확인해보기
* 결과를 확인해보면 사진이 제대로 나오지 않는다
  - 개발자도구에서 보면 img태그에 파일 이름은 MD5로 해쉬된 파일명이 제대로 지정되어 있음을 확인할 수 있다
  - 그럼에도 제대로 이미지를 불러오지 못하는 것은 웹팩으로 번들된 파일이 img가 어느 경로에 있는지를 모르기 때문이다 

public파일의 경로를 지정하기
* public파일은 앞서 output프로퍼티 객체 내부에 publicPath로 지정한다
```js
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/'
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};
```
* publicPath를 dist/로 지정했으므로 이제 번들파일이 이미지를 찾을 때는 dist/경로에서 찾게될 것이다
* 다시 브라우저에서 확인해보면 잘 작동하는 것을 알 수 있다
* 이 때 주의해야 할 점은 실제 서비스에서 배포할때는 도메인부터 풀네임으로 경로를 지정해줘야 한다는 것이다
  - https://www.xxxxx.com/dist 와 같은 형태로 지정해야 한다는 의미다

---

앞서 이미지 파일과 마찬가지로 CSS파일을 불러오기
* 우선 React나 Angular같은 SPA개발을 할 때처럼 간단한 작성했던 파일을 컴포넌트로 변경해보자
```js
// src/components/hello-world-button/hello-world-button.js
class HelloWorldButton {
  render() {
    const button = document.createElement('button');
    button.innerHTML = 'Hello world';
    button.classList.add('hello-world-button');
    const body = document.querySelector('body');
    button.onclick = function () {
      const p = document.createElement('p');
      p.innerHTML = 'Hello world';
      p.classList.add('hello-world-text');
      body.appendChild(p);
    }
    body.appendChild(button);
  }
};

export default HelloWorldButton;

// src/index.js
import HelloWorldButton from './components/hello-world-button/hello-world-button';

const helloWorldButton = new HelloWorldButton();
helloWorldButton.render();
```
* 다시 빌드 후에 브라우저에서 확인해보자
* 버튼을 누르면 hello world 텍스트가 추가됨을 확인할 수 있을 것이다

버튼과 추가된 텍스트에 스타일 적용해보기
* 우선 간단하게 css코드를 작성해보자
```css
/* components/hello-world-buttton/hello-world-button.css */
.hello-world-button {
  font-size: 20px;
  padding: 7px 15px;
  background: green;
  color: white;
  outline: none;
}

.hello-world-text {
  color: green;
  font-weight: bold;
}
```
* 그런 다음 js파일에서 불러온다
```js
import './hello-world-button.css';

class HelloWorldButton {
  render() {
    const button = document.createElement('button');
    button.innerHTML = 'Hello world';
    button.classList.add('hello-world-button');
    const body = document.querySelector('body');
    button.onclick = function () {
      const p = document.createElement('p');
      p.innerHTML = 'Hello world';
      p.classList.add('hello-world-text');
      body.appendChild(p);
    }
    body.appendChild(button);
  }
};

export default HelloWorldButton;
```

css파일을 자바스크립트에서 불러올 수 있는 로더를 적용하기
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/'
  },
  mode: 'none',
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
          'style-loader', 'css-loader'
        ]
      }
    ]
  }
};
```
* css-loader
  - file로부터 css코드를 읽는다
* style-loader
  - style태그를 HTML페이지에 만들어 css코드를 안에 넣어준다
* 위와 같이 여러 개의 로더를 지정할 수 있다
  - 순서는 맨 오른쪽에 있는 로더부터 적용되므로 이를 주의해서 사용해야 한다

Loader설치하기
```terminal
$ npm i css-loader style-loader --save
```
* 설치가 완료되면 다시 빌드후 브라우저에서 css가 잘 적용됐는지 확인해보자

---

SASS나 LESS같은 CSS 전처리기를 적용하기
```scss
/* components/hello-world-buttton/hello-world-button.scss */
$font-size: 20px;
$button-background-color: green;
$button-font-color: white;
$text-font-color: red;

.hello-world-button {
  font-size: $font-size;
  padding: 7px 15px;
  background: $button-background-color;
  color: $button-font-color;
  outline: none;
}

.hello-world-text {
  color: $text-font-color;
  font-weight: bold;
}
```
* 앞서 작성했던 css코드를 확장자를 scss로 바꾸고 변수를 적용했다
* 이 파일을 import하는 js파일에도 확장자를 바꿔주는 것을 잊지말자

웹팩에 Sass를 사용할 수 있도록 모듈 지정하기
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/'
  },
  mode: 'none',
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
          'style-loader', 'css-loader'
        ]
      },
      {
        test: /\.scss|sass$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      }
    ]
  }
};
```
* sass-loader가 맨 먼저 적용되어야 하기 때문에 맨 오른쪽에 위치시켰다

sass-loader를 적용하기 위한 패키지 설치
```terminal
$ npm i sass-loader node-sass --save
```
* 빌드 후 작성한 제대로 작동하는지 브라우저에서 확인해보자

---

트랜스파일러 사용하기
* Javascript는 현재 상당히 빠르게 발전하고 있다
* 그런데 Modern Javascript의 기능을 모든 브라우저에서 사용할 수 있는 것은 아니다
* 이런 문제를 해결하기 위해 Babel같은 트랜스파일러를 사용한다

```js
import './hello-world-button.scss';

class HelloWorldButton {
  buttonCssClass = 'hello-world-button';

  render() {
    const button = document.createElement('button');
    const body = document.querySelector('body');
    button.innerHTML = 'Hello world';
    button.onclick = function () {
      const p = document.createElement('p');
      p.innerHTML = 'Hello world';
      p.classList.add('hello-world-text');
      body.appendChild(p);
    }
    button.classList.add(this.buttonCssClass);
    body.appendChild(button);
  }
};

export default HelloWorldButton;
```
* 대부분의 브라우저는 자바스크립트 클래스의 method는 인식한다
* 그러나 위의 buttonCssClass같은 프로퍼티는 인식하지 못한다
  - 클래스 프로퍼티는 Ecmascript 공식 스펙이 아니기 때문이다
* 빌드 후에 확인해보면 아래와 같은 에러가 발생할 것이다
```txt
ERROR in ./src/components/hello-world-button/hello-world-button.js 4:17
Module parse failed: Unexpected token (4:17)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
|
| class HelloWorldButton {
>   buttonCssClass = 'hello-world-button';
|
|   render() {
 @ ./src/index.js 1:0-82 3:29-45
```
* 적절한 로더를 설정하지 않았기 때문에 프로퍼티를 인식하지 못하고 있다
* 이 문제를 해결하기 위해서는 babel-loader가 필요하다

웹팩에 babel-loader모듈 추가하기
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/'
  },
  mode: 'none',
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
          'style-loader', 'css-loader'
        ]
      },
      {
        test: /\.scss|sass$/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/env' ],
            plugins: [ 'transform-class-properties' ] 
          }
        }
      }
    ]
  }
};
```
* js파일에 babel-loader를 적용할 때 node_modules에는 적용되지 않도록 exclude를 지정한다
* preset env는 ES6이상을 ES5로 변경해준다
* 앞서 공식스펙이 아닌 클래스 프로퍼티를 적용하려면 특별한 바벨로더가 필요하다
  - 플러그인에 transform-class-properties를 적용하면 사용할 수 있다

babel과 관련된 패키지 설치하기
```terminal
$ npm i @babel/core babel-loader @babel/preset-env babel-plugin-transform-class-properties --save-dev
```