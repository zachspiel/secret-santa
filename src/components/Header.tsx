import React from "react";
import { Avatar } from "primereact/avatar";
import santaImage from "../images/santa.svg";
import { useHistory } from "react-router-dom";
import { Menu } from "primereact/menu";
import AccountModals from "../features/account/AccountModals";
import { Button } from "primereact/button";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = (): JSX.Element => {
    const menu = React.useRef<Menu>(null);
    const history = useHistory();
    const [showModal, setShowModal] = React.useState(false);
    const currentUser = localStorage.getItem("currentUser");
    const currentLocation = window.location.pathname;
    const isOnHomePage = currentLocation === "/";
    const items = [
        {
            label: "Manage Groups",
            icon: "pi pi-users",
            command: () => history.push("/groups"),
        },
        {
            label: "Add Groups",
            icon: "pi pi-plus",
            command: () => history.push("/"),
        },
        // add logout conditionally {label: 'Register', icon: 'pi pi-fw pi-trash'}
    ];

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
                    <Menu model={items} popup ref={menu} id="popup-menu" />
                    <Avatar
                        icon="pi pi-user"
                        className="m-2"
                        size="large"
                        shape="circle"
                        onClick={(e) =>
                            currentUser !== null
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
