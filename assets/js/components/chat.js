(function () {
  'use strict';

  app.chat = {
    init: function () {
      this.$jsChat = $('.js-chat');
      this.$text = $('.js-chat-text');
      this.$messagesContainer = $('.js-chat-messages .js-content');

      if (this.$jsChat.length <= 0) return;

      var self = this;

      self.bindScroll();

      // empty test messages
      this.$messagesContainer.empty();

      // bind form
      self.$text.keyup(function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13 && !e.shiftKey) {
          self.submitMessage(e);
        }
      });

      app.simpleEditor.init('#js-send-messages');

      $('#js-send-messages').on('submit', self.submitMessage);

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
      var height = this.$jsChat.data('height');

      console.log(height);

      this.chatHeight = $(window).height() * .8;
      this.$messagesScrollContainer = this.$jsChat.find('.chat-messages .js-scroll-container');
      this.$messagesScroll = this.$messagesScrollContainer.find('.js-scroll');

      var $messagesHeader = this.$jsChat.find('.chat-messages .header');
      var $messagesFooter = this.$jsChat.find('.chat-messages .editor');

      var messagesScrollHeight = (this.chatHeight - 42) - ($messagesHeader.height() + $messagesFooter.height());

      this.$jsChat.height(this.chatHeight);
      this.$messagesScrollContainer.height(messagesScrollHeight);

      this.$jsChat.find('.js-sidebar-scroll').scrollbar({});
      this.$messagesScroll.scrollbar({});
    },

    loadMessages: function () {
      const setMessage = function (data) {
        this.insertMessage(data.val());

      }.bind(this);

      this.messages.limitToLast(12).on('child_added', setMessage);
      this.messages.limitToLast(12).on('child_changed', setMessage);
    },

    sanitizeHtml: function ($root) {
      $root.find('div:empty').remove();

      // Removes elements with only '<br/>' children
      $root.children().each(function (i, el) {
        var $el = $(el);
        if (el.tagName != 'BR' && $el.find('br').length > 0 && $el.find('br').length == $el.children().length) {
          $el.remove();
        }
      });

      // Removes last '<br/>'
      if ($root.last().get(0).tagName == 'BR') {
        $root.last().remove();
      }

      return $root;
    },

    submitMessage: function (event) {
      event.preventDefault();

      var self = this;
      var $html = self.sanitizeHtml(self.$text);
      var text = $html.html();

      if (text.length <= 0) return;

      self.$text.html('').focus();

      function pad(n) {
        return (n < 10) ? ("0" + n) : n;
      }

      var date = new Date();

      app.chat.messages.push({
        name: 'Pessoa da Edools',
        text: text,
        schedule: pad(date.getHours()) + ':' + pad(date.getMinutes())
      });
    },

    insertMessage: function (data) {
      var self = this;
      var html = self.renderTemplate('chat-message', {
        avatar: 'https://s-media-cache-ak0.pinimg.com/736x/7b/c7/0d/7bc70d641a5b7986739ed2c768449e65.jpg',
        name: data.name,
        text: data.text,
        schedule: data.schedule
      });

      self.$messagesContainer.append(html);
      self.$messagesScroll.scrollTop(self.$messagesScroll[0].scrollHeight);
    },

    renderTemplate: function (key, data) {
      var liquid = $('#' + key + '-template').html();
      var template = Liquid.parse(liquid);

      return template.render(data);
    }
  }

})();
