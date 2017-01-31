(function () {
  'use strict';

  app.Lesson = function () {

    var $player = $('#js-course-tree-ajax');
    var lessonProgress = $player.data('lesson-progress');

    $(document).trigger('current-lesson', {
      progress: lessonProgress
    });
  };
})();
