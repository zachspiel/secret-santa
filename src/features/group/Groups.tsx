import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Card } from "primereact/card";
import { useHistory } from "react-router-dom";
import Header from "../../components/Header";
import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
    useDeleteGroupByIdMutation,
    useGetAllGroupsQuery,
    useUpdateGroupByIdMutation,
} from "../../redux/api";
import { setGroups } from "./groupSlice";
import Snowfall from "react-snowfall";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import "../home/scss/styles.scss";
import GroupTable from "../groupTable/GroupTable";
import { shuffleArray } from "../../common/util";
import groupImage from "../../images/undraw_Having_fun_re_vj4h.png";

const Groups = (): JSX.Element => {
    const groups = useAppSelector((state) => state.groups.groups);
    const isUserSignedIn = useAppSelector((state) => state.app.isUserSignedIn);
    const [editingGroupIndex, setEditingGroupIndex] = React.useState(-1);
    const [deleteGroupIndex, setDeleteGroupIndex] = React.useState(-1);
    const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
    const [displaySecretSantas, setDisplaySecretSantas] = React.useState<number[]>([]);
    const toast = React.useRef<Toast>(null);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { data } = useGetAllGroupsQuery(
        localStorage.getItem("currentUser") ?? skipToken,
    );

    const [deleteGroup, { isSuccess, isError }] = useDeleteGroupByIdMutation();
    const [
        updateGroup,
        { isSuccess: groupUpdatedSuccessfully, isError: isGroupUpdateError },
    ] = useUpdateGroupByIdMutation();

    React.useEffect(() => {
        if (data !== undefined) {
            dispatch(setGroups(data));
        }
    }, [dispatch, data]);

    React.useEffect(() => {
        if (isError) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Error while deleting group.",
                life: 3000,
            });
        }
    }, [isError]);

    React.useEffect(() => {
        if (isSuccess) {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Group sucessfully deleted.",
                life: 3000,
            });
        }
    }, [isSuccess]);

    React.useEffect(() => {
        if (groupUpdatedSuccessfully) {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Group sucessfully updated.",
                life: 3000,
            });
        }
    }, [groupUpdatedSuccessfully]);

    const Footer = (index: number) => {
        return (
            <div className="d-flex justify-content-start p-2">
                <Button
                    label="Delete"
                    className="p-button-text p-button-danger me-2"
                    onClick={() => {
                        setShowConfirmDelete(true);
                        setDeleteGroupIndex(index);
                    }}
                />
                <Button
                    label="Re-shuffle list"
                    className="p-button-text me-2"
                    onClick={() => {
                        const _members = [...groups[index].members];
                        const santaList = shuffleArray(_members);

                        _members.forEach((member, index) => {
                            _members[index] = {
                                ...member,
                                assignedTo: santaList[index].name,
                            };
                        });

                        updateGroup({
                            _id: groups[index]._id,
                            body: { ...groups[index], members: _members },
                        });
                    }}
                />
                {/*editingGroupIndex !== index && (
                    <Button
                        icon="pi pi-pencil"
                        label="Edit"
                        onClick={() => setEditingGroupIndex(index)}
                    />
                )*/}

                {/*editingGroupIndex === index && (
                    <Button
                        icon="pi pi-times"
                        label="Cancel"
                        onClick={() => setEditingGroupIndex(-1)}
                    />
                )*/}
            </div>
        );
    };

    const displayMessage = (message: string) => {
        toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: message,
            life: 3000,
        });
    };
    /*   <ConfirmDialog
                visible={showConfirmDeleteMember}
                onHide={() => setShowConfirmDelete(false)}
                message="Are you sure you want to delete this member?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={() => updateGroup({_id: groups[editingGroupIndex]._id, body: {members: [groups[editingGroupIndex].members]}}
                reject={() => setShowConfirmDelete(false)}
            /> 
            
            
            
            
            
             <GroupTable
                                    tableData={group.members}
                                    createToast={displayMessage}
                                    displaySecretSantas={displaySecretSantas.includes(
                                        index,
                                    )}
                                    displayActionColumn={editingGroupIndex === index}
                                />
            
            */
    return (
        <div className="container-fluid text-center">
            <Header />
            <div className="row">
                {groups.map((group, index) => {
                    return (
                        <div className="col-lg-4 col-sm-6 mt-2 mb-5" key={index}>
                            <Card
                                key={index}
                                title={group.name}
                                header={
                                    <div className="d-flex justify-content-end">
                                        <label htmlFor="toggle" className="mt-2 me-2">
                                            Show Secret Santas
                                        </label>
                                        <InputSwitch
                                            name="toggle"
                                            className="m-2"
                                            checked={displaySecretSantas.includes(index)}
                                            onChange={(e) =>
                                                e.value
                                                    ? setDisplaySecretSantas([
                                                          ...displaySecretSantas,
                                                          index,
                                                      ])
                                                    : setDisplaySecretSantas(
                                                          displaySecretSantas.filter(
                                                              (item) => item !== index,
                                                          ),
                                                      )
                                            }
                                        />
                                    </div>
                                }
                                footer={Footer(index)}
                            ></Card>
                        </div>
                    );
                })}
                {groups.length === 0 && isUserSignedIn && (
                    <div className="col-3 ms-auto me-auto" style={{ zIndex: 1000 }}>
                        <Card>
                            <img src={groupImage} alt="Group Placeholder" height={200} />
                            <p>Create a group to get your next Secret Santa started.</p>
                            <Button
                                label="Add a group"
                                className="p-button p-button-outline me-2"
                                onClick={() => history.push("/")}
                            />
                        </Card>
                    </div>
                )}
                {!isUserSignedIn && (
                    <div className="col-3 ms-auto me-auto">
                        <Card header="You are not currently signed in">
                            <Button
                                icon="pi pi-external-link"
                                label="Click here to add a group"
                                className="p-button p-button-outline me-2"
                                onClick={() => history.push("/")}
                            />
                        </Card>
                    </div>
                )}
            </div>
            <ConfirmDialog
                visible={showConfirmDelete}
                onHide={() => setShowConfirmDelete(false)}
                message="Are you sure you want to delete this group?"
                header="Delete this group"
                icon="pi pi-exclamation-triangle"
                acceptClassName="p-button-danger"
                acceptLabel="Delete"
                rejectLabel="Cancel"
                accept={() => deleteGroup(groups[deleteGroupIndex]._id)}
                reject={() => setShowConfirmDelete(false)}
            />

            <Toast ref={toast} />
            <Snowfall color="white" />
        </div>
    );
};

export default Groups;
