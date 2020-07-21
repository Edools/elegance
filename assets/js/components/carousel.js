(function () {    
    'use strict';
  
    app.carousel = function () {
      
      var homeSlider = $('.home-slider-owl');

      homeSlider.owlCarousel({
        dots: true,
        mouseDrag: false,
        margin:10,
        nav:false,
        loop: true,
        navText : ['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],
        autoplay:true,
        autoplayTimeout:8000,
        responsiveClass: true,
        responsive:{
          0 :{
            items:1,
            loop: true
          },
          600:{
            items:1,
            loop: true
          },
          1000:{
            items:1,
            loop: true
          }
        },
        

      });

      var homeTestimonials = $('.home-testimonials-carousel');

      homeTestimonials.owlCarousel({
       
        dots: true,
        mouseDrag: false,
        margin:40,
        nav:true,
        navText : ['<i class="fas fa-angle-left"></i>','<i class="fas fa-angle-right"></i>'],
        autoplay:true,
        autoplayTimeout:12000,
        responsiveClass: true,
        
        responsive:{
            0:{
                items:1,
                loop: true
            },
            600:{
                items:1,
                loop: true
            },
            1000:{
                items:3,
                loop: true
            }
        },
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
  