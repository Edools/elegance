(function () {
    'use strict';
  
    app.owlCarousel2 = function () {
       
        $(".header-carousel").owlCarousel({
            items:1,
            loop:true,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause:true,
            nav : false
        });

        $(".section-content").owlCarousel({
            loop:false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause:true,
            nav : false,
            responsive : {
                0:{
                    items:1
                },
                768:{
                    items:3
                }
            }
        });

        $(".testimonials").owlCarousel({
            items:1,
            dots: false,
            autoplayHoverPause:true,
            nav : true
        });
        
        $(".ratings-carousels").owlCarousel({
            items:1,
            dots: true,
            autoplay: false,
            autoplayTimeout: 4000,
            autoplayHoverPause:true,
            nav : false
        });
    }
      
    $(document).trigger('app:bind:owlCarousel2');
  })();
  