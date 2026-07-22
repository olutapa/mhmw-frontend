import { A } from "@solidjs/router";

import styles from "./HeaderMenu.module.css";

type HeaderMenuProps = {
    headerRef: HTMLDivElement;
}

function HeaderMenu(props: HeaderMenuProps) {
    return (
        <div class={styles.container}>
            <div class={styles.menu} style={{ "margin-top": props.headerRef.clientHeight + "px" }}>
                <A href="/" class={styles.menuItem}>Homepage</A>
                <A href="/characters" class={styles.menuItem}>Characters</A>
                <A href="/series" class={styles.menuItem}>Series</A>
                <A href="/search" class={styles.menuItem}>Search</A>
            </div>
        </div>
    );
}

export default HeaderMenu;
