(function () {
    "use strict";
    angular.module("app.module").controller("homeCtrl", homeCtrl);

    homeCtrl.$inject = ["getFileFactory", "$uibModal", "_", "$filter"];

    /**
    * @ngdoc controller
    * @name homeCtrl
    * @module app.module
    * @description Controller da página homeCtrl.html
    */
    function homeCtrl(getFileFactory, $uibModal, _, $filter) {

        var vm = this;

        vm.setPage = setPage;
        vm.checkAll = checkAll;
        vm.checkCheckAll = checkCheckAll;
        vm.modalSalvar = modalSalvar;
        vm.modalEditar = modalEditar;
        vm.excluir = excluir;
        vm.pesquisar = pesquisar;
        vm.seleciona = seleciona;

        iniciar();

        /**
        * @ngdoc method
        * @name iniciar
        * @methodOf app.module:homeCtrl
        * @description Método responsável pelo carregamento inicial
        */
        function iniciar() {
            getFileFactory.get("listaVeiculos.json")
                .then(function (result) {
                    vm.listaVeiculos = result.data;
                    vm.listaVeiculos.forEach(function (item) {
                        item.select = false;
                    });
                    vm.qtdeCheck = 0;
                    vm.qtdeTotalVeiculos = vm.listaVeiculos.length;
                    vm.listaVeiculosOriginal = angular.copy(vm.listaVeiculos);
                })
                .then(function () {
                    vm.maxSize = 5;
                    vm.itemsPerPage = 5;
                    setPage(1);
                });
        }

        /**
        * @ngdoc method
        * @name setPage
        * @methodOf app.module:homeCtrl
        * @description Método responsável por inserir o valor da página corrente
        */
        function setPage(page) {
            vm.currentPage = page;
        }

        /**
        * @ngdoc method
        * @name checkAll
        * @methodOf app.module:homeCtrl
        * @description Método responsável por ativar o checkbox de todos os itens da lista
        */
        function checkAll() {
            if (vm.selectedAll) {
                vm.selectedAll = true;
            } else {
                vm.selectedAll = false;
            }
            var lista = vm.listaVeiculos.slice(((vm.currentPage - 1) * vm.itemsPerPage), (vm.currentPage * vm.itemsPerPage));
            lista.forEach(function (item) {
                item.select = vm.selectedAll;
                if (vm.selectedAll) {
                    vm.qtdeCheck += 1;
                } else {
                    vm.qtdeCheck = 0;
                }
            });
        }

        /**
        * @ngdoc method
        * @name checkCheckAll
        * @methodOf app.module:homeCtrl
        * @description Método responsável por ativar ou não o checkbox que ativa/desativa todos os checks
        */
        function checkCheckAll() {
            vm.qtdeCheck = 0;
            var check = false;
            var lista = vm.listaVeiculos.slice(((vm.currentPage - 1) * vm.itemsPerPage), (vm.currentPage * vm.itemsPerPage));
            lista.forEach(function (item) {
                if (item.select) {
                    vm.qtdeCheck += 1;
                }
            });
            if (vm.qtdeCheck == vm.listaVeiculos.length) {
                check = true;
            }
            vm.selectedAll = check;
        }

        /**
        * @ngdoc method
        * @name modalSalvar
        * @methodOf app.module:homeCtrl
        * @description Método responsável por abrir o Modal para salvar informações novas
        */
        function modalSalvar() {
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "ModalVeiculo.html",
                controller: "modalVeiculoCtrl",
                controllerAs: "mCtrl",
                size: "lg",
                resolve: {
                    veiculo: function () {
                        return vm.veiculoSelecionado = {};
                    },
                    acao: function () {
                        return "salvar";
                    }
                }
            });
            modalInstance.result.then(function (veiculo) {
                vm.pesquisa = "";
                vm.listaVeiculos = vm.listaVeiculosOriginal;

                vm.listaVeiculos.push(veiculo);
                vm.listaVeiculosOriginal = angular.copy(vm.listaVeiculos);
                vm.qtdeTotalVeiculos = vm.listaVeiculos.length;
            });
        }

        /**
        * @ngdoc method
        * @name modalEditar
        * @methodOf app.module:homeCtrl
        * @description Método responsável por abrir o Modal para editar informações existentes
        */
        function modalEditar() {
            var copiaVeiculo = {};
            var veiculoSelecionado = {};
            vm.listaVeiculos.forEach(function (veiculo) {
                if (veiculo.select) {
                    veiculoSelecionado = veiculo;
                    copiaVeiculo = angular.copy(veiculo);
                    copiaVeiculo.placa = $filter("placaFilter")(copiaVeiculo.placa);
                }
            });
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "ModalVeiculo.html",
                controller: "modalVeiculoCtrl",
                controllerAs: "mCtrl",
                size: "lg",
                resolve: {
                    veiculo: function () {
                        return copiaVeiculo;
                    },
                    acao: function () {
                        return "editar";
                    }
                }
            });
            modalInstance.result.then(function (veiculo) {
                vm.pesquisa = "";
                vm.listaVeiculos = vm.listaVeiculosOriginal;
                var listaAtualizada = [];

                vm.listaVeiculos.forEach(function (e) {
                    if (!_.isMatch(e, veiculoSelecionado)) {
                        listaAtualizada.push(e);
                    }
                });
                vm.listaVeiculos = listaAtualizada;
                vm.listaVeiculos.push(veiculo);
                vm.listaVeiculosOriginal = angular.copy(vm.listaVeiculos);
            });
        }

        /**
        * @ngdoc method
        * @name excluir
        * @methodOf app.module:homeCtrl
        * @description Método responsável por excluir um ou vários registros
        */
        function excluir() {
            vm.listaVeiculos = vm.listaVeiculosOriginal;
            var lista = [];
            vm.listaVeiculos.forEach(function (veiculo) {
                if (!veiculo.select) {
                    lista.push(veiculo);
                }
            });
            vm.listaVeiculos = lista;
            vm.listaVeiculosOriginal = angular.copy(vm.listaVeiculos);
            pesquisar(vm.pesquisa);
            checkCheckAll();
        }

        /**
        * @ngdoc method
        * @name pesquisar
        * @methodOf app.module:homeCtrl
        * @description Método responsável por filtrar resultados da pesquisa
        */
        function pesquisar(valor) {
            vm.listaVeiculos = vm.listaVeiculosOriginal;
            if (valor != "") {
                vm.listaVeiculos = $filter("pesquisarFilter")(vm.listaVeiculos, valor);
            }
            checkCheckAll();
        }


        function seleciona(veiculo, valor){
            vm.listaVeiculos[veiculo].select = valor;
            vm.listaVeiculosOriginal = angular.copy(vm.listaVeiculos);
        }
    }
})();