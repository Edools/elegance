(function () {
  'use strict';

  app.bindPostsForm = function () {
    $(document).on('click', '.js-post-edit', function () {
      var post = $(this).parents('.js-post');

      post.find('.js-post-body').addClass('hidden');
      post.find('.js-post-form').removeClass('hidden');
    });

    $(document).on('click', '.js-post-cancel', function (e) {
      var post = $(this).parents('.js-post');

      post.find('.js-post-body').removeClass('hidden');
      post.find('.js-post-form').addClass('hidden');
    });

    $(document).trigger('app:bind:bind_posts_form');
  };
})();
