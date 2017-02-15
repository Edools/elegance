(function () {
  'use strict';

  app.bindExamQuestionForm = function () {
    $(document).on('click', '#js-remake-exam', function () {
      $('#answers-container').addClass('hide');
      $('#form-container').removeClass('hide');
    });

    $(document).on('click', '.js-clean-associative-options', function () {
      $(this).parents('.associative-question')
        .find('.js-associative-select option:selected')
        .removeAttr('selected')
    });

    $(document).on('change', '.js-associative-select', function () {
      var $question = $(this).parents('.associative-question');
      var optionIndex = $(this).data('option-index');
      var assertionId = $(this).find('option:selected').data('first-assertion-id');

      $question.find('.js-associate-assertion[data-option-index="' + optionIndex + '"]').val(assertionId);
    });

    // bind all form's inputs
    $(document).on('change', '#exam_answer_form', app.checkFormValidity);
    // bind all form's textareas for all types of typing
    $(document).on('input propertychange', '#exam_answer_form', app.checkFormValidity);

    $(document).ajaxSuccess(function(event, jqXHR, ajaxInfo, data) {
      if (ajaxInfo.url == "/exam_answers" && jqXHR.status == 200) {
        const lessonID = $('#js-media-player').data('lesson-id');
        $('.icon-check.js-completed-icon', `#lesson-${lessonID}`).removeClass('hide');
        $('.icon-clock.js-in-progress-icon', `#lesson-${lessonID}`).addClass('hide');
      }
    });

    $(document).trigger('app:bind:bind_exam_question_form');
  };
})();
