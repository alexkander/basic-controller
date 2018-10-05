'use strict';

const path = require('path');

function buildError (code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

class Controller {

  constructor(filepath) {
    const Ctrl     = require(path.resolve(filepath));
    Ctrl._viewpath = path.resolve(path.dirname(filepath), 'views');
    this._ctrl     = Ctrl;
    if (typeof Ctrl !== 'function') {
      throw buildError('INVALID_CONTROLLER', `Controller is not a valid controller ${filepath}`);
    }
  }

  link (method) {
    return (req, res) => {
      let view;
      const params = Object.keys(req.params).map((key) => req.params[key]).concat([req.params, req, res]);
      const Ctrl = this._ctrl;
      const controller = new Ctrl();
      Promise.resolve()
      .then(() => {
        controller.setView = (newView) => {
          view = newView;
        };
        controller.setView(method);
        if (typeof controller[method] !== 'function') {
          throw buildError('INVALID_METHOD', `Controller method ${method} is not a function`);
        }
        return controller[method].apply(controller, params);
      })
      .then((locals) => {
        const viewpath = path.resolve(Ctrl._viewpath, view);
        if (controller.locals) {
          locals = controller.locals(locals);
        }
        return new Promise((resolve, reject) => {
          res.render(viewpath, locals, (err, str) => {
            if (err) {
              if (err.view) {
                resolve('');
              } else {
                reject(err)
              }
            } else {
              resolve(str);
            }
          });
        })
        .then((str) => {
          res.send(str);
        })
      })
      .catch((error) => {
        req.next(error);
      });

    };
  }

}

module.exports = Controller;