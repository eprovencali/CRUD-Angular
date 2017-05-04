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