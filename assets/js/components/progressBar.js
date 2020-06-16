(function () {
  'use strict';

  app.progressBar = {
    resize: function () {
      $(window).on('load scroll resize', function (e) {
        $('.progress-bar-component').each(function () {
          var width = $(this).width();
          $(this).find('.percent-front').css({
            width: width,
            display: 'block'
          })
        })
      })
    }
  }

})();
