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
      var $chat_room = $deadpool.data("chat-room");

      if ($deadpool.length) {
        loadAsset('Deadpool', src, function() {
          try {
            deadpool.default.on(`connected`, () => {
              // Throws error if you are not properly connected
              deadpool.default.join($chat_room);
            });

            // Connect with deadpool server
            // - `ws://` for development
            // - `wss://` for production
            // Note that you must adjust the endpoint accordingly
            deadpool.default.connect("wss://deadpool.herospark.com/chat-service", $jwt);
          } catch (error) {
              console.log(error);
          }

          // deadpool.on(`presence`, presenceList => {
          //   // `presenceList` is an array of users, use this to track who is online
          // });

          // deadpool.on(`new_message`, message => {
          //     // message structure
          //     // {
          //     //     "user": {
          //     //         "name": "username",
          //     //         "avatar": "url/to/avatar"
          //     //     },
          //     //     "message": "message here",
          //     //     "date": 1560890124270
          //     // }
          // });

          // deadpool.on(`message_sent`, message => {
          //     // message follows the same structure described above
          // });

          // // To send messages
          // // It will work only if you are both connected and inside a room
          // deadpool.sendMessage(`Hello wolverine!`);


          $(document).trigger('app:deadpool:connected');
        });

        $(document).trigger('app:bind:deadpool');
      }
    },
  }
 })();
