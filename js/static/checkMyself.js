"use strict";

/**
 * 延时循环自检横竖屏
 */


var ua = navigator.userAgent.toLowerCase();
// console.log(ua);

/**判断是否为安卓；如果是安卓,再判断其是否是在微信中打开；让其在手机自带浏览器打开*/
if (ua.match(/android/i)) {
    console.log('设备是android设备');
    /**是安卓，判断其是否在微信中打开*/
    if (isWeixin()){
        console.log('网页在微信中打开了，指引其使用自身浏览器播放isWeixin');
        setInterval (function(){
            var windowHeight = ($(window).height());/** 获取屏幕可视化高度 */
            var windowWidth = ($(window).width());/** 获取屏幕可视化宽度 */
            if(windowHeight > windowWidth){
                // console.log('系统检测您的手机当前是竖屏;竖屏应该显示指引其到手机自带浏览器的图片');
                var screenV = $('#andriod-screen-v');
                screenV.css({ 'display':'block'});
                screenV.attr({'width':windowWidth, 'height':windowHeight});
            }else {
                // console.log('系统检测您的手机当前是横屏;横屏应该显示指引其到手机自带浏览器的图片');
                var screenH = $('#andriod-screen-h');
                screenH.css({'display':'block'});
                screenH.attr({'width':windowWidth, 'height':windowHeight});
            }
        },10);
    } else{
        console.log('安卓移动设备且不是微信');
        console.log(ua);
        /***
         * 判断安卓移动设备是否使用的 Firefox、Opera 、UC，若是，则替换其 source 标签的 src 属性为 ogg 格式；否则就使用 MP4 格式
         */
        if (ua.indexOf("firefox") !== -1 || ua.indexOf('opr') !== -1 || ua.indexOf('uc') !== -1) {
            console.log("安卓移动设备使用的 Firefox、Opera 、UC，使用的是ogg格式播放");
            var videoMobile = document.querySelector("#video");
            console.log('找到dom videoMobile');
            var sourceMp4 = document.querySelector("#id-source-mp4");
            videoMobile.removeChild(sourceMp4);
            // var element = document.createElement('source');
            // element.innerHTML = "src=\"video/sintel.ogv\" type='video/ogg; codecs=\"theora, vorbis\"'";
            // videoMobile.appendChild(element);
            // videoMobile.insertAdjacentHTML('beforeend',`<source src="video/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>`);
            videoMobile.insertAdjacentHTML('beforeend',`<source src="video/264.ogg" type='video/ogg; codecs="theora, vorbis"'>`);
            console.log('执行结束');
            // var h = document.createElement('h1');
            // h.innerHTML = '这是一个h1标签';
            // var body=  document.querySelector('body');
            // body.appendChild(h);
            // console.log('创建了h1标签');

        } else {
            console.log("使用的是MP4格式播放");
            /***
             * 使用 mp4格式播放
             */
            // var h2 = document.createElement('h2');
            // h2.innerHTML = ua;
            // var body=  document.querySelector('body');
            // body.appendChild(h2);
            // console.log('创建了h2标签');
        }

        setInterval (function(){
            var windowHeight = ($(window).height());/** 获取屏幕可视化高度 */
            var windowWidth = ($(window).width());/** 获取屏幕可视化宽度 */
            var screen = $('#screen');
            if(windowHeight > windowWidth){
                // console.log('系统检测您的手机当前是竖屏;竖屏应该显示让其横屏的图片');
                screen.css({ 'display':'block'});
                screen.attr({'width':windowWidth, 'height':windowHeight});
            }else {
                // console.log('系统检测您的手机当前是横屏');
                screen.css('display','none');
            }
        },10);
    }
} else {
    console.log("设备不是安卓设备，可能是ios移动设备或者pc端设备");
    /**ios移动设备或者pc端设备的逻辑*/
    setInterval (function(){
        var windowHeight = ($(window).height());/** 获取屏幕可视化高度 */
        var windowWidth = ($(window).width());/** 获取屏幕可视化宽度 */
        var screen = $('#screen');
        if(windowHeight > windowWidth){
            console.log('系统检测您的手机当前是竖屏');
            screen.css({ 'display':'block'});
            screen.attr({'width':windowWidth, 'height':windowHeight});
        }else {
            // console.log('系统检测您的手机当前是横屏');
            screen.css('display','none');
        }
    },10);
}

//判断是否是微信
    function isWeixin() {
        console.log(ua);
        console.log(ua.match(/micromessenger/g));
        return ua.match(/micromessenger/g) !== null;
    }

