/* Copyright start
  Copyright (C) 2008 - 2024 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
/* author: kimd@fortinet.com
  modified: 240830 */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editDanny_playbook_c3_charts200Ctrl', editDanny_playbook_c3_charts200Ctrl);

  editDanny_playbook_c3_charts200Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'toaster', 'Field', 'dannyJSUtil_v1', 'dannyPlaybookUtil_v1', 'dannyFormEntityServiceUtil_v1'];

  function editDanny_playbook_c3_charts200Ctrl($scope, $uibModalInstance, config, toaster, Field, dannyJSUtil_v1, dannyPlaybookUtil_v1, dannyFormEntityServiceUtil_v1) {
    $scope.config = config;



    // -------------------------------------------------------- Title Start  --------------------------------------------------------
    $scope.config.title = dannyJSUtil_v1.default_value_if_undefined($scope.config.title, "");
    $scope.data_cs_title = new Field({
      "name": "data_cs_title",
      "formType": "text",
      "title": "Title",
      "writeable": true,
      "validation": {
        "required": false
      }
    });
    $scope.config.title_show = dannyJSUtil_v1.default_value_if_undefined($scope.config.title_show, false);
    // -------------------------------------------------------- Title End  --------------------------------------------------------



    // -------------------------------------------------------- Playbook Util Start  --------------------------------------------------------
    $scope.config.dp_playbook_1 = dannyJSUtil_v1.default_value_as_object($scope.config.dp_playbook_1);
    $scope.dp_playbook_1 = dannyPlaybookUtil_v1.init($scope, $scope.config.dp_playbook_1);


    $scope.$watch("dp_playbook_1.scope.config.data_cs_selected_playbook", function (newValue, oldValue) {
      if (newValue !== undefined && newValue !== null) {
        $scope.$broadcast("d_playbook_status", { "status": "active", "workflow_id": true })
        $scope.dp_playbook_1.execute_playbook(newValue);
      }
    });


    $scope.dp_playbook_1.scope.$on('d_playbook_status', function (event, json_data) {
      console.debug('d_playbook_status', json_data);

      const playbook_status = json_data.status;
      const response = json_data.response;

      if (playbook_status === 'finished' && response['@type'] === 'Workflow') {
        $scope.dp_playbook_1.scope.data_cs_playbook_result_model = response;
        if (!response.result.data)
          toaster.error({ body: `result of playbook must contain a valid chart data, {{result.data}} must contain a valid c3 chart data` });
        else {
          $scope.chart_data = JSON.parse(JSON.stringify(response.result.data));
          render_chart();
        }
      }
      else {
        $scope.dp_playbook_1.scope.data_cs_playbook_result_model = { "status": playbook_status };
      }

      delete $scope.dp_playbook_1.scope.data_cs_playbook_result;
      $scope.dp_playbook_1.scope.data_cs_playbook_result = new Field({
        "formType": "json",
        "writeable": false,
        "validation": {
          "required": true
        }
      });
    });
    // -------------------------------------------------------- Playbook Util End  --------------------------------------------------------


    // -------------------------------------------------------- Common start  --------------------------------------------------------
    $scope.$on("$destroy", function () {
      $scope.$broadcast('$destory');
    });
    // -------------------------------------------------------- Common end  --------------------------------------------------------



    // -------------------------------------------------------- Rendering Chart Start  --------------------------------------------------------
    $scope.chart_uid = "dc-" + crypto.randomUUID();

    $scope.render_chart = render_chart;
    function render_chart() {
      // todo add animation option
      try {
        $scope.chart_data["bindto"] = "#" + $scope.chart_uid;
        $scope.chart = c3.generate($scope.chart_data);
      }
      catch (error) {
        toaster.error({ body: `result of playbook must contain a valid chart data, {{result.data}} must contain a valid c3 chart data` });
      }
    }
    // -------------------------------------------------------- Rendering Chart End  --------------------------------------------------------



    // -------------------------------------------------------- UI start  --------------------------------------------------------
    $scope.bt_cancel = bt_cancel;
    $scope.bt_save = bt_save;


    function bt_cancel() {
      $uibModalInstance.dismiss('cancel');
    }


    function bt_save() {
      if ($scope.editWidgetForm.$invalid) {
        $scope.editWidgetForm.$setTouched();
        $scope.editWidgetForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }
    // -------------------------------------------------------- UI end  --------------------------------------------------------
  }
})();
