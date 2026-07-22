import { Collection } from "~/types/dolls";
import styles from "./CollectionCard.module.css";
import { A } from "@solidjs/router";
import { For } from "solid-js";

type CollectionCardProps = {
    collection: Collection;
}

function CollectionCard(props: CollectionCardProps) {
    return (
        <A class={styles.card} href={`/series/${props.collection.text_id}`}>
            <div class={styles.card__title_row}>
                {props.collection.name}
            </div>
            <div class={styles.card__subtitle_row}>
                <For each={props.collection.realeses}>
                    {realease => <div class={styles.card__release}>{(new Date(realease)).toLocaleDateString('en-GB', { year: 'numeric' })}</div>}
                </For>
            </div>
        </A>
    );
};

export default CollectionCard;
