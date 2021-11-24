import React from "react";
import { InputText } from "primereact/inputtext";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeMember, setExclusions, setMembersList } from "../../../redux/membersSlice";
import type { GroupMember } from "../../../common/types";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { shuffleArray } from "../../../common/util";
import { InputTextarea } from "primereact/inputtextarea";

interface Props {
    members: GroupMember[];
    error: string;
}

const AddMember = (props: Props): JSX.Element => {
    const dispatch = useAppDispatch();
    const members = useAppSelector((state) => state.members.membersList);
    const exclusions = useAppSelector((state) => state.members.exclusions);
    const [newMember, setNewMember] = React.useState("");
    const [newMemberWishList, setNewMemberWishList] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [error, setError] = React.useState("");

    const insertMember = () => {
        const reducedMemberName = newMember.trim().replace(/[^a-zA-Z ]/g, "");
        if (newMember.trim().length === 0) {
            setError("Please enter a valid name.");
        } else if (
            props.members.findIndex((member) => member.name === reducedMemberName) !== -1
        ) {
            setError("That person already exists.");
        } else {
            const _members = [
                ...members,
                {
                    name: reducedMemberName,
                    wishlist: newMemberWishList,
                    notes: notes,
                    assignedTo: "",
                },
            ];

            if (members.length < 2) {
                dispatch(setMembersList(_members));
            } else {
                const santaList = shuffleArray(_members);
                const _exclusions = [...exclusions];
                _members.forEach((member, index) => {
                    _members[index] = { ...member, assignedTo: santaList[index].name };
                });

                _exclusions.push([]);
                dispatch(setMembersList(_members));
                dispatch(setExclusions(_exclusions));
            }

            resetForm();
        }
    };

    const resetForm = () => {
        setNewMember("");
        setNewMemberWishList("");
        setNotes("");
        setError("");
    };

    return (
        <div className="row justify-content-center mt-4">
            <div className="col-md-4 col-sm-12 border-end">
                <div className="text-start p-3">
                    <div className="text-center">
                        <h5>Add Member</h5>
                    </div>
                    {props.error.length > 0 && (
                        <Message
                            severity="info"
                            text={props.error}
                            className="mt-2 mb-2"
                        />
                    )}
                    <div className="p-field mb-3">
                        <label htmlFor="name" className="d-block">
                            Name
                        </label>
                        <InputText
                            id="name"
                            placeholder="Add person"
                            value={newMember}
                            className={`${error.length > 0 ? "p-invalid" : ""} w-100`}
                            onChange={(e) => setNewMember(e.target.value)}
                        />
                    </div>
                    <div className="p-field mb-3">
                        <label htmlFor="wishlist" className="d-block">
                            Wishlist (optional)
                        </label>
                        <InputText
                            id="wishlist"
                            placeholder="Add link to wish list"
                            value={newMemberWishList}
                            className={`${error.length > 0 ? "p-invalid" : ""} w-100`}
                            onChange={(e) => setNewMemberWishList(e.target.value)}
                        />
                    </div>
                    <div className="p-field mb-3">
                        <label htmlFor="wishlist" className="d-block">
                            Additonal Notes (optional)
                        </label>
                        <InputTextarea
                            className="w-100"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={5}
                            autoResize
                        />
                    </div>
                    {error.length > 0 && (
                        <small className="p-error d-block">{error}</small>
                    )}

                    <div className="d-flex justify-content-end">
                        <Button
                            label="Reset"
                            className="p-button-text me-2"
                            onClick={resetForm}
                        />
                        <Button label="Add member" onClick={insertMember} />
                    </div>
                </div>
            </div>
            <div className="col-md-2 p-3">
                <div className="text-center">
                    <h5>Draw names with</h5>
                </div>
                {members.length === 0 && (
                    <h6 className="mt-3 border p-2">Add a member to get started.</h6>
                )}
                {members.map((member, index) => (
                    <div className="d-flex justify-content-between mb-2" key={index}>
                        <InputText
                            value={members[index].name}
                            placeholder={`Enter member ${index + 1}`}
                            onChange={(e) => {
                                const _members = [...members];
                                _members[index] = {
                                    ..._members[index],
                                    name: e.target.value,
                                };

                                dispatch(setMembersList(_members));
                            }}
                        />

                        <i
                            className="pi pi-times d-flex text-muted mt-2 ms-2"
                            onClick={() => dispatch(removeMember(member))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddMember;
