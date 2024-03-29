import React from "react";
import { Avatar } from "primereact/avatar";
import santaImage from "../../images/santa.svg";
import { useNavigate } from "react-router-dom";
import { Menu } from "primereact/menu";
import AccountModals from "../account/AccountModals";
import { Button } from "primereact/button";
import "bootstrap/dist/css/bootstrap.min.css";
import { MenuItem } from "primereact/menuitem";
import { useAppDispatch } from "../../redux/hooks";
import { setGroups } from "../group/groupSlice";
import { setSignInStatus } from "../../appSlice";
import { useGetUserByIdQuery } from "../../redux/api";
import { skipToken } from "@reduxjs/toolkit/dist/query";

const Header = (): JSX.Element => {
    const menu = React.useRef<Menu>(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = React.useState(false);
    const currentLocation = window.location.pathname;
    const isOnHomePage = currentLocation === "/";
    const dispatch = useAppDispatch();

    const { data } = useGetUserByIdQuery(
        localStorage.getItem("currentUser") ?? skipToken,
    );

    const getMenuItems = (): MenuItem[] => {
        const items: MenuItem[] = [
            {
                label: "Manage Groups",
                icon: "pi pi-users",
                command: () => navigate("/groups"),
            },
            {
                label: "Create Group",
                icon: "pi pi-plus",
                command: () => navigate("/"),
            },
            {
                label: "Logout",
                icon: "pi pi-sign-out",
                command: () => {
                    dispatch(setGroups([]));
                    dispatch(setSignInStatus(false));
                    localStorage.clear();
                    navigate("/");
                },
            },
        ];

        if (data !== undefined) {
            items.unshift({
                label: `${data.firstName} ${data.lastName}`,
                icon: "pi pi-user",
            });
        }
        return items;
    };

    return (
        <>
            <div className="row justify-content-end">
                <div className="col-md-6 col-sm-8 mt-2 d-inline-flex justify-content-end">
                    <Button
                        label="Home"
                        className={`p-button p-button-danger me-2 h-50 mt-3 ${
                            isOnHomePage ? "" : "p-button-outlined"
                        }`}
                        onClick={() => navigate("/")}
                    />
                    <Button
                        label="Groups"
                        className={`p-button p-button-danger me-2 h-50  mt-3 ${
                            currentLocation === "/groups" ? "" : "p-button-outlined"
                        }`}
                        onClick={() => navigate("/groups")}
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
                    style={{ width: "6rem", marginTop: "1rem" }}
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
