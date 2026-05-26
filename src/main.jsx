import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./Home"
import { Provider } from 'react-redux';
import store from './redux/store';
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Home />
    </Provider>
  </React.StrictMode>
);
