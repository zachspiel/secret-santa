import {
    type FieldInput,
    FORM_ONE,
    FORM_TWO,
    FORM_THREE,
} from "../features/common/Forms";

export type FormType = "form-one" | "form-two" | "form-three";

export const formTypeToForm: Record<FormType, FieldInput[]> = {
    "form-one": FORM_ONE,
    "form-two": FORM_TWO,
    "form-three": FORM_THREE,
};
