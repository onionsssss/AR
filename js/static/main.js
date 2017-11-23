"use strict";

init();
animate();

/**
 * 重复渲染
 */
function animate() {
    requestAnimationFrame( animate );
    render();
}

/**
 * 渲染函数
 */
function render() {
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    camera.lookAt( scene.position );
    if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
        imageContext.drawImage( video, 0, 0 );
        if ( texture ) texture.needsUpdate = true;
        if ( textureReflection ) textureReflection.needsUpdate = true;
    }
    imageReflectionContext.drawImage( image, 0, 0 );
    imageReflectionContext.fillStyle = imageReflectionGradient;
    imageReflectionContext.fillRect( 0, 0, 408, 272 );
    renderer.render( scene, camera );
}