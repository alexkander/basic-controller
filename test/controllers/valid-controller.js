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

  force_render(){
    return this.render();
  }

  force_render_with_locals(){
    return this.render({
      name: 'Alex'
    });
  }

  force_render_with_other_view(){
    return this.render('force_render');
  }

  force_render_with_invalid_view_param(){
    return this.render(1111);
  }

  force_render_with_invalid_locals_param(){
    return this.render('force_render', 111);
  }

  view_with_errors() {
  }

}

module.exports = ValidController;