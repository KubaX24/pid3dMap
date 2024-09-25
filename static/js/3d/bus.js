export class Bus {
    constructor(id, x, y) {
        this.id = id

        this.modelTransform = {
            translateX: 0,
            translateY: 0,
            translateZ: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 0
        };

        this.setPosition(x, y)

        this.modelTransform.rotateX = Math.PI / 2
        this.modelTransform.rotateY = 10
        this.modelTransform.rotateZ = 0
    }

    setPosition(x, y) {
        const modelPosition = [x, y]

        const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
            modelPosition,
            0
        );

        this.modelTransform.translateX = modelAsMercatorCoordinate.x
        this.modelTransform.translateY = modelAsMercatorCoordinate.y
        this.modelTransform.translateZ = modelAsMercatorCoordinate.z
        this.modelTransform.scale = modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 5
    }

    setRotation(rotate) {
        this.modelTransform.rotateY = rotate
    }

    render() {
        let self = this;

        return {
            id: '3d-model',
            type: 'custom',
            renderingMode: '3d',
            onAdd (map, gl) {
                this.camera = new THREE.Camera();
                this.scene = new THREE.Scene();

                const directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(0, -70, 100).normalize();
                this.scene.add(directionalLight);

                const directionalLight2 = new THREE.DirectionalLight(0xffffff);
                directionalLight2.position.set(0, 70, 100).normalize();
                this.scene.add(directionalLight2);

                const loader = new THREE.GLTFLoader();
                loader.load(
                    'http://localhost:8080/data/bus2.gltf',
                    (gltf) => {
                        this.scene.add(gltf.scene);
                    }
                );
                this.map = map;

                this.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });

                this.renderer.autoClear = false;
            },
            render (gl, matrix) {
                const rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    self.modelTransform.rotateX
                );
                const rotationY = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 1, 0),
                    self.modelTransform.rotateY
                );
                const rotationZ = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(0, 0, 1),
                    self.modelTransform.rotateZ
                );

                const m = new THREE.Matrix4().fromArray(matrix);
                const l = new THREE.Matrix4()
                    .makeTranslation(
                        self.modelTransform.translateX,
                        self.modelTransform.translateY,
                        self.modelTransform.translateZ
                    )
                    .scale(
                        new THREE.Vector3(
                            self.modelTransform.scale,
                            -self.modelTransform.scale,
                            self.modelTransform.scale
                        )
                    )
                    .multiply(rotationX)
                    .multiply(rotationY)
                    .multiply(rotationZ);

                this.camera.projectionMatrix = m.multiply(l);
                this.renderer.resetState();
                this.renderer.render(this.scene, this.camera);
                this.map.triggerRepaint();
            }
        };
    }
}