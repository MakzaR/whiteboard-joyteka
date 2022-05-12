import React, {useContext, useState} from 'react'


const ToolContext = React.createContext();

export function useTools() {
    return useContext(ToolContext);
}

export function ToolProvider({children}) {
    const [tool, setTool] = useState('cursor')

    const tools = {
        CURSOR: 'cursor',
        PEN: 'pen',
        ERASER: 'eraser'
    }

    const getTool = () => {
        return tool;
    }

    const changeTool = (toolName) => {
        setTool(toolName)
    }

    const value = {
        tools,
        getTool,
        changeTool,
    }

    return(
        <ToolContext.Provider value={value}>
            {children}
        </ToolContext.Provider>
    )
}