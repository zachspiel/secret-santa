import { Formik } from "formik";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React from "react";
import { EmailGroupPayload, GroupMember } from "../../common/types";
import { object, string } from "yup";
import ReactQuill from "react-quill";
import { useEmailGroupsMutation } from "../../redux/api";
import { Messages } from "primereact/messages";

interface Props {
    members: GroupMember[];
}

const validationSchema = object().shape({
    subject: string().trim().required("Subject is required."),
    message: string().trim().required("Message is required."),
});

const EmailGroup = (props: Props): JSX.Element => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [emailGroup, { isSuccess, isError }] = useEmailGroupsMutation();
    const messages = React.useRef<Messages>(null);

    React.useEffect(() => {
        if (isSuccess) {
            messages?.current?.show({
                severity: "success",
                summary: "Emails sent successfully",
                life: 5000,
            });
        }
    }, [isSuccess]);

    React.useEffect(() => {
        if (isError) {
            messages?.current?.show({
                severity: "error",
                summary: "An error occurred. Please try again later.",
                life: 5000,
            });
        }
    }, [isError]);

    const initialValues: EmailGroupPayload = {
        subject: "Ho Ho Ho! Santa is coming to town!",
        message: "I have included the link for your secret santa assignment!",
        members: props.members,
    };

    return (
        <>
            <Dialog
                visible={isVisible}
                onHide={() => setIsVisible(false)}
                breakpoints={{ "960px": "75vw", "640px": "100vw" }}
                style={{ width: "50vw" }}
            >
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => {
                        emailGroup(values);
                    }}
                    validationSchema={validationSchema}
                >
                    {(props) => (
                        <form onSubmit={props.handleSubmit}>
                            <Messages ref={messages} className="w-100 mb-2" />

                            <div className="p-field mb-3">
                                <label className="d-block" htmlFor="subject">
                                    Email Subject
                                </label>
                                {props.errors.subject && props.touched.subject && (
                                    <small id="subject-help" className="p-error block">
                                        {props.errors.subject}
                                    </small>
                                )}
                                <InputText
                                    placeholder={"Enter subject for email"}
                                    id="subject"
                                    value={props.values.subject}
                                    className="w-100"
                                    onChange={props.handleChange}
                                />
                            </div>

                            <div className="p-field mb-3">
                                <label className="d-block" htmlFor="message">
                                    Email Content
                                </label>
                                {props.errors.message && props.touched.message && (
                                    <small
                                        id="subjectmessage-help"
                                        className="p-error block"
                                    >
                                        {props.errors.message}
                                    </small>
                                )}
                                <ReactQuill
                                    value={props.values.message}
                                    id={"message"}
                                    placeholder={"Enter email content."}
                                    theme={"snow"}
                                    onChange={(e): void => {
                                        props.setFieldValue("message", e);
                                    }}
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <Button
                                    label="Reset"
                                    type="reset"
                                    className="p-button-outlined me-2"
                                    onClick={() => props.resetForm()}
                                />
                                <Button
                                    label="Email members"
                                    className="p-button-sm"
                                    type="submit"
                                />
                            </div>
                        </form>
                    )}
                </Formik>
            </Dialog>
            <Button
                label="Email links"
                className="p-button-outlined p-button-sm me-2"
                onClick={() => setIsVisible(true)}
            />
        </>
    );
};

export default EmailGroup;
