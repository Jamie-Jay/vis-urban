import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppLatestLoop from './AppLatestLoop';
import AppHistory from './AppHistory';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  // // <React.StrictMode> // cause render two times
  //   <App />,
  // // </React.StrictMode>,
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={ <AppHistory /> } />
      <Route path="/5MinLoop" element={ <AppLatestLoop /> } />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
