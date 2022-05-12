import './App.css';
import Whiteboard from "./components/Whiteboard";
import {ToolProvider} from "./contexts/ToolContext";

function App() {
  return (
    <div className="App">
        <ToolProvider>
            <Whiteboard/>
        </ToolProvider>
    </div>
  );
}

export default App;
