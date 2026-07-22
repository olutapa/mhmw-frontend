import { createEffect, createSignal, For } from "solid-js";
import styles from "./DropdownSelect.module.css";

type Option = {
    value: number;
    label: string;
}

type DropdownSelectProps = {
    options: Option[];
    selected?: number;
    onChange: (value: number) => void;
}

function DropdownSelect(props: DropdownSelectProps) {
    const [selected, setSelected] = createSignal(props.selected ?? props.options[0].value);

    createEffect(() => {
        props.onChange(selected());
    });

    console.log(props.selected);

    return (
        <div>
            <select value={selected()} onChange={(e) => setSelected(parseInt(e.currentTarget.value))}>
                <For each={props.options}>
                    {option => <option value={option.value}>{option.label}</option>}
                </For>
            </select>
        </div>
    );
};

export default DropdownSelect;
