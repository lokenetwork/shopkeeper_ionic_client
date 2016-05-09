angular.module('starter.chat_controllers', ["starter.keyboard_services", "starter.chat_services"])

  //商品控制器析构
  .controller('chatBaseCtrl', function ($rootScope, Websocket) {
    Websocket.init();


  })

  .controller('talkingCtrl', function ($scope, AppKeyboard, $stateParams, Websocket,$rootScope) {

    $scope.template_data = {
      need_send_msg: "sadasd",
      show_addition_button: false
    };

    $rootScope.$on("chat_data_change",function () {
      $scope.$apply();
    })

    $scope.message_list = Websocket.get_message_list($stateParams.toBuyerWebsokcetId);
    console.log($scope.message_list)
    $scope.send_msg = function () {
      AppKeyboard.close();

      var normal_message = {
        command: 'send_shoper_message',
        //content是登陆token
        content: {
          "toBuyerUserId": parseInt($stateParams.toBuyerUserId),
          "toBuyerWebsokcetId": parseInt($stateParams.toBuyerWebsokcetId),
          "message": $scope.template_data['need_send_msg']
        },
      };

      Websocket.send_msg(normal_message);

      console.log($scope.message_list)

      $scope.template_data['need_send_msg'] = "";

    }

    $scope.show_addition_button = function () {
      $scope.template_data["show_addition_button"] = true;
    }

    $scope.hide_addition_button = function () {
      $scope.template_data["show_addition_button"] = false;
    }


  })
;