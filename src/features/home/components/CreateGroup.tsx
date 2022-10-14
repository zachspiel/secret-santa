/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Group, GroupMember } from "../../../common/types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { createUrl, findIndexById, getAllAvailableCurrency } from "../../../common/util";
import { useInsertGroupMutation } from "../../../redux/api";
import { Dropdown } from "primereact/dropdown";
import { setMembersList } from "../../../redux/membersSlice";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router";
import AccountModals from "../../account/AccountModals";
import { Formik } from "formik";
import { object, string } from "yup";
import { ToastSeverityType } from "primereact/toast";

interface Props {
    createToast: (message: string, summary: string, severity: ToastSeverityType) => void;
}

interface CurrencyOptions {
    name: string;
    value: string;
}

interface GroupPayload {
    groupName: string;
    date: string;
    currency: string;
    budget: string;
}

const CreateGroup = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const isSignedIn = useAppSelector((state) => state.app.isUserSignedIn);
    const [showSignIn, setShowSignIn] = React.useState(false);
    const currentYear = new Date().getFullYear();
    const [saveGroup, { isSuccess, isError }] = useInsertGroupMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { createToast } = props;

    const initialValues: GroupPayload = {
        groupName: "",
        date: "",
        currency: "US$",
        budget: "",
    };

    const groupValidationSchema = object().shape({
        groupName: string().trim().required("Group is required."),
        date: string().trim().optional(),
        currency: string().trim().optional(),
        budget: string().trim().optional(),
    });

    React.useEffect(() => {
        if (isSuccess) {
            createToast("Group successfully created.", "Success", "success");
            dispatch(setMembersList([]));
        }
    }, [dispatch, isSuccess]);

    React.useEffect(() => {
        if (isError) {
            createToast(
                "Group cannot be created. Please try again later.",
                "Error",
                "error",
            );
        }
    }, [isError]);

    const getCurrencySymbols = (): CurrencyOptions[] => {
        const availableCurrency = getAllAvailableCurrency();
        const currencyOptions: CurrencyOptions[] = [];

        availableCurrency.forEach((currency) => {
            currencyOptions.push({ name: currency, value: currency });
        });

        return currencyOptions;
    };

    const onSaveGroup = (values: GroupPayload) => {
        console.log("gere");
        const _members: GroupMember[] = members.map((member, index) => {
            const assignedMemberIndex = findIndexById(members[index].assignedTo, members);
            const assignedMember = members[assignedMemberIndex];

            const inviteLink = createUrl(
                members[index],
                assignedMember,
                values.currency,
                values.budget,
                values.date,
            );
            return {
                ...member,
                inviteLink: inviteLink,
            };
        });

        const group: Group = {
            _id: "",
            createdBy: localStorage.getItem("currentUser") ?? "",
            name: values.groupName,
            members: [..._members],
        };

        saveGroup(group);
    };

    return (
        <div className="row mt-3 justify-content-center">
            <div
                className="col-md-5 col-sm-6 text-start mb-3 p-5"
                style={{ zIndex: 1000 }}
            >
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        console.log(values);
                        isSignedIn ? onSaveGroup(values) : setShowSignIn(true);
                    }}
                    validationSchema={groupValidationSchema}
                >
                    {(props) => (
                        <form onSubmit={props.handleSubmit}>
                            <h6>Group name</h6>
                            <InputText
                                value={props.values.groupName}
                                id="groupName"
                                placeholder={"Enter name for group"}
                                className="w-100"
                                onChange={props.handleChange}
                            />
                            <h6 className="mt-2">
                                Budget
                                <span className="text-muted">- optional</span>
                            </h6>
                            <div className="d-flex">
                                <Dropdown
                                    id="currency"
                                    value={props.values.currency}
                                    options={getCurrencySymbols()}
                                    optionLabel="name"
                                    placeholder="Select a currency"
                                    onChange={props.handleChange}
                                />
                                <InputText
                                    id="budget"
                                    value={props.values.budget}
                                    placeholder={"Enter budget"}
                                    className="w-100 ms-2"
                                    onChange={props.handleChange}
                                />
                            </div>
                            <h6 className="mt-2">
                                Date of gift exchange
                                <span className="text-muted">- optional</span>
                            </h6>
                            <Calendar
                                inputId="date"
                                dateFormat="yy-mm-dd"
                                placeholder="Select date"
                                className="w-100 mb-2"
                                value={new Date(props.values.date)}
                                onChange={props.handleChange}
                                monthNavigator
                                yearNavigator
                                yearRange={`1990:${currentYear}`}
                                showIcon
                            />
                            <div className="d-flex">
                                <Button label="Create Group" type="submit" />
                                {isSuccess && (
                                    <Button
                                        className="p-button-outlined ms-2"
                                        label="Go to new group"
                                        onClick={() => navigate("/groups")}
                                    />
                                )}
                            </div>
                        </form>
                    )}
                </Formik>

                <AccountModals
                    isVisible={showSignIn}
                    onHide={() => setShowSignIn(false)}
                />
            </div>
        </div>
    );
};

export default CreateGroup;
