import Header from "../common/Header";
import { useAppQuery } from "../../redux/hooks";
import { InputText } from "primereact/inputtext";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import {
    PRODUCTION_URL,
    useGetGroupByIdQuery,
    useSendMessageMutation,
} from "../../redux/api";
import { useRef, type ReactElement } from "react";
import { encryptString } from "../../common/util";
import { Messages } from "primereact/messages";

const SecretSantaMessage = (): ReactElement => {
    const methods = useForm<{ response: string }>();
    const query = useAppQuery();
    const message = atob(query.get("message") ?? "");
    const email = atob(query.get("email") ?? "");
    const type = query.get("type");
    const questionId = query.get("id") ?? "";
    const memberId = query.get("memberId");
    const groupId = query.get("groupId");
    const [sendMessage, { isLoading }] = useSendMessageMutation();
    const messageRef = useRef<Messages>(null);
    const { data: group } = useGetGroupByIdQuery(groupId || "", {
        skip: groupId === null,
    });
    const member = group?.members?.find((member) => member.id === memberId);
    const assignee = group?.members?.find(
        (groupMember) => groupMember.name === member?.assignedTo,
    );

    const onSubmit = (data: { response: string }) => sendResponse(data);

    const sendResponse = ({ response }: { response: string }) => {
        const url: URL = new URL(`${PRODUCTION_URL}/secretSantaMessage/`);
        url.searchParams.append("type", "recieved-response");
        url.searchParams.append("message", encryptString(response));
        url.searchParams.append("email", encryptString(query.get("email") ?? ""));
        url.searchParams.append("memberId", memberId ?? "");
        url.searchParams.append("groupId", groupId ?? "");

        if (email) {
            sendMessage({
                message: response,
                email: email,
                memberId: memberId ?? "",
                groupId: groupId ?? "",
                subject: `You recieved a response from ${
                    assignee?.name ?? " your secret santa assignee"
                }`,
                url: url.toString(),
                type: "answer",
                question: {
                    id: questionId,
                    question: message,
                    answer: response,
                },
            })
                .then(() => {
                    messageRef?.current?.show([
                        {
                            severity: "success",
                            summary: "",
                            detail: "Successfully sent message",
                            life: 3000,
                        },
                    ]);
                })
                .catch(() => {
                    messageRef?.current?.show([
                        {
                            severity: "error",
                            summary: "",
                            detail: "Error sending message, please try again later",
                            life: 3000,
                        },
                    ]);
                });
        }
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
                        <Messages ref={messageRef} />

                        {type === "send-response" && (
                            <>
                                <p>
                                    You have received a question from your Secret Santa!
                                </p>

                                <div
                                    className="p-2 rounded mb-2"
                                    style={{ background: "lightblue" }}
                                >
                                    {message}
                                </div>

                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                                        <div className="d-flex flex-column gap-2">
                                            <label htmlFor="response">Respose</label>
                                            <InputText
                                                {...methods.register("response", {
                                                    required: true,
                                                })}
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="mt-2"
                                            loading={isLoading}
                                        >
                                            Send
                                        </Button>
                                    </form>
                                </FormProvider>
                            </>
                        )}

                        {type === "recieved-response" && (
                            <>
                                <p>
                                    You have received a response from{" "}
                                    <strong>{assignee?.name}</strong>!
                                </p>

                                <div
                                    className="p-2 rounded mb-2"
                                    style={{ background: "lightblue" }}
                                >
                                    {message}
                                </div>

                                <a href={member?.inviteLink ?? ""} className="mt-2">
                                    View {assignee?.name}'s information
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecretSantaMessage;
