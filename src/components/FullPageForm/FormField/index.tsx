import { JSX } from "solid-js";

import styles from "./FormField.module.css";

type Field = {
    name: string;
    label?: string;
    secondaryLabel?: JSX.Element;
    type: JSX.InputHTMLAttributes<HTMLInputElement>["type"];
    placeholder?: string;
    minlength?: number;
    pattern?: JSX.InputHTMLAttributes<HTMLInputElement>["pattern"];
    autocomplete?: string;
    onInput?: JSX.InputHTMLAttributes<HTMLInputElement>["onInput"];
    value: JSX.InputHTMLAttributes<HTMLInputElement>["value"];
}

function FormField(field: Field) {
    return (
        <div class={styles.field}>
            <div class={styles.label}>
                <label for={field.name}>{field.label}</label>
                {field.secondaryLabel}
            </div>
            <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                autocomplete={field.autocomplete}
                onInput={field.onInput}
                value={field.value}
                minlength={field.minlength}
                pattern={field.pattern}
                />
        </div>
    );
}

export default FormField;