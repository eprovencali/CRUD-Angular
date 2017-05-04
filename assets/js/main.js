angular.module("app.module", ["ui.bootstrap", "ui.utils.masks", "ngRoute", "ngSanitize", "underscore", "oc.lazyLoad"])

    .config(["$locationProvider", function ($locationProvider) {
        $locationProvider.hashPrefix("");
    }])

    .config(["$routeProvider", function ($routeProvider) {

        $routeProvider
            .when("/home", {
                templateUrl: "/views/home.html",
                controller: "homeCtrl as hCtrl",
                resolve: {
                    lazy: ["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: ["/assets/js/home.js"]
                        }]);
                    }]
                }
            })

            .otherwise({
                redirectTo: "/home"
            });
    }]);
"use strict";
angular.module("ngLocale", [], ["$provide", function ($provide) {
    var PLURAL_CATEGORY = { ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other" };
    $provide.value("$locale", {
        "DATETIME_FORMATS": {
            "AMPMS": [
                "AM",
                "PM"
            ],
            "DAY": [
                "domingo",
                "segunda-feira",
                "ter\u00e7a-feira",
                "quarta-feira",
                "quinta-feira",
                "sexta-feira",
                "s\u00e1bado"
            ],
            "ERANAMES": [
                "Antes de Cristo",
                "Ano do Senhor"
            ],
            "ERAS": [
                "a.C.",
                "d.C."
            ],
            "FIRSTDAYOFWEEK": 6,
            "MONTH": [
                "janeiro",
                "fevereiro",
                "mar\u00e7o",
                "abril",
                "maio",
                "junho",
                "julho",
                "agosto",
                "setembro",
                "outubro",
                "novembro",
                "dezembro"
            ],
            "SHORTDAY": [
                "dom",
                "seg",
                "ter",
                "qua",
                "qui",
                "sex",
                "s\u00e1b"
            ],
            "SHORTMONTH": [
                "jan",
                "fev",
                "mar",
                "abr",
                "mai",
                "jun",
                "jul",
                "ago",
                "set",
                "out",
                "nov",
                "dez"
            ],
            "STANDALONEMONTH": [
                "janeiro",
                "fevereiro",
                "mar\u00e7o",
                "abril",
                "maio",
                "junho",
                "julho",
                "agosto",
                "setembro",
                "outubro",
                "novembro",
                "dezembro"
            ],
            "WEEKENDRANGE": [
                5,
                6
            ],
            "fullDate": "EEEE, d 'de' MMMM 'de' y",
            "longDate": "d 'de' MMMM 'de' y",
            "medium": "d 'de' MMM 'de' y HH:mm:ss",
            "mediumDate": "d 'de' MMM 'de' y",
            "mediumTime": "HH:mm:ss",
            "short": "dd/MM/yy HH:mm",
            "shortDate": "dd/MM/yy",
            "shortTime": "HH:mm"
        },
        "NUMBER_FORMATS": {
            "CURRENCY_SYM": "R$",
            "DECIMAL_SEP": ",",
            "GROUP_SEP": ".",
            "PATTERNS": [
                {
                    "gSize": 3,
                    "lgSize": 3,
                    "maxFrac": 3,
                    "minFrac": 0,
                    "minInt": 1,
                    "negPre": "-",
                    "negSuf": "",
                    "posPre": "",
                    "posSuf": ""
                },
                {
                    "gSize": 3,
                    "lgSize": 3,
                    "maxFrac": 2,
                    "minFrac": 2,
                    "minInt": 1,
                    "negPre": "-\u00a4",
                    "negSuf": "",
                    "posPre": "\u00a4",
                    "posSuf": ""
                }
            ]
        },
        "id": "pt-br",
        "localeID": "pt_BR",
        "pluralCat": function (n) { if (n >= 0 && n <= 2 && n != 2) { return PLURAL_CATEGORY.ONE; } return PLURAL_CATEGORY.OTHER; }
    });
}]);
angular.module("underscore", ["underscore"]);
(function () {

    "use strict";
    
    angular.module("app.module").controller("mainCtrl", mainCtrl);

    mainCtrl.$inject = [];

    /**
     * @ngdoc controller
     * @name mainCtrl
     * @module app.module
     * @description Controller da página mainCtrl.html
     */
    function mainCtrl() {
        
    }
})();
(function () {

    "use strict";

    angular.module("app.module")
        .factory("getFileFactory", getFileFactory);

    getFileFactory.$inject = ["$http", "$q"];

    /**
    * @ngdoc service
    * @name getFileFactory
    * @module app.module
    * @description Factory para pegar valores de JSON
    **/
    function getFileFactory($http, $q) {

        return {
            get: get
        };


        /**
        * @ngdoc method
        * @name get
        * @methodOf getFileFactory
        * @description Metodo responsavel por chamar o controlador e retornar o resultado
        **/
        function get(file) {
            var defer = $q.defer();
            var path = "./assets/data/" + file;
            $http.get(path)
                .then(function (result) {
                    defer.resolve(result);
                })
                .catch(function (erro) {
                    defer.reject(erro);
                });
            return defer.promise;
        }

    }
})();
(function () {

    "use strict";

    angular.module("underscore").factory("_", _);

    _.$inject = ["$window"];

    /**
    * @ngdoc service
    * @name _
    * @module underscore
    * @description Factory de criação do underscore
    **/
    function _($window) {
        return $window._;
    }

})();
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