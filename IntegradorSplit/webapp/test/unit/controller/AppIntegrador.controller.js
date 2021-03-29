/*global QUnit*/

sap.ui.define([
	"IntegradorSplit/IntegradorSplit/controller/AppIntegrador.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AppIntegrador Controller");

	QUnit.test("I should test the AppIntegrador controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
