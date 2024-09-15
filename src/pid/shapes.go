package pid

import "fmt"

type Shape struct {
	Features []features `json:"features,omitempty"`
	Type     string     `json:"type,omitempty"`
}

type features struct {
	Geometry   geometry   `json:"geometry"`
	Properties properties `json:"properties"`
	Type       string     `json:"type,omitempty"`
}

type properties struct {
	ShapeDistTraveled int    `json:"shape_dist_traveled,omitempty"`
	ShapeId           string `json:"shape_id,omitempty"`
	ShapePtSequence   int    `json:"shape_pt_sequence,omitempty"`
}

type geometry struct {
	Coordinates []float64 `json:"coordinates,omitempty"`
	Type        string    `json:"type,omitempty"`
}

type ShapeCoordinates struct {
	Coordinates [][2]float64 `json:"coordinates,omitempty"`
}

func GetShape(id string) ShapeCoordinates {
	var shape Shape
	var stationResponse = getResponse("/gtfs/shapes/" + id)

	parseJsonFromRequest(stationResponse.Body, &shape)

	fmt.Println(shape)

	var shapeCoordinates = ShapeCoordinates{
		Coordinates: [][2]float64{{}},
	}

	for i := range shape.Features {
		float64s := append(shapeCoordinates.Coordinates, [2]float64(shape.Features[i].Geometry.Coordinates))

		shapeCoordinates.Coordinates = float64s
	}

	return shapeCoordinates
}
