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

      self.loadGroups(self.didLoadGroups);
      self.loadGeneral(self.didLoadGeneral);
      self.loadFollowers(self.didLoadFollowers);

      app.simpleEditor.init('#js-send-messages');

      $('#js-send-messages').on('submit', self.submitMessage);
      $('#js-chat-group-list-item').on('click', self.switchRoom);

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

      var $html = this.sanitizeHtml(this.$text);
      var text = $html.html();

      if (text.length <= 0) return;

      this.$text.html('').focus();

      function pad(n) {
        return (n < 10) ? ("0" + n) : n;
      }

      var date = new Date();
      var user = $("#school-header").first().data('user');

      app.chat.messages.push({
        id: user.id,
        name: user.name,
        avatar_url: user.avatar_url,
        text: text,
        timestamp: moment().unix(),
        schedule: pad(date.getHours()) + ':' + pad(date.getMinutes())
      });
    },

    insertMessage: function (data) {
      var self = this;
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
      var apiKey = $('#js-chat-page').data('api-key');

      $.ajax({
        url: window.CORE_HOST + '/chat/groups',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + apiKey
        },
      }).success(function (data) {
        callback(data);
      });
    },

    loadGeneral: function (callback) {
      var apiKey = $('#js-chat-page').data('api-key');

      $.ajax({
        url: window.CORE_HOST + '/chat/general',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + apiKey
        },
      }).success(function (data) {
        callback(data);
      });
    },

    loadFollowers: function (callback) {
      var apiKey = $('#js-chat-page').data('api-key');

      $.ajax({
        url: window.CORE_HOST + '/chat/followers',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + apiKey
        },
      }).success(function (data) {
        callback(data);
      });
    },

    didLoadGroups: function (groups) {
      var groupTemplate = $("#js-chat-group-list-item").html();

      groups.forEach(function (group) {
        var $template = $(groupTemplate);

        // set group name
        $('#js-chat-group-name', $template).html(group.name);

        // set users count
        var $usersCont = $('#js-chat-group-users-count', $template);
        $usersCont.html(group.users_count + $usersCont.html());

        // append to group list
        $('.js-groups').append($template);
      });
    },

    didLoadGeneral: function (users) {
      var self = app.chat;
      self.addProfileItems(users, 'js-team');
    },

    didLoadFollowers: function (users) {
      var self = app.chat;
      self.addProfileItems(users, 'js-students');
    },

    addProfileItems: function (users, divClass) {
      var profileTemplate = $("#js-chat-profile-list-item").html();

      users.forEach(function (user) {
        var $template = $(profileTemplate);

        var $avatar = $('<img />').addClass('animated').attr('src', user.cover_image_url);
        $('.avatar', $template).append($avatar);

        $('.name', $template).html(user.first_name + ' ' + user.last_name);
        $('.location', $template).html("Niterói - Rio de Janeiro");

        if (user.status && user.last_seen) {
          $('.status', $template).html("Niterói - Rio de Janeiro");
        }

        $('.' + divClass).append($template);
      });
    }
  }

})();
