(function () {
    'use strict';

    var strength = function(pass) {
        var force = 0;

        // rules
        var lowerLetters = /[a-z]+/;
        var upperLetters = /[A-Z]+/;
        var numbers = /\d+/;
        var symbols = /.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;

        // check if password is > 6
        if ( pass.length >= 6 ) force++;

        // check lowercase and uppercase 
        if ( ( pass.match(lowerLetters) ) && ( pass.match(upperLetters) ) ) force++;

        // check numbers
        if ( pass.match(numbers) ) force++;

        // check symbols
        if ( pass.match(symbols) ) force++;

        // check if password is > 12
        if ( pass.length > 12 ) force++;

        return force;
    }
  
    app.bindStrongPassword = function () {
        var input = $('.strong--password'),
            form  = input.parents('form:first'),
            alert = form.find('.alert');

        $('.strong--password')
            .bind('change focus paste keyup', function () {
                if ( $(this).val() !== '' && (strength($(this).val()) >= 2) ) {
                    alert.hide();
                    form.find('input[type="submit"]').removeClass('disabled');
                } else {
                    alert.show();
                    form.find('input[type="submit"]').addClass('disabled');
                }
            })
            .bind('blur', function () {
                alert.hide();
                form.find('input[type="submit"]').removeClass('disabled');
            });
    }
  })();
  