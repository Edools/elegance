(function () {
  'use strict';

  app.Lesson = function () {
    var $player = $('.js-edools-player[data-course-content]');
    var lessonProgress = $player.data('lesson-progress');

    $(document).trigger('current-lesson', {
      progress: lessonProgress
    });
  };
})();
