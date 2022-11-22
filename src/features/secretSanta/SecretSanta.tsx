import React from "react";
import confettiAnimation from "../../images/confetti.gif";
import present from "../../images/present-bouncing.gif";
import reindeer from "../../images/reindeer.gif";
import santa from "../../images/santa-sled2.gif";
import { Messages } from "primereact/messages";
import { useAppQuery } from "../../redux/hooks";
import Header from "../common/Header";
import Snowfall from "react-snowfall";
import { getFormattedDate } from "../../common/util";

const SecretSanta = (): JSX.Element => {
    const [displayResult, setDisplayResult] = React.useState(false);
    const [displaySanta, setDisplaySanta] = React.useState(false);
    const [hasClicked, setHasClicked] = React.useState(false);
    const message = React.useRef<Messages>(null);

    const decryptString = (stringToDecript: string | null): string => {
        if (stringToDecript === null) {
            return "Sorry, that user was not found.";
        }
        return atob(stringToDecript);
    };

    const query = useAppQuery();
    const secretSanta = query.get("name");
    const assignee = decryptString(query.get("selected"));
    const wishlist = query.get("wishlist");
    const budget = decryptString(query.get("budget"));
    const currencySymbol = decryptString(query.get("currency"));
    const notes = decodeURIComponent(query.get("notes") ?? "");
    const favoriteStore = decodeURIComponent(query.get("favoriteStore") ?? "");
    const favoriteFood = decodeURIComponent(query.get("favoriteFood") ?? "");
    const favoriteColor = decodeURIComponent(query.get("favoriteColor") ?? "");
    const date = decryptString(query.get("date"));

    const decriptWishlist = (wishlist: string | null): string => {
        if (wishlist === null || wishlist.length === 0) {
            return "";
        }

        return atob(wishlist);
    };

    const openWishList = (newUrl: string): void => {
        setDisplaySanta(true);
        message?.current?.show([
            {
                severity: "success",
                summary: "",
                detail: `Santa is now getting ${assignee}"s wish list`,
                sticky: true,
            },
        ]);
        setTimeout(() => {
            setDisplaySanta(false);
            window.open(newUrl, "_blank");
        }, 3000);
    };

    const playPresentAnimation = () => {
        setHasClicked(true);
        setTimeout(() => {
            setHasClicked(false);
            setDisplayResult(true);
        }, 1050);
    };

    const createDetailField = (
        label: string,
        content: string,
        icon: string,
        extraContent?: string,
    ): JSX.Element => {
        return (
            <div className="d-flex mt-2">
                <i className={`pi ${icon} me-2 mt-1`} />
                <p>
                    {label} <b>{content}</b>
                    {extraContent}
                </p>
            </div>
        );
    };

    return (
        <div className="container-fluid text-center">
            <Header />
            <div className="row justify-content-center">
                <div className="col-md-3 col-sm-6 mt-3">
                    <div
                        className="card p-3 border-0 text-start"
                        style={{ zIndex: 1000 }}
                    >
                        {displayResult && (
                            <div>
                                <div className="text-center border-bottom">
                                    <p>
                                        Ho Ho Ho <b>{secretSanta}</b>!
                                    </p>
                                    <p>
                                        You are <b>{assignee}</b>
                                        {`'s Secret Santa!`}
                                    </p>
                                </div>
                                <p className="mt-2">
                                    Details for <b>{assignee}</b>:
                                </p>
                                {budget !== "" &&
                                    createDetailField(
                                        "The budget is",
                                        currencySymbol + budget,
                                        "pi-money-bill",
                                    )}

                                {date !== "" &&
                                    createDetailField(
                                        " The gift exchange will be held on",
                                        getFormattedDate(date),
                                        "pi-calendar",
                                    )}
                                {decriptWishlist(wishlist).length !== 0 && (
                                    <div className="d-flex mt-2">
                                        <i className="pi pi-external-link me-2 mt-1" />
                                        <p>
                                            Open{" "}
                                            <b
                                                className="text-primary"
                                                onClick={() =>
                                                    openWishList(
                                                        decriptWishlist(wishlist),
                                                    )
                                                }
                                            >
                                                {assignee}
                                            </b>
                                            {`'s wishlist`}
                                        </p>
                                    </div>
                                )}
                                {favoriteStore !== "" &&
                                    createDetailField(
                                        "Favorite Store:",
                                        favoriteStore,
                                        "pi-shopping-cart",
                                    )}
                                {favoriteFood !== "" &&
                                    createDetailField(
                                        "Favorite Food:",
                                        favoriteFood,
                                        "pi-chart-pie",
                                    )}
                                {favoriteColor !== "" && (
                                    <div className="d-flex">
                                        <i className={`pi pi-palette me-2 mt-1`} />
                                        <p>Favorite Color:</p>
                                        <div
                                            className="p-colorpicker-preview ms-2"
                                            style={{
                                                backgroundColor:
                                                    "#" + decodeURI(favoriteColor ?? ""),
                                                width: "1.5rem",
                                                height: "1.5rem",
                                            }}
                                        />
                                    </div>
                                )}

                                {notes !== "" && (
                                    <div className="d-flex mt-1">
                                        <i className={`pi pi-book me-2 mt-1`} />
                                        <p>Additional Notes: {notes}</p>
                                    </div>
                                )}
                                <Messages ref={message} />
                                <img
                                    src={reindeer}
                                    className="d-flex ms-auto me-auto"
                                    alt="Reindeer gif"
                                    height={150}
                                />
                            </div>
                        )}
                        {!displayResult && hasClicked && (
                            <>
                                <h5 className="text-center">Now opening...</h5>
                                <img
                                    src={confettiAnimation}
                                    alt="present opening"
                                    style={{ maxHeight: "230px" }}
                                />
                            </>
                        )}

                        {!displayResult && !hasClicked && (
                            <div
                                onClick={() => playPresentAnimation()}
                                className="text-center"
                            >
                                <h5>Click to view your assigned person!</h5>
                                <img
                                    src={present}
                                    alt="present bouncing"
                                    style={{ maxHeight: "230px" }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <img
                    src={santa}
                    id={displaySanta ? "santa" : "santa-hidden"}
                    alt="santa"
                />
            </div>
            <Snowfall color="white" />
        </div>
    );
};

export default SecretSanta;
