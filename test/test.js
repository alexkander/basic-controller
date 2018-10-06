'use strict';

const fs         = require('fs');
const path       = require('path');
const assert     = require('assert');
const expect     = require('chai').expect;
const express    = require('express');
const supertestp = require('supertest-as-promised');

const Controller = require('..');

describe('Controller', () => {

  describe('new Controller', () => {

    it('controller file doesn\'t exists', () => {
      try {
        new Controller(path.resolve(__dirname, './no-existing-controller'));
        assert(false, 'a error must be throwed');
      } catch(e) {
        expect(e.code).to.equal('MODULE_NOT_FOUND');
      }
    });

    it('controller isn\'t a function', () => {
      try {
        new Controller(path.resolve(__dirname, './controllers/no-function-controller'));
        assert(false, 'a error must be throwed');
      } catch(e) {
        expect(e.code).to.equal('INVALID_CONTROLLER');
      }
    });

    it('normal instance', () => {
      new Controller(path.resolve(__dirname, './controllers/valid-controller'));
    });

  });

  describe('link', () => {

    it('link method returns a function', () => {
      const Ctrl = new Controller(path.resolve(__dirname, './controllers/valid-controller'));
      expect(Ctrl.link('home')).to.be.an('function');
    });

  });

  describe('calling', () => {

    const Ctrl           = new Controller(path.resolve(__dirname, './controllers/valid-controller'));
    const CtrlWithLocals = new Controller(path.resolve(__dirname, './controllers/valid-controller-with-locals-method'));
    const api            = supertestp('http://localhost:3000');
    const app            = express();
    let server;
    
    app.set('view engine', 'ejs');

    function likeTest(call){
      const prevEnv = app.get('env');
      app.set('env', 'test');
      Promise.resolve()
      .then(call)
      .then(() => {
        app.set('env', prevEnv);
      });
    }

    before((done) => {
      server = app.listen(3000, done);
    });

    it('general error', (done) => {
      app.get('/view_with_errors', Ctrl.link('view_with_errors'));
      likeTest(() => {
        return api.get('/view_with_errors')
        .expect(500)
        .then(function(res) {;
          done();
        })
        .catch((err) => {
          done(err);
        })
      });
    });

    it('non existing method', (done) => {
      app.get('/non_existing_method', Ctrl.link('non_existing_method'));
      likeTest(() => {
        return api.get('/non_existing_method')
        .expect(500)
        .then(function(res) {
          assert(res.error.text.indexOf(`Error: Controller method non_existing_method is not a function`)!=-1, 'error is not expected error');
          done();
        })
        .catch((err) => {
          done(err);
        });
      });
    });

    it('method render non existing view', (done) => {
      app.get('/non_existing_view', Ctrl.link('non_existing_view'));
      api.get('/non_existing_view')
      .expect(200, done);
    });

    it('method render existing view', (done) => {
      const resultMustBe = fs.readFileSync(path.resolve(__dirname, 'controllers/views/existing_view.html'), 'utf8');
      app.get('/existing_view', Ctrl.link('existing_view'));
      api.get('/existing_view')
      .expect(200, resultMustBe, done);
    });

    it('method render another existing view', (done) => {
      const resultMustBe = fs.readFileSync(path.resolve(__dirname, 'controllers/views/another_existing_view_to_render.html'), 'utf8');
      app.get('/another_existing_view', Ctrl.link('another_existing_view'));
      api.get('/another_existing_view')
      .expect(200, resultMustBe, done);
    });

    it('controller with params method', (done) => {
      const resultMustBe = fs.readFileSync(path.resolve(__dirname, 'controllers/views/with_params.html'), 'utf8');
      app.get('/with_params/:param/:anotherparam', Ctrl.link('with_params'));
      api.get('/with_params/bugs/bunny')
      .expect(200, resultMustBe, done);
    });

    after(() => {
      server.close();
    });

  });

});