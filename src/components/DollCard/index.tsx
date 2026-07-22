import { A } from "@solidjs/router";
import styles from "./DollCard.module.css";
import { Doll } from "~/types/dolls";
import { createSignal, Show } from "solid-js";
import { addToWishlist, removeFromWishlist } from "~/api";

type DollCardProps = {
    doll: Doll;
    onWishlistChange?: (wishlist: boolean, doll_id: number) => void;
}

function DollCard(props: DollCardProps) {
    const [wishlist, setWishlist] = createSignal(props.doll.wishlist);

    const proccessWishlist = async () => {
        if (!props.doll.owned && wishlist() !== null) {
            if (props.doll.wishlist) {
                await removeFromWishlist(props.doll.id);
            }
            else {
                await addToWishlist(props.doll.id);
            }
            if (props.onWishlistChange) {
                props.onWishlistChange(props.doll.wishlist ? false : true, props.doll.id);
            }
            setWishlist(props.doll.wishlist ? false : true);
        }
    }

    return (
        <div
            class={styles.card}
        >
            <div class={styles.card__image}>
                <img src={props.doll.images[0]?.image_path} alt={props.doll.model_number} />
            </div>

            <div class={styles.card__title_row}>
                {props.doll.character.name}
            </div>
            <div class={styles.card__subtitle_row}>
                {props.doll.collection.name} • {new Date(props.doll.released).toLocaleDateString('en-GB', { year: 'numeric', month: 'long'})}
            </div>

            <div class={styles.card__additional_info}>
                <div class={styles.card__learn_more}>
                    <A href={`/doll/${props.doll.collection.text_id}/${props.doll.character.text_id}`}>Learn more</A>
                </div>

                <Show when={props.doll.owned !== null && props.doll.wishlist !== null}>
                    <div class={styles.card__wishlist}>
                        <button
                            class={styles.card__wishlist_btn}
                            onClick={proccessWishlist}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <Show when={wishlist()}>
                                    <path class={`filledHeartIcon ${styles.heart}`} />
                                </Show>
                                <Show when={!wishlist() && !props.doll.owned}>
                                    <path class={`hollowHeartIcon ${styles.hollow_heart}`} />
                                </Show>
                                <Show when={props.doll.owned}>
                                    <path class={`inventoryIcon ${styles.owned_icon}`} />
                                </Show>
                            </svg>
                        </button>
                    </div>
                </Show>
            </div>

            {/* <Show when={props.doll.owned !== null && props.doll.wishlist !== null}>
                <div class={styles.card__buttons}>
                    <Show when={props.doll.owned}>
                        <button class={styles.card__owned_btn}>Owned</button>
                    </Show>
                    <Show when={!props.doll.owned}>
                        <button class={styles.card__add_btn}>Add to collection</button>
                    </Show>

                    <Show when={props.doll.wishlist}>
                        <button class={styles.card__wishlisted_btn}>In the wishlist</button>
                    </Show>
                    <Show when={!props.doll.wishlist && !props.doll.owned}>
                        <button class={styles.card__want_btn}>Add to wishlist</button>
                    </Show>
                </div>
            </Show> */}
        </div>
    );
};

export default DollCard;