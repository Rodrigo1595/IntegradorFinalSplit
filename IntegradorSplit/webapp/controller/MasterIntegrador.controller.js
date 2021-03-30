sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent",
        "IntegradorSplit/IntegradorSplit/util/Services",
        "sap/ui/model/json/JSONModel",
        "IntegradorSplit/IntegradorSplit/util/Constants",
        "IntegradorSplit/IntegradorSplit/util/Formatter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Filter",
        'sap/m/library',
        'sap/ui/Device',
        'sap/ui/model/Sorter'
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller,UIComponent,Services,JSONModel,Constants,Formatter,FilterOperator,Filter,mLibrary,DeviceAcceleration,Sorter) {
		"use strict";

		return Controller.extend("IntegradorSplit.IntegradorSplit.controller.MasterIntegrador", {
            
        Formatear:Formatter,

		onInit: function () {
            //Cargar modelo base
            this.loadModelBase();
            //Cargar Dialogs aqui
            this.Dialogs = {};

            //Inicializar grupos

            this.mGroupFunctions = {
                    ProductName:function(oContext){
                        var sProductName = oContext.getProperty("ProductName");
                    return{
                        key:sProductName,
                        text:sProductName
                        }
                    },

                    UnitPrice:function(oContext){
                        var sUnitPrice = oContext.getProperty("UnitPrice");
                    return{
                        key:sUnitPrice,
                        text:sUnitPrice
                        }
                    }
                }


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
            // AQUI LO CREE PARA TENER DATOS POR DEFECTO (EL PRIMERO)
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

                


            },
            //Searchfield renovar cantidad items y filtros por nombre.
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

            //////////FILTRAR SORT - GROUPBY - FILTRO COINCIDENCIA////////////
            //Crear configuraciones para el dialog segun corresponda (SORT-GROUP-Filtro)
            createViewSettingsDialog: function(sDialogFragmentName){
                var oDialog;
                    //Setear Dialogo
                    oDialog = this.Dialogs[sDialogFragmentName];
                    //Si NO existe , crea un nuevo dialogo y le asigna la propiedad del dialogo el cual proviene (SORT O GROUP en este caso)
                    if(!oDialog){
                        oDialog = sap.ui.xmlfragment(sDialogFragmentName,this);
                        this.getView().addDependent(oDialog);
                        this.Dialogs[sDialogFragmentName] = oDialog;
                    }
                    //Setea filtro/s
                    oDialog.setFilterSearchOperator(mLibrary.StringFilterOperator.Contains);
                    if(DeviceAcceleration.system.desktop){
                        oDialog.addStyleClass("sapUISizeCompact");
                    }

                    if(sDialogFragmentName === Constants.routes.FRAGMENTS.filterDialog){
                        //Obtener modelo
                        var oModelJSON = this.getOwnerComponent().getModel(Constants.model.modeloProductos);
                        //Obtener propiedades
                        var modelOriginal = oModelJSON.getProperty(Constants.properties.rootValue);
                        var jsonProductName = JSON.parse(JSON.stringify(modelOriginal,['ProductName']));
                        var jsonUnitPrice = JSON.parse(JSON.stringify(modelOriginal,['UnitPrice']));

                        oDialog.setModel(oModelJSON);
                        
                        // Revisar duplicados
                        jsonProductName = jsonProductName.filter(function(currentObject){
                            if(currentObject.ProductName in jsonProductName){
                                return false;
                            }else{
                                jsonProductName[currentObject.ProductName] = true;
                                 return true;
                            }
                        });
                        jsonUnitPrice = jsonUnitPrice.filter(function(currentObject){
                            if(currentObject.UnitPrice in jsonUnitPrice){
                                return false;
                            }else{
                                jsonUnitPrice[currentObject.UnitPrice] = true;
                                 return true;
                            }
                        });
                        


                        //Crear arreglos filtros
                        var ProductNameFilter = [];
                        for (var i = 0; i < jsonProductName.length; i++) {
                            ProductNameFilter.push(
                                new sap.m.ViewSettingsItem({
                                    text: jsonProductName[i].ProductName,
                                    key: "ProductName"
                                })
                            );
                        };
                        
                        var UnitPriceFilter = [];
                        for (var i = 0; i < jsonUnitPrice.length; i++) {
                            UnitPriceFilter.push(
                                new sap.m.ViewSettingsItem({
                                    text: jsonUnitPrice[i].UnitPrice,
                                    key: "UnitPrice"
                                })
                            );
                        };

                        //Destruir para inicializar filtros nuevamente
                        oDialog.destroyFilterItems();
                        //Agregar Filtros
                        oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                            key: "ProductName",
                            text: "ProductName",
                            items: ProductNameFilter
                        }));

                        oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                            key: "UnitPrice",
                            text: "UnitPrice",
                            items: UnitPriceFilter
                        })); 
                    }
                    return oDialog

            },

            //SORT///////////////////////////////////////////////////
            // Crear dialog Sort
            onSort: function(){
                this.createViewSettingsDialog(Constants.routes.FRAGMENTS.sortDialog).open()
            },

            //Aplicar sort 
            onSortDialogConfirm: function(oEvent){
                let sListaId = this.getView().byId(Constants.ids.listaProductos),
                mParams = oEvent.getParameters(),
                oBinding= sListaId.getBinding("items"),
                sPath,
                bDescending,
                aSorters=[];

                sPath= mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath,bDescending));
                oBinding.sort(aSorters);
            },

            //GROUP BY/////////////////////////////////////////////////
            //Inicia la funcion para abrir el dialogo de agrupamiento
            onGroup: function(){
                this.createViewSettingsDialog(Constants.routes.FRAGMENTS.groupByDialog).open()
            },
           
            // Al confirma el dialogo y las opciones devuelve los argumentos para conformar los grupos
            onGroupDialogConfirm: function(oEvent){
                let sListaId = this.getView().byId(Constants.ids.listaProductos),
                mParams = oEvent.getParameters(),
                oBinding = sListaId.getBinding("items"),
                sPath,
                bDescending,
                vGroup,
                aGroups=[];

                if(mParams.groupItem){
                    sPath = mParams.groupItem.getKey();
                    bDescending = mParams.groupDescending;
                    vGroup= this.mGroupFunctions[sPath];
                    aGroups.push(new Sorter(sPath,bDescending,vGroup));
                    oBinding.sort(aGroups);
                }else{
                    oBinding.aSorters = null;
                    aGroups = [];
                    oBinding.sort(aGroups);
                }
            },

            // BUSQUEDA POR FILTRO //
            
            onFilter: function(){
                this.createViewSettingsDialog(Constants.routes.FRAGMENTS.filterDialog).open();
            },

            onFilterDialogConfirm: function(oEvent){
                    let sListaId = this.getView().byId(Constants.ids.listaProductos),
                    mParams= oEvent.getParameters(),
                    oBinding = sListaId.getBinding("items"),
                    aFilters=[];
                mParams.filterItems.forEach(function(oItem){
                    var sPath = oItem.getKey(),
                        sOperator = FilterOperator.EQ,
                        sValue1 = oItem.getText();
                    var oFilter = new Filter(sPath,sOperator,sValue1);
                    aFilters.push(oFilter);
                });
                oBinding.filter(aFilters);
                
                //Actualizar Largo
                //Seleccionar items a vincular
                var oBindingInfo = sListaId.getBinding(Constants.ids.items);
                let oLargoActual = oBindingInfo.getLength();
                let modelLargo = new JSONModel();
                modelLargo.setData(oLargoActual);
                this.getOwnerComponent().setModel(modelLargo,Constants.model.largoModel)                
                
            }

		});
	});
