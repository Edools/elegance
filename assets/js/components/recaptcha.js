(function () {
  'use strict';

  window.onLoadRecaptcha = function () {
    app.bindRecaptcha();
  };

  app.bindRecaptcha = function () {
    var $recaptcha = $('.js-recaptcha');

    if (!$recaptcha.length || typeof grecaptcha === 'undefined' || !grecaptcha.hasOwnProperty('render')) return;

    $recaptcha.each(function (i, el) {
      const $el = $(el);
      const sitekey = $el.data('sitekey');
      const elId = $el.attr('id');
      const disableButton = $el.data('disable-button') === true;
      const buttonSelector = $el.data('button-selector');

      const $form = $el.parents('form');
      const $formButton = buttonSelector ? $form.find(buttonSelector) : $form.find('button[type="submit"], input[type="submit"]');

      if (disableButton) {
        $formButton.prop('disabled', true);
      }

      grecaptcha.render(elId, {
        'sitekey': sitekey,
        'callback': function () {
          if (disableButton) {
            $formButton.prop('disabled', false);
          }
        }
      });
    });
  };
})();
