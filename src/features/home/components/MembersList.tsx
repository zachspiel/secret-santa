import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearMembers, removeMember } from "../../../redux/membersSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useInsertGroupMutation } from "../../../redux/api";
import { Group } from "../../../common/types";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";

interface Props {
    createToast: (message: string, summary: string, severity: string) => void;
}

const MembersList = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const santasList = useAppSelector((state) => state.members.santaList);
    const isUserSignedIn = useAppSelector((state) => state.members.isUserSignedIn);
    const [newGroupName, setNewGroupName] = React.useState("");
    const [showNewGroupInput, setShowNewGroupInput] = React.useState(false);
    const [newGroupNameError, setNewGroupNameError] = React.useState(false);
    const history = useHistory();
    const dispatch = useAppDispatch();

    const [saveGroup, { data }] = useInsertGroupMutation();

    React.useEffect(() => {
        if (data?.name !== undefined) {
            setShowNewGroupInput(false);
            setNewGroupName("");
            dispatch(clearMembers());

            history.push("/groups");
            props.createToast("Group Successfully created", "Success", "success");
        }
    }, [data]);

    const encryptString = (stringToEncrypt: string): string => {
        return btoa(stringToEncrypt);
    };

    const createUrl = (selectedMember: string, assignee: string): string => {
        return `${
            window.location.hostname
        }:3000/getSecretSanta/?name=${selectedMember}&selected=${encryptString(
            assignee,
        )}`;
    };

    const displayMessage = () => {
        props.createToast("Invite copied successfully", "Success", "success");
    };

    const onSaveGroup = () => {
        if (newGroupName.length !== 0) {
            const group: Group = {
                _id: "",
                createdBy: localStorage.getItem("currentUser") ?? "",
                name: newGroupName,
                members: [...members],
            };
            setNewGroupNameError(false);
            saveGroup(group);
        } else {
            setNewGroupNameError(true);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-3 col-sm-6 mt-3" style={{ zIndex: 1000 }}>
                <div className="card p-3 border-0">
                    <Tooltip target=".pi-question-circle" />
                    <i
                        className="pi pi-question-circle d-flex align-self-end mb-2 me-0"
                        data-pr-tooltip="After generating the list, click on 'Copy invite' to copy a unique url to send to each member in your group. This url will show the member who they are assigned to."
                        data-pr-position="right"
                    />
                    {members.map((member, index) => (
                        <div className="d-flex justify-content-between" key={index}>
                            <p>
                                {index + 1}
                                <span className="ms-3">{member.name}</span>
                            </p>
                            {santasList.length > 0 && (
                                <>
                                    <CopyToClipboard
                                        text={createUrl(
                                            members[index].name,
                                            santasList[index].name,
                                        )}
                                        onCopy={displayMessage}
                                    >
                                        <Button
                                            icon="pi pi-copy"
                                            label="Copy invite"
                                            className="p-button-text"
                                        />
                                    </CopyToClipboard>
                                </>
                            )}

                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger p-button-text"
                                onClick={() => dispatch(removeMember(member))}
                            />
                        </div>
                    ))}

                    <hr />
                    {!isUserSignedIn && (
                        <h6>To save this group, please sign in above.</h6>
                    )}
                    {/**add link to go to group */}
                    {isUserSignedIn && (
                        <Button
                            label="Save group"
                            onClick={() => setShowNewGroupInput(true)}
                        />
                    )}

                    {showNewGroupInput && members.length >= 3 && (
                        <div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <InputText
                                        value={newGroupName}
                                        placeholder={"Enter new group name"}
                                        className="w-100"
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 d-flex justify-content-end">
                                    <Button
                                        label="Cancel"
                                        className="p-button-outlined me-2"
                                        onClick={() => {
                                            setNewGroupName("");
                                            setNewGroupNameError(false);
                                            setShowNewGroupInput(false);
                                        }}
                                    />
                                    <Button label="Save" onClick={() => onSaveGroup()} />
                                </div>
                            </div>
                        </div>
                    )}

                    {newGroupNameError && (
                        <Message
                            severity="error"
                            text={`Group name cannot be empty`}
                            className="mt-2 mb-2"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MembersList;
