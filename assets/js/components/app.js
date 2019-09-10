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
      $("body")
        .tooltip("destroy")
        .tooltip({
          selector: '[data-toggle="tooltip"]'
        });

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

    bindCepService() {
      $(document).on('cep-result', function(_event, result){
        if (result) {
          $('input[name="user[address_attributes][street]"]').val(result.street);
          $('input[name="user[address_attributes][city]"]').val(result.city);
          $('input[name="user[address_attributes][state]"]').val(result.state);
          $('input[name="user[address_attributes][district]"]').val(result.neighborhood);
          $('input[name="user[address_attributes][complement]"]').val(result.complement);
        }
      });
    },

    bindValidationCpf() {
      var $userCpf = $('#user-cpf');

      if ($userCpf.data('validate-cpf')) {
        $userCpf.on('keyup', function() {
          var $field = $(this);
          var $parents = $field.parent();
          var $validationMessage = $('<span />', {
            class: 'color-danger',
            text: 'O cpf preenchido é inválido.'
          });
          var $button = $field.parents('form').find('button[type="submit"], input[type="submit"]');
          var $validationMessagesList = $parents.find('.color-danger');
          var isValid = CPF.validate($field.val());

          if ($validationMessagesList.size() < 1 && !isValid && $field.val() !== '') {
            $field.after($validationMessage);

            $button.prop('disabled', true);
          }

          if (isValid || $field.val() === '') {
            $validationMessagesList.remove();

            $button.prop('disabled', false);
          }
        });
      }
    },

    init: function () {
      app.bindGlobal();
      app.bindRecaptcha();
      app.bindBlazy();
      app.bindOpenOnLoad();
      app.bindMasks();
      app.bindTooltips();
      app.bindReadMore();
      app.bindDatepicker();
      app.bindFixOnScroll();
      app.ckeditor.bindCkeditor();
      app.bindCheckout();
      app.bindForumFeed();
      app.bindCourseRating();
      app.deadpoolChat.bindDeadpool();
      app.lessonList.init();
      app.chat.init();
      app.studentDoubts.init();
      app.notepad.init();
      app.categoryList.init();
      app.bindExamQuestionForm();
      app.changeTimeZone();
      app.followBind();
      app.lessonPage();
      app.timeTags();
      app.bindPostsForm();
      app.accessibility();
      app.bindStrongPassword();
      app.bindValidationCpf();
      app.randomQuizStatistics();
      app.bindCepService();

      $(document).on('app:bind:ckeditor_submit', app.bindCollaborativeDiscussion);
    }
  }
})();
