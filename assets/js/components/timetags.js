(function () {
  'use strict';

  app.timeTags = function () {
    var $edoolsPlayerContainer = $('.js-edools-player');
    if ($edoolsPlayerContainer.length <= 0) {
      return;
    }

    var edoolsPlayer = $edoolsPlayerContainer[0].edoolsPlayer;

    $('.js-timetags .list-group-item').on('click', function (e) {
      e.preventDefault();

      if ($edoolsPlayerContainer.length > 0) {
        var time = $(this).data('time');

        edoolsPlayer.setTime(time);
      }
    })
  };
})();
