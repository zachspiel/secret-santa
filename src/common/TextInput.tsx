import React from "react";
import { InputText } from "primereact/inputtext";
import { useFormContext } from "react-hook-form";

interface Props {
    name: string;
    label: string;
    isRequired?: boolean;
}

const TextInput = ({ name, label, isRequired }: Props): JSX.Element => {
    const { register, formState } = useFormContext();
    const isTouched = formState.touchedFields[name];
    const isInvalid = formState.errors[name] && isTouched;

    return (
        <div className="p-field mb-3">
            <label className="d-block" htmlFor={name}>
                {label}
                {isRequired && <span className="text-danger">*</span>}
            </label>
            <InputText
                placeholder={`Enter ${label.toLocaleLowerCase()}`}
                className={`w-100 ${isInvalid ? "p-invalid" : ""}`}
                {...register(name, { required: isRequired ?? false })}
            />
            {isInvalid && (
                <small id={`${name}-help`} className="p-error block">
                    {formState.errors[name]?.message?.toString()}
                </small>
            )}
        </div>
    );
};

export default TextInput;
