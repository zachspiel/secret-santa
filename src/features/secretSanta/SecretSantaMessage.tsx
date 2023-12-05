import Snowfall from "react-snowfall";
import Header from "../common/Header";
import { useAppQuery } from "../../redux/hooks";
import { InputText } from "primereact/inputtext";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { PRODUCTION_URL, useSendMessageMutation } from "../../redux/api";
import React from "react";
import { encryptString } from "../../common/util";
import { Messages } from "primereact";

const SecretSantaMessage = (): JSX.Element => {
    const methods = useForm();
    const query = useAppQuery();
    const message = atob(query.get("message") ?? "");
    const email = atob(query.get("email") ?? "");
    const type = query.get("type");
    const [sendMessage] = useSendMessageMutation();
    const messageRef = React.useRef<Messages>(null);

    const onSubmit = (data) => sendResponse(data);

    const sendResponse = ({ response }: { response: string }) => {
        const url: URL = new URL(`${PRODUCTION_URL}/secretSantaMessage/`);
        url.searchParams.append("type", "recieved-response");
        url.searchParams.append("message", encryptString(response));
        url.searchParams.append("email", encryptString(query.get("email") ?? ""));

        if (email) {
            sendMessage({
                message: response,
                email: email,
                subject: "You recieved a response from your Secret Santa!",
                url: url.toString(),
                type: "answer",
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
                                    You have received a question from your assigned
                                    person!
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
                                            disabled={
                                                methods.getFieldState("response").invalid
                                            }
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
                                    You have received a response from your Secret Santa!
                                </p>

                                <div
                                    className="p-2 rounded mb-2"
                                    style={{ background: "lightblue" }}
                                >
                                    {message}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Snowfall color="white" />
        </div>
    );
};

export default SecretSantaMessage;
