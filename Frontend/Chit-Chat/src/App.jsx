import { useState } from 'react'
import Home from "./components/Home.jsx";
import Chat from "./components/Chat.jsx";
import './App.css'
import {Routes,Route} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
  <Routes>
    <Route path ="/" element = {Home}></Route>
    <Route path ="/chat" element = {Chat}></Route>
  </Routes>
    </div>
  )
}

export default App
