(function () {
  'use strict';

  app.chat = {
    init: function () {
      if ($('.js-chat').length <= 0) return;

      var self = this;

      self.bindScroll();
    },

    bindScroll: function () {
      $('.js-sidebar-scroll').tinyscrollbar({});
    }
  }

})();
