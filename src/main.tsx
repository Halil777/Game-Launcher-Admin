import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./components/common/theme/ThemeContext.tsx";
import Background from "./components/common/background/Background.tsx";
import RouteList from "./components/common/routes/RouteList.tsx";
import "./assets/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <Background>
      <RouteList />
    </Background>
  </ThemeProvider>
);
