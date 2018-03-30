/**
 * Created by qh on 2018/3/26.
 */
angular.module('Directives', [])

    // 自定义指令
    .directive('loading', function () {
        return {
            restrict: 'A',
            replace: true,
            template: '<img class="loadImg" src="./public/loading.gif" alt="" />'
        }
    })

    .directive('imageonload', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('load', function () {
                    //call the function that was passed
                    scope.$apply(attrs.imageonload);
                });
            }
        };
    })
    /*重复数据最后一条渲染成功后回调*/
    .directive('onFinishRenderFilters', function ($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    scope.time = $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                        $timeout.cancel(scope.time);
                    });
                }
            }
        };
    });