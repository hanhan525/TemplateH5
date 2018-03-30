/**
 * Created by qh on 2018/3/29.
 */
var moduleshare = (function(mode,$){
    mode.GetRequest = function() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    mode.params = mode.GetRequest();
    mode.changeURLPar = function(destiny, par, par_value)
    {
        var pattern = par+'=([^&]*)';
        var replaceText = par+'='+par_value;
        if (destiny.match(pattern))
        {
            var tmp = '/\\'+par+'=[^&]*/';
            tmp = destiny.replace(eval(tmp), replaceText);
            return (tmp);
        }
        else
        {
            if (destiny.match('[\?]'))
            {
                return destiny+'&'+ replaceText;
            }
            else
            {
                return destiny+'?'+replaceText;
            }
        }
        return destiny+'\n'+par+'\n'+par_value;
    }
    var wx_url = "";

    if(mode.params.userid == undefined){
        mode.params.shareuserid = mode.params.shareuserid;
        window.location.href = "http://720qf.com/KFWeb/normalwxlogin.html?aid="+mode.params.aid+"&pid="+mode.params.pid+"&mid="+mode.params.mid+"&shareuserid="+mode.params.shareuserid;
    }else if( mode.params.userid.indexOf("1-")!=-1) {
        mode.params.shareuserid = mode.params.userid.split("-")[1];
        window.location.href = "http://720qf.com/KFWeb/normalwxlogin.html?aid="+mode.params.aid+"&pid="+mode.params.pid+"&mid="+mode.params.mid+"&shareuserid="+mode.params.shareuserid;
    }


    var url= window.location.href;
    var deleteuid2 = mode.changeURLPar(url,'userid','1-'+mode.params.userid);


    var nowurl = encodeURIComponent(window.location.href);


     (function(url,deleteuid2){
        $.ajax({
            url: "http://gravity-ar.com/WeiXinShare?urlData=" + url, //请求地址
            type: "POST", //请求方式
            dataType: "json",
            success: function(response, xml) {
                // 此处放成功后执行的代码
                var obj = response;
                wx_url=obj.url;
                wx_timestamp = obj.timestamp;
                wx_noncestr = obj.nonceStr;
                wx_signature = obj.signature;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wx9034f6f6ca243cff', // 必填，公众号的唯一标识
                    timestamp: obj.timestamp, // 必填，生成签名的时间戳
                    nonceStr: obj.nonceStr, // 必填，生成签名的随机串
                    signature: obj.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                wx.ready(function() {

                    wx.onMenuShareTimeline({
                        title: '绿地·太平湖', // 分享标题
                        link: deleteuid2, // 分享链接
                        imgUrl: 'http://720qf.com/taipinghu/logo.jpg', // 分享图标
                        success: function() {
                            // 用户确认分享后执行的回调函数

                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                    wx.onMenuShareAppMessage({
                        title: '绿地·太平湖', // 分享标题
                        desc: '湖山里的世界时光', // 分享描述
                        link: deleteuid2, // 分享链接
                        imgUrl: 'http://720qf.com/taipinghu/logo.jpg', // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {
                            // 用户确认分享后执行的回调函数

                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    });

                });


            },
            error: function(status) {
                // 此处放失败后执行的代码
            }
        });

    })(nowurl,deleteuid2)
    return mode;

})(window.moduleshare||{},$)