import React from "react";
import { InputText } from "primereact/inputtext";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMembersList } from "../../../redux/membersSlice";
import type { GroupMember } from "../../../common/types";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { ColorPicker } from "primereact/colorpicker";
import { setCurrentStep } from "../../../appSlice";
import EditMember from "../../group/EditMember";
import MembersList from "./MembersList";

interface Props {
    members: GroupMember[];
}

const AddMember = (props: Props): JSX.Element => {
    const dispatch = useAppDispatch();
    const members = useAppSelector((state) => state.members.membersList);
    const editMemberIndex = useAppSelector((state) => state.members.editMemberIndex);
    const [newMember, setNewMember] = React.useState("");
    const [newMemberWishList, setNewMemberWishList] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [favoriteStore, setFavoriteStore] = React.useState("");
    const [favoriteFood, setFavoriteFood] = React.useState("");
    const [favoriteColor, setFavoriteColor] = React.useState("");
    const [error, setError] = React.useState("");

    const insertMember = () => {
        const reducedMemberName = newMember.trim().replace(/[^a-zA-Z ]/g, "");

        if (newMember.trim().length === 0) {
            setError("Please enter a valid name.");
        } else if (
            props.members.findIndex((member) => member.name === reducedMemberName) !== -1
        ) {
            setError(`${reducedMemberName} already exists.`);
        } else {
            const _members = [
                ...members,
                {
                    name: reducedMemberName,
                    wishlist: newMemberWishList,
                    notes: notes,
                    favoriteStore: favoriteStore,
                    favoriteFood: favoriteFood,
                    favoriteColor: favoriteColor,
                    assignedTo: "",
                    exclusions: [],
                },
            ];

            dispatch(setMembersList(_members));
            resetForm();
        }
    };

    const resetForm = () => {
        setNewMember("");
        setNewMemberWishList("");
        setNotes("");
        setFavoriteStore("");
        setFavoriteFood("");
        setFavoriteColor("");
        setError("");
    };

    const saveUpdatedMember = (updatedMember: GroupMember) => {
        const _members = [...members];
        _members[editMemberIndex] = { ...updatedMember };
        dispatch(setMembersList(_members));
    };

    return (
        <div className="row justify-content-center mt-4">
            <div className="col-md-4 col-sm-12 border-end mb-2">
                <div className="text-start p-3">
                    <div className="text-center">
                        <h5>Add Member</h5>
                    </div>
                    <div className="p-field mb-3">
                        <label className="d-block">Name</label>
                        <InputText
                            placeholder={"Add member"}
                            value={newMember}
                            className={`${error.length > 0 ? "p-invalid" : ""} w-100`}
                            onChange={(e) => setNewMember(e.target.value)}
                        />
                    </div>
                    <div className="p-field mb-3">
                        <label className="d-block">
                            Wishlist <span className="text-muted">- optional</span>
                        </label>
                        <InputText
                            placeholder={"Add link to wish list"}
                            value={newMemberWishList}
                            className={`${error.length > 0 ? "p-invalid" : ""} w-100`}
                            onChange={(e) => setNewMemberWishList(e.target.value)}
                        />
                    </div>
                    <div className="p-field mb-3">
                        <label className="d-block">
                            Favorite store(s){" "}
                            <span className="text-muted">- optional</span>
                        </label>
                        <InputText
                            placeholder={"Enter favorite store"}
                            value={favoriteStore}
                            className={`${error.length > 0 ? "p-invalid" : ""} w-100`}
                            onChange={(e) => setFavoriteStore(e.target.value)}
                        />
                    </div>
                    <div className="p-field mb-3">
                        <label className="d-block">
                            Favorite food <span className="text-muted">- optional</span>
                        </label>
                        <InputText
                            placeholder={"Enter favorite food"}
                            value={favoriteFood}
                            className={`${error.length > 0 ? "p-invalid" : ""} w-100`}
                            onChange={(e) => setFavoriteFood(e.target.value)}
                        />
                    </div>
                    <div className="p-field mb-3">
                        <label className="d-block">
                            Favorite Color <span className="text-muted">- optional</span>
                        </label>
                        <ColorPicker
                            value={favoriteColor}
                            className="w-100"
                            onChange={(e) => setFavoriteColor((e.value as string) ?? "")}
                        ></ColorPicker>
                    </div>

                    <div className="p-field mb-3">
                        <label className="d-block">
                            Additional notes{" "}
                            <span className="text-muted">- optional</span>
                        </label>
                        <InputTextarea
                            value={notes}
                            className={`${error.length > 0 ? "p-invalid" : ""} w-100`}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    {error.length > 0 && (
                        <small className="p-error d-block">{error}</small>
                    )}

                    <div className="d-flex justify-content-end">
                        <Button
                            label="Reset"
                            className="p-button-outlined me-2"
                            onClick={resetForm}
                        />
                        <Button label="Add member" onClick={insertMember} />
                    </div>
                </div>
            </div>

            <MembersList />

            {members.length >= 3 && (
                <div className="mt-3">
                    <Button
                        label="Next"
                        className="p-button mb-2"
                        onClick={() => dispatch(setCurrentStep(1))}
                    />
                </div>
            )}

            <EditMember onSave={saveUpdatedMember} />
        </div>
    );
};

export default AddMember;
