(function () {
  'use strict';

  app.bindCheckout = function () {
    $('#js-terms-of-use-check').change(function () {
      if ($(this).is(":checked") === true) {
        $('.cta-checkout-cart').removeClass('disabled');
      } else {
        $('.cta-checkout-cart').addClass('disabled');
      }
    });

    $(document).trigger('app:bind:checkout');
  };
})();
