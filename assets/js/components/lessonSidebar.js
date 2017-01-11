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

      var $courseContent = $('.course-content');
      if ($courseContent.length <= 0) {
        $(document).trigger('app:bind:lesson_sidebar');
        return;
      }

      // Expand first item
      var $firstModule = $courseContent.find('.module.sub-1').first();
      app.lessonSidebar.toggleChildren($firstModule, 'expand');

      $(document).on('page:change', function () {
        $courseContent.find('.module.expanded').each(function (i, m) {
          app.lessonSidebar.toggleChildren($(m), 'collapse', function () {
            app.lessonSidebar.toggleChildren($(m), 'expand');
          });
        })
      });

      $courseContent
        .off("click")
        .on('click', '.module', function () {
          if ($(this).hasClass('expanded')) {
            app.lessonSidebar.toggleChildren($(this), 'collapse');
          } else {
            app.lessonSidebar.toggleChildren($(this), 'expand');
          }
        });

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
      app.lessonSidebar.expandParentModule(app.lessonSidebar.currentLesson());

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

      app.lessonSidebar.expandParentModule($targetLesson);
      $targetLesson.find('a')[0].click();
    },

    prevLesson: function () {
      app.lessonSidebar.changeLesson('prev');
    },

    nextLesson: function () {
      app.lessonSidebar.changeLesson('next');
    },

    getModuleIndex: function (el) {
      var sub = null;
      $(el.attr('class').split(' '))
        .each(function (i, x) {
          if (x.indexOf('sub-') > -1) {
            sub = parseInt(x.replace('sub-', ''));
          }
        });

      return sub;
    },

    expandParentModule: function (el) {
      var parentModules = [];

      var gotTop = false;
      $(el).prevAll('.module')
        .each(function (i, el) {
          var $el = $(el);

          if (!gotTop) {
            parentModules.push($el);
          }

          if (app.lessonSidebar.getModuleIndex($el) == 1) {
            gotTop = true;
          }
        });

      parentModules = parentModules.filter(function (module, i) {
        return i == 0 || app.lessonSidebar.getModuleIndex($(module)) < (app.lessonSidebar.getModuleIndex($(el)) - 1);
      });

      parentModules = parentModules.reverse();

      $(parentModules).each(function (i, el) {
        app.lessonSidebar.toggleChildren(el, 'expand');
      });
    },

    toggleChildren: function (module, mode, cb) {
      if (module.length <= 0) return;

      var $module = $(module);
      var sub = app.lessonSidebar.getModuleIndex($module);

      var $children = $module
        .nextUntil('.sub-' + sub)
        .filter(function () {
          return app.lessonSidebar.getModuleIndex($(this)) == app.lessonSidebar.getModuleIndex($module) + 1;
        });

      var $childModules = $children.filter(function () {
        return $(this).hasClass('module');
      });

      if (mode == 'expand') {
        $module.addClass('expanded');
        $children.removeClass('hidden');

      } else if (mode == 'collapse') {
        $module.removeClass('expanded');
        $children.addClass('hidden');
      }

      $childModules.each(function (i, el) {
        app.lessonSidebar.toggleChildren(el, 'collapse');
      })

      if (cb) {
        cb();
      }
    }
  };

})();
