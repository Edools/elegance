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
      var src = "https://staging-cdn.eadbox.com/deadpooljs/dist.js";

      this.$deadpool = $('.deadpool-chat');
      this.$jwt = this.$deadpool.data("jwt");
      this.$message_list = $('.chat-message-list');
      this.$message_inputs = $('.message-inputs');
      this.$chat_room = this.$deadpool.data("chat-room");
      this.$is_before = this.$deadpool.data("is-before");
      this.$message_form = $('form#message');
      this.$message_input = this.$message_form.find('textarea[name=message-body]');

      if (!this.$is_before) {
        if (this.$deadpool.length) {
          var that = this;
          loadAsset('Deadpool', src, function() {
            try {
              deadpool.default.on(`connected`, () => {
                app.deadpoolChat.joinRoom();
              });

              deadpool.default.on(`connection_failed`, () => {
                var notification = {
                  "type": "close",
                  "message_body": "Falha ao conectar com o chat!"
                }

                app.deadpoolChat.renderNewMessage(app.deadpoolChat.buildNotification(notification));
              });

              deadpool.default.on(`disconnected`, () => {
                var notification = {
                  "type": "exclamation",
                  "message_body": "A conexão com o chat foi encerrada!"
                }

                app.deadpoolChat.renderNewMessage(app.deadpoolChat.buildNotification(notification));
              });

              deadpool.default.connect("wss://deadpool.herospark.com/chat-service", that.$jwt);
            } catch (error) {
                console.log(error);
            }

            $(document).trigger('app:deadpool:connected');
          });

          $(document).trigger('app:bind:deadpool');
        }
      } else {
        var notification = {
          "type": "exclamation",
          "message_body": "Esse Webinar ainda não começou"
        }

        app.deadpoolChat.renderNewMessage(app.deadpoolChat.buildNotification(notification));
        this.$message_inputs.attr('disabled', 'disabled');
      }
    },
    renderNewMessage: function(message) {
      var hour = moment(message.date).format("HH:mm");

      if (this.$is_before) {
        var $msg_html = $(`
          <div class="row message-item">
            <div class="message-header">
              <div class="col-md-9">
                ${ message.notification ? '<i class="icon-'+message.type+'"> Notificação</i>' : '<h5>'+message.user.name+'</h5>' }
              </div>
              <div class="col-md-3 message-timestamp">
                <span class="message-timestamp">${hour}</span>
              </div>
            </div>
            <div class="col-md-12 message-body">
              <p>${message.message}</p>
            </div>
          </div>
        `)
      } else {
        var $msg_html = $(`
          <div class="row message-item">
            <div class="col-md-12 message-header">
              <i class="icon-${message.type}"> ${message.message}</i>
            </div>
          </div>
        `)
      }

      this.$message_list.append($msg_html);
    },
    joinRoom: function() {
      try {
        deadpool.default.on(`joined_room`, () => {
          var notification = {
            "type": "check",
            "message_body": "Conectado ao chat com sucesso!"
          }

          app.deadpoolChat.bindMessageEvents();
          app.deadpoolChat.bindPresenceEvent();

          app.deadpoolChat.renderNewMessage(app.deadpoolChat.buildNotification(notification));
        });

        deadpool.default.on(`join_timeout join_crashed join_failed`, () => {
          var notification = {
            "type": "close",
            "message_body": "Falha ao conectar com o chat!"
          }

          app.deadpoolChat.renderNewMessage(app.deadpoolChat.buildNotification(notification));
        });

        deadpool.default.on(`closed_room`, () => {
          var notification = {
            "type": "exclamation",
            "message_body": "O chat da transmissão foi encerrado!"
          }

          app.deadpoolChat.renderNewMessage(app.deadpoolChat.buildNotification(notification));
        });

        deadpool.default.join(this.$chat_room);
      } catch (error) {
          console.log(error);
      }
    },
    bindMessageEvents: function() {
      deadpool.default.on(`new_message`, message => {
        var should_scroll_to_bottom = this.$message_list.scrollTop() + this.$message_list.height() == this.$message_list.prop("scrollHeight");
        app.deadpoolChat.renderNewMessage(message);

        if (should_scroll_to_bottom)
          this.$message_list.animate({ scrollTop: this.$message_list.prop("scrollHeight")}, 0);
      });

      deadpool.default.on(`message_sent`, message => {
        var should_scroll_to_bottom = this.$message_list.scrollTop() + this.$message_list.height() == this.$message_list.prop("scrollHeight");
        app.deadpoolChat.renderNewMessage(message);

        if (should_scroll_to_bottom)
          this.$message_list.animate({ scrollTop: this.$message_list.prop("scrollHeight")}, 0);
      });

      this.$message_input.on('keyup', function (e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          app.deadpoolChat.submitMessage();
        }
      });

      this.$message_form.on('submit', function(e) {
        e.preventDefault();
        app.deadpoolChat.submitMessage();
      });

      deadpool.default.on(`message_failed message_timeout`, () => {
        var notification = {
          "type": "close",
          "message_body": "Falha ao enviar messagem!"
        }

        app.deadpoolChat.renderNewMessage(app.deadpoolChat.buildNotification(notification));
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
      var message_body = this.$message_input.val();
      this.$message_input.val('');

      deadpool.default.sendMessage(message_body);
    },
    buildNotification: function(options) {
      var notification = {
        "notification": true,
        "type": options.type,
        "date": new Date(),
        "message": options.message_body
      }

      return notification;
    }
  }
})();
