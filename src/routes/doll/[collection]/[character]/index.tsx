import { useParams } from "@solidjs/router";
import { createResource, ErrorBoundary, Show } from "solid-js";

import { getDollHumanly } from "~/api";
import Header from "~/components/Header";
import NotFound from "~/routes/[...404]";


function DollPage() {
    const params = useParams();

    const [doll] = createResource(
        () => {
            return { collection: params.collection as string, character: params.character as string };
        },
        async ({ collection, character }) => {
            return await getDollHumanly(collection, character);
        },

    );
    
    return (
        <ErrorBoundary fallback={() => (
            <NotFound />
        )}>
            <main>
                <Header />
                <div class="page">
                    <Show when={doll()}>
                        <h1>{doll()?.character.name} - {doll()?.collection.name}</h1>
                        <p>{doll()?.model_number}</p>
                    </Show>
                </div>
            </main>
        </ErrorBoundary>
    );
}


export default DollPage;
