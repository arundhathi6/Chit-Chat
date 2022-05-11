
import './App.css';
import {Route,Routes} from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
    <Routes>
       <Route path="/" element={<Home/>}></Route>
       <Route path="/chat" element={<Chat/>}></Route>
       </Routes>
     
    </div>
  );
}

export default App;
