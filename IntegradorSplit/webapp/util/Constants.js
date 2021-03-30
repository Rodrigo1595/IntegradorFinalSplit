sap.ui.define([],function(){

    'use strict';

    return{
        //Modelos
        model:{
            I18n:'i18n',
            modeloProductos:'modeloProductos',
            modeloSeleccionado:'modeloSeleccionado',
            modeloCategoria:'modeloCategoria',
            modeloSupplier:'modeloSupplier',
            largoModel:'largoModel'

        },

        //Propiedades del modelo 
        properties: {
            ProductName:"/ProductName",
            valueDefault:"/value/0",
            rootValue:'/value'
        },

        ids: {
            Northwind:"Northwind",
            listaProductos:"idLista",
            bindFiltro:"bindFiltro",
            productName:"ProductName",
            idDialogEdit:"idEditDialog",
            items:"items"
        },

        routes:{
            detalle:"RouteView1",
            main:"RouteMasterIntegrador",
            productos:{
                productos:"/V3/Northwind/Northwind.svc/Products"
            },
            FRAGMENTS:{
                dialogEdit:"IntegradorSplit.IntegradorSplit.fragments.editDialog",
                sortDialog:"IntegradorSplit.IntegradorSplit.fragments.sortDialog",
                groupByDialog:"IntegradorSplit.IntegradorSplit.fragments.groupDialog",
                filterDialog:"IntegradorSplit.IntegradorSplit.fragments.filterDialog"
            }
        }
    }
},true);