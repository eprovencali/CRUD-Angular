(function () {
    "use strict";

    angular.module("app.module").filter("pesquisarFilter", pesquisarFilter);

    pesquisarFilter.$inject = ["$filter", "_"];

    /**
    * @ngdoc filter
    * @name pesquisarFilter
    * @module app.module
    * @description Filtro que retorna array de objetos retornados de acordo com o valor passado
    * @param {string} array array que será pesquisado
    * @param {string} valor Valor a ser procurado 
    **/
    function pesquisarFilter($filter, _) {
        return function (array, valor) {
            var array_matches = [];
            array_matches.push($filter("filter")(array, { combustivel: valor }));
            array_matches.push($filter("filter")(array, { marca: valor }));
            return _.uniq(_.flatten(array_matches));
        };
    }
})(); 