import React from "react";
import { FormikProps } from "formik";
import { ColorPicker } from "primereact/colorpicker";
import { InputTextarea } from "primereact/inputtextarea";
import { v4 as uuidv4 } from "uuid";
import { object, string, array } from "yup";
import TextInput from "../../common/TextInput";

export interface AddMemberFormValues {
    name: string;
    email: string;
    wishlist: string;
    notes: string;
    favoriteStore: string;
    favoriteFood: string;
    favoriteColor: string;
    assignedTo: string;
    exclusions: string[];
}

export const initialValues: AddMemberFormValues = {
    name: "",
    email: "",
    wishlist: "",
    notes: "",
    favoriteStore: "",
    favoriteFood: "",
    favoriteColor: "",
    assignedTo: "",
    exclusions: [],
};

export const validationSchema = object().shape({
    name: string()
        .trim()
        .min(2, "Name must be at least 2 characters long.")
        .max(20, "Name cannot be longer than 20 characters.")
        .required("Name is required."),
    email: string()
        .trim()
        .email("Please enter a valid email")
        .required("Email is required."),
    wishlist: string(),
    notes: string(),
    favoriteStore: string(),
    favoriteFood: string(),
    favoriteColor: string(),
    assignedTo: string(),
    exclusions: array(string()),
});

const AddMemberForm = (props: FormikProps<AddMemberFormValues>): JSX.Element => {
    const keys = Object.entries(initialValues).map((key) => uuidv4());

    return (
        <>
            {TextInput(keys[0], "name", "Name", props)}
            {TextInput(keys[1], "email", "Email address", props)}
            {TextInput(keys[2], "wishlist", "Wishlist", props, true)}
            {TextInput(keys[3], "favoriteStore", "Favorite store(s)", props, true)}
            {TextInput(keys[4], "favoriteFood", "Favorite food", props, true)}
            <div className="p-field mb-3">
                <label className="d-block" htmlFor={keys[5]}>
                    Favorite Color <span className="text-muted">- optional</span>
                </label>
                <ColorPicker
                    id={keys[5]}
                    name="favoriteColor"
                    value={props.values.favoriteColor}
                    className="w-100"
                    onChange={props.handleChange}
                />
            </div>
            <div className="p-field mb-3">
                <label className="d-block" htmlFor={keys[6]}>
                    Additional notes
                    <span className="text-muted">- optional</span>
                </label>
                <InputTextarea
                    id={keys[6]}
                    name="notes"
                    value={props.values.notes}
                    className="w-100"
                    onChange={props.handleChange}
                />
            </div>
        </>
    );
};

export default AddMemberForm;
