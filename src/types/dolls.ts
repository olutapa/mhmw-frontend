export type Collection = {
    name: string;
    description: string;
    realeses: string[];
    id: number;
    text_id: string;
};

export type Character = {
    name: string;
    description: string;
    id: number;
    text_id: string;
};

export type Image = {
    id: number;
    doll_id: number;
    image_path: string;
}

export type Doll = {
    model_number: string;
    assortment_number: string;
    released: string;
    made_in: string;
    height: number;
    character_id: number;
    collection_id: number;
    id: number;
    character: Character;
    collection: Collection;
    owned: boolean | null;
    wishlist: boolean | null;
    images: Image[];
};