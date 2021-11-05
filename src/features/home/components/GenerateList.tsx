import React from "react";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setSantasList } from "../../../redux/membersSlice";

interface Props {
    setError: (error: string) => void;
}

const GenerateList = (props: Props) => {
    const members = useAppSelector((state) => state.members.membersList);
    const dispatch = useAppDispatch();
    const { setError } = props;

    React.useEffect(() => {
        if (members.length > 0 && members.length < 3) {
            setError("There must be at least three members in a group.");
        } else {
            setError("");
            shuffleArray();
        }
    }, [members, setError]);

    const shuffleArray = () => {
        const _members = [...members];
        for (let index = _members.length - 1; index > 0; index--) {
            const innerIndex = Math.floor(Math.random() * index);
            const temp = _members[index];
            _members[index] = _members[innerIndex];
            _members[innerIndex] = temp;
        }

        dispatch(setSantasList(_members));
    };

    const generateList = () => {
        props.setError("");
        shuffleArray();
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-3 col-sm-6 mt-3">
                <Button
                    label="Generate Secret Santa List"
                    icon="pi pi-refresh"
                    className="p-button-success w-100"
                    onClick={() => generateList()}
                    disabled={members.length < 3}
                />
            </div>
        </div>
    );
};

export default GenerateList;
