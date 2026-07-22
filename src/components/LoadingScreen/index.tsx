import styles from "./LoadingScreen.module.css";

function LoadingScreen() {
    return (
        <div class={styles.container}>
            <div class={styles.spinner}>
                <span style={{ color: "var(--red)" }}>M</span>
                <span style={{ color: "var(--blue)" }}>H</span>
            </div>
        </div>
    );
}

export default LoadingScreen;
