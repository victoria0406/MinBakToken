import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Dapp } from "./components/Dapp";
import './css/style.scss';

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Dapp />
    </BrowserRouter>
  </React.StrictMode>
);
