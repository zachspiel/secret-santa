import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Header from "../common/Header";
import AddMember from "./components/AddMember";
import CreateGroup from "./components/CreateGroup";
import { Steps } from "primereact/steps";
import { Toast, ToastSeverityType } from "primereact/toast";
import Snowfall from "react-snowfall";
import Exclusions from "./components/Exclusions";
import { progressToNextStep, progressToPreviousStep } from "../../appSlice";
import SelectForm from "./components/SelectForm";

const AddGroupMembers = (): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const currentStep = useAppSelector((state) => state.app.currentStep);
    const toast = React.useRef<Toast>(null);
    const dispatch = useAppDispatch();

    const displayToastMessage = (
        message: string,
        summary: string,
        severity: ToastSeverityType,
    ) => {
        toast?.current?.show({
            severity: severity,
            summary: summary,
            detail: message,
            life: 3000,
        });
    };

    const items = [
        { label: "Select form" },
        { label: "Enter names" },
        { label: "Set exclusions" },
        { label: "Set gift exchange details" },
    ];

    const onPageChange = (newStep: number) => {
        if (newStep - currentStep > 1) {
            displayToastMessage("Please go to the next step.", "Error", "error");
        } else if ((newStep > 0 && members.length >= 3) || newStep === 0) {
            if (currentStep < newStep) {
                dispatch(progressToNextStep());
            } else {
                dispatch(progressToPreviousStep());
            }
        } else if (newStep > 0 && members.length < 3) {
            displayToastMessage(
                "There must be at least three members in a group.",
                "Error",
                "error",
            );
        }
    };

    return (
        <div className="container-fluid text-center">
            <Header />
            <div
                className="col-md-8 col-sm-12 mb-5 main-content"
                style={{
                    backgroundColor: "white",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <div className="d-flex justify-content-center">
                    <div className="w-75 mt-3">
                        <Steps
                            model={items}
                            activeIndex={currentStep}
                            onSelect={(e) => onPageChange(e.index)}
                            readOnly={false}
                        />
                    </div>
                </div>
                {currentStep === 0 && <SelectForm />}

                {currentStep === 1 && <AddMember />}

                {currentStep === 2 && <Exclusions />}

                {currentStep === 3 && <CreateGroup createToast={displayToastMessage} />}
            </div>
            <Toast ref={toast} />
            <Snowfall color="white" />
        </div>
    );
};

export default AddGroupMembers;
