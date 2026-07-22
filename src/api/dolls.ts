import qs from 'qs';
import { redirect } from '@solidjs/router';
import apiClient from '~/api/client';
import { Character, Collection, Doll } from '~/types/dolls';
import { UserWithInventory, UserWithWishlist } from '~/types/users';

export const dollsService = {
    getAll: async (
        limit: number,
        sort_by: "collection" | "character" | "release",
        cursor: string | undefined,
        collection_id: string[] | undefined,
        character_id: string[] | undefined,
    ): Promise<Doll[]> => {
        let params: any = {
            limit,
            sort_by,
        };

        if (cursor !== undefined) {
            params.cursor = cursor;
        }

        if (collection_id !== undefined) {
            params.collection_id = collection_id;
        }

        if (character_id !== undefined) {
            params.character_id = character_id;
        }

        const response = await apiClient.get(
            `/dolls/all`,
            {
                params,
                paramsSerializer: {
                    indexes: null,
                }
            }
    );
        console.log(response.data);

        return response.data;
    },

    getCollections: async (): Promise<Collection[]> => {
        const response = await apiClient.get(`/dolls/collections/all`);
        console.log(response.data);

        return response.data;
    },

    getCharacters: async (): Promise<Character[]> => {
        const response = await apiClient.get(`/dolls/characters/all`);
        console.log(response.data);

        return response.data;
    },

    getDoll: async (id: number): Promise<Doll> => {
        const response = await apiClient.get(`/dolls/get/${id}`);
        console.log(response.data);

        return response.data;
    },

    getDollHumanly: async (collection_name: string, character_name: string): Promise<Doll> => {
        // try {
        const response = await apiClient.get(
            '/dolls/get_humanly',
        {
            params: {
                collection: collection_name,
                character: character_name
            }
        });
        console.log(response.data);

        return response.data;
        // } catch (error) {
        //     throw redirect(`/doll/${collection_name}/${character_name}`, 404);
        // }
    },

    getCollection: async (id: number): Promise<Collection> => {
        const response = await apiClient.get(`/dolls/collections/get/${id}`);
        console.log(response.data);

        return response.data;
    },

    getCollectionHumanly: async (collection_name: string): Promise<Collection> => {
        const response = await apiClient.get(`/dolls/collections/get_humanly/${collection_name}`);
        console.log(response.data);

        return response.data;
    },

    addToWishlist: async (doll_id: number): Promise<void> => {
        const response = await apiClient.post(
            `/dolls/add_to_wishlist?doll_id=${doll_id}`,
            // {
            //     params: {
            //         doll_id
            //     }
            // }
        );
        console.log(response.data);
    },

    removeFromWishlist: async (doll_id: number): Promise<void> => {
        const response = await apiClient.delete(
            `/dolls/remove_from_wishlist?doll_id=${doll_id}`,
            // {
            //     params: {
            //         doll_id
            //     }
            // }
        );
        console.log(response.data);
    },

    getUserInventory: async (id: number): Promise<UserWithInventory> => {
        const response = await apiClient.get(`/users/inventory/${id}`);
        console.log(response.data);

        return response.data;
    },

    getUserWishlist: async (id: number): Promise<UserWithWishlist> => {
        const response = await apiClient.get(`/users/wishlist/${id}`);
        console.log(response.data);

        return response.data;
    },
};
