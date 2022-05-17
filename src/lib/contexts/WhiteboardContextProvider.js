import {combineContexts} from "./combineContexts";

import {ToolProvider} from "./ToolContext";
import {ColorProvider} from "./ColorContext";
import {WidthProvider} from "./WidthContext";


const providers = [
    ToolProvider,
    ColorProvider,
    WidthProvider
]

export const WhiteboardContextProvider = combineContexts(...providers);