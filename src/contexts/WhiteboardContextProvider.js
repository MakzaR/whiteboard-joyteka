import React from 'react';
import {combineComponents} from "./combineContexts";

import {ToolProvider} from "./ToolContext";
import {ColorProvider} from "./ColorContext";


const providers = [
    ToolProvider,
    ColorProvider,
]

export const WhiteboardContextProvider = combineComponents(...providers);