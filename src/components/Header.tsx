import React from "react";
import { Avatar } from "primereact/avatar";
import santaImage from "../images/santa.svg";
import { useHistory } from "react-router-dom";
import { Menu } from "primereact/menu";
import AccountModals from "../features/account/AccountModals";
import { Button } from "primereact/button";
import "bootstrap/dist/css/bootstrap.min.css";
import { MenuItem } from "primereact/menuitem";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMembersList } from "../redux/membersSlice";
import { setGroups } from "../features/group/groupSlice";
import { setSignInStatus } from "../appSlice";
import { useGetUserByIdQuery } from "../redux/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const Header = (): JSX.Element => {
    const menu = React.useRef<Menu>(null);
    const history = useHistory();
    const [showModal, setShowModal] = React.useState(false);
    const isUserSignedIn = useAppSelector((state) => state.app.isUserSignedIn);
    const currentLocation = window.location.pathname;
    const isOnHomePage = currentLocation === "/";
    const dispatch = useAppDispatch();

    const { data } = useGetUserByIdQuery(
        localStorage.getItem("currentUser") ?? skipToken,
    );

    const getMenuItems = (): MenuItem[] => {
        const items = [
            {
                label: "Manage Groups",
                icon: "pi pi-users",
                command: () => history.push("/groups"),
            },
            {
                label: "Create Group",
                icon: "pi pi-plus",
                command: () => history.push("/"),
            },
        ];

        items.push({
            label: "Logout",
            icon: "pi pi-sign-out",
            command: () => {
                dispatch(setGroups([]));
                dispatch(setSignInStatus(false));
                localStorage.clear();
                history.push("/");
            },
        });

        if (data !== undefined) {
            items.unshift({
                label: `${data.firstName} ${data.lastName}`,
                icon: "pi pi-user",
                command: () => history.push("/"),
            });
        }
        return items;
    };

    return (
        <>
            <div className="row justify-content-end">
                <div className="col-md-2 col-lg-4 col-sm-8 mt-2 d-inline-flex justify-content-end">
                    <Button
                        label="Home"
                        className={`p-button p-button-danger me-2 h-50 mt-3 ${
                            isOnHomePage ? "" : "p-button-outlined"
                        }`}
                        onClick={() => history.push("/")}
                    />
                    <Button
                        label="Groups"
                        className={`p-button p-button-danger me-2 h-50  mt-3 ${
                            currentLocation === "/groups" ? "" : "p-button-outlined"
                        }`}
                        onClick={() => history.push("/groups")}
                    />
                    <Button
                        label="FAQ"
                        className={`p-button p-button-danger h-50 mt-3 ${
                            currentLocation === "/faq" ? "" : "p-button-outlined"
                        }`}
                        onClick={() => history.push("/faq")}
                    />
                    <Menu model={getMenuItems()} popup ref={menu} id="popup-menu" />
                    <Avatar
                        icon="pi pi-user"
                        className="m-2"
                        size="large"
                        shape="circle"
                        onClick={(e) =>
                            localStorage.getItem("currentUser") !== null
                                ? menu.current?.toggle(e)
                                : setShowModal(!showModal)
                        }
                        aria-controls="popup-menu"
                        aria-haspopup
                    />
                </div>
            </div>
            <div className="row justify-content-center text-center">
                <img
                    src={santaImage}
                    alt="Santa"
                    style={{ width: "6rem", marginTop: "2rem" }}
                />
                <h3>
                    <b>Secret Santa Generator</b>
                </h3>
            </div>
            <AccountModals isVisible={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

export default Header;
