(function () {
  'use strict';

  app.chat = {
    init: function () {
      if ($('.js-chat').length <= 0) return;

      var self = this;

      self.bindScroll();

      // empty test messages
      $('#chat-messages').empty();

      // bind form

      $('#send-messages').on('submit', function (event) {
        event.preventDefault();
        const text = $('#text').val();
        $('#text').val('');

        function pad(n) {
          return (n < 10) ? ("0" + n) : n;
        }

        var date = new Date();

        app.chat.messages.push({
          name: 'Pessoa da Edools',
          text: text,
          schedule: pad(date.getHours()) + ':' + pad(date.getMinutes())
        });
      });

      const config = {
        apiKey: 'AIzaSyD2oUy-240XWPEWmGrh6PqJRaoA4lJFN4s',
        authDomain: 'edools-chat.firebaseapp.com',
        databaseURL: 'https://edools-chat.firebaseio.com',
        projectId: 'edools-chat',
        storageBucket: 'edools-chat.appspot.com',
        messagingSenderId: '322321995609'
      };

      firebase.initializeApp(config);
      var database = firebase.database();
      this.messages = database.ref('messages');
      this.loadMessages();
    },

    bindScroll: function () {
      $('.js-sidebar-scroll').tinyscrollbar({});
      this.messagesScroll = $('.chat-messages .js-scroll')
        .tinyscrollbar({})
        .data("plugin_tinyscrollbar");
    },

    loadMessages: function () {
      const setMessage = function (data) {
        this.insertMessage(data.val());

      }.bind(this);

      this.messages.limitToLast(12).on('child_added', setMessage);
      this.messages.limitToLast(12).on('child_changed', setMessage);
    },

    insertMessage: function (data) {
      var self = this;
      const $container = $('#chat-messages');
      var html = self.renderTemplate('chat-message', {
        avatar: 'https://s-media-cache-ak0.pinimg.com/736x/7b/c7/0d/7bc70d641a5b7986739ed2c768449e65.jpg',
        name: data.name,
        text: data.text,
        schedule: data.schedule
      });

      $container.append(html);
      self.messagesScroll.update('bottom');
    },

    renderTemplate: function (key, data) {
      var liquid = $('#' + key + '-template').html();
      var template = Liquid.parse(liquid);

      return template.render(data);
    }
  }

})();
