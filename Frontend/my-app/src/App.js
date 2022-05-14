
import './App.css';
import {Route,Routes} from "react-router-dom";
import Home from "./Pages/Homepage"
import Chat from "./Pages/Chatpage"

function App() {
  return (
    <div className="App">
    <Routes>
       <Route path="/" element={<Home/>}></Route>
       <Route path="/chats" element={<Chat/>}></Route>
       </Routes>
     
    </div>
  );
}

export default App;
