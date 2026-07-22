import { createSignal } from "solid-js";
import styles from "./FilterSelectable.module.css";

type FilterSelectableProps = {
    text: string;
    canBeDeselected: boolean;
    selected?: boolean;
    onClick: () => void;
}

function FilterSelectable(props: FilterSelectableProps) {
    const [selected, setSelected] = createSignal(props.selected ?? false);
    
    return (
        <button
            class={`${styles.option} ${selected() ? styles.selected : ""} ${props.canBeDeselected ? "" : " " + styles.unselectable}`}
            onClick={() => {
                if (!props.canBeDeselected && selected()) {
                    return;
                }
                setSelected(!selected());
                props.onClick();
            }}
        >
            {props.text}
        </button>
    );
}

export default FilterSelectable;
