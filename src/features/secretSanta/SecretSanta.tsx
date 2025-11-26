import { useRef, useState, type ReactElement } from "react";
import confettiAnimation from "../../images/confetti.gif";
import present from "../../images/present-bouncing.gif";
import reindeer from "../../images/reindeer.gif";
import { Messages } from "primereact/messages";
import { useAppQuery } from "../../redux/hooks";
import Header from "../common/Header";
import { encryptString, getFormattedDate } from "../../common/util";
import { FieldType } from "../common/Forms";
import { formTypeToForm } from "../../types/FormTypes";
import {
    PRODUCTION_URL,
    useGetGroupByIdQuery,
    useGetMemberByIdQuery,
    useSendMessageMutation,
} from "../../redux/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { FormProvider, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { v4 as uuid } from "uuid";
import { Message } from "primereact/message";

const SecretSanta = (): ReactElement => {
    const [displayResult, setDisplayResult] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);
    const message = useRef<Messages>(null);
    const methods = useForm<{ question: string }>();

    const query = useAppQuery();

    const memberId = query.get("id");
    const groupId = query.get("groupId");
    const { data } = useGetGroupByIdQuery(groupId ?? skipToken);
    const formType = data?.formType ?? "form-one";

    const form = formTypeToForm[formType];

    const { data: result } = useGetMemberByIdQuery(
        { memberId: memberId || "" },
        { skip: !memberId },
    );
    const assignedMember = data?.members.find(
        (member) => member.name === result?.member?.assignedTo,
    );

    const [sendMessage, { isLoading }] = useSendMessageMutation();

    const playPresentAnimation = () => {
        setHasClicked(true);
        setTimeout(() => {
            setHasClicked(false);
            setDisplayResult(true);
        }, 1050);
    };

    const createDetailField = (label: string, content: string): ReactElement => {
        return (
            <div className="d-flex flex-column mt-2" key={label}>
                <p className="text-muted mb-0">{label}</p>
                <p className="mb-1">
                    <strong>{content}</strong>
                </p>
            </div>
        );
    };

    const sendResponse = ({ question }: { question: string }) => {
        if (!assignedMember) {
            return;
        }
        const url: URL = new URL(`${PRODUCTION_URL}/secretSantaMessage/`);
        url.searchParams.append("type", "send-response");
        url.searchParams.append("message", encryptString(question));
        url.searchParams.append("email", encryptString(result?.member.email ?? ""));
        url.searchParams.append("memberId", memberId ?? "");
        url.searchParams.append("groupId", groupId ?? "");

        const questionPayload = {
            id: uuid(),
            question,
            answer: "",
        };

        url.searchParams.append("id", questionPayload.id);

        sendMessage({
            message: question,
            email: assignedMember.email,
            memberId: memberId ?? "",
            groupId: groupId ?? "",
            subject: "You recieved a question from your Secret Santa!",
            url: url.toString(),
            type: "question",
            question: questionPayload,
        })
            .then(() => {
                message?.current?.show([
                    {
                        severity: "success",
                        summary: "",
                        detail: "Successfully sent message",
                        life: 3000,
                    },
                ]);

                methods.setValue("question", "");
            })
            .catch(() => {
                message?.current?.show([
                    {
                        severity: "error",
                        summary: "",
                        detail: "Error sending message, please try again later",
                        life: 3000,
                    },
                ]);
            });
    };

    return (
        <div className="container-fluid text-center">
            <Header />
            <div className="row justify-content-center">
                <div className="col-md-4 col-sm-8 mt-3">
                    <div
                        className="card p-3 border-0 text-start"
                        style={{ zIndex: 1000 }}
                    >
                        {displayResult && (
                            <div>
                                <div className="text-center border-bottom">
                                    <p>
                                        Ho Ho Ho <strong>{result?.member.name}</strong>!
                                    </p>
                                    <p>
                                        You are <strong>{assignedMember?.name}</strong>
                                        {`'s Secret Santa!`}
                                    </p>
                                </div>
                                <p className="mt-2">
                                    Details for <strong>{assignedMember?.name}</strong>:
                                </p>
                                {data?.budget &&
                                    createDetailField(
                                        "The budget is",
                                        data.currencySymbol + data.budget,
                                    )}

                                {data?.date &&
                                    createDetailField(
                                        " The gift exchange will be held on",
                                        getFormattedDate(data.date),
                                    )}

                                {form
                                    .filter((field) => field.name !== "name")
                                    .filter((field) => {
                                        const value = assignedMember?.[field.name];
                                        return value && value.length > 0;
                                    })
                                    .map((field) => {
                                        const value = assignedMember?.[field.name];

                                        if (
                                            field.fieldType === FieldType.TEXT ||
                                            field.fieldType === FieldType.TEXT_AREA
                                        ) {
                                            return createDetailField(field.label, value);
                                        } else if (field.fieldType === FieldType.COLOR) {
                                            return (
                                                <div
                                                    className="d-flex flex-column"
                                                    key={field.name}
                                                >
                                                    <p className="text-muted mb-0">
                                                        {field.label}
                                                    </p>
                                                    <div
                                                        className="p-colorpicker-preview mb-2"
                                                        style={{
                                                            backgroundColor: "#" + value,
                                                            width: "1.5rem",
                                                            height: "1.5rem",
                                                        }}
                                                    />
                                                </div>
                                            );
                                        } else if (field.fieldType === FieldType.URL) {
                                            return (
                                                <div className="mt-2" key={field.name}>
                                                    <p>{field.label}</p>
                                                    <div className="d-flex align-items-center">
                                                        <i className="pi pi-external-link me-2" />

                                                        <a href={value} target="_blank">
                                                            <b>Open URL</b>
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}

                                <Messages ref={message} />
                                <img
                                    src={reindeer}
                                    className="d-flex ms-auto me-auto"
                                    alt="Reindeer gif"
                                    height={150}
                                />
                            </div>
                        )}

                        {!displayResult && hasClicked && (
                            <>
                                <h5 className="text-center">Now opening...</h5>
                                <img
                                    src={confettiAnimation}
                                    alt="present opening"
                                    style={{ maxHeight: "230px" }}
                                />
                            </>
                        )}

                        {!displayResult && !hasClicked && (
                            <div
                                onClick={() => playPresentAnimation()}
                                className="text-center"
                            >
                                <h5>Click to view your assigned person!</h5>
                                <img
                                    src={present}
                                    alt="present bouncing"
                                    style={{ maxHeight: "230px" }}
                                />
                            </div>
                        )}

                        {displayResult && (
                            <div>
                                <div>
                                    <p>
                                        Have a question for{" "}
                                        <strong>{assignedMember?.name}</strong>? Send them
                                        an anonymous message below. You will recieve an
                                        email once they have replied!
                                    </p>
                                </div>

                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(sendResponse)}>
                                        <div className="d-flex flex-column gap-2">
                                            <InputText
                                                {...methods.register("question", {
                                                    required: true,
                                                })}
                                                placeholder="Enter question"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="mt-2"
                                            disabled={
                                                methods.getFieldState("question").invalid
                                            }
                                            loading={isLoading}
                                        >
                                            Send
                                        </Button>
                                    </form>
                                </FormProvider>

                                <h4 className="mt-4">
                                    <strong>
                                        Chat history with {assignedMember?.name}
                                    </strong>
                                </h4>

                                {result?.member?.qAndA &&
                                    result.member.qAndA.length === 0 && (
                                        <p>
                                            When you send your first message, it will show
                                            up here!
                                        </p>
                                    )}

                                <div className="d-flex flex-column">
                                    {result?.member.qAndA?.map((item) => (
                                        <>
                                            <div className="d-flex justify-content-end mb-1">
                                                <Message
                                                    severity="info"
                                                    style={{ maxWidth: "75%" }}
                                                    text={item.question}
                                                    icon={<></>}
                                                />
                                            </div>

                                            <div className="d-flex justify-content-start mb-1">
                                                {item.answer.length > 0 && (
                                                    <Message
                                                        severity="success"
                                                        style={{ maxWidth: "75%" }}
                                                        text={item.answer}
                                                        icon={<></>}
                                                    />
                                                )}
                                            </div>
                                        </>
                                    ))}{" "}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecretSanta;
