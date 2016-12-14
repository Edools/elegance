(function () {
  'use strict';

  app.bindFixOnScroll = function () {
    if (window.innerWidth < 992) return;

    $('.js-fix-on-scroll').each(function (i, el) {
      var $el = $(el);
      $el.wrap('<div class="js-fix-scroll-wrapper"/>');
      var $wrapper = $el.parent('.js-fix-scroll-wrapper');

      var offset = $el.offset();
      var size = {
        width: $el.outerWidth(),
        height: $el.outerHeight()
      };

      $wrapper.width(size.width);
      $wrapper.height(size.height);

      $(document).on('scroll', function (e) {
        var scrollTop = $(document).scrollTop();

        if (scrollTop >= offset.top) {
          if ($el.css('position') === 'fixed') return;

          $el.addClass('scroll');
          $el.css({
            position: 'fixed',
            left: offset.left,
            top: 0,
            width: size.width,
            height: size.height,
            'z-index': '10000'
          });
        } else {
          if ($el.css('position') === 'static') return;

          $el.removeClass('scroll');
          $el.css({
            position: 'static',
            left: 'auto',
            top: 'auto',
            width: 'auto',
            height: 'auto'
          });
        }
      })

    });
  }
})();
