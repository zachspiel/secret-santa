import React from "react";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { removeMember } from "../../redux/membersSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Toast } from "primereact/toast";

const MembersList = () => {
  const members = useAppSelector((state) => state.members.membersList);
  const santasList = useAppSelector((state) => state.members.santaList);
  const dispatch = useAppDispatch();
  const toast = React.useRef<Toast>(null);

  const encryptString = (stringToEncrypt: string): string => {
    return btoa(stringToEncrypt);
  };

  const createUrl = (selectedMember: string, assignee: string): string => {
    return `${window.location.hostname
      }:3000/getSecretSanta/?name=${selectedMember}&selected=${encryptString(assignee)}`;
  };

  const displayMessage = () => {
    toast?.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Invite copied successfully",
      life: 3000,
    });
  };
  return (
    <div className="row justify-content-center">
      <div className="col-md-3 col-sm-6 mt-3" style={{ zIndex: 1000 }}>
        <div className="card p-3 border-0">
          <Toast ref={toast} />
          {members.map((member, index) => (
            <div className="d-flex justify-content-between" key={index}>
              <p>
                {index + 1}
                <span className="ms-3">{member}</span>
              </p>

              {santasList.length === 0 && (
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger p-button-text"
                  onClick={() => dispatch(removeMember(member))}
                />
              )}

              {santasList.length > 0 && (
                <>
                  <CopyToClipboard
                    text={createUrl(members[index], santasList[index])}
                    onCopy={displayMessage}
                  >
                    <Button label="Copy invite" className="p-button-text" />
                  </CopyToClipboard>
                </>
              )}
            </div>
          ))}
          <hr />
          <h6>To save this group, please sign in above.</h6>
        </div>
      </div>
    </div>
  );
};

export default MembersList;
