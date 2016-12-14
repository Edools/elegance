(function () {
  'use strict';

  app.lessonSidebar = {
    init: function () {
      this.nextButton().on('click', this.nextLesson);
      this.prevButton().on('click', this.prevLesson);
      this.lessons().find('a').on('click', function (e) {
        e.preventDefault();
        app.lessonSidebar.changeLesson(null, $(this).parents('.js-content'));
      });
      this.lazyLoadButtons().on('click', app.lessonSidebar.resetTooltips);

      this.handleButtons();
      this.handleLessons();

      $(document).trigger('app:bind:lesson_sidebar');
    },

    lazyLoadButtons: function () {
      return $('#js-course-content-more-link, #js-course-content-prev-link');
    },

    prevButton: function () {
      return $('#js-lesson-content-player').find('.js-btn-prev');
    },

    nextButton: function () {
      return $('#js-lesson-content-player').find('.js-btn-next');
    },

    handleButtons: function () {
      var $next = this.currentLesson().nextAll('.js-content');
      var $prev = this.currentLesson().prevAll('.js-content');

      if ($next.length <= 0 || $next.find('a').length <= 0) {
        app.lessonSidebar
          .nextButton().attr('disabled', 'disabled');
      } else {
        app.lessonSidebar
          .nextButton().removeAttr('disabled');
      }

      if ($prev.length <= 0 || $prev.find('a').length <= 0) {
        app.lessonSidebar
          .prevButton().attr('disabled', 'disabled');
      } else {
        app.lessonSidebar
          .prevButton().removeAttr('disabled');
      }
    },

    handleLessons: function () {
      app.lessonList.expandParentModule(app.lessonSidebar.currentLesson());

      $(document).on('page:load page:restore', function (e) {

        if (!e.originalEvent.data || e.originalEvent.data.length == 0) return;

        var $html = $(e.originalEvent.data[0]);
        app.lessonSidebar.lessons().each(function (i, el) {
          var $el = $(el);
          var $new = $html.find('#' + $el.attr('id'));
          $el.html($new.html());
        });
      })
    },

    lessons: function () {
      return $('.lesson-page #js-course-tree').find('.js-content');
    },

    currentLesson: function () {
      return $($('.lesson-page #js-course-tree')
        .find('.js-content.active')[0]);
    },

    changeLesson: function (direction, lesson) {
      var $targetLesson = $(lesson);

      if (direction == 'prev') {
        var $prev = app.lessonSidebar
          .currentLesson()
          .prevAll('.js-content');

        if ($prev.length > 0 && $prev.find('a').length > 0)
          $targetLesson = $($prev[0]);
      } else if (direction == 'next') {
        var $next = app.lessonSidebar
          .currentLesson()
          .nextAll('.js-content');

        if ($next.length > 0 && $next.find('a').length > 0)
          $targetLesson = $($next[0]);
      }

      app.lessonList.expandParentModule($targetLesson);
      $targetLesson.find('a')[0].click();
    },

    prevLesson: function () {
      app.lessonSidebar.changeLesson('prev');
    },

    nextLesson: function () {
      app.lessonSidebar.changeLesson('next');
    }
  };
})();
