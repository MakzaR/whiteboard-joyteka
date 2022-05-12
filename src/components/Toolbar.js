import React from 'react';
import {useTools} from "../contexts/ToolContext";

export default function Toolbar() {
    const {tools, changeTool} = useTools();

    return (
        <>
            <button onClick={() => changeTool(tools.CURSOR)}>Cursor</button>
            <button onClick={() => changeTool(tools.HAND)}>Hand</button>
            <button onClick={() => changeTool(tools.PEN)}>Pen</button>
            <button onClick={() => changeTool(tools.ERASER)}>Eraser</button>
            <button onClick={() => changeTool(tools.CIRCLE)}>Add circle</button>
            <button onClick={() => changeTool(tools.RECTANGLE)}>Add rectangle</button>
            <button onClick={() => changeTool(tools.TEXT)}>Add text</button>
        </>
    );
}