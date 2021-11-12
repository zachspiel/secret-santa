import React from "react";
import type { ModalTypes } from "../../common/types";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

interface Props {
    isVisible: boolean;
    onHide: () => void;
}

const AccountModals = (props: Props): JSX.Element => {
    const [currentModal, setCurrentModal] = React.useState<ModalTypes>("LOGIN_MODAL");

    const getCurrentModal = (): JSX.Element => {
        switch (currentModal) {
            case "REGISTER_MODAL":
                return (
                    <RegisterModal
                        renderLoginModal={() => setCurrentModal("LOGIN_MODAL")}
                        isVisible={currentModal === "REGISTER_MODAL" && props.isVisible}
                        onHide={() => props.onHide()}
                    />
                );
            default:
                return (
                    <LoginModal
                        renderRegisterModal={() => setCurrentModal("REGISTER_MODAL")}
                        isVisible={currentModal === "LOGIN_MODAL" && props.isVisible}
                        onHide={() => props.onHide()}
                    />
                );
        }
    };
    return getCurrentModal();
};

export default AccountModals;
