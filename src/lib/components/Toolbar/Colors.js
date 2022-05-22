import React from 'react';
import {useColors} from "../../contexts/ColorContext";

import styles from './Colors.module.css';

export default function Colors() {
    const {colors, getColor, changeColor} = useColors();
    const currentColor = getColor();

    const addStyles = (colorStyle, color) => {
        return `${styles.color_button} ${colorStyle} ${currentColor === color ? styles.active : ''}`;
    }

    return (
        <div className={styles.colors_container}>
            <button
                className={addStyles(styles.black, colors.BLACK)}
                onClick={() => {changeColor(colors.BLACK)}}
            />
            <button
                className={addStyles(styles.white, colors.WHITE)}
                onClick={() => changeColor(colors.WHITE)}
            />
            <button
                className={addStyles(styles.red, colors.RED)}
                onClick={() => changeColor(colors.RED)}
            />
            <button
                className={addStyles(styles.yellow, colors.YELLOW)}
                onClick={() => changeColor(colors.YELLOW)}
            />
            <button
                className={addStyles(styles.blue, colors.BLUE)}
                onClick={() => changeColor(colors.BLUE)}
            />
            <button
                className={addStyles(styles.green, colors.GREEN)}
                onClick={() => changeColor(colors.GREEN)}
            />
        </div>
    );
}