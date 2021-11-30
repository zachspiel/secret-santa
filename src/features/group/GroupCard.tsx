import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import { ScrollPanel } from "primereact/scrollpanel";
import { Toast } from "primereact/toast";
import CopyToClipboard from "react-copy-to-clipboard";
import { Group } from "../../common/types";
import { getListOfNames, generateDraw } from "../../common/util";
import { useUpdateGroupByIdMutation } from "../../redux/api";

interface Props {
    group: Group,
    groupList: Group[],
    index: number,
    displaySecretSantas: number[],
    toast: React.RefObject<Toast>,
    setDisplaySecretSantas: (index: number[]) => void,
    onDeleteGroup: (index: number) => void,
}

const GroupCard = (props: Props): JSX.Element => {
    const { group, groupList, index, displaySecretSantas, setDisplaySecretSantas, toast } = props;

    const [updateGroup, { isSuccess: groupUpdatedSuccessfully }] = useUpdateGroupByIdMutation();

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
                    <p className="mt-2 ms-2">
                        Budget: {group.currencySymbol ?? ""} {group.budget}
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
            </div>
        )
    }

    const Footer = (index: number) => {
        return (
            <div className="d-flex justify-content-end p-2">
                <Button
                    label="Delete"
                    className="p-button-outlined p-button-danger me-2"
                    onClick={() => props.onDeleteGroup(index)}
                />
                <Button
                    label="Re-shuffle list"
                    className="p-button-outlined me-2"
                    onClick={() => {
                        const _members = [...groupList[index].members];
                        const names = getListOfNames(_members);
                        const santaList = generateDraw(names, [...names], [..._members]);

                        updateGroup({
                            _id: groupList[index]._id,
                            body: { ...groupList[index], members: santaList },
                        });
                    }}
                />
            </div>
        );
    };
    return (
        <div className="col-lg-4 col-sm-6 mt-2 mb-5">
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
                    </div>
                <ScrollPanel style={{ width: '100%', height: '280px' }} className="border mb-2 p-3">
                    
                    {group.members.map((member, memberIndex) => {
                        return (
                            <div className="d-flex justify-content-between border-bottom" key={memberIndex}>
                                <p>{member.name}</p>
                                {displaySecretSantas.includes(index) && <p>{member.assignedTo}</p>}
                                <CopyToClipboard
                                    text={member.inviteLink ?? ""}
                                    onCopy={() => props.toast.current?.show({
                                        severity: "success",
                                        summary: "Success",
                                        detail: "Invite sucessfully copied.",
                                        life: 3000,
                                    })}
                                >
                                    <Button label="Copy invite" className="p-button-text" />
                                </CopyToClipboard>
                            </div>
                        )
                    })}
                </ScrollPanel>
            </Card>
        </div>
    )
}

export default GroupCard;