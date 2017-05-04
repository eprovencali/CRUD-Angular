(function () {
    "use strict";

    angular.module("app.module").filter("placaFilter", placaFilter);

    placaFilter.$inject = ["$filter", "_"];

    /**
    * @ngdoc filter
    * @name placaFilter
    * @module app.module
    * @description Filtro que retorna placa somente com letras e números
    * @param {string} placa placa a ser tratada
    **/
    function placaFilter() {
        return function (placa) {
            return placa.replace(/[^a-zA-Z0-9]/g, "").slice(0, 7);
        };
    }
})(); 