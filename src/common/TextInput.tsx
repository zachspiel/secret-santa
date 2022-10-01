import React from "react";
import { InputText } from "primereact/inputtext";
import { AddMemberFormValues } from "../features/common/AddMemberForm";
import { FormikProps } from "formik";

const TextInput = (
    id: string,
    key: keyof AddMemberFormValues,
    label: string,
    formProps: FormikProps<AddMemberFormValues>,
    optional?: boolean,
): JSX.Element => {
    const isTouched = formProps.getFieldMeta(key).touched;
    const isInvalid = formProps.errors[key] && isTouched;
    return (
        <div className="p-field mb-3">
            <label className="d-block" htmlFor={id}>
                {label}
                {optional && <span className="text-muted">- optional</span>}
            </label>
            <InputText
                placeholder={`Enter ${label.toLocaleLowerCase()}`}
                id={id}
                name={key}
                value={formProps.values[key]}
                className={`w-100 ${isInvalid ? "p-invalid" : ""}`}
                onChange={formProps.handleChange}
            />
            {isInvalid && (
                <small id={`${id}-help`} className="p-error block">
                    {formProps.errors[key]}
                </small>
            )}
        </div>
    );
};

export default TextInput;
