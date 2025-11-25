import { useFormContext } from "react-hook-form";
import type { FieldInput } from "../features/common/Forms";
import { ColorPicker } from "primereact/colorpicker";
import type { ReactElement } from "react";

const ColorInput = ({ name, label, isRequired }: FieldInput): ReactElement => {
    const { register } = useFormContext();

    return (
        <div className="p-field mb-3">
            <label className="d-block" htmlFor={name}>
                {label} {isRequired && <span className="text-danger">*</span>}
            </label>
            <ColorPicker {...register(name)} className="w-100" />
        </div>
    );
};

export default ColorInput;
