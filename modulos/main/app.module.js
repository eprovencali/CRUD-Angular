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