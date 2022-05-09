import React, {useRef, useState} from 'react';
import {Image, Layer, Line, Rect, Stage} from 'react-konva';
import useImage from "use-image";
import backgroundImage from '../images/Background.svg';

import Circ from './Circle';
import Rectangle from "./Rectangle";

import styles from './Whiteboard.module.css'

const SCALE_BY = 1.2;
const SCALE_MAX = 5;
const SCALE_MIN = 0.5;

export default function Whiteboard() {
    const [tool, setTool] = useState('pen');
    const [lines, setLines] = useState([]);
    const [circles, setCircles] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [selectedId, selectShape] = useState(null);

    const [background] = useImage(backgroundImage);

    const stageEl = useRef(null);
    const layerEl = useRef();
    const backLayerEl = useRef();

    const isDrawing = useRef(false);

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
        handleMouseUp();
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
                document.body.style.cursor = 'default';
                stage.draggable(false);
            }
        }
    });

    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getRelativePointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y]}]);
    }

    const handleMouseMove = (e) => {
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getRelativePointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    }

    const handleMouseUp = (e) => {
        isDrawing.current = false;
    }

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
            <select
                value={tool}
                onChange={(e) => {
                    setTool(e.target.value);
                }}
            >
                <option value={'pen'}>Pen</option>
                <option value={'eraser'}>Eraser</option>
            </select>
            <div>
                <Stage
                    ref={stageEl}
                    width={3000}
                    height={1500}
                    onMouseDown={checkDeselect}
                    onWheel={zoomStage}
                >
                    <Layer ref={backLayerEl} onMouseDown={checkBackgroundDeselect}>
                        <Image
                            image={background}
                            shadowColor={'black'}
                            shadowBlur={35}
                            shadowOpacity={0.05}
                            shadowOffsetX={10}
                            shadowOffsetY={10}
                        />
                    </Layer>
                    <Layer
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        <Rect
                            width={3000}
                            height={1500}
                        />
                        {lines.map((line, i) => (
                            <Line
                                key={i}
                                points={line.points}
                                stroke={'black'}
                                strokeWidth={5}
                                tension={0.5}
                                lineCap={'round'}
                                globalCompositeOperation={
                                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                                }
                            />
                        ))}
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
