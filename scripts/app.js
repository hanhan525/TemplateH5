/**
 * Created by qh on 2018/3/26.
 */
var myApp = new Framework7();

var $$ = Dom7;

var  kj = angular.module('TempleteKF',['ui.router','Controllers','Directives','ngAnimate']);

kj.config(["$stateProvider",'$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('aeriaView',{
            url:'/aeriaView',
            templateUrl:'./views/Aerialview.html',
            controller:'aeriaViewController'
        })
        .state('buildBooksView',{
            url:'/buildBooksView',
            templateUrl:'./views/BuildBooks.html',
            controller:'buildBooksViewController'
        })
        .state('houseTypeRepleaseView',{
            url:'/houseTypeRepleaseView',
            templateUrl:'./views/HouseTypeRepleaseView.html',
            controller:'houseTypeRepleaseViewController'
        })
        .state('houseTypeView',{
            url:'/houseTypeView',
            templateUrl:'./views/HouseTypeView.html',
            controller:'houseTypeViewController'
        })
        .state('houseTypeView.normalpanel',{
            url:'/normalpanel',
            templateUrl:'./views/houseType_panel.html',
            controller:'houseTypePanelViewController'
        })
        .state('houseTypeView.threeDpanel',{
            url:'/threeDpanel',
            templateUrl:'./views/houseType_3d.html',
            controller:'houseType_3dViewController'
        })
        .state('sampleroomView',{
            url:'/sampleroomView',
            templateUrl:'./views/sampleroomView.html',
            controller:'sampleroomViewController'
        })
        .state('roamingView',{
            url:'/roamingView',
            templateUrl:'./views/roamingView.html',
            controller:'roamingViewController'
        })
        .state('singleBuildRollView',{
            url:'/singleBuildRollView',
            templateUrl:'./views/singleBuildRollView.html',
            controller:'singleBuildRollViewController'
        })
        .state('helpToolsView',{
            url:'/helpToolsView',
            templateUrl:'./views/helpToolsView.html',
            controller:'helpToolsViewController'
        })
        .state('quweiView',{
            url:'/quweiView',
            templateUrl:'./views/quweiView.html',
            controller:'quweiViewController'
        });

    $urlRouterProvider.otherwise('',{
        template:'<div></div>'
    });
}]);
kj.animation('.fad',function(){
    return {
        enter: function(element, done) {
            element.css({
                opacity: 0,
                'margin-left': '100%'
            });
            element.animate({
                opacity: 1,
                'margin-left': '0%'
            }, 500, done);
        },
        leave: function (element, done) {
            element.css({
                opacity: 1,
                'margin-left': '0%'
            });
            element.animate({
                opacity: 0,
                'margin-left': '-100%'
            }, 500, done);
        }
    };
})

kj.run(['$rootScope','$http','$location','$state',function($rootScope,$http,$location,$state){
    
    $rootScope.bottomBarShow = false;
    embedpano({
        swf:"tour.swf",
        xml:"Panoram/YaJuLe.xml",
        target:"pano",
        html5:"auto",
        initvars:{design:"flat"},
        passQueryParameters:true
    });
    /*全景数组*/
    $rootScope.panoArray = ['scene_niaokan','scene_kecanting','scene_woshi','scene_yangtai','scene_yuanjing','scene_beixiaozhen'];
    /*当前全景下标*/
    $rootScope.currentPanoIndex = 0;
    /*是否加载过北小镇小行星*/
    $rootScope.littleTown = true;
    /*菊花*/
    $rootScope.loaded = true;

    /*
    * menu按下数组列表
    * */
    $rootScope.lastBtn = 0;
    $state.go('aeriaView');
    $rootScope.menuArr = [{show:true},{show:false},{show:false},{show:false},{show:false},{show:false},{show:false}];
    $rootScope.menuClick = function(index){
        $rootScope.menuArr[$rootScope.lastBtn].show = false;
        $rootScope.menuArr[index].show = true;
        $rootScope.lastBtn = index;
        switch (index){
            case 0:
                $state.go('aeriaView');
                break;
            case 1:
                $state.go('buildBooksView');
                break;
            case 2:
               /* $state.go('houseTypeView.normalpanel');*/
                $state.go('houseTypeRepleaseView');
                break;
            case 3:
                $state.go('sampleroomView');
                break;
            case 4:
                $state.go('roamingView');
                break;
            case 5:
                $state.go('singleBuildRollView');
                break;
            case 6:
                $state.go('quweiView');
                break;
        }
    }

    /*
    * 小行星开场后延迟加载动画
    * */
    window.showmenu  = function(){
        setTimeout(function(){
            $rootScope.marbottom = {
                'bottom':'0px'
            }
            $rootScope.bottomBarShow = true;
            $rootScope.$apply();
        },1500)
    }


    /*
     * pano Event
     * */
    window.clickRoll = function(){
        $rootScope.menuClick(5);
    }


}]);