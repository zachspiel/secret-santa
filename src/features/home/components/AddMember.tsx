import React from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMembersList } from "../../../redux/membersSlice";
import type { GroupMember } from "../../../common/types";
import { Button } from "primereact/button";
import { progressToNextStep } from "../../../appSlice";
import EditMember from "../../group/EditMember";
import MembersList from "./MembersList";
import { FormProvider, useForm } from "react-hook-form";
import { FORM_ONE, FORM_TWO } from "../../common/Forms";
import Field from "../../common/Field";
import { v4 as uuid } from "uuid";

const AddMember = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const members = useAppSelector((state) => state.members.membersList);
    const editMemberIndex = useAppSelector((state) => state.members.editMemberIndex);
    const selectedForm = useAppSelector((state) => state.app.selectedForm);
    const methods = useForm();
    const onSubmit = (data) => insertMember(data);
    const [error, setError] = React.useState("");

    const form = selectedForm === "form-one" ? FORM_ONE : FORM_TWO;

    const insertMember = (fields: Record<string, string>) => {
        const member: GroupMember = {
            id: uuid(),
            name: fields["name"],
            email: fields["email"],
            assignedTo: "",
            exclusions: [],
            ...fields,
        };

        const _members = [...members, member];
        localStorage.setItem("currentMembers", JSON.stringify(_members));
        methods.reset();
        dispatch(setMembersList(_members));
        setError("");
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

                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(onSubmit)}
                            id="add-member-form"
                        >
                            {form.map((field) => (
                                <Field {...field} key={field.name} />
                            ))}
                            <Button
                                label="Reset"
                                className="p-button-outlined p-button-sm me-2"
                                onClick={() => methods.reset()}
                            />
                            <Button
                                label="Add member"
                                className="p-button-sm"
                                type="submit"
                            />
                        </form>
                    </FormProvider>

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
                        onClick={() => dispatch(progressToNextStep())}
                    />
                </div>
            )}

            <EditMember onSave={saveUpdatedMember} />
        </div>
    );
};

export default AddMember;
