(function () {
  'use strict';

  app.bindReadMore = function () {
    $('[role="readmore"]').each(function (i, el) {
      var speed = $(el).data('speed') || 100;
      var collapsedHeight = $(el).data('collapsed-height') || 200;
      var moreText = $(el).data('more-text') || 'Leia Mais';
      var lessText = $(el).data('less-text') || 'Fechar';

      var currHeight = $(el).innerHeight();
      var showLink = currHeight <= collapsedHeight;

      $(el).readmore({
        speed: speed,
        collapsedHeight: collapsedHeight,
        moreLink: '<a href="#" class="' + (showLink ? 'hidden' : 'readmore-link') + '">' + moreText + '</a>',
        lessLink: '<a href="#" class="' + (showLink ? 'hidden' : 'readmore-link') + '">' + lessText + '</a>'
      })
    });
  }
})();
