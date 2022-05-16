import React from 'react';
import {useColors} from "../../contexts/ColorContext";

import styles from './Colors.module.css';

export default function Colors() {
    const {colors, changeColor} = useColors();

    return (
        <>
            <button
                className={`${styles.color_button} ${styles.black}`}
                onClick={() => changeColor(colors.BLACK)}
            />
            <button
                className={`${styles.color_button} ${styles.white}`}
                onClick={() => changeColor(colors.WHITE)}
            />
            <button
                className={`${styles.color_button} ${styles.red}`}
                onClick={() => changeColor(colors.RED)}
            />
            <button
                className={`${styles.color_button} ${styles.yellow}`}
                onClick={() => changeColor(colors.YELLOW)}
            />
            <button
                className={`${styles.color_button} ${styles.blue}`}
                onClick={() => changeColor(colors.BLUE)}
            />
            <button
                className={`${styles.color_button} ${styles.green}`}
                onClick={() => changeColor(colors.GREEN)}
            />
        </>
    );
}