/**
 * Created by qh on 2018/3/26.
 */
angular.module('Controllers', [])
    .controller('aeriaViewController',['$scope','$rootScope','$http','$state',function($scope,$rootScope,$http,$state) {
        console.log("aeriaViewController");
        /*$state.go('secondView');*/
        var krpano = document.getElementById("krpanoSWFObject");
        if($rootScope.currentPanoIndex!=0){
            krpano.call("loadscene("+$rootScope.panoArray[0]+",null,MERGE,BLEND(1));");
            $rootScope.currentPanoIndex = 0;
        }
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[0].show = true;
        $rootScope.lastBtn = 0;
    }])
    /*
    * 楼书
    *
    * */
    .controller('buildBooksViewController',['$scope','$rootScope','$http',function($scope,$rootScope,$http) {
        console.log("secondViewController");
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[1].show = true;
        $rootScope.lastBtn = 1;
        $scope.init = function(){
            var Swiper = myApp.swiper(
                ".swiper-vertical",
                {
                    direction: 'vertical',
                    pagination: ' .swiper-pagination',
                    paginationClickable: true,
                    resistanceRatio: 0,//禁止回弹
                    onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
                        swiperAnimateCache(swiper); //隐藏动画元素
                        swiperAnimate(swiper); //初始化完成开始动画

                    },
                    onSlideChangeEnd: function(swiper){
                        swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画

                    }
                });
        }

    }])

    /*
    * 户型暂时代替页面
    * */

    .controller('houseTypeRepleaseViewController',['$scope','$rootScope','$location',function($scope,$rootScope,$location){
        console.log("houseTypeRepleaseViewController");
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[2].show = true;
        $rootScope.lastBtn = 2;
        var krpano = document.getElementById("krpanoSWFObject");
        krpano.call("loadscene("+$rootScope.panoArray[1]+",null,MERGE,BLEND(1));");
        $rootScope.currentPanoIndex = 1;
    }])
    /*
     * 户型鉴赏
     * */
    .controller('houseTypeViewController',['$scope','$rootScope','$location',function($scope,$rootScope,$location){
        console.log("houseTypeViewController");
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[2].show = true;
        $rootScope.lastBtn = 2;
        $scope.normalSelect = true;
        $scope.changeselect = function(){
            if( $scope.normalSelect){
                $location.path('/houseTypeView/normalpanel');
            }else {
                $location.path('/houseTypeView/threeDpanel');
            }
        }
    }])
    /*
    * 平面户型
    * */
    .controller('houseTypePanelViewController',['$scope','$rootScope',function($scope,$rootScope){
        console.log("houseTypePanelViewController");
        $scope.$parent.normalSelect = true;
        console.log($scope);
    }])
    /*
     * 3D户型
     * */
    .controller('houseType_3dViewController',['$scope','$rootScope',function($scope,$rootScope){
        console.log("houseType_3dViewController");
        $scope.$parent.normalSelect = false;

    }])

    .controller('sampleroomViewController',['$scope','$rootScope',function($scope,$rootScope){
        console.log("sampleroomViewController");
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[3].show = true;
        $rootScope.lastBtn = 3;
    }])

    /*
    *
    * 北小镇鸟瞰
    * */
    .controller('roamingViewController',['$scope','$rootScope',function($scope,$rootScope){
        console.log("roamingViewController");
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[4].show = true;
        $rootScope.lastBtn = 4;
        var krpano = document.getElementById("krpanoSWFObject");
        if($rootScope.currentPanoIndex!=5){
            if(!$rootScope.littleTown){
                krpano.call("loadscene("+$rootScope.panoArray[5]+",null,MERGE,BLEND(1));littlePanoReload();");
                $rootScope.littleTown = true;
            }else {
                krpano.call("loadscene("+$rootScope.panoArray[5]+",null,MERGE,BLEND(1));");
            }
            $rootScope.currentPanoIndex = 5;
        }



    }])

    /*
    * 单体旋转
    * */

    .controller('singleBuildRollViewController',['$scope','$rootScope','$location','$state',function($scope,$rootScope,$location,$state){
        console.log("singleBuildRollViewController");
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[5].show = true;
        $rootScope.lastBtn = 5;
        $scope.loadImgs = function(){
            zc_buildAxisSlide($('.danti01'));
        }

        $scope.gotoHousetype =function(){$state.go('houseTypeRepleaseView');}
        /*$scope.gotoHousetype =function(){$location.path('/houseTypeView/normalpanel');}*/
    }])

    .controller('helpToolsViewController',['$scope','$rootScope',function($scope,$rootScope){
        console.log("helpToolsViewController");
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[6].show = true;
        $rootScope.lastBtn = 6;
        /*导航*/
        $scope.gotopro = function(){
            window.location.href = "https://apis.map.qq.com/uri/v1/routeplan?type=drive&from=&fromcoord=&to=金谷㙟顶&tocoord=22.7965184471,112.6195192337&policy=0&referer=myapp";
        }
        /*打电话*/
        $scope.tellpro = function(){
            window.location.href = "tel:1311111111";
        }
    }])

    .controller('quweiViewController',['$scope','$rootScope',function($scope,$rootScope){
        console.log("quweiViewController");
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[6].show = true;
        $rootScope.lastBtn = 6;
        window.chagetoVideoView();
    }])