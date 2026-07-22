import { createEffect, createSignal, Show } from "solid-js";
import { A, Navigate, useSearchParams } from "@solidjs/router";

import { registerAction } from "~/actions";
import { useUser } from "~/contexts/UserContext";
import Header from "~/components/Header";
import FullPageForm from "~/components/FullPageForm";
import FormField from "~/components/FullPageForm/FormField";

function RegisterPage() {
    const { user, refetchUser } = useUser();
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = createSignal(searchParams.error);
    
    const [username, setUsername] = createSignal("");
    const [displayName, setDisplayName] = createSignal("");
    const [password, setPassword] = createSignal("");

    createEffect(() => {
        if (searchParams.error) {
            console.log(searchParams.error);
            setError(searchParams.error);
            setPassword("");
        }
    })

    return (
        <main>
            <Header pageTitle="register" />
            <div class="page">
                <Show when={user}>
                    <Navigate href={`/profile/${user?.username}`} />
                </Show>

                <FullPageForm
                    title="Create an account"
                    action={registerAction.with(username(), displayName(), password(), refetchUser)}
                    method="post"
                    error={error() === "exists" ? {
                        message: "Username already exists",
                        onClick: () => {
                            setError("");
                            setSearchParams({
                                error: "",
                            });
                        },
                    } : error() === "pass" ? {
                        message: "Password must be at least 8 characters long and contain at least one letter and one number",
                        onClick: () => {
                            setError("");
                            setSearchParams({
                                error: "",
                            });
                        },
                    } : undefined}
                    footer={
                        <>
                            Already have an account?
                            <A href="/login">Login here</A>
                        </>
                    }
                >
                    <FormField
                        name="username"
                        label="Username:"
                        type="text"
                        placeholder="frankie1337"
                        autocomplete="off"
                        pattern="^[a-zA-Z0-9_]{3,15}$"
                        onInput={(e) => setUsername(e.currentTarget.value)}
                        value={username()}
                    />
                    <FormField
                        name="displayName"
                        label="Display name:"
                        type="text"
                        placeholder="Frankie Stein"
                        autocomplete="off"
                        minlength={1}
                        onInput={(e) => setDisplayName(e.currentTarget.value)}
                        value={displayName()}
                    />
                    <FormField
                        name="password"
                        label="Password:"
                        type="password"
                        placeholder="8+ characters (letters & numbers)"
                        autocomplete="off"
                        onInput={(e) => setPassword(e.currentTarget.value)}
                        value={password()}
                        minlength={8}
                    />
                    <button
                        disabled={username() === "" || displayName() === "" || password() === ""}
                    >
                        Register
                    </button>
                </FullPageForm>
            </div>
        </main>
    );
}

export default RegisterPage;
