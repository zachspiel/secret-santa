import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Dropdown } from "primereact/dropdown";
import { progressToNextStep, setFormType } from "../../../appSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { type FieldInput } from "../../common/Forms";
import { Button } from "primereact/button";
import type { ReactElement } from "react";
import { formTypeToForm } from "../../../types/FormTypes";

const SelectForm = (): ReactElement => {
    const dispatch = useAppDispatch();
    const selectedForm = useAppSelector((state) => state.app.selectedForm);
    const form = formTypeToForm[selectedForm];

    const fieldLabelTemplate = (field: FieldInput): string => {
        return field.label;
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
                            { value: "form-three", label: "Form Three" },
                        ]}
                        onChange={(event) => {
                            dispatch(setFormType(event.value));
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
                <Column field="label" body={fieldLabelTemplate} header="Questions" />
            </DataTable>
        </div>
    );
};

export default SelectForm;
