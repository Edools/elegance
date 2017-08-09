(function () {
  'use strict';

  app.simpleEditor = {
    createShortcut: function (bindKey, callback) {
      var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

      var bindFunction = function (e) {
        var character = String.fromCharCode(e.keyCode);
        var ctrl = e.ctrlKey;
        var meta = !!e.metaKey;
        var score = 0;

        if (isMac && meta) {
          score++;
        } else if (ctrl) {
          score++;
        }

        if (character === bindKey) {
          score++;

          if (score === 2) {
            e.stopPropagation();
            e.preventDefault();
            return callback();
          }
        }
      };

      $('body').bind('keydown', bindFunction);
    },

    handleDrag: function (e) {
      e.stopPropagation();
      e.preventDefault();
    },

    handleDrop: function (e) {
      e.stopPropagation();
      e.preventDefault();
      var x = e.clientX;
      var y = e.clientY;
      var file = e.dataTransfer.files[0];

      var URLObj = window.URL || window.webkitURL;
      var source = URLObj.createObjectURL(file);

      if (file.type.match('image.*')) {

        var img = document.createElement("img");

        img.src = source;

        var range = null;

        if (document.caretPositionFromPoint) {
          var pos = document.caretPositionFromPoint(x, y);
          range = document.createRange();
          range.setStart(pos.offsetNode, pos.offset);
          range.collapse();
          range.insertNode(img);
        } else if (document.caretRangeFromPoint) {
          range = document.caretRangeFromPoint(x, y);
          range.insertNode(img);
        }
      }
    },

    updateButtons: function () {
      var bold = document.queryCommandState("Bold");
      var italic = document.queryCommandState("Italic");
      var underline = document.queryCommandState("Underline");

      if (bold === true) {
        $('[data-action=bold]').addClass('active');
      } else {
        $('[data-action=bold]').removeClass('active');
      }

      if (italic === true) {
        $('[data-action=italic]').addClass('active');
      } else {
        $('[data-action=italic]').removeClass('active');
      }

      if (underline === true) {
        $('[data-action=underline]').addClass('active');
      } else {
        $('[data-action=underline]').removeClass('active');
      }
    },

    init: function (container) {
      this.$container = $(container);

      if(this.$container.length <= 0) {
        return;
      }

      this.$input = this.$container.find('.js-input');
      this.$btnAction = this.$container.find('.js-btn-action');

      this.registerTriggers();
      this.registerDropZone();
      this.registerShortcuts();
    },

    registerTriggers: function () {
      var self = this;

      self.$btnAction.on('click', function () {
        var action = $(this).attr('data-action');
        document.execCommand(action);
        app.simpleEditor.updateButtons();
      });

      self.$input.on('click', function () {
        app.simpleEditor.updateButtons();
      });

      self.$input.on('focusin', function () {
        self.$container.addClass('focused');
      });

      self.$input.on('focusout', function () {
        self.$container.removeClass('focused');
      });
    },

    registerDropZone: function () {
      var dropZone = $(this.container).find('.js-input');
      dropZone.on('dragover', app.simpleEditor.handleDrag, false);
      dropZone.on('drop', app.simpleEditor.handleDrop, false);
    },

    registerShortcuts: function () {

      app.simpleEditor.createShortcut('U', function () {
        document.execCommand('underline');
        app.simpleEditor.updateButtons();
      });

      app.simpleEditor.createShortcut('B', function () {
        document.execCommand('bold');
        app.simpleEditor.updateButtons();
      });

      app.simpleEditor.createShortcut('I', function () {
        document.execCommand('italic');
        app.simpleEditor.updateButtons();
      });
    }
  };

})();
