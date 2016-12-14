(function () {
  $(document).on('page:load', function () {
    app.init();
  });

  $(document).on('page:partial-load', function () {
    app.bindBlazy();
  });

  $(document).ready(function () {
    app.init();
  });
})();
