basic-controller
===============

[![npm version](https://badge.fury.io/js/basic-controller.svg)](https://badge.fury.io/js/basic-controller) [![Build Status](https://travis-ci.org/arondn2/basic-controller.svg?branch=master)](https://travis-ci.org/arondn2/basic-controller)
[![Coverage Status](https://coveralls.io/repos/github/arondn2/basic-controller/badge.svg?branch=master)](https://coveralls.io/github/arondn2/basic-controller?branch=master)

Basic implemetation of controllers for NodeJS

## Installation
`npm install basic-controller --save`

## Usage

#### Include
```js
var Controller = require('basic-controller');
```

#### `new Controller(controllerFilepath);`

Create a instance of a controller.

##### Arguments
 Name                 | Type      | Description
----------------------|-----------|-------------
 `controllerFilepath` | `string`  | Controller file path.

##### Example
Controller File
```js
// controllers/main/mainContoller.js
class MainCtrl {
  home () {
    // Make something cool
  }
  otherView () {
    // Make something else cool
  }
}
module.exports = MainCtrl;
```

```js
// controllers/main/otherContoller.js
module.exports = function OtherCtrl () {
};

OtherCtrl.prototype.myView = function () {
  // Make great things
};
```

Controller instance
```js
const MainController = new Controller('controllers/main/mainContoller.js');
const OtherController = new Controller('controllers/main/otherContoller.js');
```

#### `controller.link(methodName);`
Make a request handler to link a router to controller method.

##### Arguments
 Name         | Type      | Description
--------------|-----------|-------------
 `methodName` | `string`  | Method name

##### Example
```js
// controllers/mycontroller.js
class MyCtrl {
  myMethod () {
    // Make something cool
  }
}
module.exports = MainCtrl;
```

```js
const app = express();
const MyCtrl = new Controller('controllers/mycontroller.js');
app.get('/myRoute', MyCtrl.link('myMethod'));
```

#### Reciving params
Each method receives as arguments the parameters in the route, followed by an
object with these same parameters, the request and the response. example:

##### Example
```js
// controllers/mycontroller.js
class MyCtrl {
  myMethod (params, req, res) {
    // Request: GET /myRoute
    // params: { }
  }
  anotherMethod(displayName, province, params, req, res) {
    // Request: GET /anotherRoute/alexander/bolivar
    // displayName: 'alexander'
    // province: 'bolivar'
    // params: { displayName: 'alexander', province: 'bolivar' }
  }
}
module.exports = MainCtrl;
```

```js
const app = express();
const MyCtrl = new Controller('controllers/mycontroller.js');
app.get('/myRoute', MyCtrl.link('myMethod'));
app.get('/anotherRoute/:displayName/:province', MyCtrl.link('anotherMethod'));
```

#### Render view
When a request is handler through a controller method, the response will be the
rendering of a view with the same name of the method in the `views` folder where
the controller is. The view is rendered with params returned in the called
method.

##### Example

```js
// controllers/mycontroller.js
class MyCtrl {
  myMethod () {
    return {
      displayName: 'Alexander'
    };
  }
}
module.exports = MainCtrl;
```

```html
<!-- controllers/views/myMethod.ejs -->
<h1><%= displayName %></h1>
<p>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat facilis,
  ipsum laborum possimus. Assumenda, vitae repellat. Laudantium eos beatae,
  repellendus provident. Nam error voluptatem labore amet sit. Odio, explicabo,
  illum!
</p>
```

```js
const app = express();
const MyCtrl = new Controller('controllers/mycontroller.js');
// Render view controllers/views/myMethod.ejs
app.get('/myRoute', MyCtrl.link('myMethod'));
app.set('view engine', 'ejs'); // Configure view engine
```

To render a different view use the `setView` method.

```js
// controllers/mycontroller.js
class MyCtrl {
  anotherMethod () {
    this.setView('anotherView'); // render controllers/views/anotherView.ejs
  }
}
module.exports = MainCtrl;
```

### Troubles

If you have any kind of trouble with it, just let me now by raising an issue on the GitHub issue tracker here:

https://github.com/arondn2/basic-controller/issues

Also, you can report the orthographic errors in the READMEs files or comments. Sorry for that, English is not my main language.

## Tests

`npm test` or `npm run cover`
