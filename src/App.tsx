import { lazy, Suspense, type ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import Home from "./features/home/Home";
import SelectedPerson from "./features/secretSanta/SecretSanta";
import SecretSantaMessage from "./features/secretSanta/SecretSantaMessage";
import EditMemberForm from "./features/member/EditMemberForm";

const Groups = lazy(() => import("./features/group/Groups"));

const App = (): ReactElement => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/getSecretSanta" element={<SelectedPerson />} />
            <Route path="/secretSantaMessage" element={<SecretSantaMessage />} />
            <Route
                path="/groups"
                element={
                    <Suspense
                        fallback={
                            <div className="container-fluid text-center">
                                <div className="col-md-8 col-sm-12 mb-5 main-content">
                                    <div className="d-flex justify-content-between mt-3">
                                        <Skeleton width="15rem" height="12rem"></Skeleton>
                                        <Skeleton width="15rem" height="12rem"></Skeleton>
                                        <Skeleton width="15rem" height="12rem"></Skeleton>
                                        <Skeleton width="15rem" height="12rem"></Skeleton>
                                        <Skeleton width="15rem" height="12rem"></Skeleton>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <Groups />
                    </Suspense>
                }
            />
            <Route path="/memberForm" element={<EditMemberForm />} />
        </Routes>
    );
};

export default App;
