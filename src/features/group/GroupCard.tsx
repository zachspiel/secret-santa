import React, { type ReactElement } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import { ScrollPanel } from "primereact/scrollpanel";
import { Toast } from "primereact/toast";
import type { Group } from "../../common/types";
import {
    getListOfNames,
    generateDraw,
    getFormattedDate,
    createUrl,
} from "../../common/util";
import { PRODUCTION_URL, useUpdateGroupByIdMutation } from "../../redux/api";
import copy from "copy-to-clipboard";
import EmailGroup from "./EmailGroup";

interface Props {
    group: Group;
    groupList: Group[];
    index: number;
    displaySecretSantas: number[];
    toast: React.RefObject<Toast>;
    setDisplaySecretSantas: (index: number[]) => void;
    onDeleteGroup: (index: number) => void;
}

const GroupCard = ({
    group,
    groupList,
    index,
    displaySecretSantas,
    setDisplaySecretSantas,
    onDeleteGroup,
    toast,
}: Props): ReactElement => {
    const [updateGroup, { isSuccess: groupUpdatedSuccessfully }] =
        useUpdateGroupByIdMutation();

    React.useEffect(() => {
        if (groupUpdatedSuccessfully) {
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Group sucessfully updated.",
                life: 3000,
            });
        }
    }, [groupUpdatedSuccessfully, toast]);

    const Header = () => {
        const hasBudget = group.budget !== undefined;

        return (
            <div className={`d-flex justify-content-${hasBudget ? "between" : "end"}`}>
                {hasBudget && (
                    <p className="mt-2 ms-3">
                        <i className="pi pi-money-bill" /> {group.currencySymbol ?? ""}{" "}
                        {group.budget}
                    </p>
                )}
                {group.date !== undefined && (
                    <p className="mt-2 ms-2">
                        <i className="pi pi-calendar" />
                        {getFormattedDate(group.date)}
                    </p>
                )}
                <div className="d-flex">
                    <label htmlFor="toggle" className="mt-2 me-2">
                        Show Secret Santas
                    </label>
                    <InputSwitch
                        name="toggle"
                        className="m-2"
                        checked={displaySecretSantas.includes(index)}
                        onChange={(e) =>
                            e.value
                                ? setDisplaySecretSantas([...displaySecretSantas, index])
                                : setDisplaySecretSantas(
                                      displaySecretSantas.filter(
                                          (item) => item !== index,
                                      ),
                                  )
                        }
                    />
                </div>
            </div>
        );
    };

    const Footer = (index: number) => {
        return (
            <div className="d-flex justify-content-md-end justify-content-sm-center p-2">
                <EmailGroup group={groupList[index]} />
                <Button
                    label="Delete"
                    className="p-button-outlined p-button-danger p-button-sm me-2"
                    onClick={() => onDeleteGroup(index)}
                />
                <Button
                    label="Re-shuffle list"
                    className="p-button-outlined p-button-sm"
                    onClick={() => {
                        const { formType } = groupList[index];
                        const _members = [...groupList[index].members];
                        const names = getListOfNames(_members);
                        let updatedGroup = generateDraw(names, [...names], _members);

                        updatedGroup = updatedGroup.map((member) => {
                            const inviteLink = createUrl(member, formType);

                            return { ...member, inviteLink };
                        });

                        updateGroup({
                            _id: groupList[index]._id,
                            body: { ...groupList[index], members: updatedGroup },
                        });
                    }}
                />
            </div>
        );
    };
    return (
        <div className="col-xl-4 col-md-6 col-sm-12 mt-2 mb-5">
            <Card
                className="border"
                title={group.name}
                header={Header()}
                footer={Footer(index)}
            >
                <div className="d-flex justify-content-between border-bottom pe-3 ps-3">
                    <p>Name</p>
                    <p>Assigned to</p>
                    <p>Invite link</p>
                    <p>Edit link</p>
                </div>
                <ScrollPanel
                    style={{ width: "100%", height: "280px" }}
                    className="border mb-2 p-3"
                >
                    {group.members.map((member, memberIndex) => {
                        return (
                            <div
                                className="d-flex justify-content-between border-bottom"
                                key={memberIndex}
                            >
                                <div className="d-flex justify-content-between w-50">
                                    <p>{member.name}</p>
                                    {displaySecretSantas.includes(index) && (
                                        <p>{member.assignedTo}</p>
                                    )}
                                </div>

                                <Button
                                    label="Copy invite"
                                    className="p-button-text"
                                    onClick={() => {
                                        copy(member.inviteLink ?? "");
                                        toast.current?.show({
                                            severity: "success",
                                            summary: "Success",
                                            detail: "Invite sucessfully copied.",
                                            life: 3000,
                                        });
                                    }}
                                />

                                <Button
                                    label="Copy edit link"
                                    className="p-button-text"
                                    onClick={() => {
                                        copy(
                                            `${PRODUCTION_URL}/memberForm?memberId=${member.id}&groupId=${member.groupId}&formType=${group.formType}`,
                                        );
                                        toast.current?.show({
                                            severity: "success",
                                            summary: "Success",
                                            detail: "Invite sucessfully copied.",
                                            life: 3000,
                                        });
                                    }}
                                />
                            </div>
                        );
                    })}
                </ScrollPanel>
            </Card>
        </div>
    );
};

export default GroupCard;
