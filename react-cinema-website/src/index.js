// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

import React, { useReducer } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './router';
import "./style/MyStyle.scss";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';




const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <RouterCustom />
  </BrowserRouter>
);





