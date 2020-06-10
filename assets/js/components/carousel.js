(function () {    
  'use strict';
  
  app.carousel = function(){
    
    var homeSlider = $('.home-slider-owl');
  

    homeSlider.owlCarousel({
      mouseDrag: false,
      margin:10,
      nav:true,
      autoplay:false,
      autoplayTimeout:8000,
      responsive:{
        0 :{
          items:1
        },
        600:{
          items:1
        },
        1000:{
          items:1
        }
      },
      

    });

    $(document).trigger('app:bind:carousel');
  };  

})();
