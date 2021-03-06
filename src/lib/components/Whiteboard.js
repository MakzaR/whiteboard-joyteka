import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, Layer, Line, Stage, Transformer} from 'react-konva';
import useImage from "use-image";
import {useTools} from "../contexts/ToolContext";
import {useColors} from "../contexts/ColorContext";
import {useWidth} from "../contexts/WidthContext";

import Toolbar from "./Toolbar/Toolbar";
import Circ from './Circle';
import Rectangle from "./Rectangle";
import Img from "./Image";
import {addTextNode, deleteTextNode} from "./Text";

import backgroundImage from '../images/Background.svg';

const SCALE_BY = 1.2;
const SCALE_MAX = 5;
const SCALE_MIN = 0.65;
const HEIGHT = window.innerHeight - 16;
const WIDTH = window.innerWidth - 16;

const downloadURI = (uri, name) => {
    let link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const getDist = (firstPoint, secondPoint) => {
    return ((firstPoint.x - secondPoint.x) ** 2 + (firstPoint.y - secondPoint.y) ** 2) ** 0.5;
}

export default function Whiteboard() {
    const {tools, getTool, changeTool} = useTools();
    const {getColor} = useColors();
    const {getWidth, changeWidth} = useWidth();

    const currentTool = getTool();
    const currentColor = getColor();
    const currentWidth = getWidth();

    const [lines, setLines] = useState([]);
    const [images, setImages] = useState([]);
    const [circles, setCircles] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [textNodes, setTextNodes] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [background] = useImage(backgroundImage);

    const stageEl = useRef(null);
    const layerEl = useRef(null);
    const backLayerEl = useRef(null);
    const textTransformer = useRef(null);
    const imageUploadEl = useRef();
    const isDrawing = useRef(false);

    const [, updateState] = React.useState();

    const forceUpdate = useCallback(() => updateState({}), [])

    const keyPress = (ev) => {
        if (ev.code === 'Space') {
            changeTool(tools.HAND, 'grabbing');
        }
        if (ev.code === "Delete") {
            handleDelete();
        }
        if (ev.shiftKey) {
            handleShortcuts(ev);
        }
    };

    const keyRelease = (ev) => {
        if (ev.code === 'Space') {
            changeTool(tools.CURSOR, 'default')
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', keyPress);
        document.addEventListener('keyup', keyRelease);
        return () => {
            document.removeEventListener('keydown', keyPress);
            document.removeEventListener('keyup', keyRelease);
        }
    }, [keyPress, keyRelease]);

    const handleMouseDown = (e) => {
        const clickedOnEmptyStage = e.target === e.target.getStage();
        const clickedOnEmptyBackground = e.target.hasName('background');

        if (clickedOnEmptyStage || clickedOnEmptyBackground) {
            selectShape(null);
        }

        const stage = stageEl.current.getStage();
        switch (currentTool) {
            case tools.CURSOR:
                stage.draggable(false);
                break;
            case tools.HAND:
                changeTool(tools.HAND, 'grabbing');
                stage.draggable(true);
                break;
            case tools.PEN:
                stage.draggable(false);
                isDrawing.current = true;
                addLines(e, currentTool, currentColor, currentWidth);
                break;
            case tools.ERASER:
                stage.draggable(false);
                isDrawing.current = true;
                addLines(e, currentTool, 'black', currentWidth + 10);
                break;
            case tools.TEXT:
                stage.draggable(false);
                addText();
                changeTool(tools.CURSOR, 'default');
                break;
            case tools.CIRCLE:
                stage.draggable(false);
                addCircle(e);
                changeTool(tools.CURSOR, 'default');
                break;
            case tools.RECTANGLE:
                stage.draggable(false);
                addRectangle(e);
                changeTool(tools.CURSOR, 'default');
                break;
            default:
                break;
        }
    }

    const handleMouseMove = (e) => {
        if (currentTool === tools.PEN || currentTool === tools.ERASER) {
            if (!isDrawing.current) {
                return;
            }
            const stage = e.target.getStage();
            const point = stage.getRelativePointerPosition();
            let lastLine = lines[lines.length - 1];

            let lastPoint = {
                x: lastLine.points[lastLine.points.length - 2],
                y: lastLine.points[lastLine.points.length - 1]
            };

            if (getDist(lastPoint, point) > 4) {
                lastLine.points = lastLine.points.concat([point.x, point.y]);
                lines.splice(lines.length - 1, 1, lastLine);
                setLines(lines.concat());
            }
        }
    }

    const handleMouseUp = () => {
        isDrawing.current = false;

        if (currentTool === tools.HAND) {
            changeTool(tools.HAND, 'grab');
        }
    }

    const handleDelete = () => {
        let circleIndex = circles.findIndex(c => c.id === selectedId);
        if (circleIndex !== -1) {
            circles.splice(circleIndex, 1);
            setCircles(circles);
        }

        let rectIndex = rectangles.findIndex(r => r.id === selectedId);
        if (rectIndex !== -1) {
            rectangles.splice(rectIndex, 1);
            setRectangles(rectangles);
        }

        let imgIndex = images.findIndex(i => i.id === selectedId);
        if (imgIndex !== -1) {
            images.splice(imgIndex, 1);
            setImages(images);
        }

        let textIndex = textNodes.findIndex(t => t.id === selectedId);
        if (textIndex !== -1) {
            const currentShape = layerEl.current.findOne(node => {
                return node.attrs.id === textNodes[textIndex].id
            });
            deleteTextNode(layerEl.current, currentShape, textTransformer.current)
            textNodes.splice(textIndex, 1);
            setTextNodes(textNodes);
        }

        forceUpdate();
    };

    const handleSelectText = (ev) => {
        if (ev.target.hasName('textNode')) {
            const id = ev.target.attrs.id
            selectShape(id);
        }
    }

    const handleShortcuts = (ev) => {
        switch (ev.code) {
            case 'KeyC':
                changeTool(tools.CURSOR, 'default');
                break;
            case 'KeyH':
                changeTool(tools.HAND, 'grab');
                break;
            case 'KeyT':
                changeTool(tools.TEXT, 'text');
                break;
            case 'KeyP':
                changeTool(tools.PEN, 'crosshair');
                break;
            case 'KeyE':
                changeTool(tools.ERASER, 'crosshair');
                break;
            case 'KeyO':
                changeTool(tools.CIRCLE, 'crosshair');
                break;
            case 'KeyR':
                changeTool(tools.RECTANGLE, 'crosshair');
                break;
            case 'KeyI':
                addImage();
                break;
            case 'BracketRight':
                if (currentWidth < 20) {
                    changeWidth(currentWidth + 1);
                }
                break;
            case 'BracketLeft':
                if (currentWidth > 1) {
                    changeWidth(currentWidth - 1);
                }
                break;
            default:
                break;
        }
    }

    const handleExport = () => {
        stageEl.current.position({x: 0, y: 0});
        stageEl.current.scale({x: 1, y: 1});
        const uri = stageEl.current.toDataURL({pixelRatio: 2});
        downloadURI(uri, 'stage.png');
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
            const newScale = event.evt.deltaY > 0 ? oldScale / SCALE_BY : oldScale * SCALE_BY;
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

    const addLines = (e, tool, color, width) => {
        const pos = e.target.getStage().getRelativePointerPosition();
        setLines([...lines, {
            tool,
            points: [pos.x, pos.y],
            color,
            width
        }]);
    }

    const addCircle = (e) => {
        const stage = e.target.getStage();
        const circle = {
            x: stage.getRelativePointerPosition().x,
            y: stage.getRelativePointerPosition().y,
            width: 100,
            height: 100,
            stroke: currentColor,
            strokeWidth: currentWidth,
            id: `circle${circles.length + 1}`,
        };
        const newCircles = circles.concat([circle]);
        setCircles(newCircles);
    };

    const addRectangle = (e) => {
        const stage = e.target.getStage();
        const rect = {
            x: stage.getRelativePointerPosition().x,
            y: stage.getRelativePointerPosition().y,
            width: 100,
            height: 100,
            stroke: currentColor,
            strokeWidth: currentWidth,
            id: `rect${rectangles.length + 1}`,
        };
        const newRects = rectangles.concat([rect]);
        setRectangles(newRects);
    }

    const uploadImage = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.addEventListener('load', () => {
            images.push({
                content: reader.result,
                id: `image${images.length + 1}`,
                x: 500,
                y: 300
            });
            setImages(images);
            forceUpdate();
        });

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const addImage = () => {
        imageUploadEl.current.click();
    }

    const addText = () => {
        const id = addTextNode(stageEl.current.getStage(), layerEl.current, textTransformer.current);
        const newTextNodes = textNodes.concat([{id}]);
        setTextNodes(newTextNodes);
    }

    return (
        <div>
            <Toolbar addImage={addImage} handleExport={handleExport}/>
            <input ref={imageUploadEl} style={{display: "none"}} type={'file'} accept={'image/*'}
                   onChange={uploadImage}/>
            <div>
                <Stage
                    ref={stageEl}
                    width={WIDTH}
                    height={HEIGHT}
                    onWheel={zoomStage}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onClick={handleSelectText}
                >
                    <Layer ref={backLayerEl}>
                        <Image
                            width={WIDTH}
                            height={HEIGHT}
                            image={background}
                            shadowColor={'black'}
                            shadowBlur={35}
                            shadowOpacity={0.05}
                            shadowOffsetX={10}
                            shadowOffsetY={10}
                            name={'background'}
                        />
                    </Layer>
                    <Layer ref={layerEl}>
                        {lines.map((line, i) => (
                            <Line
                                key={i}
                                points={line.points}
                                stroke={line.color}
                                strokeWidth={line.width}
                                tension={0.5}
                                lineCap={'round'}
                                globalCompositeOperation={
                                    line.tool === tools.ERASER ? 'destination-out' : 'source-over'
                                }
                            />
                        ))}
                        <Transformer
                            ref={textTransformer}
                            enabledAnchors={['middle-left', 'middle-right']}
                            boundBoxFunc={(oldBox, newBox) => {
                                newBox.width = Math.max(30, newBox.width);
                                return newBox;
                            }}
                        />
                        {images.map((image, i) => {
                            return (
                                <Img
                                    key={i}
                                    shapeProps={image}
                                    imageUrl={image.content}
                                    isSelected={image.id === selectedId}
                                    onSelect={() => {
                                        selectShape(image.id);
                                    }}
                                    onChange={(newAttr) => {
                                        const newImages = images.slice();
                                        newImages[i] = newAttr;
                                    }}
                                />
                            )
                        })}
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
