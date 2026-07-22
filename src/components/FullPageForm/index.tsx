import { JSX, Show } from "solid-js";

import styles from "./FullPageForm.module.css";

type Error = {
    message: string;
    onClick: JSX.CustomEventHandlersLowerCase<HTMLButtonElement>["onclick"];
}

type FullPageFormProps = {
    title: string;
    action: any;
    method: JSX.HTMLFormMethod;
    children: JSX.Element;
    error?: Error;
    footer?: JSX.Element;
}

function FullPageForm(props: FullPageFormProps) {
    return (
        <div class={styles.formContainer}>
            <div class={styles.formContainerInner}>
                <Show when={props.error}>
                    <div class={styles.error}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path class={styles.errorIcon} />
                        </svg>
                        {props.error?.message}
                        <button
                            onclick={props.error?.onClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path class={styles.closeIcon} />
                            </svg>
                        </button>
                    </div>
                </Show>
                <form
                    action={props.action}
                    method={props.method}
                >
                    <div class={styles.formTitle}>
                        {props.title}
                    </div>
                    {props.children}
                </form>
                
                <Show when={props.footer}>
                    <div class={styles.footer}>
                        {props.footer}
                    </div>
                </Show>
            </div>
        </div>
    );
}

export default FullPageForm;
