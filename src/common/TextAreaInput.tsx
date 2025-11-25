import { useFormContext } from "react-hook-form";
import type { FieldInput } from "../features/common/Forms";
import { InputTextarea } from "primereact/inputtextarea";
import type { ReactElement } from "react";

const TextAreaInput = ({ name, label, isRequired }: FieldInput): ReactElement => {
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
