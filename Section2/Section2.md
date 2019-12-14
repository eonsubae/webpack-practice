# Section2. Initial Setup and Integrating Webpack

웹팩의 필요성
* 간단한 프로젝트 하나가 있다
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <script src="./src/hello-world.js"></script>
  <script src="./src/index.js"></script>
</body>
</html>
```
```js
// src/index.js
helloWorld();

// src/hello-world.js
function helloWorld() {
  console.log('hello world');
};
```
* html 파일에서 index.js와 hello-world.js을 사용하는 매우 간단한 프로젝트다
* 이 프로젝트에서 index.js는 hello-world.js의 helloWorld함수를 호출하고 있다
* 따라서 index.js는 hello-world.js에 의존하고 있다
* 여기서 만약 index.js와 hello-world.js의 script태그의 순서를 바꾼다면 의도대로 동작하지 않을 것이다
* 지금은 js파일 2개의 매우 간단한 프로젝트이기 때문에 이런 의존성 순서를 맞추는 것이 어렵지 않다
* 그러나 현실의 프로젝트에서 의존성을 관리해야 하는 js파일이 10개, 20개 이상이 된다면 어떨까
* 의존성 관리를 위한 문서 작성이 따로 필요할 수도 있는 매우 복잡한 문제가 될 것이다
* 웹팩은 이런 복잡한 문제를 자바스크립트를 하나의 파일로 만들어 해결해준다

웹팩의 주요 옵션들

### Entry

* Entry는 모든 의존성들을 불러오는 파일이다
  - 웹팩은 이 파일을 시작으로 빌드 프로세스를 시작한다
  - Section2의 예제에서 라면 index.js다

```js
module.exports = {
  entry: './src/index.js',
}
```

### Output

* Output은 웹팩의 빌드 결과 합쳐진 파일의 이름을 지정하는 옵션이다
  - Javascript object형태로 작성한다
  - 파일의 이름과, 저장될 경로를 설정해야 한다

```js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: './dist'
  }
}
```

### Mode

* Mode는 빌드 옵션을 지정하는 옵션으로 entry, output에 이은 웹팩의 마지막 mandatory옵션이다
  - production과 development옵션이 있지만 여기서는 none으로 지정한다
  - 이 옵션은 이후에 설명할 것이다
  
```js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: './dist'
  },
  mode: 'none'
};
```

웹팩을 편리하게 이용하려면 package.json파일에 scripts를 등록하는 것이 좋다
```json
(...)
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
},
(...)
```

이제 더이상 html파일에서 js파일간의 의존관계를 고려해 script태그를 작성할 필요가 없다
* 이제 html에는 하나의 js파일만을 불러올 것이다. 이 때 앞서 지정한 output의 경로와 이름을 지정해주자
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <script src="./dist/bundle.js"></script>
</body>
</html>
```
* 그리고 js파일 간의 관계는 js파일 내에서 지정한다
* Webpack은 기본적으로 ES6모듈을 지원한다
```js
// index.js
import helloWorld from './hello-world';

helloWorld();

// hello-world.js
function helloWorld() {
  console.log('hello world');
};

export default helloWorld;
```

이제 위 코드가 작동하도록 번들 파일을 실제로 만들기 위해 앞서 만든 스크립트를 실행해보자
```terminal
$ npm run build
```

아마 아래와 같은 에러가 발생할 것이다
```txt
Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema.
 - configuration.output.path: The provided value "./dist" is not an absolute path!
   -> The output directory as **absolute path** (required).
```
* output의 폴더 경로는 절대경로로 지정해야 한다는 의미다
* 이 문제는 일반적으로 node.js의 path모듈을 이용해 해결한다
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  mode: 'none'
};
```
* 다시 npm run build으로 빌드해보면 잘 작동하는 것을 확인할 수 있을 것이다