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
      app.lessonSidebarAjax.init();
      app.bindExamQuestionForm();
      app.changeTimeZone();
      app.followBind();
      app.bindPostsForm();

      $(document).on('app:bind:ckeditor_submit', app.bindCollaborativeDiscussion);
    }
  }
})();
