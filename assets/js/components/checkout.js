(function () {
  'use strict';

  app.bindCheckout = function () {
    console.log(0);
    $('#js-terms-of-use-check').change(function () {
      if ($(this).is(":checked") === true) {
        $('.cta-checkout-cart').removeClass('disabled');
      } else {
        $('.cta-checkout-cart').addClass('disabled');
      }
    });

    $(document).trigger('app:bind:checkout');
  },

  app.bindItemQuantity = function () {
    console.log(1);
    $('.js-item-quantity').change(function () {
      console.log(2);
    });

    $(document).trigger('app:bind:item_quantity');
  };
})();
