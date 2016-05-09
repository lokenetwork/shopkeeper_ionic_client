angular.module('starter.location_services', ['starter.goods_services'])
  .factory('LocationAction', function ($ionicLoading, HotGoods) {

    return {

      update_location: function () {
        this.loading();
        var LocationObject = this;
        ionic.Platform.ready(function () {
          //android 定位可能被墙,要做特殊处理
          if (window.device != undefined && window.device.platform == 'android') {

          } else {
            navigator.geolocation.getCurrentPosition(
              function (position) {
                //判断设备类型,缓存定位信息
                ionic.Platform.ready(function () {
                  function save_location_in_h5_storage() {
                    var location = {};
                    location['latitude'] = position.coords.latitude;
                    location['longitude'] = position.coords.longitude;
                    location['altitude'] = position.coords.altitude;
                    location['accuracy'] = position.coords.accuracy;
                    location['altitudeAccuracy'] = position.coords.altitudeAccuracy;
                    location['heading'] = position.coords.heading;
                    location['speed'] = position.coords.speed;
                    location['timestamp'] = position.coords.timestamp;
                    //web h5 缓存定位信息
                    window.localStorage["location_info"] = JSON.stringify(location);
                  }

                  //暂时全部用h5缓存,有时间再优化
                  if (window.device != undefined) {
                    //其他平台,sqlite缓存定位信息
                    save_location_in_h5_storage();
                  } else {
                    save_location_in_h5_storage();
                  }
                  LocationObject.location_change_event();
                  $ionicLoading.hide();
                });


              },
              function onError(error) {
                $ionicLoading.hide();
                //app定位失败,根据ip地址定位
                alert('code: ' + error.code + '\n' +
                  'message: ' + error.message + '\n');
              }
            );
          }
        });
      },

      loading: function () {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br/>定位中...'
        });
      },

      //位置改变触发事件
      location_change_event: function () {
        //推荐爆款商品数据变换
        console.log(window.localStorage["location_info"]);
        console.log("推荐爆款商品数据变换ing");
        HotGoods.initial_hot_goods_data();
        window.localStorage["show_location_info"] = 1;

      },

      hide_location_info: function () {
        window.localStorage.removeItem('show_location_info');
      },

      show_location_info: function () {
        window.localStorage["show_location_info"] = 1;

      },

      get_location_name: function () {
        return '深圳市龙岗区布吉中心花园陌陌摸摸弄';
      },

    };
  })
  //获取位置信息类
  .factory('LocationData', function ($ionicLoading) {

    return {
      get_latitude: function () {
        if (window.localStorage["location_info"] != undefined) {
          location_info = JSON.parse(window.localStorage["location_info"]);
          return location_info.latitude;
        } else {
          return false;
        }
      },
      get_longitude: function () {
        if (window.localStorage["location_info"] != undefined) {
          location_info = JSON.parse(window.localStorage["location_info"]);
          return location_info.longitude;
        } else {
          return false;
        }
      },
      get_base_location_info_fadeLeftClass:function(){
        if (window.localStorage["show_location_info"] != undefined && window.localStorage["show_location_info"] == 1 ) {
          return 'fadeInDown';
        } else {
          return 'fadeOutUp';
        }
      }

    };
  });


