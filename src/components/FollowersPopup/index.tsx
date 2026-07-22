import { createEffect, createSignal, For, on, onCleanup, onMount, Show } from "solid-js";

import styles from "./FollowersPopup.module.css";
import { FollowersResponse, User } from "~/types/users";
import { getUsersFollowers } from "~/api";
import { useUser } from "~/contexts/UserContext";
import UserRow from "./UserRow";

type FollowersPopupProps = {
    title: string;
    users: FollowersResponse["users"];
    loadMore: () => Promise<number>;
    onClose: () => void;
    profile_id: number;
    onFollow: (id: number) => Promise<void>;
    onUnfollow: (id: number) => Promise<void>;
}

function FollowersPopup(props: FollowersPopupProps) {
    const { user } = useUser();
    const [loading, setLoading] = createSignal(true);

    let loadingRef!: HTMLDivElement;
    let popupRef!: HTMLDivElement;

    const handler = (event: Event) => {
        if (popupRef && (popupRef as HTMLDivElement).contains(event.target as HTMLElement)) { 
            return
        }
        props.onClose();
    };

    onMount(() => {
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
    })

    const observer = new IntersectionObserver(async (entries) => {
        console.log(entries);
        if (!user || !loading()) {
            return;
        }

        if (entries[0].isIntersecting) {
            console.log("intersection");
            observer.unobserve(loadingRef);
            if (await props.loadMore() === 0) {
                setLoading(false);
            }

        }
    }, {threshold: [0, .1]});

    createEffect(() => {
        if (props.users.length !== 0) {
            observer.observe(loadingRef);
        }
    });

    onCleanup(() => {
        observer.unobserve(loadingRef);
        document.removeEventListener('mousedown', handler);
        document.removeEventListener('touchstart', handler);
    });

    return (
        <div class={styles.container}>
            <div class={styles.popup} ref={popupRef}>
                <div class={styles.popup__header}>
                    <div class={styles.popup__header__title}>
                        {props.title}
                    </div>
                    <button onClick={() => { props.onClose(); }} class={styles.closeBtn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path class={styles.closeIcon} />
                        </svg>
                    </button>
                </div>

                <div class={styles.popup__content}>

                    <For each={props.users}>
                        {follower => (
                            <UserRow
                                user={follower.user}
                                is_mutual={follower.is_mutual}
                                followed={follower.requester_follows}
                                follows_requester={follower.follows_requester}
                                profile_id={props.profile_id}
                                type={props.title === "Followers" ? "followers" : "following"}
                                onFollow={props.onFollow}
                                onUnfollow={props.onUnfollow}
                            />
                        )}
                    </For>
                    <Show when={loading()}>
                        <div ref={loadingRef}></div>
                    </Show>
                </div>
            </div>
        </div>
    );
}

export default FollowersPopup;