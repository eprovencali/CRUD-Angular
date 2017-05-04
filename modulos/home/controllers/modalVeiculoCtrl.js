(function () {
    "use strict";

    angular.module("app.module").controller("modalVeiculoCtrl", modalVeiculoCtrl);

    modalVeiculoCtrl.$inject = ["$uibModalInstance", "veiculo", "acao"];

    /**
    * @ngdoc controller
    * @name modalVeiculoCtrl
    * @module app.module
    * @description Controller da modal modalVeiculoCtrl
    */
    function modalVeiculoCtrl($uibModalInstance, veiculo, acao) {
        var vm = this;

        vm.veiculo = veiculo;
        vm.acao = acao;

        vm.tipoCombustivel = ["Alcool", "Flex", "Gasolina"];

        vm.ok = function () {
            $uibModalInstance.close(vm.veiculo);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    }
})();