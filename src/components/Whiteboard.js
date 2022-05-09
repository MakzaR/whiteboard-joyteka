import React, {useRef, useState} from 'react';
import {Layer, Rect, Stage} from 'react-konva';
import Circ from './Circle';
import Rectangle from "./Rectangle";

import styles from './Whiteboard.module.css'

const SCALE_BY = 1.2;
const SCALE_MAX = 5;
const SCALE_MIN = 0.5;

export default function Whiteboard() {
    const [circles, setCircles] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [selectedId, selectShape] = useState(null);

    const stageEl = useRef(null);
    const layerEl = useRef();
    const backLayerEl = useRef();

    const checkDeselect = (el) => {
        const clickedOnEmpty = el.target === el.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    const checkBackgroundDeselect = (el) => {
        const clickedOnEmpty = el.target._id === 6;
        if (clickedOnEmpty) {
            selectShape(null);
        }
    }

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
            if (newScale < SCALE_MAX && newScale > SCALE_MIN) {
                stage.scale({x: newScale, y: newScale});
                const newPos = {
                    x: pointerX - mousePointTo.x * newScale,
                    y: pointerY - mousePointTo.y * newScale,
                }
                stage.position(newPos);
                stage.batchDraw();
            }
        }
    }

    document.addEventListener('keydown', (ev) => {
        if (stageEl.current !== null) {
            const stage = stageEl.current;
            if (ev.code === 'Space') {
                document.body.style.cursor = 'grabbing';
                stage.draggable(true);
            }
        }
    });

    document.addEventListener('keyup', (ev) => {
        if (stageEl.current !== null) {
            const stage = stageEl.current;
            if (ev.code === 'Space') {
                document.body.style.cursor = 'grab';
                stage.draggable(false);
            }
        }
    });

    const addCircle = () => {
        const circle = {
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            stroke: 'black',
            id: `circle${circles.length + 1}`,
        };
        const newCircles = circles.concat([circle]);
        setCircles(newCircles);
    };

    const addRectangle = () => {
        const rect = {
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            stroke: 'black',
            id: `rect${rectangles.length + 1}`,
        };
        const newRects = rectangles.concat([rect]);
        setRectangles(newRects);
    }

    return (
        <div>
            <button className={styles.circle_button} onClick={addCircle}>Add circle</button>
            <button className={styles.rect_button} onClick={addRectangle}>Add rectangle</button>
            <div>
                <Stage
                    className={styles.whiteboard}
                    ref={stageEl}
                    width={3000}
                    height={1500}
                    onMouseDown={checkDeselect}
                    onWheel={zoomStage}
                >
                    <Layer ref={backLayerEl} onMouseDown={checkBackgroundDeselect}>
                        <Rect
                            width={3000}
                            height={1500}
                            fill={'white'}
                            stroke={'#F5F5F5'}
                            shadowColor={'black'}
                            shadowBlur={35}
                            shadowOpacity={0.05}
                            shadowOffsetX={10}
                            shadowOffsetY={10}
                        />
                    </Layer>
                    <Layer ref={layerEl}>
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
                        {rectangles.map((rectangle, i) => {
                            return (
                                <Rectangle
                                    key={i}
                                    shapeProps={rectangle}
                                    isSelected={rectangle.id === selectedId}
                                    onSelect={() => {
                                        selectShape(rectangle.id);
                                    }}
                                    onChange={(newAttrs) => {
                                        const newRects = rectangles.slice();
                                        newRects[i] = newAttrs;
                                        setRectangles(newRects);
                                    }}
                                />
                            )
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}
