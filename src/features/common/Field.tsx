import React from "react";
import { FieldInput, FieldType } from "./Forms";
import TextInput from "../../common/TextInput";
import TextAreaInput from "../../common/TextAreaInput";
import ColorInput from "../../common/ColorInput";

const Field = (props: FieldInput) => {
    switch (props.fieldType) {
        case FieldType.COLOR:
            return <ColorInput {...props} />;
        case FieldType.TEXT:
            return <TextInput {...props} />;
        case FieldType.TEXT_AREA:
            return <TextAreaInput {...props} />;
        case FieldType.URL:
            return <TextInput {...props} />;
        default:
            throw new Error("Invalid Field Type");
    }
};

export default Field;
