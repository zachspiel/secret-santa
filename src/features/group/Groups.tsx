import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { Card } from "primereact/card";
import Header from "../../components/Header";
import { Button } from "primereact/button";
import EditGroup from "./EditGroup";

const Groups = (): JSX.Element => {
  const groups = useAppSelector((state) => state.groups.groups);
  const [editingGroupIndex, setEditingGroupIndex] = React.useState(-1);

  return (
    <div className="container-fluid text-center">
      <Header />
      <h3>Groups</h3>
      <div className="row justify-content-center">
        {groups.map((group, index) => {
          if (editingGroupIndex !== index) {
            return (
              <div className="col-2" key={index}>
                <Card key={index} footer={<Button icon="pi pi-pencil" label="edit" />}>
                  <div className="text-start">
                    <p>Name: {group.name}</p>
                    <p>Members</p>
                    {group.members.map((member, index) => {
                      return <li key={index}>{member.name}</li>;
                    })}
                  </div>
                </Card>
              </div>
            );
          } else {
            return <EditGroup group={group} />
          }
        })}
        {groups.length === 0 && <Card header="No Groups Available"></Card>}
      </div>
    </div>
  );
};

export default Groups;
