import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import Header from "../../components/Header";
import { Card } from "primereact/card";
import "./css/faq.css";

const Faq = (): JSX.Element => {
    return (
        <div className="container-fluid">
            <Header />
            <div className="row justify-content-center">
                <div className="col-md-6 col-sm-12">
                    <Card title="Secret Sanata FAQ's for group owners">
                        <Accordion>
                            <AccordionTab header="How do I create a Secret Sanata group?">
                                <p>
                                    Go to the <a href="/">home page</a> and add at least
                                    three members, which will automatically generate a
                                    Secret Santa list. Please note that in order to save
                                    this group, you must create an account or sign in.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="How do I know everyone's Secret Santa?">
                                <p>
                                    After three members are added to a group, an invite
                                    button will be available which will copy a unique url
                                    for each member when clicked. You can then paste this
                                    url into a new browser window or email it to the
                                    correct person to see who they are assigned to.
                                </p>
                                <p>
                                    The list of members and their Secret Santas is also
                                    available on the <a href="/groups">groups page</a>{" "}
                                    after creating and saving a group.
                                </p>
                            </AccordionTab>
                            <AccordionTab header="Can a list be edited after saving?">
                                <p className="text-align-left">
                                    Yes, lists are completly editable after saving and can
                                    be found by going to the{" "}
                                    <a href="groups">groups page</a> . On that page you
                                    can manage all of your groups that you have created.
                                </p>
                            </AccordionTab>
                        </Accordion>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Faq;
