import { A, Navigate, useSearchParams } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";

import { loginAction } from "~/actions";
import { useUser } from "~/contexts/UserContext";
import Header from "~/components/Header";
import FullPageForm from "~/components/FullPageForm";
import FormField from "~/components/FullPageForm/FormField";

function LoginPage() {
    const { user, refetchUser } = useUser();
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = createSignal(searchParams.error);

    const [username, setUsername] = createSignal("");
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
            <Header pageTitle="login" />
            <div class="page">
                <Show when={user}>
                    <Navigate href={`/profile/${user?.username}`} />
                </Show>

                <FullPageForm
                    title="Login into your account"
                    action={loginAction.with(username(), password(), refetchUser)}
                    method="post"
                    error={error() === "true" ? {
                        message: "Wrong username or password",
                        onClick: () => {
                            setError("");
                            setSearchParams({
                                error: "",
                            });
                        },
                    } : undefined}
                    footer={
                        <>
                            Don't have an account?
                            <A href="/register">Register here</A>
                        </>
                    }
                >
                    <FormField
                        name="username"
                        label="Username:"
                        type="text"
                        placeholder=""
                        autocomplete="off"
                        onInput={(e) => setUsername(e.currentTarget.value)}
                        value={username()}
                    />
                    <FormField
                        name="password"
                        label="Password:"
                        secondaryLabel={<A href="/forgot_password">Forgot password?</A>}
                        type="password"
                        placeholder=""
                        autocomplete="off"
                        onInput={(e) => setPassword(e.currentTarget.value)}
                        value={password()}
                        minlength={8}
                    />
                    <button>
                        Login
                    </button>
                </FullPageForm>
            </div>
        </main>
    );
}

export default LoginPage;
