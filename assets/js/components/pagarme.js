(function () {
  'use strict';

  app.pagarme = {
    buildCreditCard: function () {
      var creditCard = new PagarMe.creditCard();
      var expiration = $("#card-form #card-expiration").val().split('/');

      creditCard.cardExpirationMonth = parseInt(expiration[0]);
      creditCard.cardExpirationYear  = parseInt(expiration[1]);
      creditCard.cardHolderName      = $("#card-form #card-holder-name").val();
      creditCard.cardNumber          = $("#card-form #card-number").val();
      creditCard.cardCVV             = $("#card-form #card-cvc").val();

      return creditCard;
    },

    submitFormCreditCardHash: function (paymentForm) {
      var creditCard  = app.pagarme.buildCreditCard();
      var fieldErrors = creditCard.fieldErrors();
      var hasErrors   = false;
      for(var field in fieldErrors) { hasErrors = true; break; }

      console.log(1);
      window.creditCardTest = creditCard;

      if(hasErrors) {
        window.fieldErrors = fieldErrors;

        console.log(window.fieldErrors);
      } else {
        creditCard.generateHash(function(cardHash) {
          $('#card_hash').val(cardHash);

          paymentForm.get(0).submit();
        });
      }
    },

    init: function () {
      var src = 'https://assets.pagar.me/js/pagarme.min.js',
        paymentForm = $('#card-form'),
        pagarmeKey  = $("#pagarme").val();

      if (paymentForm.length && pagarmeKey) {
        loadAsset('PagarMe', src, function () {
          PagarMe.encryption_key = pagarmeKey;

          paymentForm.submit(function(event) {
            event.preventDefault();

            app.pagarme.submitFormCreditCardHash(paymentForm);
          });

          $(document).trigger('app:bind:pagarme');
        });
      }
    }
  }
})();
