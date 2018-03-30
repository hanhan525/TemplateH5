/**
 * Created by qh on 2018/3/29.
 */
(function(share,jq){
    console.log(share);
    /*链接融云*/
    var instance = null;
    var beginConnect = function(){
        /*初始化*/
        var  initRongYun = function(params, callbacks, modules){
            var appKey = params.appKey;
            var token = params.token;
            var navi = params.navi || "";

            modules = modules || {};
            var RongIMLib = modules.RongIMLib || window.RongIMLib;
            var RongIMClient = RongIMLib.RongIMClient;
            var protobuf = modules.protobuf || null;

            var config = {};

            //私有云切换navi导航，私有云格式 '120.92.10.214:8888'
            if(navi !== ""){
                config.navi = navi;
            }

            //私有云切换api,私有云格式 '172.20.210.38:81:8888'
            var api = params.api || "";
            if(api !== ""){
                config.api = api;
            }

            //support protobuf url + function
            if(protobuf != null){
                config.protobuf = protobuf;
            };


            RongIMLib.RongIMClient.init(appKey,null,config);

            var instance = RongIMClient.getInstance();

            // 连接状态监听器
            RongIMClient.setConnectionStatusListener({
                onChanged: function (status) {
                    // console.log(status);
                    switch (status) {
                        case RongIMLib.ConnectionStatus["CONNECTED"]:
                        case 0:
                            console.log("连接成功")
                            callbacks.getInstance && callbacks.getInstance(instance);
                            break;

                        case RongIMLib.ConnectionStatus["CONNECTING"]:
                        case 1:
                            console.log("连接中")
                            break;

                        case RongIMLib.ConnectionStatus["DISCONNECTED"]:
                        case 2:
                            console.log("当前用户主动断开链接")
                            break;

                        case RongIMLib.ConnectionStatus["NETWORK_UNAVAILABLE"]:
                        case 3:
                            console.log("网络不可用")
                            break;

                        case RongIMLib.ConnectionStatus["CONNECTION_CLOSED"]:
                        case 4:
                            console.log("未知原因，连接关闭")
                            break;

                        case RongIMLib.ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]:
                        case 6:
                            console.log("用户账户在其他设备登录，本机会被踢掉线")
                            break;

                        case RongIMLib.ConnectionStatus["DOMAIN_INCORRECT"]:
                        case 12:
                            console.log("当前运行域名错误，请检查安全域名配置")
                            break;
                    }
                }
            });

            /*
             注意事项：
             1：为了看到接收效果，需要另外一个用户向本用户发消息
             2：判断会话唯一性 ：conversationType + targetId
             3：显示消息在页面前，需要判断是否属于当前会话，避免消息错乱。
             4：消息体属性说明可参考：http://rongcloud.cn/docs/api/js/index.html
             */
            RongIMClient.setOnReceiveMessageListener({
                // 接收到的消息
                onReceived: function (message) {
                    // 判断消息类型
                    console.log("新消息: " + message.targetId);
                    console.log(message);
                    callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
                }
            });

            //开始链接
            RongIMClient.connect(token, {
                onSuccess: function(userId) {
                    callbacks.getCurrentUser && callbacks.getCurrentUser({userId:userId});
                    console.log("链接成功，用户id：" + userId);
                },
                onTokenIncorrect: function() {
                    console.log('token无效');
                },
                onError:function(errorCode){
                    console.log(errorCode);
                }
            });
        }
        var conversationType = RongIMLib.ConversationType.PRIVATE; // 私聊
        var begin =  new Date().getTime();
        //公有云初始化
        var config = {
            //protobuf: './local-sdk/protobuf-2.2.7.min.js' //支持http(s)网络路径、本地相对路径
        };

        var params = {
            appKey : appkey,
            token :  token
        };
        var callbacks = {
            getInstance : function(_instance){
                instance = _instance;
                instance.getUnreadCount( conversationType, share.params.aid,{
                    onSuccess:function(count){
                        if(count>0){
                            $('.messages').show();
                        }
                    },
                    onError:function(error){
                        console.log("获取会话未读数失败", error);
                    }
                });

            },
            receiveNewMessage : function(message){
                // 判断消息类型
                jq('.messages').show();
            },
            getCurrentUser : function(userInfo){



            }
        };
        initRongYun( params, callbacks,config);

    }
    /*获取token*/
    var appkey = '3argexb63maje';
    var appsecret = 'XCpxznUOE1oA1';
    var token = "1CzzCWrqORtkfAL3HYyrJIiG9yu4B3fipAB9xxvwzHK20f0PQNjLkQWQwUfwunhGyeP0BrQSo/25Ih987O3317GzmIo5CZKu";
    if(token==null){
        jq.ajax({
            url : "http://gravity-ar.com/RyToken",
            data : {
                id:share.params.userid
            },
            type : "GET",
            success : function(result) {

                token = result.extend.pageInfo[0]
                beginConnect();
            },
            error:function(result){

            }
        });
    }else {
        beginConnect();
    }
    jq('.icon3').on('click',function(){
        window.location.href = "http://localhost:63342/www/KFWeb/SiYuanChat/index.html?userid="+share.params.userid+"&aid="+share.params.aid;
    })


})(window.moduleshare,$)