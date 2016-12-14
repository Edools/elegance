(function () {
  'use strict';

  app.changeTimeZone = function () {
    $('.js-to-client-timezone').each(function (i, el) {
      var $el = $(el);
      var format = $el.data('format');
      var zone = moment.tz.guess();
      var time = $el.data('timezone');

      $el.html(moment.tz(time, zone).format(format));
    });

    $(document).trigger('app:change:timezone');
  };

  // TODO: FIXME: Essa chamada é para funcionar no primeiro load. Não deveria
  // ser assim, parece ser algum erro com a inserção de cod no tema
  app.changeTimeZone();
})();
