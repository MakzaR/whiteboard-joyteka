import React from 'react';
import {useWidth} from "../../contexts/WidthContext";

import styles from './WidthSlider.module.css';

export default function WidthSlider() {
    const {width, changeWidth} = useWidth();

    return (
        <div className={styles.slider_container}>
            <input
                className={styles.slider}
                type="range"
                min={1}
                max={20}
                step={1}
                value={width}
                onChange={event => {
                    changeWidth(event.target.valueAsNumber)
                }}
            />
        </div>
    );
}