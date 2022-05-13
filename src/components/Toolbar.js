import React from 'react';
import {useTools} from "../contexts/ToolContext";

import styles from './Toolbar.module.css';

import CursorIcon from '../images/Cursor.svg';
import HandIcon from '../images/Hand.svg';
import TextIcon from '../images/Text.svg';
import ClipIcon from '../images/Clip.svg';

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
                <img src={CursorIcon} alt="Курсор"/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.hand_tool}`}
                onClick={() => {
                    changeTool(tools.HAND);
                }}
            >
                <img src={HandIcon} alt="Рука"/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.text_tool}`}
                onClick={() => changeTool(tools.TEXT)}
            >
                <img src={TextIcon} alt="Текст"/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.pen_tool}`}
                onClick={() => changeTool(tools.PEN)}
            >
                Pen
            </button>
            <button
                className={`${styles.tool_button} ${styles.eraser_tool}`}
                onClick={() => changeTool(tools.ERASER)}
            >
                Eraser
            </button>
            <button
                className={`${styles.tool_button} ${styles.circle_tool}`}
                onClick={() => changeTool(tools.CIRCLE)}
            >
                Add circle
            </button>
            <button
                className={`${styles.tool_button} ${styles.rect_tool}`}
                onClick={() => changeTool(tools.RECTANGLE)}
            >
                Add rect
            </button>
            <button
                className={`${styles.tool_button} ${styles.image_tool}`}
                onClick={props.addImage}
            >
                <img src={ClipIcon} alt="Изображение"/>
            </button>
            <button
                className={`${styles.tool_button} ${styles.export_tool}`}
                onClick={props.handleExport}
            >
                Export
            </button>
        </>
    );
}