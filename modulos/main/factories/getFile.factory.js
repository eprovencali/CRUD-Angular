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