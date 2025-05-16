import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import Feature from "ol/Feature";
import { LineString, Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

let positionFeature: Feature<Point> | undefined;
let destinationFeature: Feature<Point> | undefined;
let lineFeature: Feature<LineString> | undefined;

export function createMap(target: HTMLDivElement, currentPosition: [number, number]): Map {
    return new Map({
        target,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
            center: fromLonLat(currentPosition),
            zoom: 13,
            minZoom: 10,
            maxZoom: 18
          }),
    });
}

export function addFeaturesToMap(map: Map, currentCoords:[number, number], targetCoords:[number, number]){
    try{
        const vectorSource = new VectorSource();
        const markerVectorLayer = new VectorLayer({ source: vectorSource });

        positionFeature = new Feature({
            geometry: new Point(fromLonLat(currentCoords))
        });

        destinationFeature = new Feature({
            geometry: new Point(fromLonLat(targetCoords))
        });

        lineFeature = new Feature({
            geometry: new LineString([
                fromLonLat(currentCoords),
                fromLonLat(targetCoords)
            ])
        });

        lineFeature.setStyle(
            new Style({
                stroke: new Stroke({
                    color: 'orange',
                    width: 2,
                    lineDash: [10, 10]
                })
            })
        );

        vectorSource.addFeatures([positionFeature, destinationFeature, lineFeature]);
        map.addLayer(markerVectorLayer);
        map.getView().fit(lineFeature.getGeometry()!, {maxZoom: 18});
    }catch(err){
        console.error('Error on adding features', err);
        throw new Error('Error showing the map');
    }
}

export function updatePosition(map: Map, newCoords: [number, number]){
    if(!positionFeature || ! lineFeature) return;

    try{
        const geom = positionFeature.getGeometry() as Point;
        geom.setCoordinates(fromLonLat(newCoords));

        const line = lineFeature.getGeometry() as LineString;
        const end = line.getLastCoordinate();
        line.setCoordinates([fromLonLat(newCoords), end]);
    }catch(err){
        console.error('Error on updating the position');
    }
}