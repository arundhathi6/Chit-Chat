import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom/umd/react-router-dom.development';
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from "./context/chatContextProvider";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <ChatProvider>
    <ChakraProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </ChakraProvider>
    </ChatProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
