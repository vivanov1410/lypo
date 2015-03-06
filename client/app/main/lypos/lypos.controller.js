(function () {
  'use strict';

  angular
    .module('lypo.app')
    .controller('LyposCtrl', LyposCtrl);

  function LyposCtrl($scope, $modal, Lypos) {
    var vm = this;

    vm.groups = [];
    vm.loading = true;

    vm.openCreate = openCreate;
    vm.openRemove = openRemove;
    vm.isEmpty = isEmpty;

    activate();

    ////////////////////////////////

    function activate() {
      loadLypos();
    }

    function loadLypos() {
      vm.loading = true;
      Lypos
        .query()
        .then(function (lypos) {
          vm.lypos = lypos;
          vm.empty = lypos.length === 0;
          sortGroups();
          vm.loading = false;
        });
    }

    function openCreate() {
      var modalInstance = $modal.open({
        templateUrl: 'app/main/lypos/create/lypo.create.html',
        controller: 'LypoCreateCtrl',
        controllerAs: 'vm'
      });

      modalInstance.result.then(function () {
        loadLypos();
      });
    }

    function openRemove(lypo) {
      var modalInstance = $modal.open({
        templateUrl: 'app/main/lypos/remove/lypo.remove.html',
        controller: 'LypoRemoveCtrl',
        controllerAs: 'vm',
        resolve: { lypo: function () { return lypo; } }
      });

      modalInstance.result.then(function () {
        loadLypos();
      });
    }

    function sortGroups() {
      vm.groups = [];
      _.each(vm.lypos, function (lypo) {
        var day = lypo.at.format('MMM D');
        var group = _.find(vm.groups, { day: day });
        if(group) {
          group.lypos.push(lypo);
        } else {
          vm.groups.push({
            day: day,
            lypos: [lypo]
          });
        }
      });
    }

    function isEmpty() {
      return vm.lypos && vm.lypos.length === 0;
    }
  }
})();