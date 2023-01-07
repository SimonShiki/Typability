import ReactDOM from "react-dom/client";
import App from "./App";
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import "./style.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <FluentProvider theme={teamsLightTheme} className='provider'>
        <App />
    </FluentProvider>
);
