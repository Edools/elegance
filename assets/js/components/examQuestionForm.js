(function () {
  'use strict';

  app.bindExamQuestionForm = function () {
    $(document).on('click', '#js-remake-exam', function () {
      $('#answers-container').addClass('hide');
      $('#form-container').removeClass('hide');
    });

    $(document).on('click', '#js-clean-associative-options', function (e) {
      $('.js-associative-select option:selected').removeAttr('selected')
    });

    $(document).on('change', '.js-associative-select', function (e) {
      var optionIndex = $(this).data('option-index');
      var assertionId = $(this).find('option:selected').data('first-assertion-id');

      $('.js-associate-assertion[data-option-index="'+optionIndex+'"]').val(assertionId);
    });

    // bind all form's inputs
    $(document).on('change', '#exam_answer_form', app.checkFormValidity);
    // bind all form's textareas for all types of typing
    $(document).on('input propertychange', '#exam_answer_form', app.checkFormValidity);

    $(document).trigger('app:bind:bind_exam_question_form');
  };
})();
