// const modelOrigin = [14.474265, 50.078444];
// const modelAltitude = 0;
// const modelRotate = [Math.PI / 2, 10, 0];
//
// const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
//     modelOrigin,
//     modelAltitude
// );
//
// const modelTransform = {
//     translateX: modelAsMercatorCoordinate.x,
//     translateY: modelAsMercatorCoordinate.y,
//     translateZ: modelAsMercatorCoordinate.z,
//     rotateX: modelRotate[0],
//     rotateY: modelRotate[1],
//     rotateZ: modelRotate[2],
//
//     scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 5
// };
//
//
// const THREE = window.THREE;
// const customLayer = {
//     id: '3d-model',
//     type: 'custom',
//     renderingMode: '3d',
//     onAdd (map, gl) {
//         this.camera = new THREE.Camera();
//         this.scene = new THREE.Scene();
//
//         const directionalLight = new THREE.DirectionalLight(0xffffff);
//         directionalLight.position.set(0, -70, 100).normalize();
//         this.scene.add(directionalLight);
//
//         const directionalLight2 = new THREE.DirectionalLight(0xffffff);
//         directionalLight2.position.set(0, 70, 100).normalize();
//         this.scene.add(directionalLight2);
//
//         const loader = new THREE.GLTFLoader();
//         loader.load(
//             'http://localhost:8080/data/bus2.gltf',
//             (gltf) => {
//                 this.scene.add(gltf.scene);
//             }
//         );
//         this.map = map;
//
//         this.renderer = new THREE.WebGLRenderer({
//             canvas: map.getCanvas(),
//             context: gl,
//             antialias: true
//         });
//
//         this.renderer.autoClear = false;
//     },
//     render (gl, matrix) {
//         const rotationX = new THREE.Matrix4().makeRotationAxis(
//             new THREE.Vector3(1, 0, 0),
//             modelTransform.rotateX
//         );
//         const rotationY = new THREE.Matrix4().makeRotationAxis(
//             new THREE.Vector3(0, 1, 0),
//             modelTransform.rotateY
//         );
//         const rotationZ = new THREE.Matrix4().makeRotationAxis(
//             new THREE.Vector3(0, 0, 1),
//             modelTransform.rotateZ
//         );
//
//         const m = new THREE.Matrix4().fromArray(matrix);
//         const l = new THREE.Matrix4()
//             .makeTranslation(
//                 modelTransform.translateX,
//                 modelTransform.translateY,
//                 modelTransform.translateZ
//             )
//             .scale(
//                 new THREE.Vector3(
//                     modelTransform.scale,
//                     -modelTransform.scale,
//                     modelTransform.scale
//                 )
//             )
//             .multiply(rotationX)
//             .multiply(rotationY)
//             .multiply(rotationZ);
//
//         this.camera.projectionMatrix = m.multiply(l);
//         this.renderer.resetState();
//         this.renderer.render(this.scene, this.camera);
//         this.map.triggerRepaint();
//     }
// };
