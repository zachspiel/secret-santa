import React from "react";
import { useAppSelector } from "../../redux/hooks";
import Header from "../../components/Header";
import AddMember from "./components/AddMember";
import MembersList from "./components/MembersList";
import { Toast } from "primereact/toast";
import Snowfall from "react-snowfall";

const AddGroupMembers = (): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
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

    return (
        <div className="container-fluid text-center">
            <Header />
            <div>
                <AddMember members={members} error={error} />

                {members.length > 0 && (
                    <MembersList createToast={displayToastMessage} setError={setError} />
                )}
            </div>
            <Toast ref={toast} />
            <Snowfall color="white" />
        </div>
    );
};

export default AddGroupMembers;
