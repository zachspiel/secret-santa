import React from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import CopyToClipboard from "react-copy-to-clipboard";
import { GroupMember } from "../../common/types";
import { createUrl, findIndexById } from "../../common/util";
import { useAppSelector } from "../../redux/hooks";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";

interface Props {
    tableData: GroupMember[];
    displaySecretSantas: boolean;
    displayActionColumn: boolean;
    createToast: (message: string, summary: string, severity: string) => void;
    onRemoveMember?: (member: GroupMember) => void;
}

const GroupTable = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);

    const displayCopyInviteMessage = () => {
        props.createToast("Invite copied successfully", "Success", "success");
    };

    const inviteLinkTemplate = (rowData: GroupMember): JSX.Element | null => {
        if (rowData.assignedTo.length === 0) {
            return null;
        }

        return (
            <div className="pb-3 pt-3 d-flex w-100">
                <CopyToClipboard
                    text={createUrl(rowData.name, rowData.assignedTo, rowData.wishlist)}
                    onCopy={displayCopyInviteMessage}
                >
                    <Button label="Copy invite" className="p-button-text" />
                </CopyToClipboard>
            </div>
        );
    };

    const wishlistTemplate = (rowData: GroupMember): JSX.Element => {
        if (rowData.wishlist === undefined) {
            return <div className="d-none"></div>;
        }

        return (
            <div className="pb-3 pt-3 d-flex w-100">
                <span className="p-column-title">Wishlist</span>
                {rowData.wishlist.length === 0 && <span>{rowData.wishlist}</span>}
                {rowData.wishlist.length !== 0 && (
                    <a
                        href={rowData.wishlist}
                        target={"_blank"}
                        rel="noreferrer"
                        className="p-button-text text-left p-0"
                    >
                        View Wishlist
                    </a>
                )}
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
        if (rowData.assignedTo.length === 0) {
            return <div className="d-none"></div>;
        }
        if (!props.displaySecretSantas) {
            return (
                <Inplace closable>
                    <InplaceDisplay>View</InplaceDisplay>
                    <InplaceContent>
                        <span>{rowData.assignedTo}</span>
                    </InplaceContent>
                </Inplace>
            );
        }
        const index = findIndexById(rowData.name, members);
        return (
            <div className="pb-3 pt-3 d-flex w-100">
                <span className="p-column-title">Recepient</span>
                <span className="w-100">{rowData.assignedTo}</span>
            </div>
        );
    };

    const actionTemplate = (rowData: GroupMember): JSX.Element => {
        return (
            <Button
                className="p-button-text"
                label="Delete"
                onClick={() => props.onRemoveMember?.(rowData)}
            />
        );
    };

    return (
        <DataTable
            value={props.tableData}
            scrollable
            scrollHeight="250px"
            className="p-datatable-responsive"
        >
            <Column field="name" header="Name" body={nameTemplate} />
            <Column field="wishlist" header="Wishlist" body={wishlistTemplate} />
            <Column field="assignedTo" header="Recepient" body={secretSantaTemplate} />
            <Column field="inviteLink" header="Invite Link" body={inviteLinkTemplate} />
            {props.displayActionColumn && (
                <Column header="Actions" body={actionTemplate} />
            )}
        </DataTable>
    );
};

export default GroupTable;
