import { useParams } from "@solidjs/router";
import { createResource, ErrorBoundary, Show } from "solid-js";

import { getCollectionHumanly } from "~/api";
import Header from "~/components/Header";
import NotFound from "~/routes/[...404]";


function SeriesPage() {
    const params = useParams();

    const [collection] = createResource(
        () => {
            return params.name as string;
        },
        async (name) => {
            return await getCollectionHumanly(name);
        },

    );
    
    return (
        <ErrorBoundary fallback={() => (
            <NotFound />
        )}>
            <main>
                <Header />
                <div class="page">
                    <Show when={collection()}>
                        <h1>{collection()?.name}</h1>
                        <p>{collection()?.description}</p>
                    </Show>
                </div>
            </main>
        </ErrorBoundary>
    );
}

export default SeriesPage;
