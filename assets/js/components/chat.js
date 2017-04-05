(function () {
  'use strict';

  app.chat = {
    init: function () {
      if ($('.js-chat').length <= 0) return;

      var self = this;

      self.bindScroll();

      /** Test renderTemplate()

      var test = self.renderTemplate('chat-message', {
        avatar: 'https://s-media-cache-ak0.pinimg.com/736x/7b/c7/0d/7bc70d641a5b7986739ed2c768449e65.jpg',
        name: 'Jason Mraz',
        text: 'Donec rutrum congue leo eget malesuada. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.',
        schedule: '10:25'
      });

      $('.js-chat-messages .viewport .overview').append(test);

      **/
    },

    bindScroll: function () {
      $('.js-sidebar-scroll').tinyscrollbar({});
    },

    renderTemplate: function (key, data) {
      var liquid = $('#' + key + '-template').html();
      var template = Liquid.parse(liquid);

      return template.render(data);
    }
  }

})();
