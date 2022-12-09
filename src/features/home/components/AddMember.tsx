import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMembersList } from "../../../redux/membersSlice";
import type { GroupMember } from "../../../common/types";
import { Button } from "primereact/button";
import { setCurrentStep } from "../../../appSlice";
import EditMember from "../../group/EditMember";
import MembersList from "./MembersList";
import { Formik, FormikHelpers } from "formik";
import AddMemberForm, {
    AddMemberFormValues,
    initialValues,
    validationSchema,
} from "../../common/AddMemberForm";

type Actions = FormikHelpers<AddMemberFormValues>;

const AddMember = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const members = useAppSelector((state) => state.members.membersList);
    const editMemberIndex = useAppSelector((state) => state.members.editMemberIndex);
    const [error, setError] = React.useState("");

    const initialValue = [{ ...initialValues }].map((x) => x)[0];

    const insertMember = (values: AddMemberFormValues, actions: Actions) => {
        if (members.findIndex((member) => member.name === values.name) !== -1) {
            setError(`${values.name} already exists.`);
        } else {
            const _members = [...members, values];
            localStorage.setItem("currentMembers", JSON.stringify(_members));
            actions.resetForm();
            dispatch(setMembersList(_members));
            setError("");
        }
    };

    const saveUpdatedMember = (updatedMember: GroupMember) => {
        const _members = members.map((member) => member);
        _members[editMemberIndex] = { ...updatedMember };
        dispatch(setMembersList(_members));
    };

    return (
        <div className="row justify-content-center mt-4">
            <div className="col-lg-4 col-md-6 col-sm-12 border-end mb-2">
                <div className="text-start p-3">
                    <div className="text-center">
                        <h5>Add Member</h5>
                    </div>
                    <Formik
                        initialValues={initialValue}
                        onSubmit={insertMember}
                        validationSchema={validationSchema}
                    >
                        {(props) => (
                            <form onSubmit={props.handleSubmit} id="add-member-form">
                                <AddMemberForm {...props} />
                                <Button
                                    label="Reset"
                                    className="p-button-outlined p-button-sm me-2"
                                    onClick={() => props.resetForm()}
                                />
                                <Button
                                    label="Add member"
                                    className="p-button-sm"
                                    type="submit"
                                />
                            </form>
                        )}
                    </Formik>

                    {error.length > 0 && (
                        <small className="p-error d-block">{error}</small>
                    )}
                </div>
            </div>

            <MembersList />

            {members.length >= 3 && (
                <div className="mt-3">
                    <Button
                        label="Next"
                        className="p-button p-button-sm mb-2"
                        onClick={() => dispatch(setCurrentStep(1))}
                    />
                </div>
            )}

            <EditMember onSave={saveUpdatedMember} />
        </div>
    );
};

export default AddMember;
