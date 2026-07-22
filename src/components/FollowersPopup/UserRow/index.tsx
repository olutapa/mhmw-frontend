import { A } from "@solidjs/router";
import styles from "./UserRow.module.css";
import { User } from "~/types/users";
import { useUser } from "~/contexts/UserContext";
import { createEffect, createSignal, Show } from "solid-js";
import { followUser, unfollowUser } from "~/api";

type UserRowProps = {
    user: User;
    is_mutual: boolean;
    followed?: boolean;
    follows_requester?: boolean;
    profile_id: number;
    onFollow: (id: number) => Promise<void>;
    onUnfollow: (id: number) => Promise<void>;
    type: "followers" | "following";
}

function UserRow(props: UserRowProps) {
    const { user } = useUser();
    const userLink = `/profile/${props.user.username}`;

    const [followed, setFollowed] = createSignal<boolean | undefined>(props.followed);
    const [isMutual, setIsMutual] = createSignal(props.is_mutual);

    const handleFollow = async () => {
        if (!user) {
            return;
        }

        if (props.user.id === user.id) {
            return;
        }

        if (followed()) {
            console.log("unfollow");
            // await unfollowUser(props.user.id);
            await props.onUnfollow(props.user.id);
            setFollowed(false);
            setIsMutual(false);
        }
        else {
            console.log("follow");
            // await followUser(props.user.id);
            await props.onFollow(props.user.id);
            setFollowed(true);
        }
    };

    return (
        <div class={styles.row}>

            <div class={styles.left}>
                <A class={styles.displayName} href={userLink}>
                    {isMutual() ? "🤝 " : ""}
                    {props.user.display_name}
                </A>
                <A class={styles.username} href={userLink}>
                    {props.user.username}
                    {
                        props.follows_requester &&
                        !props.followed && (
                        props.profile_id !== user?.id ||
                        (props.type === "following" &&
                            props.profile_id === user?.id)
                        )
                        ? " • follows you" : ""
                    }
                    {props.user.id === user?.id ? " • you" : ""}
                </A>
            </div>

            <div class={styles.right}>
                <Show when={user && props.user.id !== user.id}>
                    <Show when={followed()}>
                        <button
                            onClick={handleFollow}
                        >
                            Unfollow
                        </button>
                    </Show>
                    <Show when={followed() === false}>
                        <button
                            onClick={handleFollow}
                        >
                            Follow
                        </button>
                    </Show>
                </Show>
            </div>
        </div>
    );
}

export default UserRow;
