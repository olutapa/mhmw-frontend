import { A } from "@solidjs/router";
import { createSignal, onCleanup, onMount } from "solid-js";

import styles from "./HeaderUserDropdown.module.css";
import { useUser } from "~/contexts/UserContext";
import { logout } from "~/api";

function HeaderUserDropdown() {
    const { user, resetUser } = useUser();
    const [menuOpen, setMenuOpen] = createSignal(false);
    let menuRef: HTMLDivElement | undefined = undefined;

    const handler = (event: Event) => {
        if (!menuOpen() || menuRef && (menuRef as HTMLDivElement).contains(event.target as HTMLElement)) { 
            return
        }
        setMenuOpen(false);
    };

    onMount(() => {
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
    })

    onCleanup(() => {
        document.removeEventListener('mousedown', handler);
        document.removeEventListener('touchstart', handler);
    })

    return (
        <div class={styles.userDropdownWrapper}>
            <button class={styles.userDropdown} onClick={() => setMenuOpen(!menuOpen())}>
                <div>{user?.username}</div>
                <div class={styles.icon}>
                    <svg style={{ "transform": menuOpen() ? "rotate(180deg)" : "" }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path class={styles.dropdownArrow}></path>
                    </svg>
                </div>
            </button>
            <div class={`${styles.menu} ${menuOpen() ? styles.open : ""}`} ref={menuRef!}>
                <A
                    class={styles.menuItem}
                    href={`/profile/${user?.username}`}
                >
                    Your profile
                </A>
                <button
                    class={styles.menuItem}
                    onclick={async () => {
                        resetUser();
                        await logout();
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default HeaderUserDropdown;
