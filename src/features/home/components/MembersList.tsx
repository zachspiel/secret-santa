import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
    removeMember,
    setEditMemberIndex,
    setMembersList,
} from "../../../redux/membersSlice";
import { ScrollPanel } from "primereact/scrollpanel";
import { Button } from "primereact/button";

const MembersList = (): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const dispatch = useAppDispatch();
    const panelClass = members.length > 0 ? "border mb-2" : "mb-2";

    return (
        <div className="col-lg-3 col-md-4 p-3">
            <div className="text-center">
                <h5>Draw names with</h5>
            </div>
            {members.length === 0 && (
                <h6 className="mt-3">Add a member to get started.</h6>
            )}

            <ScrollPanel
                style={{ width: "100%", height: "280px" }}
                className={panelClass}
            >
                {members.map((member, index) => (
                    <div
                        className="d-flex justify-content-between mb-2 border-bottom"
                        key={index}
                    >
                        <span className="text-start p-2">{member.name}</span>
                        <span className="d-flex">
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-text"
                                onClick={() => dispatch(setEditMemberIndex(index))}
                            />
                            <Button
                                icon="pi pi-times"
                                className="p-button-rounded p-button-text text-danger"
                                onClick={() => {
                                    dispatch(removeMember(member));
                                    localStorage.setItem(
                                        "currentMembers",
                                        JSON.stringify(
                                            members.filter(
                                                (person) => person.name !== member.name,
                                            ),
                                        ),
                                    );
                                }}
                            />
                        </span>
                    </div>
                ))}
            </ScrollPanel>
            {members.length > 0 && (
                <Button
                    label="Delete all members"
                    className="p-button-outlined p-button-sm"
                    onClick={() => dispatch(setMembersList([]))}
                />
            )}
        </div>
    );
};

export default MembersList;
