sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "IntegradorSplit/IntegradorSplit/util/Services",
        "sap/ui/model/json/JSONModel",
        "IntegradorSplit/IntegradorSplit/util/Constants",
        "IntegradorSplit/IntegradorSplit/util/Formatter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Filter",
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller,UIComponent,Services,JSONModel,Constants,Formatter,FilterOperator,Filter) {
		"use strict";

		return Controller.extend("IntegradorSplit.IntegradorSplit.controller.MasterIntegrador", {
            
        Formatear:Formatter,

		onInit: function () {
            this.loadModelBase();
        },

        loadModelBase: async function(){
            
            //Modelo base
            let oComponent = this.getOwnerComponent();
            const oResponse = await Services.getoData();
            const oData = oResponse[0];
            let oProductosModel = new JSONModel();
            oProductosModel.setData(oData);
            oComponent.setModel(oProductosModel,Constants.model.modeloProductos);
            
            //Modelo Seleccionado por defecto (el primero)
            let oProductoSeleccionado = oProductosModel.getProperty(Constants.properties.valueDefault);
            let oModelSeleccionado = new JSONModel(oProductoSeleccionado);
            this.getOwnerComponent().setModel(oModelSeleccionado,Constants.model.modeloSeleccionado);
            this.getOwnerComponent().getRouter().getRoute(Constants.routes.main).attachPatternMatched(this._onRouteMatched, this);

            //Crear modelo CATEGORIAbyID.
            const oResponseCategoria = await Services.getCategoriabyID(oProductoSeleccionado.CategoryID);
            const oDataCategoria = oResponseCategoria[0];
            let oCategoriaModel = new JSONModel();
            oCategoriaModel.setData(oDataCategoria);
            oComponent.setModel(oCategoriaModel,Constants.model.modeloCategoria);
            
            //Crear modelo SUPPLIERbyID.
            const oResponseSupplier = await Services.getProveedorbyID(oProductoSeleccionado.SupplierID);
            const oDataSupplier = oResponseSupplier[0];
            let oSupplierModel = new JSONModel();
            oSupplierModel.setData(oDataSupplier);
            oComponent.setModel(oSupplierModel,Constants.model.modeloSupplier);

            //Modelo Cantidad productos 
            //Obtener Data
            let oLargo= this.getOwnerComponent().getModel(Constants.model.modeloProductos).getData();
            //Obtener Largo DATA
            oLargo = oLargo.value.length
            // Crear Nuevo Modelo
            let oModelCantidadProductos = new JSONModel();
            oModelCantidadProductos.setData(oLargo);
            this.getOwnerComponent().setModel(oModelCantidadProductos,Constants.model.largoModel);

        },
            //Navegar al primer item por defecto
         _onRouteMatched: function(oEvent) {
            this.getOwnerComponent().getRouter().navTo(Constants.routes.detalle, {productId:"0"}, true);
        },

        //AL CLICKEAR ITEM
        onSelectionChange: async function(oEvent) {
                //Crear nuevo modelo seleccionado
                let oItem = oEvent.getSource().getSelectedItem();
                let oBindingContext = oItem.getBindingContext(Constants.model.modeloProductos);
                let oModel = this.getOwnerComponent().getModel(Constants.model.modeloProductos);
                let oProductoSeleccionado = oModel.getProperty(oBindingContext.getPath());
                let oModelSelectedItem = new JSONModel();
                oModelSelectedItem.setData(oProductoSeleccionado);                
                this.getOwnerComponent().setModel(oModelSelectedItem,Constants.model.modeloSeleccionado);

                //Crear modelo CATEGORIA x seleccionado.
                let oComponent = this.getOwnerComponent();
                const oResponse = await Services.getCategoriabyID(oProductoSeleccionado.CategoryID);
                const oData = oResponse[0];
                let oCategoriaModel = new JSONModel();
                oCategoriaModel.setData(oData);
                oComponent.setModel(oCategoriaModel,Constants.model.modeloCategoria);

                //Crear modelo Proveedor x seleccionado.
                const oResponseSupplier = await Services.getProveedorbyID(oProductoSeleccionado.SupplierID);
                const oDataSupplier = oResponseSupplier[0];
                let oSupplierModel = new JSONModel();
                oSupplierModel.setData(oDataSupplier);
                oComponent.setModel(oSupplierModel,Constants.model.modeloSupplier);

                //Searchfield renovar cantidad items y filtros por nombre.


            },

            //AL BUSCAR POR ITEM
             onChangeBuscar: function(evento){

                //Valor de la query al momento del evento
                var sQuery = evento.getSource().getValue();
                

                if(sQuery && sQuery.length > 0){
                    var oFilter = new Filter(Constants.ids.productName, FilterOperator.Contains, sQuery);                  
                }
                let sListaId = this.getView().byId(Constants.ids.listaProductos)
                //Seleccionar items a vincular
                var oBindingInfo = sListaId.getBinding(Constants.ids.items);

                //Entregar Filtro para los items
                oBindingInfo.filter(oFilter,Constants.ids.bindFiltro); 
                let oLargoActual = oBindingInfo.getLength();

                let modelLargo = new JSONModel();
                modelLargo.setData(oLargoActual);
                this.getOwnerComponent().setModel(modelLargo,Constants.model.largoModel)

            },

        
		});
	});
