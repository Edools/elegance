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

    $(document).on("forum_feed_post_created", function (event, topicId) {
      var $postsCounter     = $("#js-topic-item-" + topicId + " .js-posts-count");
      var $postsCounterSize = $postsCounter.find('.size');
      var counter           = parseInt($postsCounterSize.html());

      $postsCounterSize.html(counter + 1);
      $postsCounter.removeClass('hidden');
      $("#js-topic-" + topicId + "-posts").removeClass('hidden');
      $("#js-topic-" + topicId + "-posts-list-panel").collapse('show');

      app.fixForumFeed();
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      app.fixForumFeed();
    });
  };

  app.fixForumFeed = function () {
    app.bindGlobal();
    app.bindBlazy();
  }
})();
