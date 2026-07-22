import { query, redirect } from "@solidjs/router";

import { authService } from "~/api/auth";
import { dollsService } from "~/api/dolls";
import { Character, Collection, Doll } from "~/types/dolls";
import { User, LocalUser, UserWithInventory, UserWithWishlist, GetUserResponse, FollowersResponse } from "~/types/users";
import { useUser } from "./contexts/UserContext";


export const getUser = query(async function(): Promise<User | undefined> {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        return undefined;
    }
    const response = await authService.getCurrentUser();
    if (!response) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
    }
    else {
        localStorage.setItem("user", JSON.stringify({
            id: response.id,
            username: response.username,
            displayName: response.display_name
        } as LocalUser));
    }
    return response;
}, "getUser");

export const logout = query(async function() {
    await authService.logout();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
    return redirect("/");
}, "logout");

export const getUserByUsername = query(async function(username: string): Promise<GetUserResponse | null> {
    console.log(username, "A");
    return await authService.getUserByUsername(username);
}, "getUserByUsername");


export const getAllDolls = query(async function(
    limit: number,
    sort_by: "collection" | "character" | "release",
    cursor: string | undefined,
    collection_id: string[] | undefined,
    character_id: string[] | undefined,
): Promise<Doll[]> {
    return await dollsService.getAll(
        limit,
        sort_by,
        cursor,
        collection_id,
        character_id,
    );
}, "getAllDolls");

export const getCollections = query(async function(): Promise<Collection[]> {
    return await dollsService.getCollections();
}, "getCollections");

export const getCollectionHumanly = query(async function(collection_name: string): Promise<Collection> {
    return await dollsService.getCollectionHumanly(collection_name);
}, "getCollectionHumanly");

export const getCharacters = query(async function(): Promise<Character[]> {
    return await dollsService.getCharacters();
}, "getCharacters");

export const getDoll = query(async function(id: number): Promise<Doll> {
    return await dollsService.getDoll(id);
}, "getDoll");

export const getDollHumanly = query(async function(collection_name: string, character_name: string): Promise<Doll> {
    return await dollsService.getDollHumanly(collection_name, character_name);
}, "getDollHumanly");

export const getCollection = query(async function(id: number): Promise<Collection> {
    return await dollsService.getCollection(id);
}, "getCollection");

export const addToWishlist = query(async function(id: number): Promise<void> {
    return await dollsService.addToWishlist(id);
}, "addToWishlist");

export const removeFromWishlist = query(async function(id: number): Promise<void> {
    return await dollsService.removeFromWishlist(id);
}, "removeFromWishlist");

export const getUserInventory = query(async function(id: number): Promise<UserWithInventory> {
    return await dollsService.getUserInventory(id);
}, "getUserInventory");

export const getUserWishlist = query(async function(id: number): Promise<UserWithWishlist> {
    return await dollsService.getUserWishlist(id);
}, "getUserWishlist");

export const followUser = query(async function(followed_id: number): Promise<{ message: string, new_amount: number }> {
    return await authService.followUser(followed_id);
}, "followUser");

export const unfollowUser = query(async function(followed_id: number): Promise<{ message: string, new_amount: number }> {
    return await authService.unfollowUser(followed_id);
}, "unfollowUser");

export const getUsersFollowers = query(async function(id: number, limit: number, last_id: number | undefined): Promise<FollowersResponse | null> {
    return await authService.getUsersFollowers(id, limit, last_id);
}, "getUsersFollowers");

export const getUsersFollowing = query(async function(id: number, limit: number, last_id: number | undefined): Promise<FollowersResponse | null> {
    return await authService.getUserFollowing(id, limit, last_id);
}, "getUsersFollowing");