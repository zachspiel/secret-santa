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
import { useHistory } from "react-router";
import AccountModals from "../../account/AccountModals";

interface Props {
    createToast: (message: string, summary: string, severity: string) => void;
}

interface CurrencyOptions {
    name: string;
    value: string;
}

const CreateGroup = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const isSignedIn = useAppSelector((state) => state.app.isUserSignedIn);
    const [showSignIn, setShowSignIn] = React.useState(false);
    const [newGroupName, setNewGroupName] = React.useState("");
    const [date, setDate] = React.useState("");
    const [selectedCurrency, setSelectedCurrency] = React.useState("US$");
    const [budget, setBudget] = React.useState("");
    const currentYear = new Date().getFullYear();
    const [saveGroup, { isSuccess, isError }] = useInsertGroupMutation();
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { createToast } = props;

    React.useEffect(() => {
        if (isSuccess) {
            createToast("Group successfully created.", "Success", "success");
            dispatch(setMembersList([]));
            setNewGroupName("");
            setDate("");
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

    const onSaveGroup = () => {
        const _members: GroupMember[] = [];

        members.forEach((member, index) => {
            const assignedMemberIndex = findIndexById(members[index].assignedTo, members);
            const assignedMember = members[assignedMemberIndex];

            const inviteLink = createUrl(
                members[index],
                assignedMember,
                selectedCurrency,
                budget,
                date,
            );
            _members.push({
                ...member,
                inviteLink: inviteLink,
            });
        });

        if (newGroupName.length !== 0) {
            const group: Group = {
                _id: "",
                createdBy: localStorage.getItem("currentUser") ?? "",
                name: newGroupName,
                members: [..._members],
            };

            if (date.length > 0) {
                group.date = date;
            }

            if (budget.length > 0) {
                group.currencySymbol = selectedCurrency;
                group.budget = budget;
            }

            saveGroup(group);
        }
    };

    return (
        <div className="row mt-3 justify-content-center">
            <div
                className="col-md-5 col-sm-6 text-start mb-3 p-5"
                style={{ zIndex: 1000 }}
            >
                <h6>Group name</h6>
                <InputText
                    value={newGroupName}
                    placeholder={"Enter name for group"}
                    className="w-100"
                    onChange={(e) => setNewGroupName(e.target.value)}
                />
                <h6 className="mt-2">
                    Budget
                    <span className="text-muted">- optional</span>
                </h6>
                <div className="d-flex">
                    <Dropdown
                        value={selectedCurrency}
                        options={getCurrencySymbols()}
                        onChange={(e) => setSelectedCurrency(e.value)}
                        optionLabel="name"
                        placeholder="Select a currency"
                    />
                    <InputText
                        value={budget}
                        placeholder={"Enter budget"}
                        className="w-75 ms-2"
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>
                <h6 className="mt-2">
                    Date of gift exchange
                    <span className="text-muted">- optional</span>
                </h6>
                <Calendar
                    id="icon"
                    dateFormat="yy-mm-dd"
                    placeholder="Select date"
                    className="w-100 mb-2"
                    value={new Date(date)}
                    onChange={(e) => setDate(e.value?.toString() ?? "")}
                    monthNavigator
                    yearNavigator
                    yearRange={`1990:${currentYear}`}
                    showIcon
                />
                <Button
                    label="Save"
                    onClick={() => (isSignedIn ? onSaveGroup() : setShowSignIn(true))}
                    disabled={newGroupName.length === 0}
                />

                {isSuccess && (
                    <Button
                        className="p-button-outlined ms-2"
                        label="Go to new group"
                        onClick={() => history.push("/groups")}
                    />
                )}

                <AccountModals
                    isVisible={showSignIn}
                    onHide={() => setShowSignIn(false)}
                />
            </div>
        </div>
    );
};

export default CreateGroup;
