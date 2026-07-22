import { createEffect, createSignal, For, JSX, Show } from "solid-js";
import styles from "./SearchSort.module.css";
import FilterSelectable from "../SearchFilters/FilterSelectable";

type Option = {
    value: "release" | "collection" | "character";
    name: string;
}

export type SearchSortProps = {
    options: Option[];
    selected?: string;
    onChange: (value: "release" | "collection" | "character") => void;

    state?: boolean;
    setState?: (state: boolean) => void;
    setChildren?: (children: JSX.Element) => void;
    class?: string;
}

function SearchSort(props: SearchSortProps) {
    // const [showSort, setShowSort] = createSignal(props.show ?? false);

    createEffect(() => {
        if (props.setChildren && props.state) {
            props.setChildren(
                
                <div class={styles.container}>
                    <div class={styles.options}>
                        {
                            props.options.map((option) => (
                                <FilterSelectable
                                    text={option.name}
                                    selected={props.selected === option.value}
                                    canBeDeselected={false}
                                    onClick={() => props.onChange(option.value)}
                                />
                            ))
                        }
                    </div>
                </div>
            );
        } else if (props.setChildren && !props.state) {
            props.setChildren(undefined);
        }
    });
// {/* <select
//                     value={props.options[0].value}
//                     class={styles.sortSelect}
//                     onChange={(e) => props.onChange(e.currentTarget.value as "release" | "collection" | "character")}
//                 >
//                     <For each={props.options}>
//                         {option => <option value={option.value}>{option.name}</option>}
//                     </For>
//                 </select> */}
    return (
        // <div>
            <button
                class={styles.showBtn + (props.state ? " " + styles.open : "") + " " + (props.class ?? "")}
                onClick={() => props.setState?.(!props.state)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path class={props.state ? styles.reversedSortIcon : styles.sortIcon} />
                </svg>
                Sort by
            </button>
        // </div>
    );
}

export default SearchSort;
