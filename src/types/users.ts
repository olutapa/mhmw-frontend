import { Doll } from "./dolls";

export type User = {
    id: number;
    username: string;
    display_name: string;
    followers: number;
    following: number;
    followed?: boolean;
};

export type GetUserResponse = {
    user: User;
    me: boolean;
}

export type UserWithInventory = User & {
    inventory: Doll[];
};

export type UserWithWishlist = User & {
    wishlist: Doll[];
};

export type LocalUser = {
    id: number;
    username: string;
    displayName: string;
};

export type FollowersResponse = {
    users: {
        user: User;
        is_mutual: boolean;
        requester_follows?: boolean;
        follows_requester?: boolean;
    }[];
}
