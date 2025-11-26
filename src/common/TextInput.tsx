import { InputText } from "primereact/inputtext";
import type { ReactElement } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
    name: string;
    label: string;
    isRequired?: boolean;
    readonly?: boolean;
}

const TextInput = ({
    name,
    label,
    isRequired,
    readonly = false,
}: Props): ReactElement => {
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
                disabled={readonly}
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
