import React from "react";
import { Dialog } from "primereact/dialog";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Button } from "primereact/button";
import { GroupMember } from "../../common/types";
import { setEditMemberIndex } from "../../redux/membersSlice";
import { Message } from "primereact/message";
import { Formik } from "formik";
import AddMemberForm, { initialValues, validationSchema } from "../common/AddMemberForm";

interface Props {
    onSave: (groupMember: GroupMember) => void;
}

const EditMember = (props: Props): JSX.Element => {
    const memberList = useAppSelector((state) => state.members.membersList);
    const editMemberIndex = useAppSelector((state) => state.members.editMemberIndex);
    const [isVisible, setIsVisible] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const dispatch = useAppDispatch();

    const initialValue = [{ ...initialValues }].map((x) => x)[0];

    React.useEffect(() => {
        if (editMemberIndex !== -1) {
            for (const [key, value] of Object.entries(memberList[editMemberIndex])) {
                initialValue[key] = value;
            }
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [editMemberIndex, initialValue, memberList]);

    React.useEffect(() => {
        if (showMessage) {
            setTimeout(() => setShowMessage(false), 5000);
        }
    }, [showMessage]);

    if (editMemberIndex === -1) {
        return <> </>;
    }

    const closeModal = () => {
        setShowMessage(false);
        dispatch(setEditMemberIndex(-1));
        setIsVisible(false);
    };

    return (
        <Dialog
            header="Edit Member"
            visible={isVisible}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
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

            <Formik
                initialValues={initialValue}
                onSubmit={(values, actions) => {
                    setShowMessage(true);
                    const updatedMember = {
                        ...memberList[editMemberIndex],
                        ...values,
                    };
                    props.onSave(updatedMember);
                }}
                validationSchema={validationSchema}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <AddMemberForm {...props} />
                        <div className="d-flex justify-content-end">
                            <Button
                                label="Cancel"
                                className="p-button-outlined me-2"
                                onClick={() => {
                                    setShowMessage(false);
                                    closeModal();
                                }}
                            />
                            <Button label="Save" type="submit" />
                        </div>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

export default EditMember;
