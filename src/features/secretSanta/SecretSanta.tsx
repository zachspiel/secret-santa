import React from "react";
import confettiAnimation from "../../images/confetti.gif";
import present from "../../images/present-bouncing.gif";
import reindeer from "../../images/reindeer.gif";
import santa from "../../images/santa-sled2.gif";
import { Messages } from "primereact/messages";
import { useAppQuery } from "../../redux/hooks";
import Header from "../common/Header";
import Snowfall from "react-snowfall";
import { encryptString, getFormattedDate } from "../../common/util";
import { FORM_ONE, FORM_TWO, FieldType } from "../common/Forms";
import { SelectedForm } from "../../types/FormTypes";
import { useGetGroupByIdQuery, useSendMessageMutation } from "../../redux/api";
import { skipToken } from "@reduxjs/toolkit/query";
import { FormProvider, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const SecretSanta = (): JSX.Element => {
    const [displayResult, setDisplayResult] = React.useState(false);
    const [displaySanta, setDisplaySanta] = React.useState(false);
    const [hasClicked, setHasClicked] = React.useState(false);
    const message = React.useRef<Messages>(null);
    const methods = useForm();

    const decryptString = (stringToDecript: string | null): string => {
        if (stringToDecript === null) {
            return "Sorry, that user was not found.";
        }
        return atob(stringToDecript);
    };

    const query = useAppQuery();

    const formType = query.get("formType")
        ? (decryptString(query.get("formType")) as SelectedForm)
        : "form-one";

    const form = formType === "form-one" ? FORM_ONE : FORM_TWO;

    const secretSanta = query.get("name");
    const assignee = decryptString(query.get("selected"));
    const budget = decryptString(query.get("budget"));
    const currencySymbol = decryptString(query.get("currency"));
    const date = decryptString(query.get("date"));
    const groupId = query.get("groupId");
    const { data } = useGetGroupByIdQuery(groupId ?? skipToken);
    const memberData = data?.members.filter((member) => member.name === assignee)[0];
    const [sendMessage] = useSendMessageMutation();

    const decryptUrl = (wishlist: string | null): string => {
        if (wishlist === null || wishlist.length === 0) {
            return "";
        }

        return atob(wishlist);
    };

    const openUrl = (newUrl: string): void => {
        setDisplaySanta(true);
        message?.current?.show([
            {
                severity: "success",
                summary: "",
                detail: `Santa is now getting URL for ${assignee}"s`,
                sticky: true,
            },
        ]);
        setTimeout(() => {
            setDisplaySanta(false);
            window.open(newUrl, "_blank");
        }, 3000);
    };

    const playPresentAnimation = () => {
        setHasClicked(true);
        setTimeout(() => {
            setHasClicked(false);
            setDisplayResult(true);
        }, 1050);
    };

    const createDetailField = (label: string, content: string): JSX.Element => {
        return (
            <div className="d-flex flex-column mt-2" key={label}>
                <p className="text-muted mb-0">{label}</p>
                <p>
                    <b>{content}</b>
                </p>
            </div>
        );
    };

    const onSubmit = (data) => sendResponse(data);

    const sendResponse = ({ question }: { question: string }) => {
        const url: URL = new URL("http://localhost:3000/secretSantaMessage/");
        url.searchParams.append("type", "send-response");
        url.searchParams.append("message", encryptString(question));

        const assignedMember = data?.members.filter(
            (member) => member.name === assignee,
        )[0];

        if (assignedMember) {
            url.searchParams.append("email", encryptString(assignedMember.email));

            sendMessage({
                message: question,
                email: assignedMember.email,
                subject: "You recieved a question from your Secret Santa!",
                url: url.toString(),
                type: "question",
            });

            message?.current?.show([
                {
                    severity: "success",
                    summary: "",
                    detail: "Successfully sent message",
                    life: 3000,
                },
            ]);
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
                        {displayResult && (
                            <div>
                                <div className="text-center border-bottom">
                                    <p>
                                        Ho Ho Ho <b>{secretSanta}</b>!
                                    </p>
                                    <p>
                                        You are <b>{assignee}</b>
                                        {`'s Secret Santa!`}
                                    </p>
                                </div>
                                <p className="mt-2">
                                    Details for <b>{assignee}</b>:
                                </p>
                                {budget !== "" &&
                                    createDetailField(
                                        "The budget is",
                                        currencySymbol + budget,
                                    )}

                                {date !== "" &&
                                    createDetailField(
                                        " The gift exchange will be held on",
                                        getFormattedDate(date),
                                    )}

                                {form
                                    .filter((field) => field.name !== "name")
                                    .map((field) => {
                                        const value = memberData?.[field.name];

                                        if (value && value.length > 0) {
                                            if (
                                                field.fieldType === FieldType.TEXT ||
                                                field.fieldType === FieldType.TEXT_AREA
                                            ) {
                                                return createDetailField(
                                                    field.label,
                                                    value,
                                                );
                                            }

                                            if (field.fieldType === FieldType.COLOR) {
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
                                                                backgroundColor:
                                                                    "#" + value,
                                                                width: "1.5rem",
                                                                height: "1.5rem",
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            }

                                            if (field.fieldType === FieldType.URL) {
                                                const url = decryptUrl(
                                                    query.get(field.name),
                                                );

                                                return (
                                                    <div
                                                        className="d-flex mt-2"
                                                        key={field.name}
                                                    >
                                                        <i className="pi pi-external-link me-2 mt-1" />
                                                        <p>
                                                            {field.label}
                                                            <b
                                                                className="text-primary"
                                                                onClick={() =>
                                                                    openUrl(url)
                                                                }
                                                            >
                                                                Open URL
                                                            </b>
                                                        </p>
                                                    </div>
                                                );
                                            }
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
                                <div className="text-center">
                                    <p>
                                        Have a question for your assigned person? Send
                                        them an anonomous message below. You will recieve
                                        an email once they have replied!
                                    </p>
                                </div>

                                <FormProvider {...methods}>
                                    <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                                        >
                                            Send
                                        </Button>
                                    </form>
                                </FormProvider>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <img
                    src={santa}
                    id={displaySanta ? "santa" : "santa-hidden"}
                    alt="santa"
                />
            </div>
            <Snowfall color="white" />
        </div>
    );
};

export default SecretSanta;
