app.notepad = {
  page: 1,

  noteContainer: function () {
    return $('#notepad-container');
  },

  form: function () {
    return $('#js-notepad-form');
  },

  loadNote: function (lesson_id, cb) {
    $.ajax({
      url: window.location.pathname + '/notepads',
      method: 'GET',
      success: function () {
        if (typeof cb == 'function') {
          cb();
        }
      }
    })
  },

  saveNote: function (cb) {
    var note = $("#js-note").html();
    var note_id = $("#js_note_id").val();

    var $button = $("#save_notepad_button");
    var buttonLabel = $button.html();
    $button.html($button.data("sending"));
    $button.prop('disabled', true);

    $.ajax({
      url: window.location.pathname + '/notepads',
      method: 'POST',
      data: {
        _id: note_id,
        note: note
      },
      success: function () {
        $button.html(buttonLabel);
        $button.prop('disabled', false);
        if (typeof cb == 'function') {
          cb();
        }
      }
    });
  },

  init: function () {
    var self = this;
    if (this.noteContainer().length <= 0) return;
    this.loadNote($("#lesson_id").val());

    $("#notepad_form").on('submit', function(event) {
      event.preventDefault();
      self.saveNote();
    });
  }
};
