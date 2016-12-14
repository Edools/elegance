(function () {
  'use strict';

  app.bindCollaborativeDiscussion = function() {
    $(document).on('click', '#collaborative-discussion .js-edit-button' ,function () {
      var commentId = $(this).data('comment-id');
      var $comment = $('#js-comment-' + commentId);

      $comment.find('.js-show-comment').addClass('hide');
      $comment.find('.js-edit-container').removeClass('hide');
    });

    $(document).on('click', '#collaborative-discussion .js-cancel-button' ,function () {
      var commentId = $(this).data('comment-id');
      var $comment = $('#js-comment-' + commentId);

      $comment.find('.js-show-comment').removeClass('hide');
      $comment.find('.js-edit-container').addClass('hide');
    });


    $(document).trigger('app:bind:collaborative_discussion');
  };
})();
