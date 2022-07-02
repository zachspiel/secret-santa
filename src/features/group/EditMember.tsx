import React from "react";
import { Dialog } from "primereact/dialog";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { GroupMember } from "../../common/types";
import { setEditMemberIndex } from "../../redux/membersSlice";
import { Message } from "primereact/message";
import { ColorPicker } from "primereact/colorpicker";

interface Props {
    onSave: (groupMember: GroupMember) => void;
}

const EditMember = (props: Props): JSX.Element => {
    const memberList = useAppSelector((state) => state.members.membersList);
    const editMemberIndex = useAppSelector((state) => state.members.editMemberIndex);
    const [isVisible, setIsVisible] = React.useState(false);
    const [name, setName] = React.useState("");
    const [wishlist, setWishlist] = React.useState("");
    const [favoriteStore, setFavoriteStore] = React.useState("");
    const [favoriteFood, setFavoriteFood] = React.useState("");
    const [favoriteColor, setFavoriteColor] = React.useState("");
    const [showMessage, setShowMessage] = React.useState(false);
    const [notes, setNotes] = React.useState("");
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (editMemberIndex !== -1) {
            setName(memberList[editMemberIndex].name);
            setWishlist(memberList[editMemberIndex]?.wishlist ?? "");
            setFavoriteStore(memberList[editMemberIndex]?.favoriteStore ?? "");
            setFavoriteFood(memberList[editMemberIndex]?.favoriteFood ?? "");
            setFavoriteColor(memberList[editMemberIndex]?.favoriteColor ?? "");
            setNotes(memberList[editMemberIndex]?.notes ?? "");
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [editMemberIndex, memberList]);

    React.useEffect(() => {
        if (showMessage) {
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [showMessage]);

    const getTextInput = (
        value: string,
        label: string,
        updateValue: (newValue: string) => void,
        placeholder?: string,
    ): JSX.Element => {
        return (
            <div className="p-field mb-3">
                <label className="d-block">{label}</label>
                <InputText
                    placeholder={placeholder ?? ""}
                    value={value}
                    className="w-100"
                    onChange={(e) => updateValue(e.target.value)}
                />
            </div>
        );
    };

    if (editMemberIndex === -1) {
        return <> </>;
    }

    const footer = () => {
        const updatedMember = {
            ...memberList[editMemberIndex],
            name: name,
            wishlist: wishlist,
            notes: notes,
            favoriteStore: favoriteStore,
            favoriteFood: favoriteFood,
            favoriteColor: favoriteColor,
        };

        return (
            <div className="d-flex justify-content-end">
                <Button
                    label="Cancel"
                    className="p-button-outlined"
                    onClick={() => {
                        setShowMessage(false);
                        closeModal();
                    }}
                />
                <Button
                    label="Save"
                    onClick={() => {
                        setShowMessage(true);
                        props.onSave(updatedMember);
                    }}
                />
            </div>
        );
    };

    const closeModal = () => {
        setShowMessage(false);
        dispatch(setEditMemberIndex(-1));
        setIsVisible(false);
    };

    return (
        <Dialog
            header="Edit Member"
            footer={footer}
            visible={isVisible}
            style={{ width: "50vw" }}
            onHide={closeModal}
        >
            {showMessage && (
                <Message
                    severity="success"
                    className="w-100"
                    text="Member updated successfully"
                />
            )}

            {getTextInput(name, "Name", setName, "Add person")}
            {getTextInput(
                wishlist,
                "Wishlist - optional",
                setWishlist,
                "Add link to wish list",
            )}

            {getTextInput(
                favoriteStore,
                "Favorite store(s) - optional",
                setFavoriteStore,
                "Enter favorite store",
            )}

            {getTextInput(
                favoriteFood,
                "Favorite food - optional",
                setFavoriteFood,
                "Enter favorite food",
            )}

            <div className="p-field mb-3">
                <label className="d-block">Favorite Color - optional</label>
                <ColorPicker
                    value={favoriteColor}
                    className="w-100"
                    onChange={(e) => setFavoriteColor(e.value as string)}
                ></ColorPicker>
            </div>

            <div className="p-field mb-3">
                <label className="d-block">Additional notes - optional</label>
                <InputTextarea
                    value={notes}
                    className="w-100"
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
        </Dialog>
    );
};

export default EditMember;
