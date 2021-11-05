import React from "react";
import { InputText } from "primereact/inputtext";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addMember, setSantasList } from "../../../redux/membersSlice";
import { Button } from "primereact/button";
import { GroupMember } from "../../../common/types";
import { Message } from "primereact/message";

interface Props {
    members: GroupMember[];
    error: string;
}

const AddMember = (props: Props) => {
    const dispatch = useAppDispatch();
    const santaList = useAppSelector((state) => state.members.santaList);
    const [newMember, setNewMember] = React.useState("");
    const [newMemberWishList, setNewMemberWishList] = React.useState("");
    const [error, setError] = React.useState("");

    const insertMember = () => {
        if (newMember.trim().length === 0) {
            setError("Please enter a valid name.");
        } else if (Object.keys(props.members).includes(newMember)) {
            setError("That person already exists.");
        } else {
            const strippedString = newMember.replace(/[^a-zA-Z ]/g, "");
            setNewMember("");
            setError("");

            if (santaList.length > 0) {
                dispatch(setSantasList([]));
            }

            dispatch(addMember({ name: strippedString, wishlist: newMemberWishList }));
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-3 col-sm-6 mt-3" style={{ zIndex: 1000 }}>
                <div className="p-inputgroup">
                    <InputText
                        placeholder="Add person"
                        value={newMember}
                        className={`${error.length > 0 ? "p-invalid" : ""}`}
                        onChange={(e) => setNewMember(e.target.value)}
                    />
                    <InputText
                        placeholder="Add wish list (optional)"
                        value={newMemberWishList}
                        className={`${error.length > 0 ? "p-invalid" : ""}`}
                        onChange={(e) => setNewMemberWishList(e.target.value)}
                    />

                    <Button icon="pi pi-plus" onClick={insertMember} />
                </div>
                {error.length > 0 && <small className="p-error d-block">{error}</small>}
                {props.error.length > 0 && (
                    <Message severity="error" text={props.error} className="mt-2 mb-2" />
                )}
            </div>
        </div>
    );
};

export default AddMember;
