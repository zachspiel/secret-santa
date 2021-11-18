import React from "react";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { shuffleArray } from "../../../common/util";
import { setMembersList } from "../../../redux/membersSlice";

interface Props {
    setError: (error: string) => void;
    createToast: (message: string, summary: string, severity: string) => void;
}

const GenerateList = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const dispatch = useAppDispatch();
    const { setError } = props;

    React.useEffect(() => {
        if (members.length > 0 && members.length < 3) {
            setError("Please add at least three members to create a group.");
        } else {
            setError("");
            shuffleArray(members);
        }
    }, [members, setError]);

    const generateList = () => {
        const _members = [...members];
        const santaList = shuffleArray(_members);

        _members.forEach((member, index) => {
            _members[index] = { ...member, assignedTo: santaList[index].name };
        });

        props.createToast("Group successfully re-shuffled", "Success", "success");
        dispatch(setMembersList(_members));
    };

    return (
        <Button
            label="Re-shuffle list"
            className="p-button-text"
            onClick={() => generateList()}
            disabled={members.length < 3}
        />
    );
};

export default GenerateList;
