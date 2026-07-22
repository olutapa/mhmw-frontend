import { revalidate, useLocation, useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, For, onMount, Show } from "solid-js";

import styles from "./profile.module.css";
import { Doll } from "~/types/dolls";
import { FollowersResponse, GetUserResponse, User } from "~/types/users";
import { followUser, getUserByUsername, getUserInventory, getUsersFollowers, getUsersFollowing, getUserWishlist, unfollowUser } from "~/api";
import Header from "~/components/Header";
import DollCard from "~/components/DollCard";
import NotFound from "~/routes/[...404]";
import FollowersPopup from "~/components/FollowersPopup";
import { useUser } from "~/contexts/UserContext";
import MiniDollCard from "~/components/MiniDollCard";

function ProfilePage() {
    const params = useParams();
    const { user } = useUser();
    // const [ fetchedUser, { refetch } ] = createResource(
    //     () => (params.username as string),
    //     async (username) => {
    //         return await getUserByUsername(username);
    //     },
    // );
    const [fetchedUser, setFetchedUser] = createSignal<GetUserResponse | null | undefined>(undefined);
    const [inventory, setInventory] = createSignal<Doll[] | undefined>();
    const [wishlist, setWishlist] = createSignal<Doll[] | undefined>();
    const [followed, setFollowed] = createSignal(false);
    
    const [followersAmount, setFollowersAmount] = createSignal(0);
    const [showFollowers, setShowFollowers] = createSignal(false);
    const [followers, setFollowers] = createSignal<FollowersResponse["users"]>([]);
    const [followingAmount, setFollowingAmount] = createSignal(0);
    const [showFollowing, setShowFollowing] = createSignal(false);
    const [following, setFollowing] = createSignal<FollowersResponse["users"]>([]);

    const location = useLocation();
    const [path, setPath] = createSignal(location.pathname);

    createEffect(async () => {
        setFetchedUser(await getUserByUsername(params.username as string));
    });

    createEffect(async () => {
        console.log(fetchedUser());
        if (fetchedUser()) {
            setFollowed(fetchedUser()?.user.followed ?? false);
            setFollowersAmount((fetchedUser()?.user as User).followers);
            setFollowingAmount((fetchedUser()?.user as User).following);
            const inventory = await getUserInventory((fetchedUser()?.user as User).id);
            setInventory(inventory.inventory);
            const wishlist = await getUserWishlist((fetchedUser()?.user as User).id);
            setWishlist(wishlist.wishlist);
        }
    });

    createEffect(() => {
        if (path() !== location.pathname) {
            setShowFollowers(false);
            setShowFollowing(false);
            setPath(location.pathname);
        }
    });

    const onWLChange = async (wishlist: boolean, doll_id: number) => {
        if (!wishlist) {
            setWishlist((wl) => (wl as Doll[]).filter((doll) => doll.id !== doll_id));
        }
    }

    const loadMoreFollowers = async () => {
        const lastId = followers()[followers().length - 1].user.id;

        if (!fetchedUser()) {
            return 0;
        }

        const newFollowers = await getUsersFollowers(fetchedUser()?.user.id as number, 1, lastId);
        if (!newFollowers) {
            return 0;
        }
        setFollowers((followers) => (followers).concat(newFollowers.users));
        return newFollowers.users.length;
    }

    const loadMoreFollowing = async () => {
        const lastId = following()[following().length - 1].user.id;

        if (!fetchedUser()) {
            return 0;
        }

        const newFollowers = await getUsersFollowing(fetchedUser()?.user.id as number, 1, lastId);
        if (!newFollowers) {
            return 0;
        }
        console.log(newFollowers.users);
        setFollowing((following) => (following).concat(newFollowers.users));
        return newFollowers.users.length;
    }

    return (
        <Show when={fetchedUser() !== null} fallback={(
            <NotFound />
        )}>
            <main>
                <Header pageTitle="profile" />


                <Show when={fetchedUser()}>
                    <div class="page">
                        <div class={styles.profile__header}>
                            <div class={styles.profile__header__left}>
                                <div class={styles.profile__image}>
                                    <img src="https://weks.dev:59017/assets/frankie.png" alt="frankie" />
                                </div>
                                <div class={styles.profile__text}>
                                    <div class={styles.profile__name}>
                                        {(fetchedUser()?.user as User).display_name}
                                    </div>
                                    <div class={styles.profile__username}>
                                        {(fetchedUser()?.user as User).username}
                                    </div>

                                    <div class={styles.profile__stats}>
                                        <button
                                            onClick={
                                                async () => {
                                                    console.log("show followers");
                                                    setFollowers((await getUsersFollowers(fetchedUser()?.user.id as number, 1, undefined))?.users ?? []);
                                                    setShowFollowers(true);
                                                }
                                            }
                                            class={styles.profile__stats__btn}
                                        >
                                            <span>{followersAmount()}</span> {followersAmount() === 1 ? "follower" : "followers"}
                                        </button>
                                        
                                        <button
                                            onClick={
                                                async () => {
                                                    console.log("show following");
                                                    setFollowing((await getUsersFollowing(fetchedUser()?.user.id as number, 1, undefined))?.users ?? []);
                                                    console.log(following());
                                                    setShowFollowing(true);
                                                }
                                            }
                                            class={styles.profile__stats__btn}
                                        >
                                            <span>{followingAmount()}</span> following
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <Show when={!fetchedUser()?.me && user}>
                                <div class={styles.profile__header__right}>
                                    <Show when={followed()}>
                                        <button
                                            onClick={async () => {
                                                const newFollowers = await unfollowUser((fetchedUser()?.user as User).id);
                                                setFollowed(false);
                                                setFollowersAmount(newFollowers.new_amount);
                                            }}
                                            class={styles.profile_follow_btn}
                                        >
                                            Unfollow
                                        </button>
                                    </Show>
                                    <Show when={!followed()}>
                                        <button
                                            onClick={async () => {
                                                const newFollowers = await followUser((fetchedUser()?.user as User).id);
                                                setFollowed(true);
                                                setFollowersAmount(newFollowers.new_amount);
                                            }}
                                            class={styles.profile_follow_btn}
                                        >
                                            Follow
                                        </button>
                                    </Show>
                                </div>
                            </Show>
                        </div>

                        <div class={styles.profile__stats}>
                            {/* <button
                                onClick={
                                    async () => {
                                        console.log("show followers");
                                        setFollowers((await getUsersFollowers(fetchedUser()?.user.id as number, 1, undefined))?.users ?? []);
                                        setShowFollowers(true);
                                    }
                                }
                                class={styles.profile__stats__btn}
                            >
                                <span>{followersAmount()}</span> {followersAmount() === 1 ? "follower" : "followers"}
                            </button>
                            
                            <button
                                onClick={
                                    async () => {
                                        console.log("show following");
                                        setFollowing((await getUsersFollowing(fetchedUser()?.user.id as number, 1, undefined))?.users ?? []);
                                        console.log(following());
                                        setShowFollowing(true);
                                    }
                                }
                                class={styles.profile__stats__btn}
                            >
                                <span>{followingAmount()}</span> following
                            </button> */}
                        
                            <Show when={showFollowers()}>
                                <FollowersPopup
                                    title="Followers"
                                    users={followers()}
                                    loadMore={loadMoreFollowers}
                                    onClose={() => { setShowFollowers(false); setFollowers([]); }}
                                    profile_id={fetchedUser()?.user.id as number}
                                    onFollow={async (id) => {
                                        await followUser(id);
                                        
                                        if (fetchedUser()?.me) {
                                            setFollowingAmount((n) => n + 1);
                                        }
                                    }}
                                    onUnfollow={async (id) => {
                                        await unfollowUser(id);
                                        
                                        if (fetchedUser()?.me) {
                                            setFollowingAmount((n) => n - 1);
                                        }
                                    }}
                                    />
                            </Show>
                            <Show when={showFollowing()}>
                                <FollowersPopup
                                    title="Following"
                                    users={following()}
                                    loadMore={loadMoreFollowing}
                                    onClose={() => { setShowFollowing(false); setFollowing([]); }}
                                    profile_id={fetchedUser()?.user.id as number}
                                    onFollow={async (id) => {
                                        await followUser(id);
                                        
                                        if (fetchedUser()?.me) {
                                            setFollowingAmount((n) => n + 1);
                                        }
                                    }}
                                    onUnfollow={async (id) => {
                                        await unfollowUser(id);
                                        
                                        if (fetchedUser()?.me) {
                                            setFollowingAmount((n) => n - 1);
                                        }
                                    }}
                                    />
                            </Show>
                        </div>

                        <Show when={followed()}>
                            <button
                                onClick={async () => {
                                    const newFollowers = await unfollowUser((fetchedUser()?.user as User).id);
                                    setFollowed(false);
                                    setFollowersAmount(newFollowers.new_amount);
                                }}
                                class={styles.profile_follow_btn_wide}
                            >
                                Unfollow
                            </button>
                        </Show>
                        <Show when={!followed()}>
                            <button
                                onClick={async () => {
                                    const newFollowers = await followUser((fetchedUser()?.user as User).id);
                                    setFollowed(true);
                                    setFollowersAmount(newFollowers.new_amount);
                                }}
                                class={styles.profile_follow_btn_wide}
                            >
                                Follow
                            </button>
                        </Show>

                        <div class={styles.profile__dolls}>
                            <div class={styles.profile__dolls__header}>
                                Owned Dolls
                            </div>
                            <Show when={inventory()}>
                                <div class={styles.profile__dolls__list}>
                                    <For each={inventory()}>
                                        {doll => <MiniDollCard doll={doll} />}
                                        {/* {doll => <DollCard doll={{...doll, owned: true}} />} */}
                                    </For>
                                </div>
                                <Show when={inventory()?.length === 0}>
                                    <div>Doesn't own any dolls yet!</div>
                                </Show>
                            </Show>
                        </div>

                        <div class={styles.profile__dolls}>
                            <div class={styles.profile__dolls__header}>
                                Wishlist
                            </div>
                            <Show when={wishlist()}>
                                <div class={styles.profile__dolls__list}>
                                    <For each={wishlist()}>
                                        {doll => <MiniDollCard doll={doll} />}
                                        {/* {doll => <DollCard doll={{...doll, wishlist: true}} onWishlistChange={onWLChange} />} */}
                                    </For>
                                </div>
                                <Show when={wishlist()?.length === 0}>
                                    <div>Doesn't have any dolls in wishlist yet!</div>
                                </Show>
                            </Show>
                        </div>
                    </div>
                </Show>
            </main>
        </Show>
    );
}


export default ProfilePage;

