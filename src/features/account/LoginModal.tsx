import React from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import type { LoginPayload } from "../../common/types";
import { useLoginUserMutation } from "../../redux/api";
import { useAppDispatch } from "../../redux/hooks";
import { setSignInStatus } from "../../redux/membersSlice";

interface Props {
    isVisible: boolean;
    renderRegisterModal: () => void;
    onHide: () => void;
}

const LoginModal = (props: Props): JSX.Element => {
    const [isEmailValid, setIsEmailValid] = React.useState(true);
    const [isPasswordValid, setIsPasswordValid] = React.useState(true);
    const [formData, setFormData] = React.useState<LoginPayload>({
        email: "",
        password: "",
    });
    const dispatch = useAppDispatch();
    const [loginUser, { isError, data }] = useLoginUserMutation();

    React.useEffect(() => {
        if (!isError && data?.data !== undefined) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("currentUser", data.data.currentUser);
            dispatch(setSignInStatus(true));
            props.onHide();
        }
    }, [isError, data, history]);

    const onSubmit = () => {
        verifyEmail();
        setIsPasswordValid(formData.password.length >= 6);

        if (isEmailValid && isPasswordValid) {
            loginUser(formData);
        }
    };

    const updateFormData = (name: keyof LoginPayload, value: string) => {
        const _formData = { ...formData };
        _formData[name] = value;
        setFormData(_formData);
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

    const verifyEmail = () => {
        const emailIsValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
            formData.email,
        );
        setIsEmailValid(emailIsValid);
    };

    return (
        <Dialog header="Login" visible={props.isVisible} onHide={props.onHide}>
            <div className="p-grid p-fluid col">
                <div className="p-field">
                    <label htmlFor="name">Email Address</label>
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
                            onChange={(e) => updateFormData("password", e.target.value)}
                            toggleMask
                            required
                            feedback={false}
                        />
                    </div>
                    {createErrorMessage(
                        isPasswordValid,
                        "Password must be at least 6 characters long.",
                    )}
                </div>

                <div className="d-flex align-items-center mt-2 mb-2">
                    <button className="btn btn-primary w-100" onClick={onSubmit}>
                        Login
                    </button>
                </div>

                <div>
                    <p>
                        {`Don't have an account? Click`}
                        <span
                            className="text-primary register-link"
                            onClick={() => props.renderRegisterModal()}
                        >
                            {` here `}
                        </span>
                        to register.
                    </p>
                </div>
            </div>
        </Dialog>
    );
};

export default LoginModal;
