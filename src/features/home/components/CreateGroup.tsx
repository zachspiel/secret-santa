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
import { useHistory } from "react-router";

interface Props {
    isVisible: boolean;
    onHide: () => void;
    createToast: (message: string, summary: string, severity: string) => void;
}

const CreateGroup = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const [newGroupName, setNewGroupName] = React.useState("");
    const [newGroupNameError, setNewGroupNameError] = React.useState(false);
    const [saveGroup, { data }] = useInsertGroupMutation();
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { createToast } = props;

    React.useEffect(() => {
        if (data?.name !== undefined) {
            props.onHide();
            setNewGroupName("");
            dispatch(clearMembers());
            props.createToast("Group Successfully created", "Success", "success");
        }
    }, [dispatch, data, createToast, history]);

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
        <Dialog
            header="Save a new group"
            visible={props.isVisible}
            style={{ width: "50vw" }}
            onHide={() => props.onHide()}
        >
            <div>
                <div className="row mt-3">
                    <div className="col-8">
                        <InputText
                            value={newGroupName}
                            placeholder={"Enter new group name"}
                            className="w-100"
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                        {props.isVisible && newGroupNameError && (
                            <Message
                                severity="error"
                                text={`Group name cannot be empty`}
                                className="mt-2 mb-2"
                            />
                        )}
                        <Button
                            label="Cancel"
                            className="p-button-outlined me-2"
                            onClick={() => {
                                setNewGroupName("");
                                setNewGroupNameError(false);
                                props.onHide();
                            }}
                        />
                        <Button label="Save" onClick={() => onSaveGroup()} />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default CreateGroup;
