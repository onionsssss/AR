"use strict";

var playPhoto,imageReflection;
var raycaster = [];
var mesh;
var container;
var stats;
var mouse;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var camera, scene, renderer;
var video, image, imageContext,
    imageReflectionContext, imageReflectionGradient,
    texture, textureReflection;
var mouseX = 0;
var mouseY = 0;

var initWidth = 408;
var initHeight = 272;
/**
 * 定义及注册函数
 */
function init() {

    function onDocumentMouseMove( event ) {
        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY ) * 0.2;
    }

    function onDocumentTouchStart( event ) {
        event.preventDefault();
        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;
        onDocumentMouseDown( event );
    }

    function pauseOfScreen() {
        setInterval(function () {
            var windowHeight_d = ($(window).height());/** 获取屏幕可视化高度 */
            var windowWidth_d = ($(window).width());/** 获取屏幕可视化宽度 */
            var player_c = $('#video')[0];
            if (windowHeight_d<windowWidth_d){
                player_c.play();
            }else{
                player_c.pause();
            }
        },1000)
    }

    function onDocumentMouseDown( event ) {
        event.preventDefault();
        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( scene.children );
        // if ( intersects.length > 0 ) {
        //     var player = $('#video')[0];
        //     player.play();
        //     $('#player').hide();
        //     scene.remove(skyBox);
        // }

        if ( intersects.length > 0 ) {
            var windowHeight_c = ($(window).height());/** 获取屏幕可视化高度 */
            var windowWidth_c = ($(window).width());/** 获取屏幕可视化宽度 */
            if (windowHeight_c > windowWidth_c){
                console.log('请横屏');
                return false;
            }else{
                var player = $('#video')[0];
                player.play();
                $('#player').hide();
                scene.remove(skyBox);
                pauseOfScreen();
            }
        }
    }

    function onDocumentTouchMove( event ) {

        mouseX = ( event.targetTouches[0].clientX - windowHalfX );
        mouseY = ( event.targetTouches[0].clientY - windowHalfY ) * 0.2;

//                console.log("*****************************");
//                console.log("touchmove", event);
//                console.log("touchmovemouseX", mouseX);
//                console.log("touchmovemouseY", mouseY);

    }

    /**
     * 建立容器container的div标签
     * @type {Element}
     */
    container = document.createElement( 'div' );
    $(document.body).append( container );

    /**
     * 建立信息info的div标签
     * @type {Element}
     */
    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    $(container).append( info );

    /**
     * 定义相机camera
     */
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    /**
     * 定义场景scene
     */
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    video = $( '#video' ).get(0);

    /**
     * 建立canvas
     * @type {Element}
     */
    image = document.createElement( 'canvas' );
    image.width = initWidth;
    image.height = initHeight;

    imageContext = image.getContext( '2d' );/** 返回绘图环境，目前唯一的环境为2d */
    imageContext.fillStyle = '#000000';/** 填充色为黑色 */
    imageContext.fillRect( 0, 0, initWidth, initHeight );/** 绘制矩形initWidth宽，initHeight高 */

    texture = new THREE.Texture( image );//设置纹理

    playPhoto = document.createElement('canvas');
    playPhoto.width = initWidth;
    playPhoto.height = initHeight;

    var skyBoxGeometry = new THREE.PlaneGeometry ( 80, 80 );
    var textureTu = new THREE.TextureLoader().load("photo/play.jpg");
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { map:textureTu } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    skyBox.position.x = 0;
    skyBox.position.y = 0;
    skyBox.position.z = 100;
    scene.add(skyBox);

    $('#player').click(function () {
        var player = $('#video')[0];
        player.play();
        $('#player').hide();
        scene.remove(skyBox);
    });

    /**
     * MeshBasicMaterial光照无感材质，主要是用于给几何体简单的颜色和线框
     - map 纹理贴图
     - side 决定了几何体的哪一面应用该材质
     - THREE.FrontSide应用到几何体的前（外）面
     - THREE.BackSide应用到几何体的后（内）面
     - THREE.DoubleSide应用到几何体的内外两侧
     - opacity 定义物体有多透明，与transparent属性一起使用
     - transparent 设置为true时，会根据opacity的值来设置透明度，设置为false时，则只着色
     - overdraw 过度描绘，当使用THREE.CanvasRenderer画布渲染器绘制对象的时候，物体之间可能会有空隙，这时设置该值为true，多边形会被渲染的稍微大一点
     * MeshLambertMaterial光照反应材质，主要是用于给暗淡不发光的物体
     * MeshPhongMaterial光照反应材质，主要是用于给金属等明亮的物体
     */
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

    /**
     * 定义另外一个canvas
     * @type {Element}
     */
    imageReflection = document.createElement( 'canvas' );
    imageReflection.width = initWidth;
    imageReflection.height = initHeight;

    imageReflectionContext = imageReflection.getContext( '2d' );
    imageReflectionContext.fillStyle = '#000000';
    imageReflectionContext.fillRect( 0, 0, initWidth, initHeight );

    /**
     * 设置渐变的效果，因为另外一个是倒影
     * @type {CanvasGradient}
     */
    imageReflectionGradient = imageReflectionContext.createLinearGradient( 0, 0, 0, initHeight );
    imageReflectionGradient.addColorStop( 0.2, 'rgba(240, 240, 240, 1)' );
    imageReflectionGradient.addColorStop( 1, 'rgba(240, 240, 240, 0.8)' );

    textureReflection = new THREE.Texture( imageReflection );/** 纹理 */

    var materialReflection = new THREE.MeshBasicMaterial( { map: textureReflection, side: THREE.BackSide, overdraw: 0.5 } ); /** 材质 */

    /**
     * PlaneGeometry用来在三维空间内创建一个平面对象
     * 此处应该是什么？
     */
    var plane = new THREE.PlaneGeometry( initWidth, initHeight, 0, 0 );/** 参数为(width, height, widthSegments, heightSegments) */

    mesh = new THREE.Mesh( plane, material );
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
    scene.add(mesh);

    mesh = new THREE.Mesh( plane, materialReflection );
    mesh.position.y = -408;/** 初始位置为( 0, -310, 0) 此处应该是什么 1.5*272   */
    mesh.rotation.x = - Math.PI;/** 这个是canvas绕X轴旋转PI个弧度(注意是一定是弧度制) */
    //console.log(mesh.rotation.x);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
    scene.add( mesh );

    //

    var separation = 150;
    var amountx = 10;
    var amounty = 10;

    var PI2 = Math.PI * 2;

    var material = new THREE.SpriteCanvasMaterial( {
        color: 0x0808080,
        program: function ( context ) {
            context.beginPath();
            context.arc( 0, 0, 1, 0, PI2, true );
            context.fill();
        }
    } );

    for ( var ix = 0; ix < amountx; ix++ ) {

        for ( var iy = 0; iy < amounty; iy++ ) {

            var sprite = new THREE.Sprite( material );
            sprite.position.x = ix * separation - ( ( amountx * separation ) / 2 );
            sprite.position.y = -200;/**此处为什么是153？*/
            sprite.position.z = iy * separation - ( ( amounty * separation ) / 2 );
            sprite.scale.setScalar( 2 );
            scene.add( sprite );

        }

    }

    renderer = new THREE.CanvasRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //stats = new Stats();
    //container.appendChild( stats.dom );
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
