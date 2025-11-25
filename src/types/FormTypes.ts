import {
    type FieldInput,
    FORM_ONE,
    FORM_TWO,
    FORM_THREE,
} from "../features/common/Forms";

export type SelectedForm = "form-one" | "form-two" | "form-three";

export const formTypeToForm: Record<SelectedForm, FieldInput[]> = {
    "form-one": FORM_ONE,
    "form-two": FORM_TWO,
    "form-three": FORM_THREE,
};
