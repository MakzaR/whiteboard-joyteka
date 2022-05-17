import React from "react";
import Whiteboard from "./Whiteboard";
import {WhiteboardContextProvider} from "../contexts/WhiteboardContextProvider";

export default function WhiteboardApp() {
    return (
        <div className={'whiteboard'}>
            <WhiteboardContextProvider>
                <Whiteboard/>
            </WhiteboardContextProvider>
        </div>
    );
}