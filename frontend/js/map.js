var map = new maplibregl.Map({
    container: 'map',
    center: [14.43556, 50.08292],
    zoom: 12,
    maxZoom: 17.5,
    minZoom: 12,
    maxBounds: [
        [14.10645, 49.90879],
        [14.77326, 50.25072]
    ],
    style: 'http://localhost:8080/data/red.json',
});

const modelOrigin = [14.474265, 50.078444];
const modelAltitude = 0;
const modelRotate = [Math.PI / 2, 10, 0];

const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
);

// transformation parameters to position, rotate and scale the 3D model onto the map
const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    /* Since our 3D model is in real world meters, a scale transform needs to be
    * applied since the CustomLayerInterface expects units in MercatorCoordinates.
    */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 5
};

const THREE = window.THREE;

// configuration of the custom layer for a 3D model per the CustomLayerInterface
const customLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd (map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        // create two three.js lights to illuminate the model
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        const loader = new THREE.GLTFLoader();
        loader.load(
            'http://localhost:8080/data/bus2.gltf',
            (gltf) => {
                this.scene.add(gltf.scene);
            }
        );
        this.map = map;

        // use the MapLibre GL JS map canvas for three.js
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
            modelTransform.rotateX
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ
        );

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
            .makeTranslation(
                modelTransform.translateX,
                modelTransform.translateY,
                modelTransform.translateZ
            )
            .scale(
                new THREE.Vector3(
                    modelTransform.scale,
                    -modelTransform.scale,
                    modelTransform.scale
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

map.on('style.load', () => {

    const route = {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'color': '#456ff7' // red
                    },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [14.474265, 50.078444],
                            [14.473338, 50.078534],
                            [14.473138, 50.078543],
                            [14.472901, 50.078531],
                            [14.472955, 50.078345],
                            [14.473063, 50.077774],
                            [14.473075, 50.077712],
                            [14.472991, 50.077514],
                            [14.469774, 50.076259],
                            [14.46912, 50.07602],
                            [14.468706, 50.075847],
                            [14.468642, 50.075751],
                            [14.46825, 50.075072],
                            [14.468172, 50.074911],
                            [14.46791, 50.074416],
                            [14.467858, 50.074266],
                            [14.467888, 50.074124],
                            [14.46799, 50.074042],
                            [14.468175, 50.073968],
                            [14.468925, 50.073689],
                            [14.469469, 50.073519],
                            [14.469718, 50.073477],
                            [14.470083, 50.073482],
                            [14.470411, 50.07274],
                            [14.470456, 50.072636],
                            [14.470711, 50.072058],
                            [14.470676, 50.071756],
                            [14.470541, 50.071463],
                            [14.46977, 50.070714],
                            [14.469336, 50.070304],
                            [14.468748, 50.069753],
                            [14.468724, 50.069533],
                            [14.46885, 50.069208],
                            [14.468937, 50.069062],
                            [14.469324, 50.06833],
                            [14.469409, 50.068168],
                            [14.469566, 50.067629],
                            [14.469527, 50.066818],
                            [14.46946, 50.066403],
                            [14.46948, 50.066178],
                            [14.469391, 50.065471],
                            [14.469304, 50.064556],
                            [14.469327, 50.064114],
                            [14.469474, 50.062829],
                            [14.469584, 50.06145],
                            [14.469585, 50.061178],
                            [14.469504, 50.061098],
                            [14.469522, 50.060682],
                            [14.469565, 50.060561],
                            [14.469693, 50.060207],
                            [14.469785, 50.059907],
                            [14.470488, 50.058326],
                            [14.470723, 50.057884],
                            [14.471153, 50.056987],
                            [14.471043, 50.056978],
                            [14.470501, 50.056939],
                            [14.469838, 50.056944],
                            [14.469421, 50.056916],
                            [14.468458, 50.056868],
                            [14.468376, 50.056875],
                            [14.4683, 50.056881],
                            [14.467158, 50.056817],
                            [14.465814, 50.056644],
                            [14.464624, 50.056501],
                            [14.464068, 50.056435],
                            [14.463459, 50.056381],
                            [14.462975, 50.056402],
                            [14.462587, 50.056441],
                            [14.462072, 50.05654],
                            [14.461682, 50.056651],
                            [14.461025, 50.056757],
                            [14.460387, 50.056773],
                            [14.459347, 50.056563],
                            [14.459069, 50.056475],
                            [14.458307, 50.056217],
                            [14.457631, 50.055949],
                            [14.456927, 50.055678],
                            [14.456719, 50.055596],
                            [14.456317, 50.055497],
                            [14.455821, 50.055381],
                            [14.45503, 50.055256],
                            [14.454717, 50.055201],
                            [14.453609, 50.054976],
                            [14.453073, 50.054847],
                            [14.452945, 50.054655],
                            [14.452536, 50.054069],
                            [14.452513, 50.054036],
                            [14.452488, 50.053952],
                            [14.452549, 50.053667],
                            [14.452894, 50.053171],
                            [14.453248, 50.052703],
                            [14.453616, 50.0523],
                            [14.453709, 50.05219],
                            [14.453772, 50.052096],
                            [14.454044, 50.051875],
                            [14.454371, 50.051731],
                            [14.454621, 50.051681],
                            [14.454913, 50.051634],
                            [14.456733, 50.051661],
                            [14.456739, 50.051667],
                            [14.457007, 50.051665],
                            [14.457271, 50.051615],
                            [14.457444, 50.051531],
                            [14.4587, 50.050598],
                            [14.458799, 50.050198],
                            [14.458978, 50.049488],
                            [14.459274, 50.04916],
                            [14.459663, 50.048723],
                            [14.459701, 50.048608],
                            [14.459761, 50.048459],
                            [14.459864, 50.048241],
                            [14.460286, 50.047253],
                            [14.460672, 50.046298],
                            [14.460728, 50.046167],
                            [14.460804, 50.04601],
                            [14.461314, 50.045195],
                            [14.46153, 50.044849],
                            [14.461981, 50.04419],
                            [14.462179, 50.043853],
                            [14.462245, 50.043678],
                            [14.462237, 50.043314],
                            [14.462246, 50.043206],
                            [14.462208, 50.043121],
                            [14.462115, 50.042895],
                            [14.461953, 50.042663],
                            [14.461742, 50.042463],
                            [14.46161, 50.042424],
                            [14.461294, 50.042251],
                            [14.461223, 50.04219],
                            [14.46097, 50.041986],
                            [14.460374, 50.041592],
                            [14.460241, 50.041504],
                            [14.460163, 50.041407],
                            [14.460026, 50.041059],
                            [14.460048, 50.040888],
                            [14.459832, 50.040379],
                            [14.459678, 50.039848],
                            [14.459509, 50.039579],
                            [14.459443, 50.039428],
                            [14.458934, 50.038975],
                            [14.458371, 50.038571],
                            [14.45801, 50.038349],
                            [14.457889, 50.038256],
                            [14.45766, 50.038073],
                            [14.457483, 50.037912],
                            [14.457413, 50.037842],
                            [14.45732, 50.037752],
                            [14.457045, 50.037519],
                            [14.45666, 50.037077],
                            [14.456454, 50.036787],
                            [14.456385, 50.036717],
                            [14.45621, 50.036347],
                            [14.456032, 50.035923],
                            [14.455796, 50.035249],
                            [14.455653, 50.034792],
                            [14.455278, 50.033579],
                            [14.455144, 50.03315],
                            [14.454937, 50.032269],
                            [14.454906, 50.031286],
                            [14.454921, 50.030289],
                            [14.454949, 50.030028],
                            [14.45496, 50.029976],
                            [14.454893, 50.02996],
                            [14.454893, 50.02996],
                            [14.454934, 50.029437],
                            [14.454764, 50.029177],
                            [14.454369, 50.028979],
                            [14.452814, 50.028606],
                            [14.451597, 50.028281],
                            [14.451441, 50.028239],
                            [14.451235, 50.028148],
                            [14.451086, 50.028054],
                            [14.448788, 50.027469],
                            [14.447251, 50.027079],
                            [14.446599, 50.026831],
                            [14.44597, 50.026612],
                            [14.445629, 50.026428],
                            [14.442471, 50.024587],
                            [14.441118, 50.023796],
                            [14.441059, 50.023748],
                            [14.440625, 50.023398],
                            [14.440197, 50.022961],
                            [14.440012, 50.022772],
                            [14.43954, 50.022277],
                            [14.439267, 50.021971],
                            [14.438438, 50.021015],
                            [14.437639, 50.020094],
                            [14.437265, 50.01967],
                            [14.436601, 50.018886],
                            [14.435989, 50.018387],
                            [14.43536, 50.017968],
                            [14.434605, 50.017611],
                            [14.434249, 50.017497],
                            [14.434035, 50.017442],
                            [14.433467, 50.017265],
                            [14.432764, 50.017046],
                            [14.43245, 50.016948],
                            [14.431483, 50.016663],
                            [14.430543, 50.01638],
                            [14.428872, 50.015896],
                            [14.428462, 50.015769],
                            [14.42687, 50.015299],
                            [14.425998, 50.015042],
                            [14.424728, 50.014657],
                            [14.423786, 50.014383],
                            [14.42233, 50.013945],
                            [14.42166, 50.013786],
                            [14.421291, 50.013735],
                            [14.42095, 50.013711],
                            [14.420777, 50.013699],
                            [14.420233, 50.013741],
                            [14.419553, 50.01389],
                            [14.418624, 50.014152],
                            [14.417974, 50.014231],
                            [14.417792, 50.014287],
                            [14.41726, 50.014276],
                            [14.417177, 50.014332],
                            [14.417075, 50.014351],
                            [14.416913, 50.014318],
                            [14.416869, 50.01426],
                            [14.416868, 50.014196],
                            [14.416956, 50.014113],
                            [14.416988, 50.013835],
                            [14.417111, 50.013719],
                            [14.417197, 50.013118],
                            [14.41719, 50.012754],
                            [14.417114, 50.012385],
                            [14.41694, 50.012079],
                            [14.416908, 50.012035],
                            [14.416689, 50.011739],
                            [14.415836, 50.010919],
                            [14.415364, 50.010296],
                            [14.415175, 50.009599],
                            [14.415188, 50.009273],
                            [14.415396, 50.008429],
                            [14.415525, 50.008065],
                            [14.41568, 50.007629],
                            [14.41597, 50.006928],
                            [14.416071, 50.006656],
                            [14.416382, 50.005857],
                            [14.416823, 50.004832],
                            [14.417165, 50.004039],
                            [14.417268, 50.003821],
                            [14.417664, 50.002963],
                            [14.418133, 50.001947],
                            [14.418491, 50.001125],
                            [14.418505, 50.0008],
                            [14.418432, 50.000612],
                            [14.418139, 50.000268],
                            [14.417873, 50.000063],
                            [14.417207, 49.999686],
                            [14.416911, 49.999424],
                            [14.416808, 49.999052],
                            [14.416827, 49.998638],
                            [14.416835, 49.998464],
                            [14.417217, 49.998126],
                            [14.417455, 49.998002],
                            [14.41784, 49.997846],
                            [14.418307, 49.997769],
                            [14.418745, 49.997762],
                            [14.41913, 49.997806],
                            [14.42065, 49.998267],
                            [14.422001, 49.998668],
                            [14.423219, 49.999031],
                            [14.423707, 49.999161],
                            [14.425004, 49.999507],
                            [14.426425, 49.999841],
                            [14.427344, 50.000023],
                            [14.427622, 50.000038],
                            [14.427937, 50.000025],
                            [14.428518, 50],
                            [14.429306, 49.999607],
                            [14.429628, 49.999218],
                            [14.429701, 49.999006],
                            [14.429728, 49.998682],
                            [14.429679, 49.998451],
                            [14.429418, 49.997892],
                            [14.429299, 49.997854],
                            [14.428908, 49.997511],
                            [14.428824, 49.997469]
                        ]
                    }
                },
                // {
                //     'type': 'Feature',
                //     'properties': {
                //         'color': '#80f745' // red
                //     },
                //     'geometry': {
                //         'type': 'LineString',
                //         'coordinates': [
                //             [14.474265, 50.078444],
                //             [14.474265, 50.072444]
                //         ]
                //     }
                // }
            ]
        }
    }
    map.addSource('lines', route);

    const k = .0000007770000007883

    let counter = 1
    let prevCords = route.data.features[0].geometry.coordinates[0]
    let goCords = route.data.features[0].geometry.coordinates[0]
    setInterval(function () {
        if (counter >= route.data.features[0].geometry.coordinates.length) {
            counter = 1
        } else {
            let nextCoords = route.data.features[0].geometry.coordinates[counter]
            let v0 = prevCords[0] - nextCoords[0]
            let v1 = prevCords[1] - nextCoords[1]

            let xCords = [prevCords[0] + 0.1, prevCords[1]]
            let yCords = [prevCords[0], prevCords[1] + 0.1]

            let vecLine = [nextCoords[0] - prevCords[0], nextCoords[1] - prevCords[1]]

            let vecX = [xCords[0] - prevCords[0], xCords[1] - prevCords[1]]
            let vecY = [yCords[0] - prevCords[0], yCords[1] - prevCords[1]]

            let xCos = ((vecX[0] * vecLine[0]) + (vecX[1] * vecLine[1])) / (Math.sqrt(Math.pow(vecX[0], 2) + Math.pow(vecX[1], 2)) * Math.sqrt(Math.pow(vecLine[0], 2) + Math.pow(vecLine[1], 2)))
            let yCos = ((vecY[0] * vecLine[0]) + (vecY[1] * vecLine[1])) / (Math.sqrt(Math.pow(vecY[0], 2) + Math.pow(vecY[1], 2)) * Math.sqrt(Math.pow(vecLine[0], 2) + Math.pow(vecLine[1], 2)))

            let vg0 = prevCords[0] - goCords[0] - (k*xCos)
            let vg1 = prevCords[1] - goCords[1] - (k*yCos)

            if (Math.abs(vg0) >= Math.abs(v0) || Math.abs(vg1) >= Math.abs(v1)) {
                goCords = nextCoords
                prevCords = nextCoords
                counter++
            } else {
                goCords = [goCords[0] + (k*xCos), goCords[1] + (k*yCos)]
            }

            const newCalcCoords = maplibregl.MercatorCoordinate.fromLngLat(
                goCords,
                0
            );

            modelTransform.translateX = newCalcCoords.x
            modelTransform.translateY = newCalcCoords.y
            modelTransform.translateZ = newCalcCoords.z

            let goVec = [nextCoords[0] - prevCords[0], nextCoords[1] - prevCords[1]]
            let nyCords = [prevCords[0], prevCords[1] - 0.2]
            let nyVec = [nyCords[0] - prevCords[0], nyCords[1] - prevCords[1]]

            let rotateCos = ((nyVec[0] * goVec[0]) + (nyVec[1] * goVec[1])) / (Math.sqrt(Math.pow(nyVec[0], 2) + Math.pow(nyVec[1], 2)) * Math.sqrt(Math.pow(goVec[0], 2) + Math.pow(goVec[1], 2)))

            console.log(rotateCos)

            modelTransform.rotateY = prevCords[0] - nextCoords[0] < 0 ? Math.acos(rotateCos) : -Math.acos(rotateCos)

            // counter++
        }

    })

    map.addLayer({
        'id': 'lines',
        'type': 'line',
        'source': 'lines',
        'paint': {
            'line-width': 3,
            // Use a get expression (https://maplibre.org/maplibre-style-spec/expressions/#get)
            // to set the line-color to a feature property value.
            'line-color': ['get', 'color']
        }
    });

    map.addLayer(customLayer);

    // map.addControl(
    //     new maplibregl.NavigationControl({
    //         visualizePitch: true,
    //         showZoom: true,
    //         showCompass: true
    //     })
    // );
});

document.getElementsByClassName("maplibregl-ctrl-attrib-inner")[0].innerHTML += ' <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'