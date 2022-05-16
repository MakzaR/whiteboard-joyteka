import React, {useContext, useState} from 'react'


const ColorContext = React.createContext();

export function useColors() {
    return useContext(ColorContext);
}

export function ColorProvider({children}) {
    const [color, setColor] = useState('#000000')

    const colors = {
        BLACK: '#000000',
        WHITE: '#FFFFFF',
        RED: '#EB5757',
        YELLOW: '#FEC807',
        BLUE: '#0080D6',
        GREEN: '#009595',
    }

    const getColor = () => {
        return color;
    }

    const changeColor = (colorName) => {
        setColor(colorName)
    }

    const value = {
        colors,
        getColor,
        changeColor,
    }

    return(
        <ColorContext.Provider value={value}>
            {children}
        </ColorContext.Provider>
    )
}