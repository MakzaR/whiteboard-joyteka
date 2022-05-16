import React from 'react';
import Colors from "./Colors";
import WidthSlider from "./WidthSlider";

import {useTools} from "../../contexts/ToolContext";

import styles from './Toolbar.module.css';

import CursorIcon from '../../images/Cursor.svg';
import HandIcon from '../../images/Hand.svg';
import TextIcon from '../../images/Text.svg';
import PenIcon from '../../images/Pen.svg';
import EraserIcon from '../../images/Eraser.svg';
import CircleIcon from '../../images/Circle.svg';
import RectIcon from '../../images/Rectangle.svg';
import ClipIcon from '../../images/Clip.svg';
import ExportIcon from '../../images/Export.svg';

export default function Toolbar(props) {
    const {tools, getTool, changeTool} = useTools();
    const currentTool = getTool();

    const addStyles = (toolStyle, tool) => {
        return `${styles.tool_button} ${toolStyle} ${currentTool === tool ? styles.active : ''}`;
    }

    return (
        <>
            <button
                className={addStyles(styles.cursor_tool, tools.CURSOR)}
                onClick={() => {
                    changeTool(tools.CURSOR)
                }}
            >
                <img src={CursorIcon} alt='Курсор'/>
            </button>
            <button
                className={addStyles(styles.hand_tool, tools.HAND)}
                onClick={() => {
                    changeTool(tools.HAND);
                }}
            >
                <img src={HandIcon} alt='Рука'/>
            </button>
            <button
                className={addStyles(styles.text_tool, tools.TEXT)}
                onClick={() => changeTool(tools.TEXT)}
            >
                <img src={TextIcon} alt='Текст'/>
            </button>
            <button
                className={addStyles(styles.pen_tool, tools.PEN)}
                onClick={() => changeTool(tools.PEN)}
            >
                <img src={PenIcon} alt='Кисть'/>
            </button>
            <button
                className={addStyles(styles.eraser_tool, tools.ERASER)}
                onClick={() => changeTool(tools.ERASER)}
            >
                <img src={EraserIcon} alt='Ластик'/>
            </button>
            <button
                className={addStyles(styles.circle_tool, tools.CIRCLE)}
                onClick={() => changeTool(tools.CIRCLE)}
            >
                <img src={CircleIcon} alt='Круг'/>
            </button>
            <button
                className={addStyles(styles.rect_tool, tools.RECTANGLE)}
                onClick={() => changeTool(tools.RECTANGLE)}
            >
                <img src={RectIcon} alt='Прямоугольник'/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.image_tool}`}
                onClick={props.addImage}
            >
                <img src={ClipIcon} alt='Изображение'/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.export_tool}`}
                onClick={props.handleExport}
            >
                <img src={ExportIcon} alt='Экспорт'/>
            </button>
            <Colors/>
            <WidthSlider/>
        </>
    );
}