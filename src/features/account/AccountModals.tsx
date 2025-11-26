import React, { type ReactElement } from "react";
import type { ModalTypes } from "../../common/types";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

interface Props {
    isVisible: boolean;
    onHide: () => void;
}

const AccountModals = (props: Props): ReactElement => {
    const [currentModal, setCurrentModal] = React.useState<ModalTypes>("LOGIN_MODAL");

    const getCurrentModal = (): ReactElement => {
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
