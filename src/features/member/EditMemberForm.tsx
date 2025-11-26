import { useEffect, type ReactElement } from "react";
import { useAppQuery } from "../../redux/hooks";
import {
    useGetGroupByIdQuery,
    useGetMemberByIdQuery,
    useUpdateMemberByIdMutation,
} from "../../redux/api";
import Header from "../common/Header";
import { Message } from "primereact/message";
import { formTypeToForm, type FormType } from "../../types/FormTypes";
import { FormProvider, useForm } from "react-hook-form";
import type { GroupMember } from "../../common/types";

import { Button } from "primereact/button";
import Field from "../common/Field";

const EditMemberForm = (): ReactElement => {
    const query = useAppQuery();
    const groupId = query.get("groupId");
    const memberId = query.get("memberId");
    const formType = query.get("formType") as FormType | null;

    const form = formTypeToForm[formType || "form-one"];
    const methods = useForm<GroupMember>();

    const { data } = useGetMemberByIdQuery(
        { memberId: memberId || "" },
        { skip: !memberId || !groupId },
    );

    const { data: group } = useGetGroupByIdQuery(groupId || "", { skip: !groupId });
    const secretSanta = group?.members.find(
        (member) => member.assignedTo === data?.member?.name,
    );

    const [updateMember, { isSuccess, isError, isLoading }] =
        useUpdateMemberByIdMutation();

    useEffect(() => {
        if (data) {
            methods.reset(data.member);
        }
    }, [data]);

    const onSubmit = (values: GroupMember) => {
        if (groupId && memberId && formType) {
            updateMember({
                member: values,
                groupId,
                formType,
                inviteLink: secretSanta?.inviteLink ?? "",
                email: secretSanta?.email ?? "",
            });
        }
    };

    if (!groupId || !memberId || !formType || isError) {
        return (
            <div className="container-fluid text-center">
                <Header />
                <div className="row justify-content-center">
                    <div className="col-md-4 col-sm-8 mt-3">
                        <div
                            className="card p-3 border-0 text-start"
                            style={{ zIndex: 1000 }}
                        >
                            <Message
                                severity="error"
                                className="mb-2 mt-2"
                                text={
                                    isError
                                        ? "Error while saving information."
                                        : "Missing groupId, memberId, or form type."
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid ">
            <Header />
            <div
                className="col-md-6 col-sm-12 mb-5 p-3 main-content"
                style={{
                    backgroundColor: "white",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                {isSuccess && (
                    <Message
                        severity="success"
                        className="w-100"
                        text="Successfully updated values!"
                    />
                )}

                {data?.member && (
                    <p className="text-center mb-0">
                        Hello, <strong>{data.member.name}</strong>
                    </p>
                )}

                <p className="mb-2 text-center">
                    Please fill out the form below for your secret santa
                </p>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} id="add-member-form">
                        {form.map((field) => (
                            <Field
                                {...field}
                                key={field.name}
                                readonly={["name", "email"].includes(field.name)}
                            />
                        ))}
                        <div className="d-flex justify-content-end">
                            <Button label="Save" type="submit" loading={isLoading} />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default EditMemberForm;
