import React from "react";
import { useFormContext } from "react-hook-form";
import { FieldInput } from "../features/common/Forms";
import { InputTextarea } from "primereact/inputtextarea";

const TextAreaInput = ({ name, label, isRequired }: FieldInput): JSX.Element => {
    const { register } = useFormContext();

    return (
        <div className="p-field mb-3">
            <label className="d-block" htmlFor={name}>
                {label}
                {!(isRequired ?? false) && <span className="text-muted">- optional</span>}
            </label>
            <InputTextarea
                {...register(name, { required: isRequired ?? false })}
                className="w-100"
            />
        </div>
    );
};

export default TextAreaInput;
