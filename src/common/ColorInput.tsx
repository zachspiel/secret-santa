import React from "react";
import { useFormContext } from "react-hook-form";
import { FieldInput } from "../features/common/Forms";
import { ColorPicker } from "primereact/colorpicker";

const ColorInput = ({ name, label, isRequired }: FieldInput): JSX.Element => {
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
