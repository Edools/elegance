(function () {
  'use strict';

  app.bindForumFeed = function () {
    $(document).on("click", ".js-collapse-toggle-text", function (event) {
        event.preventDefault();
        var $this          = $(this);
        var openText       = $this.data('open-text');
        var closeText      = $this.data('close-text');
        var $accordionBody = $($this.attr('href'));

        if ($accordionBody.hasClass('in')) {
          $accordionBody.collapse('hide');
          $this.html(closeText);
        } else {
          $accordionBody.collapse('show');
          $this.html(openText);
          app.bindBlazy();
        }
    });

    $(document).on("fix_forum_feed", function () {
      app.fixForumFeed();
    });
  };

  app.fixForumFeed = function () {
    app.bindGlobal();
    app.bindBlazy();
  }
})();
