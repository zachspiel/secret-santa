import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useDeleteGroupByIdMutation, useGetAllGroupsQuery } from "../../redux/api";
import { setGroups } from "./groupSlice";
import Snowfall from "react-snowfall";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import "../home/scss/styles.scss";
import groupImage from "../../images/undraw_Having_fun_re_vj4h.png";
import { Skeleton } from "primereact/skeleton";
import GroupCard from "./GroupCard";

const Groups = (): JSX.Element => {
    const groups = useAppSelector((state) => state.groups.groups);
    const isUserSignedIn = useAppSelector((state) => state.app.isUserSignedIn);
    const [deleteGroupIndex, setDeleteGroupIndex] = React.useState(-1);
    const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
    const [displaySecretSantas, setDisplaySecretSantas] = React.useState<number[]>([]);
    const toast = React.useRef<Toast>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data, isLoading } = useGetAllGroupsQuery(
        localStorage.getItem("currentUser") ?? skipToken,
    );

    const [deleteGroup, { isSuccess, isError }] = useDeleteGroupByIdMutation();

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

    return (
        <div className="container-fluid text-center">
            <Header />
            <div className="row justify-content-center">
                {groups.map((group, index) => {
                    return (
                        <GroupCard
                            key={index}
                            group={group}
                            groupList={groups}
                            index={index}
                            displaySecretSantas={displaySecretSantas}
                            onDeleteGroup={(index) => {
                                setShowConfirmDelete(true);
                                setDeleteGroupIndex(index);
                            }}
                            setDisplaySecretSantas={(groupIndex) =>
                                setDisplaySecretSantas(groupIndex)
                            }
                            toast={toast}
                        />
                    );
                })}
                {isLoading && (
                    <div className="d-flex justify-content-between mt-3">
                        <Skeleton width="15rem" height="12rem"></Skeleton>
                        <Skeleton width="15rem" height="12rem"></Skeleton>
                        <Skeleton width="15rem" height="12rem"></Skeleton>
                        <Skeleton width="15rem" height="12rem"></Skeleton>
                        <Skeleton width="15rem" height="12rem"></Skeleton>
                    </div>
                )}
                {groups.length === 0 && isUserSignedIn && !isLoading && (
                    <div className="col-3 ms-auto me-auto" style={{ zIndex: 1000 }}>
                        <Card className="border">
                            <img src={groupImage} alt="Group Placeholder" height={200} />
                            <p>Create a group to get your next Secret Santa started.</p>
                            <Button
                                label="Add a group"
                                className="p-button p-button-outline me-2"
                                onClick={() => navigate("/")}
                            />
                        </Card>
                    </div>
                )}
                {!isUserSignedIn && (
                    <div className="col-md-3 col-sm-10 ms-auto me-auto">
                        <Card header="You are not currently signed in">
                            <Button
                                icon="pi pi-external-link"
                                label="Click here to add a group"
                                className="p-button p-button-outline me-2"
                                onClick={() => navigate("/")}
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
