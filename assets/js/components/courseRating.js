(function () {
  'use strict';

  app.bindCourseRating = function () {
    $(document).on("rate-course", function (event, courseId) {
      $('#js-rating-course-'+courseId+'-modal').modal();
    });

    $(document).on("course-rating-created", function (event, courseId) {
      $('#js-rating-course-'+courseId+'-modal').modal('hide');
    });
  };
})();
