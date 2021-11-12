import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearMembers, removeMember, setSantasList } from "../../../redux/membersSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useInsertGroupMutation } from "../../../redux/api";
import type { Group, GroupMember } from "../../../common/types";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import { InputText } from "primereact/inputtext";
import { findIndexById, shuffleArray } from "../../../common/util";
import { InputSwitch } from "primereact/inputswitch";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import "../scss/styles.scss";
import GenerateList from "./GenerateList";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createToast: (message: string, summary: string, severity: string) => void;
    setError: (error: string) => void;
}

const MembersList = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const santasList = useAppSelector((state) => state.members.santaList);
    const isUserSignedIn = useAppSelector((state) => state.members.isUserSignedIn);
    const [newGroupName, setNewGroupName] = React.useState("");
    const [showNewGroupInput, setShowNewGroupInput] = React.useState(false);
    const [newGroupNameError, setNewGroupNameError] = React.useState(false);
    const [displaySecretSantas, setDisplaySecretSantas] = React.useState(false);
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

    React.useEffect(() => {
        if (members.length >= 3) {
            dispatch(setSantasList(shuffleArray(members)));
        } else {
            dispatch(setSantasList([]));
            setNewGroupNameError(false);
            setShowNewGroupInput(false);
        }
    }, [dispatch, members]);

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
        const _members: GroupMember[] = [];

        members.forEach((member, index) => {
            const inviteLink = createUrl(members[index].name, santasList[index].name);
            _members.push({ ...member, inviteLink: inviteLink });
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

    const inviteLinkTemplate = (rowData: GroupMember): JSX.Element | null => {
        if (santasList.length === 0) {
            return null;
        }
        const index = findIndexById(rowData.name, members);
        return (
            <div className="pb-3 pt-3 d-flex w-100">
                <CopyToClipboard
                    text={createUrl(members[index].name, santasList[index].name)}
                    onCopy={displayMessage}
                >
                    <Button label="Copy invite" className="p-button-text text-left p-0" />
                </CopyToClipboard>
            </div>
        );
    };

    const wishlistTemplate = (rowData: GroupMember): JSX.Element => {
        if (!rowData.wishlist) {
            return <div className="d-none"></div>;
        }

        return (
            <div className="pb-3 pt-3 d-flex w-100">
                <span className="p-column-title">Wishlist</span>
                <span>{rowData.wishlist}</span>
            </div>
        );
    };

    const nameTemplate = (rowData: GroupMember): JSX.Element => {
        return (
            <div className="pb-3 pt-3 d-flex justify-content-between">
                <span className="p-column-title">Name</span>
                <span>{rowData.name}</span>
            </div>
        );
    };

    const secretSantaTemplate = (rowData: GroupMember): JSX.Element => {
        if (santasList.length === 0 || !displaySecretSantas) {
            return <div className="d-none"></div>;
        }
        const index = findIndexById(rowData.name, members);
        return (
            <div className="pb-3 pt-3 d-flex w-100">
                <span className="p-column-title">Recepient</span>
                <span className="w-100">{santasList[index].name}</span>
            </div>
        );
    };

    const actionTemplate = (rowData: GroupMember): JSX.Element => {
        return (
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger p-button-text"
                onClick={() => dispatch(removeMember(rowData))}
            />
        );
    };

    const leftToolbarTemplate = () => {
        return <GenerateList setError={props.setError} />;
    };

    const rightToolbarTemplate = () => {
        return (
            <>
                <span>Show Secret Santas</span>
                <InputSwitch
                    name="toggle"
                    className="ms-2"
                    checked={displaySecretSantas}
                    onChange={(e) => setDisplaySecretSantas(e.value)}
                />
                <Tooltip target=".pi-question-circle" />
                <i
                    className="pi pi-question-circle d-flex align-self-end mb-2 ms-2 me-0"
                    data-pr-tooltip="Click on 'Copy invite' to copy a unique url to send to each member in your group. This url will show the member who they are assigned to."
                    data-pr-position="right"
                />
            </>
        );
    };
    return (
        <div className="row justify-content-center">
            <div className="col-lg-6 col-md-5 col-sm-6 mt-3" style={{ zIndex: 1000 }}>
                <div className="card p-3 border-0 mb-5">
                    <Toolbar
                        className="p-mb-4"
                        left={leftToolbarTemplate}
                        right={rightToolbarTemplate}
                    ></Toolbar>

                    <DataTable
                        value={members}
                        stripedRows={true}
                        scrollable
                        scrollHeight="250px"
                        className="p-datatable-responsive"
                    >
                        <Column field="name" header="Name" body={nameTemplate} />
                        <Column
                            field="wishlist"
                            header="Wishlist"
                            body={wishlistTemplate}
                        />
                        <Column
                            field="inviteLink"
                            header="Invite Link"
                            body={inviteLinkTemplate}
                        />
                        <Column
                            field="assignedTo"
                            header="Recepient"
                            body={secretSantaTemplate}
                        />
                        <Column header="Actions" body={actionTemplate} />
                    </DataTable>

                    <hr />
                    {!isUserSignedIn && (
                        <h6>To save this group, please sign in above.</h6>
                    )}

                    {/**add link to go to group */}
                    {isUserSignedIn && (
                        <Button
                            label="Save group"
                            onClick={() => setShowNewGroupInput(true)}
                            disabled={members.length < 3}
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

                    {showNewGroupInput && newGroupNameError && (
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
