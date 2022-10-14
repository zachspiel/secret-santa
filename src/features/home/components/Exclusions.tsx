import React from "react";
import { MultiSelect } from "primereact/multiselect";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { InputSwitch } from "primereact/inputswitch";
import { setMembersList, toggleEnableExclusions } from "../../../redux/membersSlice";
import { GroupMember } from "../../../common/types";
import { Button } from "primereact/button";
import { setCurrentStep } from "../../../appSlice";
import { getListOfNames, generateDraw } from "../../../common/util";
import { Message } from "primereact/message";
import { ScrollPanel } from "primereact/scrollpanel";

const Exclusions = (): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const enableExclusions = useAppSelector((state) => state.members.enableExclusions);
    const dispatch = useAppDispatch();
    const panelClass =
        members.length >= 6 && enableExclusions ? "border ms-auto me-auto mb-2 p-3" : "";
    const getOptions = (filteredMembers: GroupMember[]) => {
        const items = filteredMembers.map((member: GroupMember) => {
            return { label: member.name, value: member.name };
        });

        return items;
    };

    return (
        <div className="justify-content-center text-start mb-3 p-3">
            <div className="w-100 text-center">
                <p>
                    An exclusion indicates who may <b>not</b> draw whom
                </p>
                {members.length >= 6 && (
                    <div className="d-flex justify-content-center mb-3">
                        <p className="mb-0 me-2">Enable Exclusions</p>
                        <InputSwitch
                            checked={enableExclusions}
                            onChange={(e) => dispatch(toggleEnableExclusions(e.value))}
                        />
                    </div>
                )}
                {members.length < 6 && (
                    <Message
                        severity="info"
                        text="Your group is too small for exclusions. There must be at least 6 people in your group."
                    />
                )}
            </div>

            <ScrollPanel
                style={{
                    width: "70%",
                    height: members.length >= 6 && enableExclusions ? "280px" : "50px",
                }}
                className={panelClass}
            >
                {members.map((member, index) => {
                    if (enableExclusions && members.length >= 6) {
                        const availableOptions = members.filter(
                            (option) => option.name !== member.name,
                        );

                        const options = getOptions(availableOptions);
                        return (
                            <div key={index} className="d-flex flex-column mb-2">
                                <h5 className="text-wrap">{member.name} cannot get:</h5>
                                <MultiSelect
                                    value={member.exclusions}
                                    options={options}
                                    display="chip"
                                    className="w-100 mb-2"
                                    onChange={(e) => {
                                        const _members = [...members];
                                        _members[index] = {
                                            ...members[index],
                                            exclusions: e.value,
                                        };

                                        dispatch(setMembersList(_members));
                                    }}
                                    placeholder="Select a name"
                                    selectionLimit={availableOptions.length - 2}
                                />
                            </div>
                        );
                    }

                    return null;
                })}
            </ScrollPanel>
            <div className="d-flex w-100 justify-content-center">
                <Button
                    label="Back"
                    className="p-button-outlined mb-2 me-2"
                    onClick={() => {
                        dispatch(setCurrentStep(0));
                    }}
                />
                <Button
                    label="Next"
                    className="p-button p-button-sm mb-2"
                    onClick={() => {
                        const _members = [...members];
                        const names = getListOfNames(_members);
                        dispatch(
                            setMembersList(generateDraw(names, [...names], _members)),
                        );
                        dispatch(setCurrentStep(2));
                    }}
                />
            </div>
        </div>
    );
};

export default Exclusions;
