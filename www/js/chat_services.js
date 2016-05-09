angular.module('starter.chat_services', [])
  .factory('Websocket', function ($rootScope, myHttp, Setting) {
    var ws;
    var auto_connect_number;
    var re_connecting = false;
    var auto_connect_times = 0;
    var login_token;
    var message_list = [];

    var _recieve_msg = function (e) {
      var recieve_msg_data = JSON.parse(e.data)
      console.log(recieve_msg_data);
      var message_item = {
        type: "receive",
        message: recieve_msg_data.content.message
      }
      message_list[recieve_msg_data.content.fromBuyerWebsocketId].push(message_item);
      $rootScope.$emit("chat_data_change")
    };
    var _error_deal = function () {
      //lazy do,记录错误日志,提交到服务器
    };
    var _server_close_deal = function (event) {
      var myDate = new Date();
      if (!re_connecting) {
        _auto_connect();
      }
    };
    var _send_msg = function (data) {
      console.log(JSON.stringify(data))
      ws.send(JSON.stringify(data));
    };
    var _login_auth = function () {
      //500毫秒读一次看看login_token,又没获取到了
      var check_login_token_intervel = setInterval(
        function () {
          if (login_token != undefined) {
            clearInterval(check_login_token_intervel);
            //发送消息,认证此websocket链接
            var login_message = {
              command: 'set_login_info',
              //content是登陆token
              content: {
                "loginToken": login_token
              },
            };
            _send_msg(login_message);


          }
        }, 500
      )

    }
    //获取php端的login token
    var _get_login_token = function () {
      //这个后续开发,应该不用http,直接读取登陆cookie的passport就行
      login_token = "HqjeQWbBMiyPSkSxUeDVLfNKJwCQCT";
    }
    var _connect = function () {
      auto_connect_times++;
      if (auto_connect_times > 10) {
        _del_auto_connect();
        return false;
      }

      if (ws == undefined || ws.readyState == 0 || ws.readyState == 2 || ws.readyState == 3) {
        ws = new WebSocket("ws://192.168.1.250:9080/shoper-entry");
        ws.onopen = function () {
          console.log("ws--open")
          _login_auth();
          _del_auto_connect();
        };
        ws.onmessage = _recieve_msg;
        ws.onerror = _error_deal;
        ws.onclose = _server_close_deal;
      }

    };
    var _auto_connect = function () {
      re_connecting = true;
      auto_connect_number = setInterval(
        _connect, 5000
      );
    };
    var _del_auto_connect = function () {
      clearInterval(auto_connect_number);
      auto_connect_times = 0;
      re_connecting = false;
    }
    return {
      init: function () {
        _get_login_token();
        this.connect();
      },
      connect: function () {
        _connect();
      },
      server_close_deal: function (event) {
        _server_close_deal(event);
      },
      get_connect: function () {
        this.connect();
        return ws;
      },
      send_msg: function (toBuyeressage) {
        _send_msg(toBuyeressage);
        if (toBuyeressage.command == 'send_shoper_message') {
          var message_item = {
            type: "reply",
            message: toBuyeressage.content.message
          }
          message_list[toBuyeressage.content.toBuyerWebsokcetId].push(message_item);
        }
      },
      recieve_msg: function (e) {
        _recieve_msg(e);
      },
      get_message_list: function (toBuyerWebsokcetId) {
        if (message_list[toBuyerWebsokcetId] == undefined) {
          message_list[toBuyerWebsokcetId] = [];
        }
        return message_list[toBuyerWebsokcetId]
      }
    }
  })
;
