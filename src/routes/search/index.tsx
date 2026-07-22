import { createEffect, createSignal, For, onCleanup, onMount, Show } from "solid-js";

import styles from "./dolls.module.css";
import { Character, Collection, Doll } from "~/types/dolls";
import { getAllDolls, getCharacters, getCollections } from "~/api";
import Header from "~/components/Header";
import DollCard from "~/components/DollCard";
import SearchFilters from "~/components/SearchFilters";
import SearchSort from "~/components/SearchSort";
import SearchSettingsWrapper from "~/components/SearchSettingsWrapper";

function SearchPage() {
    const [init, setInit] = createSignal(true);
    const [dolls, setDolls] = createSignal<Doll[]>([]);
    const [collections, setCollections] = createSignal<Collection[]>([]);
    const [characters, setCharacters] = createSignal<Character[]>([]);

    const [selectedCollections, setSelectedCollections] = createSignal<string[]>([]);
    const [selectedCharacters, setSelectedCharacters] = createSignal<string[]>([]);
    const [sorting, setSorting] = createSignal<"collection" | "character" | "release">("release");
    const [isAll, setIsAll] = createSignal(false);

    let loadingRef!: HTMLDivElement;

    const observer = new IntersectionObserver(async (entries) => {
        console.log(entries);

        if (entries[0].isIntersecting) {
            observer.unobserve(loadingRef);
            if (init() || dolls().length === 0) {
                return;
            }
            let cursor: string;
            const lastDoll = dolls()[dolls().length - 1];
            
            switch (sorting()) {
                case "collection":
                    cursor = `${lastDoll.collection_id}:${lastDoll.id}`
                    break;
                case "character":
                    cursor = `${lastDoll.character_id}:${lastDoll.id}`
                    break;
                case "release":
                    cursor = `${lastDoll.released}:${lastDoll.id}`
                    break;
            }

            const dollsToAdd = await getAllDolls(
                10,
                sorting(),
                cursor,
                selectedCollections(), 
                selectedCharacters()
            );
            if (dollsToAdd.length === 0) { setIsAll(true); }
            else { setDolls((dolls) => (dolls).concat(dollsToAdd)) };
        }
    }, {threshold: [0, .1]});

    onMount(async() => {
        setCollections(await getCollections());
        setCharacters(await getCharacters());
        setInit(false);
    });

    onCleanup(() => {
        observer.unobserve(loadingRef);
    });

    createEffect(async () => {
        if (init()) {
            return;
        }
        setDolls(await getAllDolls(10, sorting(), undefined, selectedCollections(), selectedCharacters()));
        setIsAll(false);
    });

    createEffect(() => {
        if (dolls().length !== 0) {
            observer.observe(loadingRef);
        }
    }, [dolls]);

    return (
        <main>
            <Header pageTitle="search" />
            <div class="page">
                <SearchSettingsWrapper
                    sort_props={{
                        options: [
                            {name: "Release date", value: "release"},
                            {name: "Collection", value: "collection"},
                            {name: "Character", value: "character"},
                        ],
                        onChange: (value) => setSorting(value),
                        selected: sorting(),
                    }}
                    filter_props={{
                        collections: collections().map((coll) => ({name: coll.name, id: coll.id})),
                        onCollectionChange: (cls) => setSelectedCollections(cls),
                        characters: characters().map((char) => ({name: char.name, id: char.id})),
                        onCharacterChange: (cls) => setSelectedCharacters(cls),
                    }}
                />

                <div class={styles.dolls}>
                    <For each={dolls()}>
                        {doll => <DollCard doll={doll} />}
                    </For>
                    <Show when={!isAll()}>
                        <div ref={loadingRef}></div>
                    </Show>
                </div>
            </div>
        </main>
    );
}


export default SearchPage;