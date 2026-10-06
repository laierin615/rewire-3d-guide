import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./guide-refresh.css";
import "@fontsource/huninn/latin-400.css";
import "@fontsource/huninn/chinese-traditional-400.css";
import "./island-theme.css";

createRoot(document.getElementById("root")!).render(<App />);
