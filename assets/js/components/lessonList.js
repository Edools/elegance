(function () {
  'use strict';

  app.lessonList = {
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

          if (app.lessonList.getModuleIndex($el) == 1) {
            gotTop = true;
          }
        });

      parentModules = parentModules.filter(function (module, i) {
        return i == 0 || app.lessonList.getModuleIndex($(module)) < (app.lessonList.getModuleIndex($(el)) - 1);
      });

      parentModules = parentModules.reverse();

      $(parentModules).each(function (i, el) {
        app.lessonList.toggleChildren(el, 'expand');
      });
    },

    toggleChildren: function (module, mode, cb) {
      if (module.length <= 0) return;

      var $module = $(module);
      var sub = app.lessonList.getModuleIndex($module);

      var $children = $module
        .nextUntil('.sub-' + sub)
        .filter(function () {
          return app.lessonList.getModuleIndex($(this)) == app.lessonList.getModuleIndex($module) + 1;
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
        app.lessonList.toggleChildren(el, 'collapse');
      })

      if (cb) {
        cb();
      }
    },

    init: function () {
      var $courseContent = $('.course-content');
      if ($courseContent.length <= 0) return;

      // Expand first item
      var $firstModule = $courseContent.find('.module.sub-1').first();
      app.lessonList.toggleChildren($firstModule, 'expand');

      $(document).on('page:change', function () {
        $courseContent.find('.module.expanded').each(function (i, m) {
          app.lessonList.toggleChildren($(m), 'collapse', function () {
            app.lessonList.toggleChildren($(m), 'expand');
          });
        })
      });

      $courseContent
        .off("click")
        .on('click', '.module', function () {
          if ($(this).hasClass('expanded')) {
            app.lessonList.toggleChildren($(this), 'collapse');
          } else {
            app.lessonList.toggleChildren($(this), 'expand');
          }
        });
    }
  };

})();
