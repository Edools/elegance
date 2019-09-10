/*********************************************************************
 *
 *  components/deadpoolChat.js
 *  @name: DeadpoolChat
 *
 *********************************************************************/

 (function () {
  'use strict';

  app.deadpoolChat = {
    bindDeadpool: function () {
      var src = "http://staging-cdn.eadbox.com/deadpooljs/dist.js";

      var $deadpool = $('.deadpool-chat');
      var $jwt = $deadpool.data("jwt");

      if ($deadpool.length) {
        loadAsset('Deadpool', src, function() {
          try {
            deadpool.default.on(`connected`, () => {
              app.deadpoolChat.joinRoom();
            });

            deadpool.default.on(`connection_failed`, () => {
              var notification = {
                "notification": true,
                "type": "close",
                "user": {
                  "name": "Notificação"
                },
                "date": new Date(),
                "message": "Falha ao conectar com o chat!"
              }

              app.deadpoolChat.renderNewMessage(notification);
            });

            deadpool.default.on(`disconnected`, () => {
              var notification = {
                "notification": true,
                "type": "exclamation",
                "user": {
                  "name": "Notificação"
                },
                "date": new Date(),
                "message": "A conexão com o chat foi encerrada!"
              }

              app.deadpoolChat.renderNewMessage(notification);
            });

            deadpool.default.connect("wss://deadpool.herospark.com/chat-service", $jwt);
          } catch (error) {
              console.log(error);
          }

          $(document).trigger('app:deadpool:connected');
        });

        $(document).trigger('app:bind:deadpool');
      }
    },
    renderNewMessage: function(message) {
      var $message_list = $('.chat-message-list');

      var date = new Date(message.date).toLocaleString();

      var $msg_html = $(`
        <div class="row message-item">
          <div class="message-header">
            <div class="col-md-9">
              ${ message.notification == true ? '<i class="icon-'+message.type+'"> '+message.user.name+'</i>' : '<h5>'+message.user.name+'</h5>' }
            </div>
            <div class="col-md-3 message-timestamp">
              <span class="message-timestamp">${date}</span>
            </div>
          </div>
          <div class="col-md-12 message-body">
            <p>${message.message}</p>
          </div>
        </div>
      `)

      $message_list.append($msg_html);
    },
    joinRoom: function() {
      var $deadpool = $('.deadpool-chat');
      var $chat_room = $deadpool.data("chat-room");

      try {
        deadpool.default.on(`joined_room`, () => {
          var notification = {
            "notification": true,
            "type": "check",
            "user": {
              "name": "Notificação"
            },
            "date": new Date(),
            "message": "Conectado ao chat com sucesso!"
          }

          app.deadpoolChat.bindMessageEvents();
          app.deadpoolChat.bindPresenceEvent();

          app.deadpoolChat.renderNewMessage(notification);
        });

        deadpool.default.on(`join_timeout join_crashed join_failed`, () => {
          var notification = {
            "notification": true,
            "type": "close",
            "user": {
              "name": "Notificação"
            },
            "date": new Date(),
            "message": "Falha ao conectar com o chat!"
          }

          app.deadpoolChat.renderNewMessage(notification);
        });

        deadpool.default.on(`closed_room`, () => {
          var notification = {
            "notification": true,
            "type": "exclamation",
            "user": {
              "name": "Notificação"
            },
            "date": new Date(),
            "message": "O chat da transmissão foi encerrado!"
          }

          app.deadpoolChat.renderNewMessage(notification);
        });

        deadpool.default.join($chat_room);
      } catch (error) {
          console.log(error);
      }
    },
    bindMessageEvents: function() {
      var $message_list = $('.chat-message-list');

      deadpool.default.on(`new_message`, message => {
        var should_scroll_to_bottom = $message_list.scrollTop() + $message_list.height() == $message_list.prop("scrollHeight");
        app.deadpoolChat.renderNewMessage(message);

        if (should_scroll_to_bottom)
          $message_list.animate({ scrollTop: $message_list.prop("scrollHeight")}, 0);
      });

      deadpool.default.on(`message_sent`, message => {
        var should_scroll_to_bottom = $message_list.scrollTop() + $message_list.height() == $message_list.prop("scrollHeight");
        app.deadpoolChat.renderNewMessage(message);

        if (should_scroll_to_bottom)
          $message_list.animate({ scrollTop: $message_list.prop("scrollHeight")}, 0);
      });

      var $message_form = $('form#message');
      var $message_input = $message_form.find('textarea[name=message-body]');

      $message_input.on('keyup', function (e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          app.deadpoolChat.submitMessage();
        }
      });

      $message_form.on('submit', function(e) {
        e.preventDefault();
        app.deadpoolChat.submitMessage();
      });

      deadpool.default.on(`message_failed message_timeout`, () => {
        var notification = {
          "notification": true,
          "type": "close",
          "user": {
            "name": "Notificação"
          },
          "date": new Date(),
          "message": "Falha ao enviar messagem!"
        }

        app.deadpoolChat.renderNewMessage(notification);
      });
    },
    bindPresenceEvent: function() {
      // Binding the other events
      deadpool.default.on(`presence`, presenceList => {
        // `presenceList` is an array of users, use this to track who is online
        $('.watching-count').text(' '+presenceList.length);
      });
    },
    submitMessage: function() {
      var $message_form = $('form#message');
      var $message_input = $message_form.find('textarea[name=message-body]');

      var message_body = $message_input.val();
      $message_input.val('');

      deadpool.default.sendMessage(message_body);
    }
  }
})();
