import React from "react";
import presentImage from "../../images/present-opening.gif";
import sex from "../../images/sex.gif";
import santa from "../../images/santa-sled2.gif";
import { Messages } from "primereact/messages";
import { useAppQuery } from "../../redux/hooks";
import Header from "../../components/Header";
import Snowfall from "react-snowfall";

const SelectedPerson = (): JSX.Element => {
  const [displayResult, setDisplayResult] = React.useState(false);
  const [displaySanta, setDisplaySanta] = React.useState(false);
  const message = React.useRef<Messages>(null);

  const query = useAppQuery();
  const secretSanta = query.get("name");
  const assignee = query.get("selected");

  const decryptString = (stringToDecript: string | null): string => {
    if (stringToDecript === null) {
      return "Sorry, that user was not found.";
    }
    return atob(stringToDecript);
  };

  setTimeout(() => setDisplayResult(true), 4650);

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
                  You are <b className="text-primary">{decryptString(assignee)}</b>
                  "s Secret Santa!
                </p>
                <p>
                  Open{" "}
                  <b
                    className="text-primary"
                    onClick={() => openWishList("https://www.google.com")}
                  >
                    {decryptString(assignee)}
                  </b>
                  "s wishlist
                </p>
                <Messages ref={message} />
                <img src={sex} alt="sex" height={150} />
              </div>
            )}
            {!displayResult && (
              <img src={presentImage} alt="present" style={{ maxHeight: "230px" }} />
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <img src={santa} id={displaySanta ? "santa" : "santa-hidden"} alt="santa" />
      </div>
      <Snowfall color="white" />
    </div>
  );
};

export default SelectedPerson;
