import React from "react";
import { MultiSelect } from "primereact/multiselect";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { MenuItem } from "primereact/menuitem";
import { InputSwitch } from "primereact/inputswitch";
import { setExclusions } from "../../../redux/membersSlice";
import { GroupMember } from "../../../common/types";
import { Button } from "primereact/button";

const Exclusions = (): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const exclusions = useAppSelector((state) => state.members.exclusions);
    const [enableExclusions, setEnableExclusions] = React.useState(false);
    const dispatch = useAppDispatch();

    const getOptions = (filteredMembers: GroupMember[]): MenuItem[] => {
        const items: MenuItem[] = [];

        filteredMembers.forEach((member) =>
            items.push({ name: member.name, value: member.name }),
        );

        return items;
    };

    return (
        <div className="row justify-content-center mt-3">
            <div className="col-md-2 col-sm-6 text-start border p-3">
                <p>
                    An exclusion indicates who may <b>not</b> draw whom.
                </p>
                {members.length >= 6 && (
                    <div className="d-flex mb-3">
                        <p className="mb-0 me-2">Enable Exclusions</p>
                        <InputSwitch
                            checked={enableExclusions}
                            onChange={(e) => setEnableExclusions(e.value)}
                        />
                    </div>
                )}
                {members.length < 6 && (
                    <>
                        <p>Your group is too small for exclusions.</p>
                        <Button label="Next step" className="p-button-rounded" />
                    </>
                )}

                {members.map((member, index) => {
                    if (enableExclusions && members.length >= 6) {
                        const availableOptions = members.filter(
                            (option) => option.name !== member.name,
                        );

                        const options = getOptions(availableOptions);
                        return (
                            <div key={index} className="d-flex flex-column">
                                <h5 className="text-wrap">{member.name}</h5>
                                <MultiSelect
                                    value={exclusions[index]}
                                    options={options}
                                    display="chip"
                                    className="w-100"
                                    onChange={(e) => {
                                        const _exclusions = [...exclusions];
                                        _exclusions[index] = e.value;
                                        dispatch(setExclusions(_exclusions));
                                    }}
                                    optionLabel="name"
                                    placeholder="Select a name"
                                    maxSelectedLabels={availableOptions.length - 3}
                                />
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default Exclusions;
