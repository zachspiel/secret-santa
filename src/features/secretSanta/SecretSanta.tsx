import React from "react";
import confettiAnimation from "../../images/confetti.gif";
import present from "../../images/present-bouncing.gif";
import reindeer from "../../images/reindeer.gif";
import santa from "../../images/santa-sled2.gif";
import { Messages } from "primereact/messages";
import { useAppQuery } from "../../redux/hooks";
import Header from "../../components/Header";
import Snowfall from "react-snowfall";
import { getFormattedDate } from "../../common/util";

const SecretSanta = (): JSX.Element => {
    const [displayResult, setDisplayResult] = React.useState(false);
    const [displaySanta, setDisplaySanta] = React.useState(false);
    const [hasClicked, setHasClicked] = React.useState(false);
    const message = React.useRef<Messages>(null);

    const query = useAppQuery();
    const secretSanta = query.get("name");
    const assignee = query.get("selected");
    const wishlist = query.get("wishlist");
    const budget = query.get("budget");
    const currencySymbol = query.get("currency");
    const notes = query.get("notes");
    const date = query.get("date");

    const decryptString = (stringToDecript: string | null): string => {
        if (stringToDecript === null) {
            return "Sorry, that user was not found.";
        }
        return atob(stringToDecript);
    };

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
                detail: `Santa is now getting ${decryptString(assignee)}"s wish list`,
                sticky: true,
            },
        ]);
        setTimeout(() => {
            setDisplaySanta(false);
            window.open(newUrl, "_blank");
        }, 5000);
    };

    const playPresentAnimation = () => {
        setHasClicked(true);
        setTimeout(() => {
            setHasClicked(false);
            setDisplayResult(true);
        }, 1050);
    };

    return (
        <div className="container-fluid text-center">
            <Header />
            <div className="row justify-content-center">
                <div className="col-md-3 col-sm-6 mt-3">
                    <div className="card p-3 border-0" style={{ zIndex: 1000 }}>
                        {displayResult && (
                            <div>
                                <p>
                                    Ho Ho Ho <b>{secretSanta}</b>!
                                </p>
                                <p>
                                    You are{" "}
                                    <b className="text-primary">
                                        {decryptString(assignee)}
                                    </b>
                                    {`'s Secret Santa!`}
                                </p>
                                {budget !== "" && (
                                    <p>
                                        The budget is{" "}
                                        <b>
                                            {decryptString(currencySymbol)}{" "}
                                            {decryptString(budget)}
                                        </b>
                                    </p>
                                )}
                                {date !== "" && (
                                    <p>
                                        The gift exchange will be held on{" "}
                                        <b>
                                            {getFormattedDate(decryptString(date) ?? "")}
                                        </b>
                                    </p>
                                )}
                                {decriptWishlist(wishlist).length !== 0 && (
                                    <p>
                                        Open{" "}
                                        <b
                                            className="text-primary"
                                            onClick={() =>
                                                openWishList(decriptWishlist(wishlist))
                                            }
                                        >
                                            {decryptString(assignee)}
                                        </b>
                                        {`"s wishlist`}
                                    </p>
                                )}
                                {notes !== "" && (
                                    <p>Additional notes: {decryptString(notes)}</p>
                                )}
                                <Messages ref={message} />
                                <img src={reindeer} alt="sex" height={150} />
                            </div>
                        )}
                        {!displayResult && hasClicked && (
                            <>
                                <h5>Now opening...</h5>
                                <img
                                    src={confettiAnimation}
                                    alt="present opening"
                                    style={{ maxHeight: "230px" }}
                                />
                            </>
                        )}

                        {!displayResult && !hasClicked && (
                            <div onClick={() => playPresentAnimation()}>
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
