import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { MetaProvider, Title } from "@solidjs/meta";

import "./app.css";
import { FileRoutes } from "@solidjs/start/router";
import { UserProvider } from "./contexts/UserContext";


export default function App() {
    return (
        <Router
            root={props => (
                <MetaProvider>
                    <Title>MHMegaWiki</Title>
                    <UserProvider>
                        <Suspense>{props.children}</Suspense>
                    </UserProvider>
                </MetaProvider>
            )}
            >
            <FileRoutes />
        </Router>
    );
}
