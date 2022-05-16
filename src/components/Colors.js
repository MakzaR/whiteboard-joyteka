import React from 'react';
import {useColors} from "../contexts/ColorContext";

export default function Colors(props) {
    const {colors, changeColor} = useColors();

    return (
        <>
            <button onClick={() => {
                props.choosePen();
                changeColor(colors.BLACK);
            }}>
                Чёрный
            </button>
        </>
    );
}