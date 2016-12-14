(function () {
  'use strict';

  app.ckeditor = {
    bindCkeditor: function () {
      var src = '//cdn.edools.com/libs/ckeditor/4.5.10/ckeditor.js';

      if ($('.js-ckeditor').length) {
        loadAsset('window.CKEDITOR', src, function () {
          var config = {
            language: 'pt-br',
            skin: 'bootstrapck'
          };

          $('.js-ckeditor').each(function (index, ckeditorObj) {
            if (!$('#cke_' + ckeditorObj.id).length) {
              config.placeholder = ckeditorObj.placeholder; // TODO: fix it

              CKEDITOR.replace(ckeditorObj.id, config);
            }
          });

          app.ckeditor.bindCkeditorSubmit();
          $(document).trigger('app:bind:ckeditor');
        });
      }
    },

    bindCkeditorSubmit: function () {
      $.each($('.js-ckeditor'), function (index, editor) {
        var $editor = $(editor);
        var $form = $editor.parents('form');
        var editorId = $editor.attr('id');

        if ($form) {
          var $submitButton = $form.find('button[type="submit"]');

          CKEDITOR.instances[editorId].on('change', function () {
            if (this.getData().length) {
              $submitButton.attr('disabled', false);
            } else {
              $submitButton.attr('disabled', true);
            }
          });
        }
      });

      $(document).trigger('app:bind:ckeditor_submit');
    }
  }
})();
