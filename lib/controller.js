'use strict';

const path = require('path');

function getError (code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

class Controller {

  constructor(filepath, transform = null) {
    if (!transform) {
      transform = (locals) => locals;
    }
    const Ctrl     = require(path.resolve(filepath));
    Ctrl._viewpath = path.resolve(path.dirname(filepath), 'views');
    this._ctrl     = Ctrl;
    this._transform = transform;
    if (typeof Ctrl !== 'function') {
      throw getError('INVALID_CONTROLLER', `Controller is not a valid controller ${filepath}`);
    }
    if (typeof this._transform !== 'function') {
      throw getError('INVALID_TRANSFORM', 'Transform is not a valid controller');
    }
  }

  render (req, res, view, locals) {
    const viewpath = path.resolve(this._ctrl._viewpath, view);
    locals = this._transform(locals, req, res) || locals;
    return new Promise((resolve, reject) => {

      res.render(viewpath, locals, (err, str) => {
        if (err) {
          reject(err)
        } else {
          resolve(str);
        }
      });
    })
  }

  link (method) {
    return (req, res) => {
      let settedView = method;
      const params = Object.keys(req.params).map((key) => req.params[key]).concat([req.params, req, res]);
      const Ctrl = this._ctrl;
      const controller = new Ctrl();
      Promise.resolve()
      .then(() => {
        controller.setView = (newView) => {
          settedView = newView;
          return this;
        };
        controller.render = (view, locals) => {
          if (typeof view === 'object') {
            locals = view;
            view = null;
          }
          if (!view) {
            view = settedView;
          }
          if (!locals) {
            locals = {}
          }
          if (typeof view !== 'string') {
            throw getError('INVALID_VIEW_PARAM', `invalid view param in controller.render`);
          }
          if (typeof locals !== 'object') {
            throw getError('INVALID_LOCALS_param', `invalid locals param in controller.render`);
          }
          return this.render(req, res, view, locals)
          .then((str) => {
            res.send(str);
          });
        };
        if (typeof controller[method] !== 'function') {
          throw getError('INVALID_METHOD', `Controller method ${method} is not a function`);
        }
        return controller[method].apply(controller, params);
      })
      .then((locals) => {
        if (!res.headersSent) {
          return this.render(req, res, settedView, locals)
          .then((str) => {
            res.send(str);
          })
          .catch((err) => {
            if (!err.view) {
              throw err;
            }
            res.send('');
          })
        }
      })
      .catch((error) => {
        req.next(error);
      });

    };
  }

}

module.exports = Controller;