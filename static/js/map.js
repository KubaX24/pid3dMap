const THREE = window.THREE;

const map = new maplibregl.Map({
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

import { Bus } from "./3d/bus.js"
const bus = new Bus("bus-150",14.474265, 50.078444)

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
                        ]
                    }
                },
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

            bus.setPosition(goCords[0], goCords[1])

            let goVec = [nextCoords[0] - prevCords[0], nextCoords[1] - prevCords[1]]
            let nyCords = [prevCords[0], prevCords[1] - 0.2]
            let nyVec = [nyCords[0] - prevCords[0], nyCords[1] - prevCords[1]]

            let rotateCos = ((nyVec[0] * goVec[0]) + (nyVec[1] * goVec[1])) / (Math.sqrt(Math.pow(nyVec[0], 2) + Math.pow(nyVec[1], 2)) * Math.sqrt(Math.pow(goVec[0], 2) + Math.pow(goVec[1], 2)))

            bus.setRotation(prevCords[0] - nextCoords[0] < 0 ? Math.acos(rotateCos) : -Math.acos(rotateCos))
        }

    })

    map.addLayer({
        'id': 'lines',
        'type': 'line',
        'source': 'lines',
        'paint': {
            'line-width': 3,
            'line-color': ['get', 'color']
        }
    });

    map.addLayer(bus.render());

    // MAP.addControl(
    //     new MAPlibregl.NavigationControl({
    //         visualizePitch: true,
    //         showZoom: true,
    //         showCompass: true
    //     })
    // );
});

document.getElementsByClassName("maplibregl-ctrl-attrib-inner")[0].innerHTML += ' <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'