'use strict';

const path = require('path');

class Controller {

  constructor(filepath) {
    const Ctrl     = require(path.resolve(filepath));
    Ctrl._viewpath = path.resolve(path.dirname(filepath), 'views');
    this._ctrl     = Ctrl;
  }

  link (method) {
    return (req, res) => {
      let view;
      const params = [];
      const Ctrl = this._ctrl;
      const controller = new Ctrl();
      Promise.resolve()
      .then(() => {
        controller.setView = (newView) => {
          view = newView;
        };
        controller.setView(method);
        return controller[method].apply(controller, params);
      })
      .then((locals) => {
        const viewpath = path.resolve(Ctrl._viewpath, view);
        if (controller.locals) {
          locals = controller.locals(locals);
        }
        res.render(viewpath, locals);
      })
      .catch((error) => {
        console.error(error);
        res.status(505);
        res.send({ error });
      });

    };
  }

}

module.exports = Controller;