(function () {
  'use strict';

  app.bindDatepicker = function () {
    // TODO: Handle i18n
    $.fn.datepicker.defaults.language = 'pt-BR';

    $('.datepicker').each(function (i, el) {
      var $el = $(el);
      var $hidden = $('<input type="hidden" />').insertBefore($el.parent());
      var frontDate = moment($el.val()).utc().format('DD/MM/YYYY');
      var serverDate = moment($el.val()).utc().format('YYYY-MM-DD');
      serverDate = (serverDate === 'Invalid date') ? null : serverDate;

      $hidden.attr('id', $el.attr('id'));
      $hidden.attr('name', $el.attr('name'));
      $hidden.attr('value', serverDate);

      $el.removeAttr('id');
      $el.removeAttr('name');

      if ($el.val() !== "") {
        $el.val(frontDate);
      }

      $(el).datepicker()
        .on('change', function () {
          var date = moment($el.val(), 'DD/MM/YYYY').utc().format('YYYY-MM-DD');
          date = (date === 'Invalid date') ? null : date;
          $hidden.val(date);
        });
    });

    $(document).trigger('app:bind:datepicker');
  };

})();
