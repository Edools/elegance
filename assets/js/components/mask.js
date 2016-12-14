(function () {
  'use strict';

  app.bindMasks = function () {
    var phoneMaskBehavior = function (val) {
      return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    };

    var phoneMaskOptions = {
      onKeyPress: function (val, e, field, options) {
        field.mask(phoneMaskBehavior.apply({}, arguments), options);
      }
    };

    $('#user-phone').mask(phoneMaskBehavior, phoneMaskOptions);
    $('#user-cpf').mask('999.999.999-99');
    $('#user-cep').mask('99.999-999');

    $(document).trigger('app:bind:masks');
  };
})();
