app.studentDoubts = {
  page: 1,

  doubtsContainer: function () {
    return $('#js-doubts-container');
  },

  form: function () {
    return $('#js-student-doubts-form');
  },

  expandButton: function () {
    return $('#js-expand-student-doubts-form');
  },

  hideButton: function () {
    return $('#js-hide-student-doubts-form');
  },

  loadMoreButton: function () {
    return $('#js-load-more-doubts');
  },

  loadDoubts: function (cb) {
    var self = this;

    $.ajax({
      url: window.location.pathname + '/student_doubts/page/' + self.page,
      method: 'GET',
      data: {
        per_page: 3
      },
      complete: function () {
        if (typeof cb == 'function') {
          cb();
        }
      }
    })
  },

  init: function () {
    var self = this;

    if (self.doubtsContainer().length <= 0) return;

    self.expandButton().on('click', function () {
      self.expandButton().hide();
      self.form().slideDown('fast');
    });

    self.hideButton().on('click', function () {
      self.form().slideUp('fast', function () {
        self.expandButton().fadeIn('fast');
      });
    });

    self.loadMoreButton().on('click', function () {
      self.page = self.page + 1;
      var $btn = $(this);

      $btn.attr('disabled', 'disabled');
      self.loadDoubts(function () {
        $btn.removeAttr('disabled');
      });
    });

    self.loadDoubts();
  }
};
