'use strict';

class ValidController{

  non_existing_view() {}

  existing_view(){}
  another_existing_view(){
    this.setView('another_existing_view_to_render');
  }

  with_params(param, anotherparam, params, req, res) {
    return { param, anotherparam, params };
  }

  view_with_errors() {
  }

}

module.exports = ValidController;