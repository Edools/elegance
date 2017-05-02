(function () {
  'use strict';

  app.chat = {
    followsPage: 0,
    followsPerPage: 5,
    followsTotalPages: 0,

    init: function () {
      var self = this;

      self.$chat = $('.js-chat');
      self.$groups = $('.js-groups');
      self.$roomTitle = $("#js-room-title");
      self.$roomUsersCount = $("#js-room-users-count");
      self.$text = $('.js-chat-text');
      self.$messagesContainer = $('.js-chat-messages .js-content');
      self.$messagesScroll = $('.js-chat-messages .js-scroll');
      self.$sendForm = $('#js-send-messages');
      self.$loadMoreStudentsButton = self.$chat.find('.js-load-more-students');
      self.$generalChatGroup = self.$chat.find('.js-chat-group-general');

      self.user = $("#school-header").data('user');

      self.schoolId = self.$chat.data('school-id');
      self.apiKey = self.$chat.data('api-key');
      self.userId = self.user.id;

      if (self.$chat.length <= 0) return;

      self.bindScroll();

      self.$messagesContainer.empty();

      // bind form
      self.$text.keyup(function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code === 13 && !e.shiftKey) {
          self.submitMessage(e);
        }
      });

      app.simpleEditor.init('#js-send-messages');
      self.$sendForm.on('submit', self.submitMessage);

      firebase.initializeApp(window.CHAT_CONFIG);
      self.database = firebase.database();

      self.authenticate();

      self.loadGroups(self.didLoadGroups);
      self.loadCollaborators(self.didLoadCollaborators);
      self.loadFollows(self.didLoadFollows);

      self.$loadMoreStudentsButton.on('click', function () {
        self.loadFollows(self.didLoadFollows);
      });

      self.$generalChatGroup.on('click', function () {
        self.changeRoom({
          currentTarget: self.$generalChatGroup
        })
      });

      self.listenConnectionChanges();
    },

    authenticate: function () {
      var self = app.chat;
      $.ajax({
        url: window.CHAT_FIREBASE_SERVICE_HOST + '/authenticate',
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
            console.error("Error creating custom token:", error);
          });
      }).error(function (error) {
        console.error('Could not authenticate');
        console.error(error);
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
      var $element = $('*[data-id="' + user_id + '"]')[0];
      if ($element) {
        $('.status > .icon', $element).first().attr('class', 'icon icon-' + status);
      }
    },

    bindScroll: function () {
      var height = this.$chat.data('height');
      var parent = this.$chat.data('parent');
      var parentHeight = parent ? $(parent).height() : $(window).height();
      var isPercentHeight = height.indexOf('%') > -1;
      height = Number(height.replace('%', '').replace('px', ''));

      if (isPercentHeight === true) {
        this.chatHeight = (parentHeight / 100) * height;
      } else {
        this.chatHeight = height;
      }

      this.$chat.height(this.chatHeight);
      this.$chat.find('.js-sidebar-scroll').scrollbar({});
      this.$chat.find('.js-chat-messages .js-scroll').scrollbar({});
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
      self.scrollToEnd();
    },

    scrollToEnd: function () {
      var self = this;
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
        }
      }).success(function (data) {
        callback(data);
      });
    },

    loadCollaborators: function (callback) {
      var self = app.chat;
      $.ajax({
        url: window.CORE_HOST + '/chat/collaborators',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        }
      }).success(function (data) {
        callback(data);
      });
    },

    loadFollows: function (callback) {
      var self = app.chat;
      this.followsPage = this.followsPage + 1;
      self.$loadMoreStudentsButton.attr('disabled', 'disabled');

      $.ajax({
        url: window.CORE_HOST + '/chat/follows?per_page=' + self.followsPerPage + '&page=' + self.followsPage,
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        }
      }).success(function (data) {
        self.$loadMoreStudentsButton.removeAttr('disabled', 'disabled');
        callback(data);
      });
    },

    didLoadGroups: function (groups) {
      var self = app.chat;

      groups = _.sortBy(groups, {is_school: false});

      groups.forEach(function (group) {
        var $html = $(self.renderTemplate('chat-group-list-item', group));
        $html.on('click', app.chat.changeRoom);
        self.$groups.append($html);
      });

      self.selectFirstRoomAvailable();
    },

    didLoadCollaborators: function (users) {
      var self = app.chat;
      self.addProfileItems(users, 'js-team');
      self.selectFirstRoomAvailable();
    },

    didLoadFollows: function (data) {
      var self = app.chat;
      self.followsTotalPages = data.total_pages;

      if (self.followsPage >= self.followsTotalPages) {
        self.$loadMoreStudentsButton.attr('disabled', 'disabled');
      }

      self.addProfileItems(data.users, 'js-students');
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
      var $element = $(event.currentTarget);

      $(".chat-sidebar-list-item").removeClass('active');
      $element.addClass('active');

      var roomName = 'messages';

      if ($element.data('type') === 'products') {
        // room name on firebase
        roomName += '_products/' + $element.data('id');

        // change room name on div
        self.$roomTitle.html($('.js-chat-group-name', $element).html());
        self.$roomUsersCount.html($('.js-chat-group-users-count', $element).html());
      } else if ($element.data('type') === 'users') {
        var ids = [self.userId, parseInt($element.data('id'))].sort();
        roomName += '_users/' + ids[0] + '/' + ids[1];

        // change room name on div
        self.$roomTitle.html($('.info .name', $element).html());
        self.$roomUsersCount.html($('.info .location', $element).html());
      } else if ($element.data('type') === 'schools') {
        // room name on firebase
        roomName += '_schools/' + self.schoolId;

        // change room name on div
        self.$roomTitle.html($('.js-chat-group-name', $element).html());
        self.$roomUsersCount.html($('.js-chat-group-users-count', $element).html());
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
