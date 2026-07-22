import { getCookie, setCookie } from "@solidjs/start/http";
import Cookies from 'universal-cookie';

export async function getAccessToken() {
    // return getCookie("accessToken");
    const cookies = new Cookies();
    return cookies.get("accessToken");
};

export async function getRefreshToken() {
    // return getCookie("refreshToken");
    const cookies = new Cookies();
    return cookies.get("refreshToken");
};

export async function setAccessToken(accessToken: string) {
    console.log("setAccessToken");
    console.log(accessToken);
    const cookies = new Cookies({ path: "/" });
    console.log(cookies.getAll());
    // setCookie(
    //     "accessToken",
    //     accessToken,
    //     {
    //         expires: new Date(Date.now() + 3600 * 1000),
    //         httpOnly: true,
    //         // secure: true,
    //         sameSite: "strict"
    //     }
    // );
    console.log(await getAccessToken());
};

export async function setRefreshToken(refreshToken: string) {
    console.log("setRefreshToken");
    console.log(refreshToken);
    // setCookie(
    //     "refreshToken",
    //     refreshToken,
    //     {
    //         expires: new Date(Date.now() + 3600 * 1000),
    //         httpOnly: true,
    //         // secure: true,
    //         sameSite: "strict"
    //     }
    // );
    const cookies = new Cookies({ path: "/" });
    cookies.set("refreshToken", refreshToken, {
        expires: new Date(Date.now() + 3600 * 1000),
        httpOnly: true,
        // secure: true,
        sameSite: "strict"
    });
    console.log(await getRefreshToken());
};
