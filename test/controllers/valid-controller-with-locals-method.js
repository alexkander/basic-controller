'use strict';

class ValidControllerWithLocals{

  locals(vars){
    return { vars };
  }

  existing_view_with_locals(){
    return {
      name: 'Daffy Duck',
    };
  }

}

module.exports = ValidControllerWithLocals;