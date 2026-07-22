import { createContext, onMount, Show, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { getUser } from "~/api";
import LoadingScreen from "~/components/LoadingScreen";
import { User } from "~/types/users";

type UserState = {
    user: User | undefined;
    loading: boolean;
    resetUser: () => void;
    refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserState>();

export const UserProvider = (props: { children: any; }) => {
    const [state, setState] = createStore<UserState>({
        user: undefined,
        loading: true,

        resetUser: () => {
            setState("user", undefined);
        },
        refetchUser: async () => {
            const user = await getUser();
            setState("user", user);
        }
    });

    onMount(async () => {
        const user = await getUser();
        setState("user", user);
        setState("loading", false);
    });

    return (
        <UserContext.Provider value={state}>
            <Show when={!state.loading} fallback={<LoadingScreen />}>
                {props.children}
            </Show>
        </UserContext.Provider>
    );
}


export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within UserProvider');
    return ctx;
}
