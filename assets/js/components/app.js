(function () {
  'use strict';

  window.app = {
    bindGlobal: function () {
      FastClick.attach(document.body);

      $('.timeago').timeago();

      $(document).trigger('app:bind:global');
    },

    bindOpenOnLoad: function () {
      var toOpen = $('.js-open-on-load');
      if (toOpen.length > 0) {
        $.each(toOpen, function (i, elem) {
          window.open($(elem).attr('href'));
        });
      }

      $(document).trigger('app:bind:open_on_load');
    },

    bindTooltips: function () {
      $("[data-toggle='tooltip']")
      .tooltip("destroy")
      .tooltip();

      $(document).trigger('app:bind:tooltips');
    },

    checkFormValidity: function (event) {
      var form = event.currentTarget;
      var submitButton = $(form).find('button[type="submit"]');

      if (form.checkValidity()) {
        submitButton.removeAttr('disabled');
      } else {
        submitButton.attr('disabled', 'disabled');
      }

      $(document).trigger('app:bind:check_form_validity');
    },

    requirementsExists: function (lessonProgress, cb, cbNotExists) {
      var requirementsElements = $('.lesson-list-panel [data-requirements]').filter(function (index, item) {
        return $(item).data('requirements').length > 0;
      });

      var requirementsUnified = requirementsElements.map(function(idx, item) {
        return {
          item: $(item),
          requirements: $(item).data('requirements')
        }
      }).toArray();

      /* aqui provavelmente vai dar problema quando os requisitos não forem linear ou tiver mais de um.
         ( porque não sei se find, faz o match exato nessa parte [{ content_id: lessonProgress.lesson_id}] ou se busca apenas fragmento). */
      var exists = _.find(requirementsUnified, { requirements: [{ content_id: lessonProgress.lesson_id}] });

      if (exists) {
        var $item = exists.item;

        if (Object.keys(exists || {}).length === 0) {
          if (cbNotExists) {
            return cbNotExists($item, null);
          }
        } else {
          if (cb) {
            return cb($item, lessonProgress.lesson_id);
          }
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

    init: function () {
      app.pagarme.init();

      app.bindGlobal();
      app.bindBlazy();
      app.bindOpenOnLoad();
      app.bindMasks();
      app.bindTooltips();
      app.bindReadMore();
      app.bindDatepicker();
      app.bindFixOnScroll();
      app.ckeditor.bindCkeditor();
      app.bindCheckout();
      app.lessonList.init();
      app.bindExamQuestionForm();
      app.changeTimeZone();
      app.followBind();
      app.lessonPage();
      app.bindPostsForm();

      $(document).on('app:bind:ckeditor_submit', app.bindCollaborativeDiscussion);
    }
  }
})();
