import './App.css';
import Whiteboard from "./components/Whiteboard";
import {WhiteboardContextProvider} from "./contexts/WhiteboardContextProvider";

function App() {
    return (
        <div className="App">
            <WhiteboardContextProvider>
                <Whiteboard/>
            </WhiteboardContextProvider>
        </div>
    );
}

export default App;
