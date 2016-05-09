angular.module('starter.my_http_services', [])
  .factory('myHttp', function ($http) {

    return {
        post:function(url,post_data,success_action,error_action){
          var http_success_action = function(respond){
            //读取data,如果response.data['login_status'] == 'no_login',页面自动跳到登陆页面
            success_action(respond);
          }

          $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
          var request = {
            method: 'POST',
            url: url,
            data: post_data
          }
          $http(request).then(
            http_success_action,
            error_action
          );
        }
    };
  });


