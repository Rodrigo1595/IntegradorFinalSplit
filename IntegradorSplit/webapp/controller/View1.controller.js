sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "IntegradorSplit/IntegradorSplit/util/Formatter",
        "IntegradorSplit/IntegradorSplit/util/Constants",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller,Formatter,Constants,MessageBox,MessageToast) {
		"use strict";

		return Controller.extend("MasterDetail.MasterDetail.controller.Detail", {
            Formatear:Formatter,
			onInit: function () {
                
            },

            onCloseDialog: function(){
                this._oFragment.close();
            },

            onBtnEditPress: function(){
                if (!this._oFragment) {
                this._oFragment = sap.ui.xmlfragment(Constants.ids.idDialogEdit , Constants.routes.FRAGMENTS.dialogEdit, this);
                this.getView().addDependent(this._oFragment);
                     }
                this._oFragment.open();
            },

            onBtnDeletePress: function(){
                
                let oModel = this.getOwnerComponent().getModel(Constants.model.modeloSeleccionado);
                let oItemSelected = oModel.getProperty(Constants.properties.ProductName);

                MessageBox.confirm(`Esta seguro de eliminar este item? ${oItemSelected} `,{
                    title:"Esta seguro?",
                    onClose: null,
                    styleClass: "",
                    actions: [ sap.m.MessageBox.Action.OK,
                    sap.m.MessageBox.Action.CANCEL ],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit 
                })
            },

            onBtnCopyPress: function(){
                let oBundleCopy= this.getOwnerComponent().getModel(Constants.model.I18n).getResourceBundle().getText("MsgShowCopy");
                MessageToast.show(`${oBundleCopy}`, {
                    duration: 3000,                  
                    width: "15em",                      
                    onClose: null,                   
                    autoClose: true,                 
                    animationTimingFunction: "ease", 
                    animationDuration: 1000,         
                    closeOnBrowserNavigation: true  
            })

        }

	});
});
