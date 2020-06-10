(function () {    
    'use strict';
  
    app.carousel = function () {
      
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

      var homeTestimonials = $('.home-testimonials-carousel');

      homeTestimonials.owlCarousel({
        loop:false,
        margin:10,
        nav:true,
        
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            992:{
                items:3
            }
        },
        dots: true
      });

      var teachersSlider = $('.more-items');

      teachersSlider.owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            992:{
                items:3
            }
        },
        dots: true
      });

      var ratingsSlider = $('#public-notes');

      ratingsSlider.owlCarousel({
        loop:false,
        margin:10,
        nav:true,
        
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            992:{
                items:3
            }
        },
        dots: true
      });
      
  
      $(document).trigger('app:bind:carousel');
    };  
  
  })();
  