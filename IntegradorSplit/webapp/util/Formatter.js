sap.ui.define([],function () {
    'use strict';

  
    return{        
            
            formatValor: function(sCodigo){
                 if(!sCodigo){
                    return;
                }else{
                    let nValor = Number.parseFloat(sCodigo).toFixed(2);
                    return "$"+nValor;
                }
            },

            formatStock: function(nStock){
                    if(nStock === 0){
                       return "Sin Stock"
                    }else if(nStock >= 1 && nStock < 10){
                       return "Bajo Stock"
                    }else{
                       return "En Stock"
                    }
            },

            formatStockColor: function(nStock){
                    if(nStock === 0){
                       return "Error"
                    }else if(nStock >= 1 && nStock < 10){
                       return "Warning"
                    }else{
                       return "Success"
                    }
                
            },

            formatDescontinuado: function(bDescontinuado){
                if(bDescontinuado){
                    return "SI"
                }else{
                    return "NO"
                }
            }
    }

},true);