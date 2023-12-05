import React from "react";
import { Dialog } from "primereact/dialog";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Button } from "primereact/button";
import { GroupMember } from "../../common/types";
import { setEditMemberIndex } from "../../redux/membersSlice";
import { Message } from "primereact/message";
import { FormProvider, useForm } from "react-hook-form";
import { FORM_ONE, FORM_TWO } from "../common/Forms";
import Field from "../common/Field";

interface Props {
    onSave: (groupMember: GroupMember) => void;
}

const EditMember = (props: Props): JSX.Element => {
    const memberList = useAppSelector((state) => state.members.membersList);
    const selectedForm = useAppSelector((state) => state.app.selectedForm);
    const editMemberIndex = useAppSelector((state) => state.members.editMemberIndex);
    const [isVisible, setIsVisible] = React.useState(false);
    const [showMessage, setShowMessage] = React.useState(false);
    const dispatch = useAppDispatch();
    const methods = useForm();
    const form = selectedForm === "form-one" ? FORM_ONE : FORM_TWO;

    React.useEffect(() => {
        if (editMemberIndex !== -1) {
            for (const [key, value] of Object.entries(memberList[editMemberIndex])) {
                methods.setValue(key, value);
            }
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

    if (editMemberIndex === -1) {
        return <> </>;
    }

    const closeModal = () => {
        setShowMessage(false);
        dispatch(setEditMemberIndex(-1));
        setIsVisible(false);
    };

    const onSubmit = (values: any) => {
        setShowMessage(true);
        const updatedMember = {
            ...memberList[editMemberIndex],
            ...values,
        };
        props.onSave(updatedMember);
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

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} id="add-member-form">
                    {form.map((field) => (
                        <Field {...field} key={field.name} />
                    ))}
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
            </FormProvider>
        </Dialog>
    );
};

export default EditMember;
