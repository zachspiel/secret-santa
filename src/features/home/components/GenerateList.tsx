import React from "react";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setSantasList } from "../../../redux/membersSlice";
import { shuffleArray } from "../../../common/util";

interface Props {
    setError: (error: string) => void;
}

const GenerateList = (props: Props): JSX.Element => {
    const members = useAppSelector((state) => state.members.membersList);
    const dispatch = useAppDispatch();
    const { setError } = props;

    React.useEffect(() => {
        if (members.length > 0 && members.length < 3) {
            setError("There must be at least three members in a group.");
        } else {
            setError("");
        }
    }, [members, setError]);

    const generateList = () => {
        props.setError("");

        dispatch(setSantasList(shuffleArray(members)));
    };

    return (
        <Button
            label="Re-shuffle list"
            icon="pi pi-refresh"
            className="p-button-success mb-2"
            onClick={() => generateList()}
            disabled={members.length < 3}
        />
    );
};

export default GenerateList;
