(function () {
     'use strict';

     app.accessibility = function () {

          var adjustPricesForAccessibility = function() {
          //This function generates Aria-Labels for the tags with prices.
          //Screen Readers can find some issues when reading '$' and ','.

               var arrayOfPrices = [];
               var itemList = $('.product-accessibility-list')
               .find('li')
               .find('a');

               for (var i = 0; i < itemList.length; i++) {
                    arrayOfPrices[i] = itemList[i];
               }

               arrayOfPrices.forEach(function(element) {

                    var price = element.innerHTML.replace(/\s+/g,' ')
                    .replace('<span>', '')
                    .replace('</span>', '')
                    .replace('<a>', '')
                    .replace('</a>', '');

                    var currencyPosition = price.indexOf('R$');
                    var hasPor = price.indexOf('por');
                    var commaPosition = price.indexOf(',');

                    if(currencyPosition != -1) {

                         if (hasPor != -1) {

                              price = price.substring(currencyPosition + 3, price.length);
                              var posAfterComma = commaPosition + 3;
                              price = price.slice(0, posAfterComma) + ' reais' + price.slice( posAfterComma , price.length);
                         }

                         else {
                              price = price.substring(currencyPosition + 3, commaPosition + 3)+' reais';
                         }

                         price = price.replace(',00', '');
                    }
                    element.setAttribute('aria-label', price);
               });
          }();

          var toggleHighContrast = function() {
               $("html").toggleClass('accessible');
               $(".accessibility-constrast-state-on").toggleClass("hidden");
               $(".accessibility-constrast-state-off").toggleClass("hidden");
          }

          $(".contrast-on-btn").on('click', function(){
               toggleHighContrast();
          });

          var checkPageName = function() {
          //This function generates a text inside the "accessibility-location" div.
          //It works like a map for Blind Users, since they may find it hard to know exactly on which page they're in.
               var possibleAddresses =
               {
                    "" : {
                         pageName : "Página Inicial",
                         divName : "home"
                    },
                    "cart": {
                         pageName : "Carrinho",
                         divName : "cart"
                    },
                    "sign_in": {
                         pageName : "Fazer Login",
                         divName : "login"
                    },
                    "enrollments": {
                         pageName : "Meus Cursos",
                         divName : "enrollments"
                    },
                    "forums": {
                         pageName : "Fóruns",
                         divName : "forums"
                    },
                    "products": {
                         pageName : "Produtos",
                         divName : "products"
                    },
                    "edit": {
                         pageName : "Meu Perfil",
                         divName : "profile"
                    },
                    "certificates": {
                         pageName : "Meus Certificados",
                         divName : "certificates"
                    },
                    "channels": {
                         pageName : "Mensagens",
                         divName : "messages"
                    },
                    "orders": {
                         pageName : "Meus Pedidos",
                         divName : "orders"
                    },
                    "profile": {
                         pageName : "Perfil Público",
                         divName : "profile"
                    },
                    "products": {
                         pageName : "Matrículas",
                         divName : "products"
                    },
                    "media": {
                         pageName : "Portifólio",
                         divName : "portifolio"
                    }
               };

               var location, address;
               location = window.location.href;

               if (location.search('/profile/') != -1) {
                    if (location.search('products') != -1)
                         address = 'products';
                    else if (location.search('media') != -1) {
                         address = 'media';
                    }
                    else {
                         address = 'profile';
                    }
               }
               else {
                    address = (location).substring(location.lastIndexOf('/') + 1, location.length);
               }

               window.$mainContentDiv = address && possibleAddresses && possibleAddresses[address] &&possibleAddresses[address].divName;
               address = address && possibleAddresses && possibleAddresses[address] && possibleAddresses[address].pageName;

               if (address) {
                 $("#accessibility-location").text("Você está em: " + address + " - Topo da Página");
               }
          }();

          var scrollToDiv = function(id) {
            var $elementToScroll = $(id);

            if ($elementToScroll.size() > 0) {
                $(window).scrollTop($elementToScroll.offset().top - 50);
                $elementToScroll.focus();
            }
          };

          var checkAccessibiltyFunction = function(selectedElement) {
               // This Function listens to the accessibility-shortcuts.
               // It helps the Screen Readers' users to navigate through the website.
               var a = $mainContentDiv;

               if (selectedElement == null)
                    var selectedElement = $(':focus').attr('id');

               switch(selectedElement) {
                    case 'accessibility-btn-1':
                         scrollToDiv("#accessibility-main-content-" + $mainContentDiv );
                    break;
                    case 'accessibility-btn-2':
                         scrollToDiv("#main-navbar");
                    break;
                    case 'accessibility-btn-3':
                         scrollToDiv("#accessibility-contact");
                    break;
                    case 'accessibility-btn-4':
                         scrollToDiv("#accessibility-location");
                    break;
               }
          };

          $(window).keydown(function(e){
               if(!$(':focus').is('input')) { //It avoids problems with SHIFT inside 'INPUTS'
                    switch (e.which) {
                         case 13: //Enter
                              checkAccessibiltyFunction();
                              break;
                         case 49: //1
                              if (e.shiftKey)
                                   checkAccessibiltyFunction('accessibility-btn-1');
                                   break;
                         case 50: //2
                         if (e.shiftKey)
                              checkAccessibiltyFunction('accessibility-btn-2');
                              break;
                         case 51: //3
                              if (e.shiftKey)
                                   checkAccessibiltyFunction('accessibility-btn-3');
                                   break;
                         case 52: //4
                              if (e.shiftKey)
                                   checkAccessibiltyFunction('accessibility-btn-4');
                                   break;
                    }
               }
          });

          $(document).trigger('app:bind:accessibility');
     };
})();
