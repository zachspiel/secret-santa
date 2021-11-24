import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Group, GroupMember } from "../../../common/types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { createUrl } from "../../../common/util";
import { Message } from "primereact/message";
import { useInsertGroupMutation } from "../../../redux/api";
import { clearMembers } from "../../../redux/membersSlice";
import { Calendar } from "primereact/calendar";
import { useHistory } from "react-router";

interface Props {
    isVisible: boolean;
    onHide: () => void;
    createToast: (message: string, summary: string, severity: string) => void;
}

const CreateGroup = (): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const [newGroupName, setNewGroupName] = React.useState("");
    const [date, setDate] = React.useState("");
    const [newGroupNameError, setNewGroupNameError] = React.useState(false);
    const currentYear = new Date().getFullYear();
    const [saveGroup, { data }] = useInsertGroupMutation();
    const history = useHistory();
    const dispatch = useAppDispatch();

    const onSaveGroup = () => {
        const _members: GroupMember[] = [];

        members.forEach((member, index) => {
            const inviteLink = createUrl(
                members[index].name,
                members[index].assignedTo,
                members[index].wishlist,
            );
            _members.push({
                ...member,
                inviteLink: inviteLink,
            });
        });

        if (newGroupName.length !== 0) {
            const group: Group = {
                _id: "",
                createdBy: localStorage.getItem("currentUser") ?? "",
                name: newGroupName,
                members: [..._members],
            };
            setNewGroupNameError(false);
            saveGroup(group);
        } else {
            setNewGroupNameError(true);
        }
    };

    return (
        <div>
            <div className="row mt-3 justify-content-center">
                <div className="col-md-3 col-sm-6 text-start">
                    <h6>Group name</h6>
                    <InputText
                        value={newGroupName}
                        placeholder={"Enter name for group"}
                        className="w-100"
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />

                    <h6 className="mt-2">
                        Date of gift exchange
                        <span className="text-muted">- optional</span>
                    </h6>
                    <Calendar
                        id="icon"
                        dateFormat="yy-mm-dd"
                        placeholder="Select date"
                        className="w-100 mb-2"
                        value={new Date(date)}
                        onChange={(e) => setDate(e.value?.toString() ?? "")}
                        monthNavigator
                        yearNavigator
                        yearRange={`1990:${currentYear}`}
                        showIcon
                    />
                    <Button label="Save" onClick={() => onSaveGroup()} />
                </div>
            </div>
        </div>
    );
};

export default CreateGroup;
