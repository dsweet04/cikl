


var app = angular.module('ciklApp', [
  'ui.bootstrap',
  'sy.bootstrap.timepicker',
  'template/syTimepicker/timepicker.html',
  'template/syTimepicker/popup.html'
]);

app.controller("SearchCtrl", function($scope, $http) {
  $scope.term = {};

  $scope.import_min = new Date();
  $scope.import_max = new Date();
  $scope.detect_min = new Date();
  $scope.detect_max = new Date();

  $scope.detect_min.setDate($scope.detect_min.getDate() -30);
  $scope.import_min.setDate($scope.import_min.getDate() -30);


  DetectMinTimeCtrl = function ($scope) {
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  };

  DetectMinDateCtrl = function ($scope) {
    $scope.today = function() {
      $scope.detect_min = $;
    };

    $scope.clear = function () {
      $scope.detect_min = null;
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.format = 'MMMM dd, yyyy';
  };

  DetectMaxTimeCtrl = function ($scope) {
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };
  };

  DetectMaxDateCtrl = function ($scope) {
    $scope.today = function() {
      $scope.detect_max = new Date();
    };

    $scope.clear = function () {
      $scope.detect_max = null;
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.format = 'MMMM dd, yyyy';
  };






  // ngShow boolean
  $scope.searched = false;

  // Sort initial type
  $scope.orderBy = 'import_time';
  $scope.order = 'desc';

  // Pagination Settings
  $scope.itemsPerPage = 20;
  $scope.maxSize = 10;
  $scope.currentPage = 1;

  // Search page top form requests
  $scope.search = function(artifact) {
    $scope.term = artifact.term;
    $scope.type = artifact.type;
    $scope.searched = true;

    // Search Function
    $scope.update();
  };

  // Update artifacts for search
  $scope.updateFqdn = function(fqdn) {
    $scope.type = 'fqdn';
    $scope.term = fqdn;
    document.getElementById("search-type").value = 'fqdn';
    document.getElementById("search-term").value = fqdn;
  }

  $scope.updateIpv4 = function(ipv4) {
    $scope.type = 'ipv4';
    $scope.term = ipv4;
    document.getElementById("search-type").value = 'ipv4';
    document.getElementById("search-term").value = ipv4;
  }

  // Sort button functions
  $scope.sortDetect = function() {
    if ($scope.orderBy === 'detect_time') {
      if ($scope.order === 'desc') {
        $scope.order = 'asc';
      }
      else {
        $scope.order = 'desc';
      }
    }
    else {
      $scope.order = 'desc';
      $scope.orderBy = 'detect_time';
    }
  };

  $scope.sortImport = function() {
    if ($scope.orderBy === 'import_time') {
      if ($scope.order === 'desc') {
        $scope.order = 'asc';
      }
      else {
        $scope.order = 'desc';
      }
    }
    else {
      $scope.order = 'desc';
      $scope.orderBy = 'import_time';
    }
  };

  $scope.sortSource = function() {

  };

  // Pagination Settings
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };

  // Filter Button Collapse Initial state
  $scope.isCollapsedImport = true;
  $scope.isCollapsedDetect = true;

  $scope.$watch ('currentPage', function () {
    $scope.update();
  });

  // Sort watch functions
  $scope.$watch ('orderBy', function () {
    $scope.update();
  });

  $scope.$watch ('order', function () {
    $scope.update();
  });


  $scope.$watch ('term', function () {
    $scope.update();
  });


  // API requests Function
  $scope.update = function () {

    if ($scope.type === 'ipv4') {
      $http.post('http://localhost:8080/api/v1/query.json',
          {
            start: 1 + ( ($scope.currentPage-1) * 10),
            per_page: $scope.itemsPerPage,
            order_by: $scope.orderBy,
            order: $scope.order,
            timing: 1,
            ipv4: $scope.term
          }).
          success(function (data) {
            $scope.query = data;

            // For pagination
            $scope.totalItems = parseInt($scope.query.total_events);
          }).
          then(function() {

          });
    }
    else if ($scope.type === 'fqdn') {
      $http.post('http://localhost:8080/api/v1/query.json',
          {
            start: 1 + ( ($scope.currentPage-1) * 10),
            per_page: $scope.itemsPerPage,
            order_by: $scope.orderBy,
            order: $scope.order,
            timing: 1,
            fqdn: $scope.term
          }).
          success(function (data) {
            $scope.query = data;

            // For pagination
            $scope.totalItems = parseInt($scope.query.total_events);
          }).
          then(function() {

          }
      );
    }
  };



}); // End searchCtrl


var DatepickerMinCtrl = function ($scope) {
  $scope.today = function() {
    $scope.date = new Date();
    $scope.date.setDate($scope.date.getDate() -30);
  };
  $scope.today();

  $scope.clear = function () {
    $scope.date = null;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'MMMM dd, yyyy';
};


var TimepickerMinCtrl = function ($scope) {
  $scope.date = new Date();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
};


var DatepickerMaxCtrl = function ($scope) {
  $scope.today = function() {
    $scope.date = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.date = null;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'MMMM dd, yyyy';
};


var TimepickerMaxCtrl = function ($scope) {
  $scope.date = new Date();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
};