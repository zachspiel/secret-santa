import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import { Group } from "../../common/types";

interface Props {
    group: Group;
}

const Footer = (): JSX.Element => {
    return (
        <div>
            <Button label="Cancel" className="p-button-outlined" />
            <Button label="Save" />
        </div>
    );
};

const EditGroup = (props: Props): JSX.Element => {
    return (
        <Card footer={Footer}>
            <div className="text-start">
                <div className="d-flex jusifty-content-between">
                    <p>Name: {props.group.name}</p>
                    <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-text p-button-plain"
                    />
                </div>
                <p>Members</p>
                {props.group.members.map((member, index) => {
                    return (
                        <div className="d-flex justify-content-between" key={index}>
                            <p>
                                {index + 1}
                                <span className="ms-3">{member.name}</span>
                            </p>

                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger p-button-text"
                                onClick={() => console.log(member)}
                            />
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default EditGroup;
