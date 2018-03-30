/*******************************************************************************
 * 
 ******************************************************************************/
// 对外接口，自动创新新的轴侧对象并初始化
function zc_buildAxisSlide(container) {
    (new zc_AxisSlide()).init(container);
}

/*******************************************************************************
 * 轴侧功能类
 */
function zc_AxisSlide() {
    // HTML容器
    this.container = false;
    // 图片帧存储及管理变量
    this.frameCurrent = 0;
    this.frameTotal = 180;
    this.frameInertiaStop = 0;
    this.frames = [];
    //跨函数辅助变量
    this.isSliding = false;
    this.handleInterval = 0;
    this.slideStartX = 0;
    this.readyImageLoad = false;

    // 初始化
    this.init = function (container) {

        //清除之前的内容，防止二次调用初始化函数导致叠加
        container.empty();

        this.container = container;

        // 读取参数
        this.frameTotal = this.container.attr('image_count') ? parseInt(this.container.attr('image_count')) : this.frameTotal;

        // 动态调整窗口大小（手机端不需要，PC端暂无法实现）
        // $(window).resize(this.resizeContainer); //受限于无法识别对象来调整大小，暂不可用
        if(this.container.width()>=1024){
            //ipad
            this.resizeContaineripad();
        }else {
            this.resizeContainer();
        }

        // 加载内容
        this.loadAllframes(this.container.attr('imageformat'));

        // 手势触发事件
        var handleObject = this;
        // 移动端消息响应
        document.addEventListener('touchstart', function (event) {
            // 检查是否在本空间滑动
            var touchX = getTouchPosX(event);
            var touchY = getTouchPosY(event);
            var targetL = handleObject.container.offset().left;
            var targetR = targetL + handleObject.container.width();
            var targetT = handleObject.container.offset().top;
            var targetB = targetT + handleObject.container.height();
            handleObject.isSliding = (touchX > targetL && touchX < targetR && touchY > targetT && touchY < targetB) ? true : false;

            if (handleObject.isSliding) {
                handleObject.slideStartX = getTouchPosX(event);
                handleObject.isSliding = true;
            }
        }, false);
        document.addEventListener('touchmove', function (event) {
            if (handleObject.isSliding) {
                handleObject.updateTouchPosition(event)
            }
        }, false);
        document.addEventListener('touchend', function (event) {
            if (handleObject.isSliding) {
                handleObject.frameInertiaStop *= 3;
                handleObject.isSliding = false;
            }
        }, false);
        // 移动端消息响应(需要jquery-1.7.2.min.js支持)
        // this.container.live("touchstart", function (event) {
        //     handleObject.slideStartX = getTouchPosX(event);
        // });
        // this.container.live("touchmove", function (event) {
        //     handleObject.updateTouchPosition(event)
        // });
        // this.container.live("touchmove", function (event) {
        //     handleObject.frameInertiaStop *= 3;
        // });
        // PC端消息响应
        this.container.mousedown(function (event) {
            event.preventDefault();
            handleObject.slideStartX = getTouchPosX(event);
            handleObject.isSliding = true;
        });
        this.container.mousemove(function (event) {
            event.preventDefault();
            if (handleObject.isSliding) {
                handleObject.updateTouchPosition(event)
            }
        });
        this.container.mouseup(function (event) {
            event.preventDefault();
            if (handleObject.isSliding) {
                handleObject.frameInertiaStop *= 3;
                handleObject.isSliding = false;
            }
        });
        // 额外事件，PC端存在离开窗口的情况，事件处理与mouseup一致
        this.container.mouseleave(function (event) {
            event.preventDefault();
            if (handleObject.isSliding) {
                handleObject.frameInertiaStop *= 3;
                handleObject.isSliding = false;
            }
        });
    };
    // 纠正显示窗口大小位置
    this.resizeContainer = function () {
        var w = this.container.width();
        /*var h = this.container.width() * 3 / 4;*/
        var h = document.body.clientHeight;
        this.container.css({
            width: w,
            height: h,
        })
    };
    this.resizeContaineripad = function () {
        var w = this.container.width()*0.8;
        var h = (this.container.width() *0.8)* 3 / 4;
        this.container.css({
            width: w,
            height: h,
            left:'50%',
           'margin-left':-w/2,
            top:'10%'
        })
    };
    this.loadAllframes = function (imageFormat) {
        // 加入加载中提示框架，加载完成会自动删掉
        this.container.append('<em class="loading"> <p>0%</p> </em>');
        // 加入序列帧显示框架
        this.container.append('<ol></ol>');
        // 进行预加载，并讲实际内容嵌入到网页
        loadImage(this, 0, imageFormat);
    }
    // 刷新函数
    this.refresh = function () {
        if (this.handleInterval === 0) {
            // 启动定时器，每50ms刷新一次
            this.handleInterval = setInterval(intervalRefresh, 50, this);
        }
    };
    // 触控激活时，随着滑动更新相关信息
    this.updateTouchPosition = function (event) {
        // 每 10s 才触发一次刷新，避免过于频繁影响效率，如果图片未加载完也直接跳过
        var newPosX = getTouchPosX(event);
        var xDistance = newPosX - this.slideStartX;
        if ((xDistance > 10 || xDistance < -10) && this.readyImageLoad) {

            this.frameInertiaStop = this.frameTotal * (xDistance / this.container.width());
            this.frameInertiaStop = this.frameInertiaStop > 0 ? Math.ceil(this.frameInertiaStop) : Math.floor(this.frameInertiaStop);

            this.slideStartX = newPosX;

            this.refresh();
        }
    };

    /***************************************************************************
     * 辅助函数
     */
    // 控制值范围
    function zc_circleValue(curValue, maxValue) {
        if (curValue < 0) {
            curValue = (-curValue) % maxValue;
            curValue = maxValue - curValue;
        } else if (curValue >= maxValue) {
            curValue = curValue % maxValue;
        }
        console.log(curValue);
        return curValue;
    }
    // 筛选事件，如果是多点触控只需要拿一个点的事件
    function getTouchPosX(event) {
        return event.touches ? event.touches[0].clientX : event.clientX;
    };
    function getTouchPosY(event) {
        return event.touches ? event.touches[0].clientY : event.clientY;
    };
    // 递归加载序列帧并嵌入到网页容器
    function loadImage(handleObject, imageIndex, imageFormat) {
        // 通过Image进行预加载
        var newImage = new Image();
        newImage.src = imageFormat.replace('#index#', imageIndex);

        newImage.onload = function () {
            var li = $('<li></li>');
            var image = $('<img>').attr('src', newImage.src).hide().appendTo(li);

            handleObject.frames.push(image);
            handleObject.container.children('ol').append(li);
            handleObject.container.find('em.loading p').text(Math.floor(imageIndex / handleObject.frameTotal * 100) + "%");
            if (imageIndex < (handleObject.frameTotal - 1)) {
                loadImage(handleObject, imageIndex + 1, imageFormat);
            } else {
                handleObject.frames[0].show();
                handleObject.container.children("em.loading").fadeOut("slow", function () {
                    handleObject.container.children("em.loading").remove();
                    handleObject.container.children('ol').fadeIn("slow");
                    handleObject.readyImageLoad = true;

                    // 加载完成刷新出来
                    handleObject.frameInertiaStop = 31;//给这个帧惯性值，让其启动时可以先转一圈
                    handleObject.refresh()
                })
            }
        };
        newImage.onerror = function () {
            handleObject.container.html('<div style="text-align:center;margin-top:50%;">加载失败，<a href="' + location.href + '">请重试</a></div>');
        };
    };
    // 时钟刷新函数，定时器回调时触发该函数来刷新状态
    function intervalRefresh(handleObject) {
        if (0 != handleObject.frameInertiaStop) {
            handleObject.frames[handleObject.frameCurrent].hide();
            if (handleObject.frameInertiaStop > 0) {
                handleObject.frameCurrent = zc_circleValue(handleObject.frameCurrent - 1, handleObject.frameTotal);
                handleObject.frameInertiaStop--;
            } else {
                handleObject.frameCurrent = zc_circleValue(handleObject.frameCurrent + 1, handleObject.frameTotal);
                handleObject.frameInertiaStop++;
            }
            handleObject.frames[handleObject.frameCurrent].show();
        } else {
            window.clearInterval(handleObject.handleInterval);
            handleObject.handleInterval = 0
        }
    };
}
