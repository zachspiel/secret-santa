import React from "react";
import { InputText } from "primereact/inputtext";
import { useAppDispatch } from "../../redux/hooks";
import { addMember } from "../../redux/membersSlice";
import { Button } from "primereact/button";

interface Props {
  members: string[];
  error: string;
}

const AddPersonForm = (props: Props) => {
  const dispatch = useAppDispatch();
  const [newMember, setNewMember] = React.useState("");
  const [newMemberWishList, setNewMemberWishList] = React.useState("");
  const [error, setError] = React.useState("");

  const insertMember = () => {
    if (newMember.trim().length === 0) {
      setError("Please enter a valid name.");
    } else if (props.members.includes(newMember)) {
      setError("That person already exists.");
    } else {
      const strippedString = newMember.replace(/[^a-zA-Z ]/g, "");
      setNewMember("");
      setError("");
      dispatch(addMember(strippedString));
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-3 col-sm-6 mt-3" style={{ zIndex: 1000 }}>
        <div className="p-inputgroup">
          <InputText
            placeholder="Add person"
            value={newMember}
            className={`${error.length > 0 ? "p-invalid" : ""}`}
            onChange={(e) => setNewMember(e.target.value)}
          />
          <InputText
            placeholder="Add wish list (optional)"
            value={newMemberWishList}
            className={`${error.length > 0 ? "p-invalid" : ""}`}
            onChange={(e) => setNewMemberWishList(e.target.value)}
          />

          <Button icon="pi pi-plus" onClick={insertMember} />
        </div>
        {error.length > 0 && <small className="p-error d-block">{error}</small>}
        {props.error.length > 0 && (
          <small className="p-error d-block">{props.error}</small>
        )}
      </div>
    </div>
  );
};

export default AddPersonForm;
