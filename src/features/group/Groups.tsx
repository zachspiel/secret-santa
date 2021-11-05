import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Card } from "primereact/card";
import Header from "../../components/Header";
import { InputSwitch } from "primereact/inputswitch";
import { DataTable } from "primereact/datatable";
import { Column, ColumnBodyType, ColumnProps } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import EditGroup from "./EditGroup";
import { useDeleteGroupByIdMutation, useGetAllGroupsQuery } from "../../redux/api";
import { setGroups } from "./groupSlice";
import Snowfall from "react-snowfall";
import { Group } from "../../common/types";

const Groups = (): JSX.Element => {
    const groups = useAppSelector((state) => state.groups.groups);
    const [editingGroupIndex, setEditingGroupIndex] = React.useState(-1);
    const [deleteGroupIndex, setDeleteGroupIndex] = React.useState(-1);
    const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
    const [displaySecretSantas, setDisplaySecretSantas] = React.useState<number[]>([]);
    const toast = React.useRef<Toast>(null);
    const dispatch = useAppDispatch();
    const { data } = useGetAllGroupsQuery(localStorage.getItem("currentUser") ?? "");
    const [deleteGroup, { isSuccess, isError }] = useDeleteGroupByIdMutation();

    React.useEffect(() => {
        if (data !== undefined) {
            dispatch(setGroups(data));
        }
    }, [data]);

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

    const Footer = (index: number) => {
        return (
            <div className="d-flex justify-content-end">
                <Button
                    icon="pi pi-trash"
                    label="Delete"
                    className="p-button-outlined p-button-danger me-2"
                    onClick={() => {
                        setShowConfirmDelete(true);
                        setDeleteGroupIndex(index);
                    }}
                />
                <Button
                    icon="pi pi-refresh"
                    label="Reshuffle Secret Santa"
                    className="p-button-outlined me-2"
                    onClick={() => {
                        setShowConfirmDelete(true);
                        setDeleteGroupIndex(index);
                    }}
                />
                <Button
                    icon="pi pi-pencil"
                    label="Edit"
                    onClick={() => setEditingGroupIndex(index)}
                />
            </div>
        );
    };
    /*
    const secretSantaTemplate = (rowData: Group, props: ColumnProps): JSX.Element => {
        return <span>{rowData.assignedTo}</span>
    }
*/
    return (
        <div className="container-fluid text-center">
            <Header />
            <h3>Groups</h3>
            <div className="row">
                {groups.map((group, index) => {
                    if (editingGroupIndex !== index) {
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
                                                checked={displaySecretSantas.includes(
                                                    index,
                                                )}
                                                onChange={(e) =>
                                                    e.value
                                                        ? setDisplaySecretSantas([
                                                              ...displaySecretSantas,
                                                              index,
                                                          ])
                                                        : setDisplaySecretSantas(
                                                              displaySecretSantas.filter(
                                                                  (item) =>
                                                                      item !== index,
                                                              ),
                                                          )
                                                }
                                            />
                                        </div>
                                    }
                                    footer={Footer(index)}
                                >
                                    <DataTable
                                        value={group.members}
                                        stripedRows={true}
                                        scrollable
                                        scrollHeight="150px"
                                    >
                                        <Column field="name" header="Name" />
                                        <Column field="wishlist" header="Wishlist" />
                                        <Column field="inviteLink" header="Invite Link" />
                                        <Column field="assignedTo" header="Assigned To" />
                                    </DataTable>
                                </Card>
                            </div>
                        );
                    } else {
                        return <EditGroup group={group} />;
                    }
                })}
                {groups.length === 0 && (
                    <div className="col-3">
                        <Card header="No Groups Available"></Card>
                    </div>
                )}
            </div>
            <ConfirmDialog
                visible={showConfirmDelete}
                onHide={() => setShowConfirmDelete(false)}
                message="Are you sure you want to delete this group?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={() => deleteGroup(groups[deleteGroupIndex]._id)}
                reject={() => setShowConfirmDelete(false)}
            />
            <Toast ref={toast} />
            <Snowfall color="white" />
        </div>
    );
};

export default Groups;
