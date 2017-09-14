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
        }
    });

    $(document).on("school/forum/sections/index", function () {
      app.fixForumFeed();
    });

    $(document).on("school/forum/topics/index", function () {
      app.fixForumFeed();
    });

    $(document).on("school/forum/posts/index", function () {
      app.fixForumFeed();
    });
  };

  app.fixForumFeed = function () {
    app.bindGlobal();
    app.bindBlazy();
    app.ckeditor.bindCkeditor();
  }
})();
