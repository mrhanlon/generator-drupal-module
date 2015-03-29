'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the groovy ' + chalk.red('Drupal Module') + ' generator!'
    ));

    var prompts = [{
      name: 'moduleName',
      message: 'What is the name of this module?'
    },{
      name: 'moduleDesc',
      message: 'Describe your module:'
    },{
      type: 'confirm',
      name: 'install',
      message: 'Would you like to add install file?',
      default: false
    },{
      type: 'checkbox',
      name: 'hooks',
      message: 'Would you like to add some hooks?',
      choices: [
        {
          name: 'hook_permission',
          value: 'perm',
          default: false
        },
        {
          name: 'hook_menu',
          value: 'menu',
          default: false
        },
        {
          name: 'hook_theme',
          value: 'theme',
          default: false
        },
        {
          name: 'hook_block_[info|view]',
          value: 'block',
          default: false
        }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.moduleName = props.moduleName;
      this.moduleDesc = props.moduleDesc;
      this.install = props.install;

      var def_value_hooks = {
        perm: false,
        menu: false,
        theme: false,
        block: false
      };
      props.hooks.forEach(function(v) {
        def_value_hooks[v] = true;
      });
      this.hooks = def_value_hooks;

      done();
    }.bind(this));
  },
/*
  dependencies: function() {
    var dep_quest = [
      {
        name: "dependency",
        message: "Need any dependencies? (Leave blank to continue)"
      }
    ];
    var dependencies = [];
    function ask(that) {
      that.prompt( dep_quest, function( answers ) {
        dependencies.push( answers.dependency );
        if (answers.dependency !== '') {
          ask(that);
        }
        else {
          this.dependencies = dependencies;
          done();
        }
      }.bind(this));
    }
    ask(this);
  },
*/

  writing: {
    app: function () {
      var context = { 
        module_name: this.moduleName,
        module_desc: this.moduleDesc,
        hooks: this.hooks,
        install: this.install
      };
      this.mkdir(context.module_name);
      this.template('_info.php', context.module_name +'/' + context.module_name + '.info', context);
      this.template('_module.php', context.module_name +'/' + context.module_name + '.module', context);
      if (typeof context.hooks.theme !== 'undefined') {
        this.mkdir(context.module_name +'/templates');
      }
      if (context.install) {
        this.template('_install.php', context.module_name +'/' + context.module_name + '.install', context);
      }
    }
  }
});
