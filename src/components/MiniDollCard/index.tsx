import { A } from "@solidjs/router";
import styles from "./MiniDollCard.module.css";
import { Doll } from "~/types/dolls";

type MiniDollCardProps = {
    doll: Doll;
};

function MiniDollCard(props: MiniDollCardProps) {
    return (
        <A class={styles.card} href={`/doll/${props.doll.collection.text_id}/${props.doll.character.text_id}`}>
            <div class={styles.card__image}>
                <img src={props.doll.images[0]?.image_path} alt={props.doll.model_number} />
            </div>

            <div class={styles.card__text}>
                <div class={styles.card__title}>
                    {props.doll.character.name}
                </div>
                <div class={styles.card__subtitle}>
                    {props.doll.collection.name}
                </div>
            </div>
        </A>
    );
};

export default MiniDollCard;
