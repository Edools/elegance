(function () {
  'use strict';

  app.chat = {
    init: function () {
      this.$jsChat = $('.js-chat');
      this.$chatPage = $('#js-chat-page');
      this.$text = $('.js-chat-text');
      this.$messagesContainer = $('.js-chat-messages .js-content');
      this.user = $("#school-header").first().data('user');
      this.apiKey = this.$chatPage.data('api-key');
      this.userId = this.$chatPage.data('user-id');

      if (this.$jsChat.length <= 0) return;

      var self = this;

      self.bindScroll();

      // empty test messages
      self.$messagesContainer.empty();

      // bind form
      self.$text.keyup(function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code === 13 && !e.shiftKey) {
          self.submitMessage(e);
        }
      });

      app.simpleEditor.init('#js-send-messages');
      $('#js-send-messages').on('submit', self.submitMessage);

      firebase.initializeApp(window.CHAT_CONFIG);
      this.database = firebase.database();

      this.authenticate();

      self.loadGroups(self.didLoadGroups);
      self.loadGeneral(self.didLoadGeneral);
      self.loadFollowers(self.didLoadFollowers);

      self.listenConnectionChanges();
    },

    authenticate: function (callback) {
      var self = app.chat;
      $.ajax({
        url: window.CHAT_FIREBASE_SERVICE_HOST + 'authenticate',
        method: 'POST',
        headers: {
          'Authorization': self.apiKey
        }
      }).success(function (data) {
        firebase.auth().signInWithCustomToken(data.body.firebase_token)
          .then(function (response) {
            self.monitorConnectionState(response);
          })
          .catch(function (error) {
            console.log("Error creating custom token:", error);
          });
      }).error(function (error) {
        console.log('could not authenticate');
        console.log(error);
      });
    },

    monitorConnectionState: function (response) {
      const self = app.chat;
      const userRef = firebase.database().ref("user_status").child(response.uid);

      // Monitor connection state on browser tab
      firebase.database().ref(".info/connected")
        .on("value", function (snap) {
          if (snap.val()) {
            // if we lose network then remove this user from the list
            userRef.onDisconnect().set("offline");
            // set user's online status
            userRef.set("online");
          }
        });

      document.onIdle = function () {
        userRef.set("idle");
      };

      document.onAway = function () {
        userRef.set("away");
      };

      document.onBack = function (isIdle, isAway) {
        userRef.set("online");
      }
    },

    listenConnectionChanges: function () {
      var self = app.chat;
      var connectionsRef = this.database.ref("user_status");

      connectionsRef.on('child_added', function (data) {
        self.updateStatus(data.val(), data.key);
      });

      connectionsRef.on('child_changed', function (data) {
        self.updateStatus(data.val(), data.key);
      });

      connectionsRef.on('child_removed', function (data) {
        self.updateStatus(data.val(), 'offline');
      });
    },

    updateStatus: function (status, user_id) {
      var $div = $('*[data-id="' + user_id + '"]')[0];
      if ($div) {
        $('.status > .icon', $div).first().attr('class', 'icon icon-' + status);
      }
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
        if (el.tagName !== 'BR' && $el.find('br').length > 0 && $el.find('br').length == $el.children().length) {
          $el.remove();
        }
      });

      // Removes last '<br/>'
      if ($root.last().get(0).tagName === 'BR') {
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

      self.messages.push({
        id: self.user.id,
        name: self.user.name,
        avatar_url: self.user.avatar_url,
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
        schedule: moment.unix(data.timestamp).format('LLL')
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

      groups.forEach(function (group) {
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

      users.forEach(function (user) {
        var $html = $(self.renderTemplate('chat-profile-list-item', user));
        $html.on('click', app.chat.changeRoom);
        $('.' + divClass).append($html);
      });
    },

    changeRoom: function (event) {
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
      if (self.messages) {
        self.messages.off();
      }
      self.messages = self.database.ref(roomName);
      self.loadMessages();
    },

    selectFirstRoomAvailable: function () {
      if (!self.$selectedRoom) {
        // Select first room
        self.$selectedRoom = $(".chat-sidebar-list-item").first();
        self.$selectedRoom.click();
      }
    }
  }

})();
