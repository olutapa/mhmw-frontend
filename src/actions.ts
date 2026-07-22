import { action, redirect } from "@solidjs/router";

import { authService } from "~/api/auth";


export const loginAction = action(async (
    username: string,
    password: string,
    refetchUser: () => Promise<void>
) => {
    const response = await authService.login({ username, password })
    .then(
        async (response) => {
            if (response.message === "success") {
                localStorage.setItem("isLoggedIn", "true");
                await refetchUser();
                return redirect("/");
            }
        }
    )
    .catch(
        (error) => {
            if (error.response?.status === 401) {
                return redirect("/login?error=true", 401);
            }
            throw error;
        }
    );

    return response;


    // console.log(response)
    // if (response.status == 200 && response.data.message === "success") {
    //     localStorage.setItem("isLoggedIn", "true");
    //     await refetchUser();
    //     return redirect("/");
    // } else if (response.status == 401) {
    //     return redirect("/register");
    // }
}, "loginAction");


export const registerAction = action(async (
    username: string,
    displayName: string,
    password: string,
    refetchUser: () => Promise<void>
) => {
    const response = await authService.register({ username, password, displayName })
    .then(
        async (response) => {
            if (response.message === "success") {
                await authService.login({ username, password })
                localStorage.setItem("isLoggedIn", "true");
                await refetchUser();
                return redirect("/");
            }
        }
    )
    .catch(
        (error) => {
            if (error.response?.status === 409) {
                return redirect("/register?error=exists", 409);
            } else if (error.response?.status === 400) {
                return redirect("/register?error=pass", 400);
            }
            throw error;
        }
    );

    return response;


    // console.log(response)
    // if (response.status == 200 && response.data.message === "success") {
    //     localStorage.setItem("isLoggedIn", "true");
    //     await refetchUser();
    //     return redirect("/");
    // } else if (response.status == 401) {
    //     return redirect("/register");
    // }
},  "registerAction");

