import React, { useState } from "react";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import type { RegisterPayload } from "../../common/types";
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import { useRegisterUserMutation } from "../../redux/api";
import { useAppDispatch } from "../../redux/hooks";
import { setSignInStatus } from "../../appSlice";

interface Props {
    isVisible: boolean;
    renderLoginModal: () => void;
    onHide: () => void;
}

const RegisterModal = (props: Props): JSX.Element => {
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isPasswordEqual, setIsPasswordEqual] = useState(true);
    const [passwordCopy, setPasswordCopy] = useState("");
    const [formData, setFormData] = useState<RegisterPayload>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const dispatch = useAppDispatch();
    const [registerUser, { isError, data }] = useRegisterUserMutation();
    const { isVisible, renderLoginModal, onHide } = props;
    const isValid =
        isFirstNameValid &&
        isLastNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isPasswordEqual;

    const onSubmit = () => {
        verifyFormData();

        if (isValid) {
            registerUser(formData);
        }
    };

    React.useEffect(() => {
        if (!isError && data?.data !== undefined) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("currentUser", data.data.currentUser);
            dispatch(setSignInStatus(true));
            onHide();
        }
    }, [dispatch, isError, data, onHide]);

    const updateFormData = (name: keyof RegisterPayload, value: string) => {
        const _formData = { ...formData };
        _formData[name] = value;
        setFormData(_formData);
    };

    const verifyFormData = () => {
        verifyEmail();
        verifyPassword();
        setIsFirstNameValid(formData.firstName.length >= 3);
        setIsLastNameValid(formData.lastName.length >= 3);
    };

    const createErrorMessage = (isValid: boolean, message: string) => {
        if (!isValid) {
            return (
                <small id="email-help" className="p-error p-d-block">
                    {message}
                </small>
            );
        }
    };

    const verifyPassword = () => {
        setIsPasswordValid(formData.password.length >= 6);
        setIsPasswordEqual(formData.password === passwordCopy);
    };

    const verifyEmail = () => {
        const emailIsValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
            formData.email,
        );
        setIsEmailValid(emailIsValid);
    };

    return (
        <Dialog header="Register" onHide={() => onHide} visible={isVisible}>
            <div className="p-grid p-fluid col">
                <div className="p-field">
                    <label htmlFor="name">First Name</label>
                    <div className="p-inputgroup">
                        <InputText
                            id="firstName"
                            value={formData.firstName}
                            placeholder="Enter First name"
                            onChange={(e) => {
                                updateFormData("firstName", e.target.value);
                            }}
                            required
                            autoFocus
                        />
                    </div>
                    {createErrorMessage(
                        isFirstNameValid,
                        "First Name must be at least 3 characters long.",
                    )}
                </div>
                <div className="p-field mb-2">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="p-inputgroup">
                        <InputText
                            id="lastName"
                            value={formData.lastName}
                            placeholder="Enter last name"
                            onChange={(e) => {
                                updateFormData("lastName", e.target.value);
                            }}
                            required
                            autoFocus
                        />
                    </div>
                    {createErrorMessage(
                        isLastNameValid,
                        "Last Name must be at least 3 characters long.",
                    )}
                </div>

                <div className="p-field mb-2">
                    <label htmlFor="email">Email Address</label>
                    <div className="p-inputgroup">
                        <InputText
                            id="email"
                            value={formData.email}
                            placeholder="Enter email address"
                            onChange={(e) => {
                                updateFormData("email", e.target.value);
                            }}
                            required
                        />
                    </div>
                    {createErrorMessage(isEmailValid, "Email is not valid.")}
                </div>
                <div className="p-field">
                    <label htmlFor="password">Password</label>
                    <div className="p-inputgroup">
                        <Password
                            id="password"
                            value={formData.password}
                            placeholder="Enter password"
                            onChange={(e) => {
                                updateFormData("password", e.target.value);
                            }}
                            toggleMask
                            required
                        />
                    </div>
                    {createErrorMessage(
                        isPasswordValid,
                        "Password must be at least 6 characters long.",
                    )}
                </div>
                <div className="p-field">
                    <label htmlFor="passwordCopy">Repeat Password</label>
                    <div className="p-inputgroup">
                        <Password
                            id="passwordCopy"
                            value={passwordCopy}
                            placeholder="Repeat password"
                            onChange={(e) => {
                                setPasswordCopy(e.target.value);
                            }}
                            toggleMask
                            feedback={false}
                            required
                        />
                    </div>
                    {createErrorMessage(isPasswordEqual, "Password must match.")}
                </div>
                {data?.error && (
                    <Message
                        severity="error"
                        className="mb-2 mt-2"
                        text={data?.error ?? "Error while registring user."}
                    />
                )}
                <div className="d-flex align-items-center mt-2 mb-2">
                    <button className="btn btn-primary w-100" onClick={onSubmit}>
                        Register
                    </button>
                </div>

                <div>
                    <p>
                        Already have an account? Click
                        <span
                            className="text-primary register-link"
                            onClick={() => renderLoginModal}
                        >
                            {` here `}
                        </span>
                        here to login.
                    </p>
                </div>
            </div>
        </Dialog>
    );
};

export default RegisterModal;
