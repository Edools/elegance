(function () {
  'use strict';

  app.hotmart = {
    init: function () {
      var hotmartCheckoutLink = $('.hotmart-fb');

      if (hotmartCheckoutLink.length) {
        var imported = document.createElement('script');
        imported.src = 'https://static.hotmart.com/checkout/widget.min.js';

        document.head.appendChild(imported);
      }
    }
  }
})();
