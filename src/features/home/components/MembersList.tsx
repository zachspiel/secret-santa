import React from "react";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { removeMember, setMembersList } from "../../../redux/membersSlice";
import { Tooltip } from "primereact/tooltip";
import { InputSwitch } from "primereact/inputswitch";
import { Toolbar } from "primereact/toolbar";
import "../scss/styles.scss";
import GenerateList from "./GenerateList";
import GroupTable from "../../groupTable/GroupTable";
import CreateGroup from "./CreateGroup";
import { InputText } from "primereact/inputtext";

interface Props {
    createToast: (message: string, summary: string, severity: string) => void;
    setError: (error: string) => void;
}

const MembersList = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const isUserSignedIn = useAppSelector((state) => state.app.isUserSignedIn);
    const [showNewGroupInput, setShowNewGroupInput] = React.useState(false);
    const [displaySecretSantas, setDisplaySecretSantas] = React.useState(false);
    const dispatch = useAppDispatch();
    const { createToast, setError } = props;

    const rightToolbarTemplate = () => {
        return (
            <>
                <span>Show Secret Santas</span>
                <InputSwitch
                    name="toggle"
                    className="ms-2"
                    checked={displaySecretSantas}
                    onChange={(e) => setDisplaySecretSantas(e.value)}
                />
                <Tooltip target=".pi-question-circle" />
                <i
                    className="pi pi-question-circle d-flex align-self-end mb-2 ms-2 me-0"
                    data-pr-tooltip="Click on 'Copy invite' to copy a unique url to send to each member in your group. This url will show the member who they are assigned to and include their wishlist."
                    data-pr-position="right"
                />
            </>
        );
    };

    /**
     * 
     *  <GroupTable
                        tableData={members}
                        displaySecretSantas={displaySecretSantas}
                        displayActionColumn={true}
                        createToast={props.createToast}
                        onRemoveMember={(member) => dispatch(removeMember(member))}
                    />
     */
    return (
        <div className="row justify-content-center">
            <div className="col-lg-6 col-md-5 col-sm-6 mt-3" style={{ zIndex: 1000 }}>
                <div className="card p-3 border-0 mb-5">
                    <Toolbar className="p-mb-4" right={rightToolbarTemplate}></Toolbar>

                    {members.map((member, index) => (
                        <div className="d-flex" key={index}>
                            <div className="d-flex justify-content-between">
                                <InputText
                                    value={members[index].name}
                                    placeholder={`Enter member ${index + 1}`}
                                    onChange={(e) => {
                                        const _members = [...members];
                                        _members[index] = {
                                            ..._members[index],
                                            name: e.target.value,
                                        };
                                        dispatch(setMembersList(_members));
                                    }}
                                />
                                <i className="pi pi-times d-flex text-muted mt-2 ms-2" />
                            </div>
                        </div>
                    ))}

                    {!isUserSignedIn && (
                        <h6>To save this group, please sign in above.</h6>
                    )}

                    {isUserSignedIn && (
                        <div className="d-flex justify-content-end pt-3 pb-3">
                            <GenerateList setError={setError} createToast={createToast} />
                            <Button
                                label="Save group"
                                className="ms-3"
                                onClick={() => setShowNewGroupInput(true)}
                                disabled={members.length < 3}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MembersList;
