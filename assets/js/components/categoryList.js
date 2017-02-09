(function () {
  'use strict';

  app.categoryList = {
    init: function () {
      var self = this;
      self.$categoryList = $('#js-category-list');

      if (self.$categoryList.length == 0) return;

      self.isActive = self.$categoryList.data('is-active') || self.isActive;

      if (!self.isActive) {
        self.bindClicks();
        self.$categoryList.attr('data-is-active', true);
        self.isActive = true;
      }

      self.expandParents();
    },

    bindClicks: function () {
      var self = this;

      $(document).on('click', '#js-category-list .category-item .toggle-btn', function () {
        self.expandParent($(this).parent('.category-item'), true);
      });
    },

    expandParent: function ($parent, animate) {
      var $nextListGroup = $parent.find('.list-group').first();
      var $parentCategoryItem = $parent;

      if (animate) {
        $nextListGroup.stop().slideToggle('fast');
      } else {
        $nextListGroup.stop().toggle();
      }

      $parentCategoryItem.toggleClass('expanded');
    },

    expandParents: function () {
      var self = this;
      var $loopItem = self.$categoryList.find('.category-item.current').first();

      while ($loopItem) {
        self.expandParent($loopItem, false);

        var $parent = $loopItem
          .parents('.category-item')
          .first();

        if ($parent.length > 0) {
          $loopItem = $parent;
        } else {
          $loopItem = null;
        }
      }
    }
  }

})();
