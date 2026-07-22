import { createSignal, For, onMount } from "solid-js";

import styles from "./series.module.css";
import { getCollections } from "~/api";
import { Collection } from "~/types/dolls";
import Header from "~/components/Header";
import CollectionCard from "~/components/CollectionCard";

function Collections() {
    const [collections, setCollections] = createSignal<Collection[]>([]);

    onMount(async() => {
        setCollections(await getCollections());
    });

    return (
        <main>
            <Header pageTitle="series" />
            <div class="page">
                <div class={styles.collections}>
                    <For each={collections()}>
                        {coll => <CollectionCard collection={coll} />}
                    </For>
                </div>
            </div>
        </main>
    );
}

export default Collections;
