import React from 'react';
import {useWidth} from "../../contexts/WidthContext";

export default function WidthSlider() {
    const {width, changeWidth} = useWidth();

    return (
        <>
            <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={width}
                onChange={event => {
                    changeWidth(event.target.valueAsNumber)
                }}
            />
        </>
    );
}