import React, {useRef, useState} from 'react';
import {Layer, Rect, Stage} from 'react-konva';
import Circ from "./Circle";

const SCALE_BY = 1.2;
const SCALE_MAX = 10;
const SCALE_MIN = 0.5;

export default function Whiteboard() {
    const [circles, setCircles] = useState([]);
    const [selectedId, selectShape] = useState(null);

    const stageEl = useRef();
    const layerEl = useRef();

    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    function zoomStage(event) {
        event.evt.preventDefault();
        if (stageEl.current !== null) {
            const stage = stageEl.current;
            const oldScale = stage.scaleX();
            const {x: pointerX, y: pointerY} = stage.getPointerPosition();
            const mousePointTo = {
                x: (pointerX - stage.x()) / oldScale,
                y: (pointerY - stage.y()) / oldScale,
            };
            const newScale = event.evt.deltaY > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;
            console.log(newScale);
            if (newScale < SCALE_MAX && newScale > SCALE_MIN) {
                stage.scale({ x: newScale, y: newScale });
                const newPos = {
                    x: pointerX - mousePointTo.x * newScale,
                    y: pointerY - mousePointTo.y * newScale,
                }
                stage.position(newPos);
                stage.batchDraw();
            }
        }
    }

    const addCircle = () => {
        const circle = {
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            stroke: "black",
            id: `circle${circles.length + 1}`,
        };
        const newCircles = circles.concat([circle]);
        setCircles(newCircles);
    };

    return (
        <div>
            <button onClick={addCircle}>Add circle</button>
            <Stage
                ref={stageEl}
                width={window.innerWidth}
                height={window.innerHeight}
                draggable
                onMouseDown={checkDeselect}
                onWheel={zoomStage}
            >
                <Layer ref={layerEl}>
                    <Rect
                        width={window.innerWidth}
                        height={window.innerHeight}
                        fill={'grey'}
                    />
                    {circles.map((circle, i) => {
                        return (
                            <Circ
                                key={i}
                                shapeProps={circle}
                                isSelected={circle.id === selectedId}
                                onSelect={() => {
                                    selectShape(circle.id);
                                }}
                                onChange={(newAttrs) => {
                                    const newCircles = circles.slice();
                                    newCircles[i] = newAttrs;
                                    setCircles(newCircles);
                                }}
                            />
                        )
                    })}
                </Layer>
            </Stage>
        </div>
    )
}
