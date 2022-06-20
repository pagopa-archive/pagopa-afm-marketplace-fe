import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Layout from "../components/Layout";
import NotFound from "../pages/NotFound";
import CreditorInstitution from "../pages/CreditorInstitution";
import Psp from "../pages/Psp";

export default class Routes extends React.Component {

    render(): React.ReactNode {
        return (
            <BrowserRouter>
                <Route render={(props)=>(
                    <Layout {...props}>
                        <Switch>
                            <Route path="/" exact component={CreditorInstitution}/>
                            <Route path="/cis" exact component={CreditorInstitution}/>
                            <Route path="/psps" exact component={Psp}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Layout>
                )}/>
            </BrowserRouter>
        );
    }

}
