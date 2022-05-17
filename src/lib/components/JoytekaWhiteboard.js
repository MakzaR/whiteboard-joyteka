import React from "react";
import {WhiteboardContextProvider} from "../contexts/WhiteboardContextProvider";
import Whiteboard from "./Whiteboard";
import './Whiteboard.css';

export default function JoytekaWhiteboard() {
    return (
        <WhiteboardContextProvider>
            <div className='whiteboard'>
                <Whiteboard/>
            </div>
        </WhiteboardContextProvider>
    );
}