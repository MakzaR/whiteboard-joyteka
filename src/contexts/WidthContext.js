import React, {useContext, useState} from 'react'


const WidthContext = React.createContext();

export function useWidth() {
    return useContext(WidthContext);
}

export function WidthProvider({children}) {
    const [width, setWidth] = useState(5)

    const getWidth = () => {
        return width;
    }

    const changeWidth = (width) => {
        setWidth(width)
    }

    const value = {
        width,
        getWidth,
        changeWidth,
    }

    return(
        <WidthContext.Provider value={value}>
            {children}
        </WidthContext.Provider>
    )
}