/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"IntegradorSplit/IntegradorSplit/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
