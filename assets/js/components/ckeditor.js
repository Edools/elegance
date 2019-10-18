(function () {
  'use strict';

  app.ckeditor = {
    bindCkeditor: function () {
      var src = '//cdn.edools.com/libs/ckeditor/4.5.10/ckeditor.js';

      if ($('.js-ckeditor').length) {
        loadAsset('window.CKEDITOR', src, function () {
          $('.js-ckeditor').each(function (index, ckeditorObj) {
            if (!$('#cke_' + ckeditorObj.id).length) {
              var config = app.ckeditor.buildConfiguration(ckeditorObj);
              config.placeholder = ckeditorObj.placeholder; // TODO: fix it

              CKEDITOR.replace(ckeditorObj.id, config);
            }
          });

          app.ckeditor.bindCkeditorSubmit();
          $(document).trigger('app:bind:ckeditor');
        });
      }
    },

    buildConfiguration: function (ckeditorObj) {
      var uploadImage = $(ckeditorObj).data('upload-image');
      var uploadUrl = '/files/full_upload';
      var config = {
        language: 'pt-br',
        skin: 'moono',
        extraPlugins: 'uploadimage'
      };

      if (uploadImage) {
        var params =  $.param({
          school_id: $(ckeditorObj).data('upload-school-id'),
          type: $(ckeditorObj).data('upload-type'),
          id: $(ckeditorObj).data('upload-id')
        })

        config.imageUploadUrl = uploadUrl;
        config.filebrowserImageUploadUrl = uploadUrl;
      }

      return config;
    },

    bindCkeditorSubmit: function () {
      $.each($('.js-ckeditor'), function (index, editor) {
        var $editor = $(editor);
        var $form = $editor.parents('form');
        var editorId = $editor.attr('id');
        var hasCaptcha = $form.find('.js-recaptcha').size();

        if ($form) {
          var $submitButton = $form.find('button[type="submit"]');
          var editor = CKEDITOR.instances[editorId];

          app.ckeditor.buidNotifications(editor);

          editor.on('change', function () {
            if (this.getData().length && !hasCaptcha) {
              $submitButton.attr('disabled', false);
            } else {
              $submitButton.attr('disabled', true);
            }
          });
        }
      });

      $(document).trigger('app:bind:ckeditor_submit');
    },

    buidNotifications: function (editor) {
      var cancelNotification = function (evt) {
        if (evt.data.notification.override !== true) {
          evt.cancel();
        }
      }

      editor.on('notificationShow', cancelNotification);
      editor.on('notificationUpdate', cancelNotification);

      editor.on( 'fileUploadRequest', function() {
        editor.notification = new CKEDITOR.plugins.notification(editor, {
          message: editor.lang.uploadwidget.uploadOne.replace( '({percentage}%)', '' ),
          type: 'progress',
          override: true
        });

        editor.notification.show();
      });

      editor.on( 'fileUploadResponse', function() {
        editor.notification.update( {
          message: editor.lang.uploadwidget.doneOne,
          type: 'success'
        });
      });
    }
  }
})();
