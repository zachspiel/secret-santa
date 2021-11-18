import React from "react";
import { InputText } from "primereact/inputtext";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMembersList } from "../../../redux/membersSlice";
import { Button } from "primereact/button";
import type { GroupMember } from "../../../common/types";
import { Message } from "primereact/message";
import { shuffleArray } from "../../../common/util";
import { Card } from "primereact/card";

interface Props {
    members: GroupMember[];
    error: string;
}

const AddMember = (props: Props): JSX.Element => {
    const dispatch = useAppDispatch();
    const members = useAppSelector((state) => state.members.membersList);
    const [newMember, setNewMember] = React.useState("");
    const [newMemberWishList, setNewMemberWishList] = React.useState("");
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
                    assignedTo: "",
                },
            ];

            if (members.length < 2) {
                dispatch(setMembersList(_members));
            } else {
                const santaList = shuffleArray(_members);

                _members.forEach((member, index) => {
                    _members[index] = { ...member, assignedTo: santaList[index].name };
                });

                dispatch(setMembersList(_members));
            }

            resetForm();
        }
    };

    const resetForm = () => {
        setNewMember("");
        setNewMemberWishList("");
        setError("");
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-2 col-sm-12">
                <div className="card text-start p-3">
                    {props.error.length > 0 && (
                        <Message
                            severity="info"
                            text={props.error}
                            className="mt-2 mb-2"
                        />
                    )}
                    <div className="text-center">
                        <h5>Add Member</h5>
                    </div>
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
                            Wishlist
                        </label>
                        <InputText
                            id="wishlist"
                            placeholder="Add link to wish list (optional)"
                            value={newMemberWishList}
                            className={`${error.length > 0 ? "p-invalid" : ""} w-100`}
                            onChange={(e) => setNewMemberWishList(e.target.value)}
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
        </div>
    );
};

export default AddMember;
