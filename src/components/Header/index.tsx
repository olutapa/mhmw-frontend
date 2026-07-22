import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";

import styles from "./Header.module.css";
import { useUser } from "~/contexts/UserContext";
import HeaderUserDropdown from "../HeaderUserDropdown";
import HeaderMenu from "./HeaderMenu";

type HeaderProps = {
    pageTitle?: "404" | "home" | "profile" | "search" | "login" | "series" | "characters" | "register" ;
}

function Header(props: HeaderProps) {
    const { user } = useUser();
    const [menuOpen, setMenuOpen] = createSignal(false);

    let headerRef!: HTMLDivElement;

    return (
        <>
            <header class={styles.header + " " + (menuOpen() ? styles.open : "")} ref={headerRef}>
                <div class={styles.header__logo}>
                    <h1>
                        <Show when={props.pageTitle !== "home"} fallback={
                            <div class={styles.logo_link}>
                                <span style={{ color: "var(--red)" }}>M</span>
                                <span style={{ color: "var(--blue)" }}>H</span>
                                MegaWiki
                            </div>
                        }>
                            <A href="/" class={styles.logo_link}>
                                <span style={{ color: "var(--red)" }}>M</span>
                                <span style={{ color: "var(--blue)" }}>H</span>
                                MegaWiki
                            </A>
                        </Show>
                        <button class={styles.logo_text} onClick={() => setMenuOpen(!menuOpen())}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <path class={styles.menuIcon}></path>
                            </svg>
                            <span style={{ color: "var(--red)" }}>M</span>
                            <span style={{ color: "var(--blue)" }}>H</span>
                            MegaWiki
                        </button>
                    </h1>
                </div>

                <div class={styles.header__nav}>
                    <A href="/characters" class={props.pageTitle === "characters" ? styles.selected : ""}>Characters</A>
                    
                    <A href="/series" class={props.pageTitle === "series" ? styles.selected : ""}>Series</A>
                    
                    
                    <A href="/search" class={props.pageTitle === "search" ? styles.selected : ""}>Search</A>
                </div>
                
                <Show when={!menuOpen()}>
                    <div class={styles.header__user}>
                        <Show when={user}>
                            <HeaderUserDropdown />
                            {/* <A href={`/profile/${user?.username}`}>{user?.username}</A> */}
                        </Show>
                        <Show when={!user && props.pageTitle !== "login" && props.pageTitle !== "register"}>
                            <A href="/login" class={styles.loginBtn}>Login</A>
                        </Show>
                    </div>
                </Show>
            </header>

            <Show when={menuOpen()}>
                <HeaderMenu headerRef={headerRef} />
            </Show>
        </>
    );
}


export default Header;
