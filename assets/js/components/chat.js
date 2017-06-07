(function () {
  'use strict';

  app.chat = {
    groupsPagination: {
      page: 0,
      perPage: 5,
      totalPages: 0
    },
    collaboratorsPagination: {
      page: 0,
      perPage: 5,
      totalPages: 0
    },
    followsPagination: {
      page: 0,
      perPage: 5,
      totalPages: 0
    },

    init: function () {
      var self = this;

      self.$chat = $('.js-chat');

      if (self.$chat.length <= 0) {
        return
      }

      self.$groups = $('.js-groups', self.$chat);
      self.$students = $('.js-students', self.$chat);
      self.$roomTitle = $('#js-room-title');
      self.$roomUsersCount = $('#js-room-users-count');
      self.$text = $('.js-chat-text');
      self.$messagesContainer = $('.js-chat-messages .js-content');
      self.$messagesScroll = $('.js-chat-messages .js-scroll');
      self.$sendForm = $('#js-send-messages');
      self.$loadMoreGroupsButton = self.$chat.find('.js-load-more-groups');
      self.$loadMoreCollaboratorsButton = self.$chat.find('.js-load-more-collaborators');
      self.$loadMoreStudentsButton = self.$chat.find('.js-load-more-students');
      self.$generalChatGroup = self.$chat.find('.js-chat-group-general');

      self.user = self.$chat.data('user');
      self.schoolId = self.$chat.data('school-id');
      self.apiKey = self.$chat.data('api-key');
      self.userId = self.user.id;
      self.chatType = self.$chat.data('type');
      self.chatLesson = self.$chat.data('lesson');

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

      if (firebase.apps.length <= 0) {
        firebase.initializeApp(window.CHAT_CONFIG);
      }

      self.database = firebase.database();

      self.authenticate();

      if (self.chatType === 'lesson-chat') {
        self.lessonRoomUsers = self.database.ref('lesson_room_users/' + self.chatLesson.id);
        self.$loadMoreStudentsButton.hide();
        self.changeRoom(null);
        self.registerCurrentUser();
        self.loadRoomOnlineUsers();

        $(document).off('page:before-change')
          .on('page:before-change', function () {
            if (self.userFirebase) {
              self.userFirebase.remove();
            }
          });

      } else {
        self.loadSchoolGroup();
        self.loadGroups();
        self.loadCollaborators();
        self.loadFollows();

        self.$loadMoreGroupsButton.on('click', function () {
          self.loadGroups();
        });

        self.$loadMoreCollaboratorsButton.on('click', function () {
          self.loadCollaborators();
        });

        self.$loadMoreStudentsButton.on('click', function () {
          self.loadFollows();
        });

        self.$generalChatGroup.on('click', function () {
          self.changeRoom({
            currentTarget: self.$generalChatGroup
          })
        });
      }

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
            console.error('Error creating custom token:', error);
          });
      }).error(function (error) {
        console.error('Could not authenticate', error);
      });
    },

    monitorConnectionState: function (response) {
      const userRef = firebase.database().ref('user_status').child(response.uid);

      // Monitor connection state on browser tab
      firebase.database().ref('.info/connected')
        .on('value', function (snap) {
          if (snap.val()) {
            // if we lose network then remove this user from the list
            userRef.onDisconnect().set('offline');
            // set user's online status
            userRef.set('online');
          }
        });

      document.onIdle = function () {
        userRef.set('idle');
      };

      document.onAway = function () {
        userRef.set('away');
      };

      document.onBack = function () {
        userRef.set('online');
      }
    },

    listenConnectionChanges: function () {
      var self = app.chat;
      var connectionsRef = this.database.ref('user_status');

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

    updateStatus: function (status, userId) {
      var self = this;

      var $element = $('*[data-id="' + userId + '"]');

      if (self.chatType === 'lesson-chat') {
        if (status === 'offline') {
          if ($element.length) {
            $element.remove();
          }

          self.lessonRoomUsers
            .orderByChild('id')
            .equalTo(Number(userId))
            .once('value')
            .then(function (snapshot) {
              if (snapshot.hasChildren()) {
                snapshot.forEach(function (snap) {
                  self.lessonRoomUsers.child(snap.key).remove();
                });
              }

              self.$roomUsersCount.html($('.chat-profile-list-item', self.$students).length);
            });
        }
      } else {
        if ($element.length) {
          $('.status .icon', $element).first().attr('class', 'icon icon-' + status);
        }
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
        return (n < 10) ? ('0' + n) : n;
      }

      var date = new Date();

      self.messages.push({
        id: self.user.id,
        name: self.user.first_name,
        avatar_url: self.user.cover_image_url,
        text: text,
        timestamp: moment().unix(),
        schedule: pad(date.getHours()) + ':' + pad(date.getMinutes())
      });
    },

    scrollToEnd: function () {
      var self = this;
      self.$messagesScroll.scrollTop(self.$messagesScroll[0].scrollHeight);
    },

    renderMessage: function (data) {
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

    renderTemplate: function (key, data) {
      var liquid = $('#' + key + '-template').html();
      var template = Liquid.parse(liquid);

      return template.render(data);
    },

    loadMessages: function () {
      var self = app.chat;
      const setMessage = function (data) {
        self.renderMessage(data.val());
      }.bind(self);

      self.messages.limitToLast(12).on('child_added', setMessage);
      self.messages.limitToLast(12).on('child_changed', setMessage);
    },

    loadRoomOnlineUsers: function () {
      var self = app.chat;
      const setUser = function (data) {
        var $html = $(self.renderTemplate('chat-profile-list-item', data.val()));
        $('.js-students', self.$chat).append($html);
        self.$roomUsersCount.html($('.chat-profile-list-item', self.$students).length);
      }.bind(self);

      const removeUser = function (data) {
        $('.js-students [data-id="' + data.val().id + '"]').remove();
        self.$roomUsersCount.html($('.chat-profile-list-item', self.$students).length);
      }.bind(self);

      self.lessonRoomUsers.on('child_added', setUser);
      self.lessonRoomUsers.on('child_removed', removeUser);
    },

    loadSchoolGroup: function () {
      var self = app.chat;
      $.ajax({
        url: window.CORE_HOST + '/chat/school_group',
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        }
      }).success(function (data) {
        data.is_school = true;

        var $html = $(self.renderTemplate('chat-group-list-item', data));
        $html.on('click', app.chat.changeRoom);
        self.$groups.prepend($html);
      });
    },

    loadGroups: function () {
      var self = app.chat;
      self.$loadMoreGroupsButton.attr('disabled', 'disabled');

      $.ajax({
        url: window.CORE_HOST + '/chat/groups?per_page=' + self.groupsPagination.perPage + '&page=' + (self.groupsPagination.page + 1),
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        }
      }).success(function (data) {
        self.groupsPagination.page = self.groupsPagination.page + 1;
        self.$loadMoreGroupsButton.removeAttr('disabled', 'disabled');
        self.groupsPagination.totalPages = data.total_pages;

        if (self.groupsPagination.page >= self.groupsPagination.totalPages) {
          self.$loadMoreGroupsButton.attr('disabled', 'disabled');
        }

        var groups = data.groups;
        groups = _.sortBy(groups, {is_school: false});
        groups = _.map(groups, function (g) {
          g.is_school = false;
          return g;
        });

        groups.forEach(function (group) {
          var $html = $(self.renderTemplate('chat-group-list-item', group));
          $html.on('click', app.chat.changeRoom);
          self.$groups.append($html);
        });

        self.selectFirstRoomAvailable();
      });
    },

    loadCollaborators: function () {
      var self = app.chat;
      self.$loadMoreCollaboratorsButton.attr('disabled', 'disabled');

      $.ajax({
        url: window.CORE_HOST + '/chat/collaborators?per_page=' + self.collaboratorsPagination.perPage + '&page=' + (self.collaboratorsPagination.page + 1),
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        }
      }).success(function (data) {
        self.collaboratorsPagination.page = self.collaboratorsPagination.page + 1;
        self.$loadMoreCollaboratorsButton.removeAttr('disabled', 'disabled');
        self.collaboratorsPagination.totalPages = data.total_pages;

        if (self.collaboratorsPagination.page >= self.collaboratorsPagination.totalPages) {
          self.$loadMoreCollaboratorsButton.attr('disabled', 'disabled');
        }

        self.addProfileItems(data.collaborators, 'js-team');
        self.selectFirstRoomAvailable();
      });
    },

    loadFollows: function () {
      var self = app.chat;
      self.$loadMoreStudentsButton.attr('disabled', 'disabled');

      $.ajax({
        url: window.CORE_HOST + '/chat/follows?per_page=' + self.followsPagination.perPage + '&page=' + (self.followsPagination.page + 1),
        method: 'GET',
        headers: {
          'Authorization': 'Token token=' + self.apiKey
        }
      }).success(function (data) {
        self.followsPagination.page = self.followsPagination.page + 1;
        self.$loadMoreStudentsButton.removeAttr('disabled', 'disabled');
        self.followsPagination.totalPages = data.total_pages;

        if (self.followsPagination.page >= self.followsPagination.totalPages) {
          self.$loadMoreStudentsButton.attr('disabled', 'disabled');
        }

        self.addProfileItems(data.users, 'js-students');
        self.selectFirstRoomAvailable();
      });
    },

    registerCurrentUser: function () {
      var self = this;

      self.lessonRoomUsers
        .orderByChild('id')
        .equalTo(self.user.id)
        .once('value')
        .then(function (snapshot) {
          if (!snapshot.hasChildren()) {
            self.lessonRoomUsers.push(self.user).then(function (snap) {
              self.userFirebase = snap;
            });
          }
        });
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

      $('.chat-sidebar-list-item').removeClass('active');

      var roomName = 'messages';

      if (self.chatType === 'lesson-chat') {
        roomName += '_lessons/' + self.chatLesson.id;

        // change room name on div
        self.$roomTitle.html(self.chatLesson.title);
        self.$roomUsersCount.html(0);
      } else {
        var $element = $(event.currentTarget);
        $element.addClass('active');

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
        self.$selectedRoom = $('.chat-sidebar-list-item').first();
        self.$selectedRoom.click();
      }
    }
  }

})();
