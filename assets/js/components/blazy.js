(function () {
  'use strict';

  app.bindBlazy = function (e) {
    new Blazy();

    $(document).trigger('app:bind:blazy');
  };
})();
