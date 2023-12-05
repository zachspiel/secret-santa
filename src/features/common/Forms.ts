export enum FieldType {
    COLOR,
    SELECT,
    TEXT,
    TEXT_AREA,
    URL,
}

interface Field {
    label: string;
    name: string;
    isRequired?: boolean;
    fieldType: FieldType;
}

export interface TextField extends Field {
    fieldType: FieldType.TEXT;
}

export interface SelectField extends Field {
    fieldType: FieldType.SELECT;
    options: { label: string; value: string }[];
}

export interface UrlField extends Field {
    fieldType: FieldType.URL;
}

export interface ColorSelectField extends Field {
    fieldType: FieldType.COLOR;
}

export interface TextAreaField extends Field {
    fieldType: FieldType.TEXT_AREA;
}

export type FieldInput =
    | ColorSelectField
    | TextField
    | TextAreaField
    | SelectField
    | UrlField;

export const BASE_FORM: FieldInput[] = [
    {
        name: "name",
        label: "Name",
        isRequired: true,
        fieldType: FieldType.TEXT,
    },
    {
        name: "email",
        label: "Email",
        isRequired: true,
        fieldType: FieldType.TEXT,
    },
];

export const FORM_ONE: FieldInput[] = [
    ...BASE_FORM,
    {
        name: "wishlist",
        label: "Wishlist",
        fieldType: FieldType.URL,
    },
    {
        name: "favoriteColor",
        label: "Favorite color",
        fieldType: FieldType.COLOR,
    },
    {
        name: "favoriteFood",
        label: "Favorite Food",
        fieldType: FieldType.TEXT,
    },
    {
        name: "favoriteStore",
        label: "Favorite Store",
        fieldType: FieldType.TEXT,
    },
    {
        name: "notes",
        label: "Additional notes",
        fieldType: FieldType.TEXT_AREA,
    },
];

export const FORM_TWO: FieldInput[] = [
    ...BASE_FORM,
    {
        name: "comfortSnack",
        label: "Tragedy has struck! What comfort snack are you reaching for?",
        fieldType: FieldType.TEXT,
    },
    {
        name: "activity",
        label: `When you think, “huh, I haven't done that in a while,” What comes to mind? (Keep answers PG-13)`,
        fieldType: FieldType.TEXT,
    },
    {
        name: "lifetimeSupply",
        label: "Yay! You just won a lifetime supply of [thing you would be excited to have a lifetime supply of]!",
        fieldType: FieldType.TEXT,
    },
    {
        name: "bookOrMovie",
        label: "A book or movie you've been dying to consume?",
        fieldType: FieldType.TEXT,
    },
    {
        name: "tool",
        label: "What is a kitchen item or tool that could improve your quality of life?",
        fieldType: FieldType.TEXT,
    },
    {
        name: "shopliftingItem",
        label: "Shoplifting is no longer illegal! What are you taking first?",
        fieldType: FieldType.TEXT,
    },
    {
        name: "favoriteFranchises",
        label: "I geek out for [fandom, sports team, comic franchise, hobby, etc...]!",
        fieldType: FieldType.TEXT,
    },
    {
        name: "itemToLeft",
        label: "Look to your left. What item is there?",
        fieldType: FieldType.TEXT,
    },
    {
        name: "giftCard",
        label: "I'm not very creative and super lame. Just get me [STORE NAME] gift card.",
        fieldType: FieldType.TEXT,
    },
    {
        name: "notes",
        label: "Anything else you would want your Santa to know?",
        fieldType: FieldType.TEXT,
    },
];
