(function () {
  'use strict';

  app.bindBlazy = function (e) {
    console.log(e);
    new Blazy();

    $(document).trigger('app:bind:blazy');
  };
})();
