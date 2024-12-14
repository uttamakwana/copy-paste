import ReactDOM from "react-dom/client";
import App from "./App";
import "./tailwind.css";
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
