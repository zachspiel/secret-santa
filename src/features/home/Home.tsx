import React from "react";
import { useAppSelector } from "../../redux/hooks";
import Header from "../../components/Header";
import AddMember from "./components/AddMember";
import CreateGroup from "./components/CreateGroup";
import MembersList from "./components/MembersList";
import { Steps } from "primereact/steps";
import { Toast } from "primereact/toast";
import Snowfall from "react-snowfall";
import Exclusions from "./components/Exclusions";

const AddGroupMembers = (): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [error, setError] = React.useState("");
    const toast = React.useRef<Toast>(null);

    const displayToastMessage = (message: string, summary: string, severity: string) => {
        toast?.current?.show({
            severity: severity,
            summary: summary,
            detail: message,
            life: 3000,
        });
    };

    const items = [
        { label: "Enter names" },
        { label: "Set exclusions" },
        { label: "Set gift exchange details" },
    ];

    const onPageChange = (newStep: number) => {
        console.log(newStep);

        if ((newStep > 0 && members.length >= 3) || newStep === 0) {
            setActiveIndex(newStep);
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
            <div className="d-flex justify-content-center">
                <div className=" w-50 ">
                    <Steps
                        model={items}
                        activeIndex={activeIndex}
                        onSelect={(e) => onPageChange(e.index)}
                        readOnly={false}
                    />
                </div>
            </div>
            <div>
                {activeIndex === 0 && <AddMember members={members} error={error} />}

                {activeIndex === 1 && <Exclusions />}

                {activeIndex === 2 && <CreateGroup />}
            </div>
            <Toast ref={toast} />
        </div>
    );
};

export default AddGroupMembers;
