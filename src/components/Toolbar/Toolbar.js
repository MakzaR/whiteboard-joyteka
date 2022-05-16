import React from 'react';
import Colors from "./Colors";
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
    const {tools, changeTool} = useTools();

    return (
        <>
            <button
                className={`${styles.tool_button} ${styles.cursor_tool}`}
                onClick={() => {
                    changeTool(tools.CURSOR);
                }}
            >
                <img src={CursorIcon} alt='Курсор'/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.hand_tool}`}
                onClick={() => {
                    changeTool(tools.HAND);
                }}
            >
                <img src={HandIcon} alt='Рука'/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.text_tool}`}
                onClick={() => changeTool(tools.TEXT)}
            >
                <img src={TextIcon} alt='Текст'/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.pen_tool}`}
                onClick={() => changeTool(tools.PEN)}
            >
                <img src={PenIcon} alt='Кисть'/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.eraser_tool}`}
                onClick={() => changeTool(tools.ERASER)}
            >
                <img src={EraserIcon} alt='Ластик'/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.circle_tool}`}
                onClick={() => changeTool(tools.CIRCLE)}
            >
                <img src={CircleIcon} alt='Круг'/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.rect_tool}`}
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
        </>
    );
}