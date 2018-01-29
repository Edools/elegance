(function () {
     'use strict';

     app.accessibility = function () {

          var adjustPricesForAccessibility = function() { 
          //This function generates Aria-Labels for the tags with prices.
          //Screen Readers can find some issues when reading '$' and ','.

               var arrayOfPrices = new Array(...$('.product-accessibility-list')
               .find('li')
               .find('a'));

               arrayOfPrices.forEach(element => {

                    var price = String((element.innerHTML));
                    var R$Position = price.indexOf('R$');
                    var hasPor = price.indexOf('por');
                    var commaPosition = price.indexOf(',');
                    
                    if(R$Position != -1) {

                         if (hasPor != -1) {

                              price = price.substring(R$Position + 3, price.length)
                                   .replace(/\s+/g,' ')
                                   .replace('<span>', '')
                                   .replace('</span>', '')
                                   .replace('<a>', '')
                                   .replace('</a>', '');

                              var posAfterComma = price.indexOf(',') + 3;

                              price = price.slice(0, posAfterComma) + ' reais' + price.slice( posAfterComma , price.length);
                         }

                         else {
                              price = price.substring(R$Position + 3, commaPosition + 3)+' reais';
                         }

                         price = price.replace(',00', '');
                         //console.log(price);                                    
                    }                              
                    element.setAttribute('aria-label', price);
               });
               console.log('criei as labels');
          }();

          var toggleHighContrast = function() {
          //This function toggles the High Contrast Mode.

               $("html").toggleClass('accessible');
                    
                    if ($("html").hasClass('accessible')) {
                         $(".contrast-on-btn-text").fadeOut(200, function(){
                              $(".contrast-on-btn-text").text("Alto Contraste Ligado").fadeIn(200);
                         })
                    }
                    else {
                         $(".contrast-on-btn-text").fadeOut(200, function(){
                              $(".contrast-on-btn-text").text("Alto Contraste Desligado").fadeIn(200);
                         })
                    }     
          }

          $(".contrast-on-btn").click(function(){
               toggleHighContrast();
          });

          var checkPageName = function() {
          //This function generates a text inside the "accessibility-location" div.
          //It works like a map for Blind Users, since they may find it hard to know exactly on which page they're in.
               var possibleAddresses =
               {
                    "": "Página Inicial",
                    "cart": "Carrinho",
                    "sign_in": "Fazer Login",
                    "enrollments": "Meus Cursos",
                    "forums": "Fóruns",
                    "products": "Produtos",
                    "edit": "Meu Perfil",
                    "certificates": "Meus Certificados",
                    "channels": "Mensagens",
                    "orders": "Meus Pedidos"
               };
          
               var address = (window.location.href).
                    substring(window.location.href.
                    lastIndexOf('/') + 1, window.location.href.length);
               
               address = possibleAddresses[address];
          
               if (address == undefined) {
                    if (window.location.href.search('/profile/'))
                         address = 'Perfil Público';
                    else
                         adress = '';  
               }           
          
               $("#accessibility-location").text(`Você está em: ${address} - Topo da Página`);
               var i = 0;
               i++; 
               console.log("rodei" + i + "vezes");  
          }();         

          var checkAccessibiltyFunction = function(selectedElement) {
               // This Function listens to the accessibility-shortcuts.
               // It helps the Screen Readers' users to navigate through the website.
               if (selectedElement == null) 
                    var selectedElement = $(':focus').attr('id');
          
               switch(selectedElement) {
                    case 'accessibility-btn-1':
                         $(window).scrollTop($("#accessibility-main-content").offset().top - 50);
                         $("#accessibility-main-content").focus();                        
                    break;
                    case 'accessibility-btn-2':
                         $(window).scrollTop($("#main-navbar").offset().top - 50);
                         $("#main-navbar").focus();
                    break;
                    case 'accessibility-btn-3':
                         $(window).scrollTop($("#accessibility-contact").offset().top - 50);
                         $("#accessibility-contact").focus();
                    break;
                    case 'accessibility-btn-4':
                         $(window).scrollTop($("#accessibility-location").offset().top - 50);
                         $("#accessibility-location").focus();
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