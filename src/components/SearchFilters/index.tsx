import { createEffect, createSignal, JSX, Show } from "solid-js";

import styles from "./SearchFilters.module.css";
import { useSearchParams } from "@solidjs/router";
import FilterSelectable from "./FilterSelectable";

type Option = {
    id: number;
    name: string;
}

export type SearchFiltersProps = {
    collections: Option[];
    onCollectionChange: (value: string[]) => void;
    characters: Option[];
    onCharacterChange: (value: string[]) => void;

    state? : boolean;
    setState?: (state: boolean) => void;

    setChildren?: (children: JSX.Element) => void;
    class?: string;
    // selected_collections?: string[];
}

function SearchFilters(props: SearchFiltersProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    // const [showFilters, setShowFilters] = createSignal(props.show ?? false);

    const [collections, setCollections] = createSignal<string[]>(
        searchParams.collection_id ? (
            Array.isArray(searchParams.collection_id) ? searchParams.collection_id : [searchParams.collection_id]
        ) : []
    );
    const [characters, setCharacters] = createSignal<string[]>(
        searchParams.character_id ? (
            Array.isArray(searchParams.character_id) ? searchParams.character_id : [searchParams.character_id]
        ) : []
    );

    createEffect(() => {
        setSearchParams({
            collection_id: collections().length === 0 ? undefined : collections(),
        });
        props.onCollectionChange(collections());
    })

    createEffect(() => {
        setSearchParams({
            character_id: characters().length === 0 ? undefined : characters(),
        });
        props.onCharacterChange(characters());
    })

    createEffect(() => {
        if (props.setChildren && props.state) {
            props.setChildren(
                <div class={styles.filters}>
                    <div class={styles.filter}>
                        <div class={styles.filter__title}>
                            Series
                        </div>
                        <div class={styles.filter__options}>
                            {
                                props.collections.map((collection) => (
                                    <FilterSelectable
                                        text={collection.name}
                                        selected={collections().includes(collection.id.toString())}
                                        canBeDeselected={true}
                                        onClick={() => {
                                            if (collections().includes(collection.id.toString())) {
                                                setCollections(collections().filter((id) => id !== collection.id.toString()));
                                            }
                                            else {
                                                setCollections([...collections(), collection.id.toString()]);
                                            }
                                        }}
                                    />
                                ))
                            }
                        </div>

                        <div class={styles.filter__title}>
                            Characters
                        </div>
                        <div class={styles.filter__options}>
                            {
                                props.characters.map((character) => (
                                    <FilterSelectable
                                        text={character.name}
                                        selected={characters().includes(character.id.toString())}
                                        canBeDeselected={true}
                                        onClick={() => {
                                            if (characters().includes(character.id.toString())) {
                                                setCharacters(characters().filter((id) => id !== character.id.toString()));
                                            }
                                            else {
                                                setCharacters([...characters(), character.id.toString()]);
                                            }
                                        }}
                                    />

                                ))
                            }
                        </div>
                    </div>
                </div>
            );
        } else if (props.setChildren && !props.state) {
            props.setChildren(undefined);
        }
    });

    return (
        // <div class={styles.container}>
            <button 
                class={styles.showFiltersBtn + (props.state ? " " + styles.open : "") + " " + (props.class ?? "")}
                onClick={() => props.setState?.(!props.state)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path class={props.state ? styles.filledFilterIcon : styles.filterIcon} />
                </svg>
                {props.state ? "Hide filters" : "Show filters"}
            </button>
        // </div>
    );
}

export default SearchFilters;