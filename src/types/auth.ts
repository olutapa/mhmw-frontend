export type LoginData = {
    username: string;
    password: string;
}

export type LoginResponse = {
    message: string;
    user_id: number;
}

export type RegisterData = {
    username: string;
    password: string;
    displayName: string;
}

export type RegisterResponse = {
    message: string;
    user_id: number;
}
