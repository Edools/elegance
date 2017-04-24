(function () {
  'use strict';

  app.chat = {
    init: function () {
      this.$jsChat = $('.js-chat');
      this.$text = $('.js-chat-text');
      this.$messagesContainer = $('.js-chat-messages .js-content');
      this.apiKey = $('#js-chat-page').data('api-key');
      this.userId = $('#js-chat-page').data('user-id');

      if (this.$jsChat.length <= 0) return;

      var self = this;

      self.bindScroll();

      // empty test messages
      self.$messagesContainer.empty();

      // bind form
      self.$text.keyup(function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13 && !e.shiftKey) {
          self.submitMessage(e);
        }
      });

      self.loadGroups(self.didLoadGroups);
      self.loadGeneral(self.didLoadGeneral);
      self.loadFollowers(self.didLoadFollowers);

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
      this.database = firebase.database();
    },

    bindScroll: function () {
      var height = this.$jsChat.data('height');

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
      // $(".js-scroll-container").html('');

      var self = app.chat;
      const setMessage = function (data) {
        self.insertMessage(data.val());
      }.bind(self);

      self.messages.limitToLast(12).on('child_added', setMessage);
      self.messages.limitToLast(12).on('child_changed', setMessage);
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
      var self = app.chat;

      var $html = self.sanitizeHtml(self.$text);
      var text = $html.html();

      if (text.length <= 0) return;

      self.$text.html('').focus();

      function pad(n) {
        return (n < 10) ? ("0" + n) : n;
      }

      var date = new Date();
      var user = $("#school-header").first().data('user');

      self.messages.push({
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url,
        text: text,
        timestamp: moment().unix(),
        schedule: pad(date.getHours()) + ':' + pad(date.getMinutes())
      });
    },

    insertMessage: function (data) {
      var self = app.chat;
      var html = self.renderTemplate('chat-message', {
        avatar: data.avatar_url,
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
    },

    loadGroups: function (callback) {
      var self = app.chat;
      $.ajax({
        url: window.CORE_HOST + '/chat/groups',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        },
      }).success(function (data) {
        callback(data);
      });
    },

    loadGeneral: function (callback) {
      var self = app.chat;
      $.ajax({
        url: window.CORE_HOST + '/chat/general',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        },
      }).success(function (data) {
        callback(data);
      });
    },

    loadFollowers: function (callback) {
      var self = app.chat;
      $.ajax({
        url: window.CORE_HOST + '/chat/followers',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        },
      }).success(function (data) {
        callback(data);
      });
    },

    didLoadGroups: function (groups) {
      var self = app.chat;

      groups.forEach(function(group) {
        var $html = $(self.renderTemplate('chat-group-list-item', group));
        $html.on('click', app.chat.changeRoom);
        $('.js-groups').append($html);
      });

      self.selectFirstRoomAvailable();
    },

    didLoadGeneral: function (users) {
      var self = app.chat;
      self.addProfileItems(users, 'js-team');
      self.selectFirstRoomAvailable();
    },

    didLoadFollowers: function (users) {
      var self = app.chat;
      self.addProfileItems(users, 'js-students');
      self.selectFirstRoomAvailable();
    },

    addProfileItems: function (users, divClass) {
      var self = app.chat;

      users.forEach(function(user) {
        var $html = $(self.renderTemplate('chat-profile-list-item', user));
        $html.on('click', app.chat.changeRoom);
        $('.' + divClass).append($html);
      });
    },

    changeRoom: function(event) {
      var self = app.chat;
      var $div = $(event.currentTarget);

      $(".chat-sidebar-list-item").removeClass('active');
      $div.addClass('active');

      var roomName = 'messages';

      if ($div.data('type') === 'products') {
        // room name on firebase
        roomName += '_products/' + $div.data('id');

        // change room name on div
        $("#js-room-title").html($('#js-chat-group-name', $div).html());
        $("#js-room-users-count").html($('#js-chat-group-users-count', $div).html());
      } else if ($div.data('type') === 'users') {
        var ids = [self.userId, parseInt($div.data('id'))].sort();
        roomName += '_users/' + ids[0] + '/' + ids[1];

        // change room name on div
        $("#js-room-title").html($('.info .name', $div).html());
        $("#js-room-users-count").html($('.info .location', $div).html());
      }

      self.$messagesContainer.html('');
      self.messages = self.database.ref(roomName);
      self.loadMessages();
    },

    selectFirstRoomAvailable: function() {
      if (!self.$selectedRoom) {
        // Select first room
        self.$selectedRoom = $(".chat-sidebar-list-item").first();
        self.$selectedRoom.click();
      }

    }
  }

})();
