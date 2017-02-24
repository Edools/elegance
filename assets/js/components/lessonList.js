(function () {
  'use strict';

  app.lessonList = {
    init: function () {
      var self = this;

      self.isActive = self.courseTree().data('is-active');
      self.course = self.courseTree().data('course');
      self.enrollment = self.courseTree().data('enrollment');
      self.courseContent = self.courseTree().data('course-content');
      self.userType = self.courseTree().data('user-type');
      self.lessonActions = self.courseTree().data('lesson-actions');
      self.downloadAction = self.courseTree().data('download-action');
      self.currentLessonId = parseInt(self.courseTree().data('current-lesson-id'));
      self.apiKey = self.courseTree().data('api-key');

      self.translations = {};
      self.translations['lesson.release_at'] = self.courseTree().data('translation-release-at');
      self.translations['lesson.release_after'] = self.courseTree().data('translation-release-after');
      self.translations['product.course_content.views'] = self.courseTree().data('translation-course_content-views');

      if (!self.isActive) {
        self.bindClicks();
        self.handleLessons();
        self.loadTopModules();

        $(document).trigger('app:bind:lesson_sidebar');

        $(document).on('lesson-completed', function (event, lessonProgress) {
          var $mediaControls = $('.btn-next-lesson');
          var enrollmentId = lessonProgress.data.enrollment_id;

          if ($mediaControls.size() > 0) {
            $mediaControls.removeClass('disabled');
          }

          app.lessonList.requirementsExists(lessonProgress.data, function ($item, content_id) {
            if (content_id) {
              app.checkLessonCompleted(enrollmentId, content_id, function (completed) {
                if (completed) {
                  $item.removeClass('disabled');
                }
              });
            }
          });
        });
      }
    },

    // Props

    courseTree: function () {
      return $('.course-content #js-course-tree-ajax');
    },

    lazyLoadButtons: function () {
      return $('.course-content #js-course-content-more-link, .course-content #js-course-content-prev-link');
    },

    lessons: function () {
      return this.courseTree().find('.js-content');
    },

    currentLesson: function () {
      return $(this.courseTree().find('.js-content.active')[0]);
    },

    toggleButton: function () {
      return $('.lesson-list-toggle .btn');
    },

    lessonListPanel: function () {
      return $('.lesson-list-panel');
    },

    requirementsExists: function (lessonProgress, cb, cbNotExists) {
      if(!lessonProgress) {
        return false;
      }

      var requirementsElements = $('.lesson-list-panel [data-requirements]').filter(function (index, item) {
        return $(item).data('requirements').length > 0;
      });

      var requirementsUnified = requirementsElements.map(function(idx, item) {
        return {
          item: $(item),
          requirements: $(item).data('requirements')
        }
      }).toArray();

      var exists = _.find(requirementsUnified, { requirements: [{ content_id: lessonProgress.lesson_id}] });

      if (exists) {
        var $item = exists.item;
        if (cb) {
          return cb($item, lessonProgress.lesson_id);
        }
      } else {
        if (cbNotExists) {
          return cbNotExists();
        }
      }
    },

    checkLessonCompleted: function (enrollmentId, id, cb) {
      var self = this;
      var completed = false;
      var apiKey = $('.course-content #js-course-tree-ajax').data('api-key');

      $.ajax({
        url: window.CORE_HOST + '/enrollments/' + enrollmentId + '/lessons_progresses?lesson_id=' + id,
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + apiKey
        },
      }).success(function (data) {
        completed = data.lessons_progresses[0].completed;

        cb(completed);
      });
    },

    // Actions

    bindClicks: function () {
      var self = this;

      self.lessons().find('a').on('click', function (e) {
        e.preventDefault();
        app.lessonList.changeLesson(null, $(this).parents('.js-content'));
      });

      self.courseTree().on('click', '.module', function (e) {
        if (!$(e.target).hasClass('module') && !$(e.target).parent().hasClass('module')) {
          return;
        }

        e.stopPropagation();

        self.loadChildren($(this));
      });

      self.courseTree().data('is-active', true);

      self.toggleButton().on('click', this.toggleSidebar);
    },

    getLessonIcon: function (lesson) {
      var lessonIcon = '';

      if (lesson.type == 'ExamLesson' && lesson.activity) {
        switch (lesson.activity.type) {
          case 'Quiz': {
            lessonIcon = 'icon-puzzle';
            break;
          }
          case 'FileUpload': {
            lessonIcon = 'icon-arrow-up-circle';
            break;
          }
          case 'CollaborativeDiscussion': {
            lessonIcon = 'icon-people';
            break;
          }
          default: {
            lessonIcon = 'icon-puzzle'
          }
        }
      } else if (lesson.media) {
        switch (lesson.media) {
          case 'Video': {
            lessonIcon = 'icon-camrecorder';
            break;
          }
          case 'Audio': {
            lessonIcon = 'icon-microphone';
            break;
          }
          case 'Slide': {
            lessonIcon = 'icon-chart';
            break;
          }
          case 'Document': {
            lessonIcon = 'icon-doc';
            break;
          }
          case 'Image': {
            lessonIcon = 'icon-picture';
            break;
          }
          case 'Text': {
            lessonIcon = 'icon-doc';
            break;
          }
          case 'LiveStream': {
            lessonIcon = 'icon-control-play';
            break;
          }
          case 'VideoSlide': {
            lessonIcon = 'icon-film';
            break;
          }
          case 'ScormPackage': {
            lessonIcon = 'icon-layers';
            break;
          }
          case 'Html': {
            lessonIcon = 'icon-doc';
            break;
          }
          default: {
            lessonIcon = 'icon-camrecorder';
          }

        }
      }

      return lessonIcon;
    },

    getContentPath: function (content) {
      var self = this;

      var enrollmentId = self.enrollment.id;
      var courseId = self.course.id;

      var path = enrollmentId ? '/enrollments/' + enrollmentId : '/admin_view';
      path = path + '/courses/' + courseId + '/course_contents/' + content.id;

      return path;
    },

    getContentDownloadPath: function (content) {
      var self = this;
      return self.getContentPath(content) + '/download';
    },

    checkLessonAvailability: function (lesson) {
      var releaseAt = lesson.release_at;
      var releaseAfter = lesson.release_after;

      if (!releaseAt && !releaseAfter) {
        return true;
      }

      var enrollmentActivatedAt = moment(this.enrollment.activated_at);

      var releaseTime = releaseAt ? moment(releaseAt) : enrollmentActivatedAt.add(releaseAfter, 'days');

      return moment() > releaseTime;
    },

    fetchModules: function ($parent) {
      var self = this;
      var id = $parent.data('id');
      var level = $parent.data('level');
      var $list = $parent.find('.list-group').first();

      return $.ajax({
        url: window.CORE_HOST + '/course_modules/' + id,
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        },
        success: function (res) {
          var modules = _.sortBy(res.course_modules, 'order');

          modules = _.filter(modules, function (m) {
            var module = _.find(self.allModules, {id: m.id});
            return module.available != false && (module.course_content_ids.length > 0 || module.course_modules.length > 0);
          });

          var $modules = _.map(modules, function (module) {
            return $(
              '<li class="list-group-item module" ' +
              'data-id="' + module.id + '"' +
              'data-level="' + (level + 1) + '">' +
              '<i class="icon icon-arrow-right"></i>' +
              '<span>' + module.name + '</span>' +
              '<i class="busy busy-xs"></i>' +
              '</li>');
          });

          $list.append($modules);
        }
      })
    },

    fetchChildren: function ($parent) {
      var self = this;
      var id = $parent.data('id');
      var level = $parent.data('level');
      var $list = $parent.find('.list-group').first();

      return $.ajax({
        url: window.CORE_HOST + '/course_modules/' + id + '/course_contents',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        },
        success: function (res) {
          var courseContents = _.filter(res.course_contents, function (lesson) {
            return lesson.available != false;
          });

          courseContents = _.sortBy(courseContents, 'order');

          if (self.enrollment) {
            courseContents = _.map(courseContents, function (content) {
              content.completed = self.enrollment.lessons_info && self.enrollment.lessons_info.completed.indexOf(content.lesson.id) > -1;
              return content;
            });
          }

          var $courseContents = _.map(courseContents, function (content) {
              var active = (self.currentLessonId == content.lesson.id ? 'active js' : '');
              var lesson = content.lesson;
              var lessonIcon = self.getLessonIcon(lesson);
              var hideInProgressIcon = 'hide';
              var hideCompletedIcon = 'hide';
              var lessonReleased = null;
              var releaseType = null;
              var releaseDate = null;
              var progress = null;
              var requirements = content.requirements;
              var available = true;
              var requirements_ids = requirements.map(function (item) {
                return item.content_id;
              });

              if (self.enrollment) {
                lessonReleased = self.checkLessonAvailability(lesson);

                if (self.enrollment.lessons_info && self.enrollment.lessons_info.completed.indexOf(lesson.id) > -1) {
                  hideInProgressIcon = 'hide';
                  hideCompletedIcon = null;
                } else {
                  if (self.enrollment.lessons_info && self.enrollment.lessons_info.in_progress.indexOf(lesson.id) > -1) {
                    hideInProgressIcon = null;
                    hideCompletedIcon = 'hide';
                  } else {
                    hideInProgressIcon = 'hide';
                    hideCompletedIcon = 'hide';
                  }
                }

                if (lesson.release_at) {
                  releaseType = 'release_at';
                  releaseDate = lesson.release_at;
                } else if (lesson.release_after) {
                  releaseType = 'release_after';
                  releaseDate = moment(self.enrollment.activated_at).add(lesson.release_after, 'days');
                }

                if (self.lessonActions) {
                  progress = _.find(self.enrollment.lessons_progresses, {lesson_id: lesson.id});
                }
              }

              if (self.enrollment) {
                _.each(requirements_ids, function (id) {
                  var exists = _.find(courseContents, {content_id: id, completed: true});


                  if (!exists) {
                    available = false;
                  }
                });
              }

              var html = '<li class="list-group-item content-lesson js-content list-group-item lesson module-item ' + active + (!available ? ' disabled' : '') + '" ' +
                'id="content-' + content.id + '" ' +
                'data-requirements=\'' + JSON.stringify(requirements) + '\'' +
                'data-id="' + content.lesson.id + '"' +
                'data-level="1">' +
                '<div id="lesson-' + lesson.id + '" class="js-lesson content-lesson ' + active + (!lessonReleased ? ' not-released' : '') + '" data-lesson-id="' + lesson.id + '">' +
                '<div class="class-info">' +

                '<div class="left"><i class="' + lessonIcon + '"></i></div>' +

                '<div class="center">' +
                (self.lessonActions && lessonReleased ?
                  '<a class="lesson-title" href="' + self.getContentPath(content) + '"><span>' + lesson.title + '</span></a>' :
                  '<span class="lesson-title"><span class="disabled">' + lesson.title + '</span></span>') +
                '</div>' +

                '<div class="right">' +
                '<span class="progress-icon js-progress-icons">' +
                '<i class="icon-check js-completed-icon ' + hideCompletedIcon + '"></i>' +
                '<i class="icon-clock js-in-progress-icon ' + hideInProgressIcon + '"></i>' +
                '</span>';

              if (self.lessonActions) {
                if (progress && progress.views <= self.enrollment.max_attendance_length && self.enrollment.max_attendance_type == 'attempts') {
                  html += '<span class="lesson-views attempt js-attendance badge" title="' + self.translations['product.course_content.views'] + '" data-tooltip-placement="left" data-toggle="tooltip">' +
                    '<span>' + progress.views + '/' + self.enrollment.max_attendance_length + '</span>' +
                    '</span>';
                }

                if (!lessonReleased) {
                  var zone = moment.tz.guess();
                  html += '<span class="release-date badge">' + self.translations['lesson.' + releaseType] + '<span> ' + moment.tz(releaseDate, zone).format('DD/MM/YYYY') + '</span>' + '</span>';
                }

                if (self.downloadAction && content.downloadable) {
                  html += '<a class="download-link" href="' + self.getContentDownloadPath(content) + '" data-no-turbolink>' +
                    '<i class="icon-cloud-download"></i>' +
                    '</a>';
                }
              }

              html += '</div>' +
                '</div>' +
                '</li>';

              return $(html);
            }
          );

          $list.append($courseContents);
          self.checkNextButtonUnlocked();

        }
      });
    },

    checkNextButtonUnlocked: function () {
      var lessonProgress = $('#js-course-tree-ajax').data('lesson-progress');

      app.lessonList.requirementsExists(lessonProgress, function ($item, content_id) {
        if (content_id && lessonProgress.hasOwnProperty('enrollment_id')) {
          app.lessonList.checkLessonCompleted(lessonProgress.enrollment_id, content_id, function (completed) {
            if (completed) {
              $('.btn-next-lesson').removeClass('disabled');
              $item.removeClass('disabled');
            }
          });
        }
      }, function () {
        $('.btn-next-lesson').removeClass('disabled');
      });
    },

    loadTopModules: function () {
      var self = this;

      if (!self.course) return;

      $.ajax({
        url: window.CORE_HOST + '/courses/' + self.course.id + '/course_modules',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        },
        success: function (res) {
          if (!res.course_modules || res.course_modules.length <= 0) return;

          self.allModules = res.course_modules;

          self.topModules = _.filter(res.course_modules, function (x) {
            return (x.parent_course_module == null && x.available != false) &&
              (x.course_content_ids.length > 0 || x.course_modules.length > 0);
          });

          self.topModules = _.sortBy(self.topModules, 'order');

          var $modules = _.map(self.topModules, function (module) {
            return $(
              '<li class="list-group-item module" ' +
              'data-id="' + module.id + '"' +
              'data-level="1">' +
              '<i class="icon icon-arrow-right"></i>' +
              '<span>' + module.name + '</span>' +
              '<i class="busy busy-xs"></i>' +
              '</li>');
          });

          self.courseTree().prev('.course-content-busy').fadeOut('fast', function () {
            self.courseTree().css('display', 'none');
            self.courseTree().html($modules);
            self.courseTree().fadeIn('fast');

            if (self.courseContent) {
              self.expandParentModules(self.courseContent.parent_modules_hash);
            }
          });
        }
      })
    },

    loadChildren: function (parent, cb) {
      var self = this;
      var $parent = $(parent);

      var id = $parent.data('id');
      var level = $parent.data('level');
      var $list = $parent.find('.list-group').first();

      if ($list.length <= 0) {
        $parent.find('.busy').css({opacity: 1});
        $list = $('<ul class="list-group" style="display: none;"></ul>');
        $list.appendTo($parent);

        $.when(self.fetchModules($parent), self.fetchChildren($parent))
          .then(function () {
            $parent.addClass('expanded');
            $parent.find('.busy').css({opacity: 0});

            $list.slideDown('fast');

            if (typeof cb == 'function') {
              cb();
            }
          });
      } else {
        if ($parent.hasClass('expanded')) {
          $parent.removeClass('expanded');
          $list.slideUp('fast');
        } else {
          $parent.addClass('expanded');
          $list.slideDown('fast');
        }

        if (typeof cb == 'function') {
          cb();
        }
      }
    },

    handleLessons: function () {
      $(document).on('page:load page:restore', function (e) {

        if (!e.originalEvent || !e.originalEvent.data || e.originalEvent.data.length == 0) return;

        var $html = $(e.originalEvent.data[0]);
        app.lessonList.lessons().each(function (i, el) {
          var $el = $(el);
          var $new = $html.find('#' + $el.attr('id'));
          $el.html($new.html());
        });
      })
    },

    changeLesson: function (direction, lesson) {
      var $targetLesson = $(lesson);

      if (direction == 'prev') {
        var $prev = app.lessonList
          .currentLesson()
          .prevAll('.js-content');

        if ($prev.length > 0 && $prev.find('a').length > 0)
          $targetLesson = $($prev[0]);
      } else if (direction == 'next') {
        var $next = app.lessonList
          .currentLesson()
          .nextAll('.js-content');

        if ($next.length > 0 && $next.find('a').length > 0)
          $targetLesson = $($next[0]);
      }

      $targetLesson.find('a')[0].click();
    },

    expandParentModules: function (parentModules) {
      var self = this;

      var modules = [];
      var loopModule = parentModules.course_module;
      modules.push(loopModule.id);

      while (loopModule.parent_module) {
        loopModule = loopModule.parent_module;
        modules.push(loopModule.id);
      }

      modules = modules.reverse();

      async.eachSeries(modules, function (moduleId, cb) {
        var $module = $('.module[data-id="' + moduleId + '"]');
        self.loadChildren($module, cb);
      });

    },

    toggleSidebar: function () {
      app.lessonList.toggleButton().toggleClass('active');
      app.lessonList.lessonListPanel().toggleClass('active');
    }
  };

})();
