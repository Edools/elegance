(function () {
  'use strict';

  app.lessonPage = function () {
    var REGEX_COLLABORATIVE_DISCUSSIONS = /\/collaborative_discussions\/([0-9]+)\/collaborative_comments/;
    var REGEX_EXAM_ANSWERS = /\/exam_answers/;

    var isCollaborativeDiscuttion = function (value) {
      return REGEX_COLLABORATIVE_DISCUSSIONS.test(value);
    };

    var isExamAnswer = function (value) {
      return REGEX_EXAM_ANSWERS.test(value);
    };

    $(document).ajaxSuccess(function (event, xhr, settings) {

      if (isCollaborativeDiscuttion(settings.url) || isExamAnswer(settings.url)) {

        var lessonProgress = $('#js-course-tree-ajax').data('lesson-progress');

        app.requirementsExists(lessonProgress, function ($item, content_id) {
          if (content_id && lessonProgress.hasOwnProperty('enrollment_id')) {
            app.checkLessonCompleted(lessonProgress.enrollment_id, content_id, function (completed) {
              if (completed) {
                $('.btn-next-lesson').removeClass('disabled');
                $item.removeClass('disabled');
              }
            });
          }
        }, function () {
          $('.btn-next-lesson').removeClass('disabled');
        });

      }
    });

  };
})();
