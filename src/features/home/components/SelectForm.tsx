import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Dropdown } from "primereact/dropdown";
import { progressToNextStep, setSelectedForm } from "../../../appSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FORM_ONE, FORM_TWO, FieldInput, FieldType } from "../../common/Forms";
import { Button } from "primereact/button";

const SelectForm = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const selectedForm = useAppSelector((state) => state.app.selectedForm);
    const form = selectedForm === "form-one" ? FORM_ONE : FORM_TWO;

    const fieldLabelTemplate = (field: FieldInput): string => {
        return field.label;
    };

    const fieldTypeTemplate = (field: FieldInput): string => {
        switch (field.fieldType) {
            case FieldType.TEXT | FieldType.TEXT_AREA:
                return "String";
            case FieldType.COLOR:
                return "Color";
            case FieldType.SELECT:
                return "Select";
            case FieldType.URL:
                return "URL";
            default:
                return "String";
        }
    };

    return (
        <div className="justify-content-center text-start mb-3 p-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                    <p className="text-center m-0 me-2">Select Form Template</p>
                    <Dropdown
                        className="me-2"
                        value={selectedForm}
                        options={[
                            { value: "form-one", label: "Form One" },
                            { value: "form-two", label: "Form Two" },
                        ]}
                        onChange={(event) => {
                            dispatch(setSelectedForm(event.value));
                        }}
                    />
                </div>

                <Button
                    label="Next"
                    className="p-button p-button-sm"
                    onClick={() => dispatch(progressToNextStep())}
                    icon="pi pi-arrow-right"
                    iconPos="right"
                />
            </div>

            <DataTable value={form}>
                <Column field="label" body={fieldLabelTemplate} header="Question Label" />
                <Column
                    field="fieldType"
                    body={fieldTypeTemplate}
                    header="Question Type"
                />
            </DataTable>
        </div>
    );
};

export default SelectForm;
