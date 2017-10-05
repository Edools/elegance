(function () {
  'use strict';

  window.onLoadRecaptcha = function () {
    app.bindRecaptcha();
  };

  app.bindRecaptcha = function () {
    if (typeof grecaptcha === 'undefined') return;

    $('.js-recaptcha').each(function (i, el) {
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
