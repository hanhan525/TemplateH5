/**
 * Created by qh on 2018/3/26.
 */
/*过滤器 不过滤聊天信息的css*/
kj.filter(
    'to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]
);
