(function () {
  'use strict';

  app.followBind = function () {
    $(document).on({
        mouseenter: function(){
          $(this).addClass('hidden');
          $('#js-unfollow').removeClass('hidden');
        }
    }, '#js-following');

    $(document).on({
        mouseleave: function(){
          $('#js-following').removeClass('hidden');
          $(this).addClass('hidden');
        }
    }, '#js-unfollow');
  };
})();
