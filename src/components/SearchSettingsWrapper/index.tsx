import { createSignal, JSX } from "solid-js";

import styles from "./SearchSettingsWrapper.module.css";
import SearchSort, { SearchSortProps } from "~/components/SearchSort";
import SearchFilters, { SearchFiltersProps } from "~/components/SearchFilters";

type SearchSettingsWrapperProps = {
    sort_props: SearchSortProps;
    filter_props: SearchFiltersProps;
};

function SearchSettingsWrapper(props: SearchSettingsWrapperProps) {
    const [children, setChildren] = createSignal<JSX.Element>();
    const [sort, setSort] = createSignal(false);
    const [filter, setFilter] = createSignal(false);

    return (
        <div class={styles.container}>
            <div class={styles.settings}>
                <SearchSort
                    setChildren={(children) => {
                        if (!children && filter()) { return; }
                        setFilter(false);
                        setChildren(children);
                    }}
                    state={sort()}
                    setState={(state) => { setSort(state); }}
                    class={sort() || filter() ? styles.op : ""}
                    {...props.sort_props}
                />
                <SearchFilters 
                    setChildren={(children) => {
                        if (!children && sort()) { return; }
                        setSort(false);
                        setChildren(children);
                    }}
                    state={filter()}
                    setState={(state) => { setFilter(state); }}
                    class={sort() || filter() ? styles.op : ""}
                    {...props.filter_props}
                />
            </div>
            {children()}
        </div>
    );
}

export default SearchSettingsWrapper;
