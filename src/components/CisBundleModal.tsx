import React from "react";
import { Modal, Button } from 'react-bootstrap';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import {toast} from "react-toastify";
import axios from "axios";

interface IProps {
    bundle: any;
    beUrl: string;
    show: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    handleClose: Function;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IState {
    alert: any;
    content: any;
    details: any;
}

export default class CisBundleModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            alert: {
                show: false,
                message: ""
            },
            content: {},
            details: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDetails = this.handleChangeDetails.bind(this);
        this.loading = this.loading.bind(this);
    }

    initializeAlert() {
        this.setState({alert: {
                show: false,
                message: ""
            }});
    }

    loading(): void {
        this.initializeAlert();
        const info = toast.info("Caricamento EC sottoscritti...");
        axios.get(this.props.beUrl).then((response:any) => {
            if (response.status === 200) {
                if ((this.props.bundle.type === "PUBLIC" || this.props.bundle.type === "GLOBAL") && response.data.ciFiscalCodeList.length > 0) {
                    this.handleChange(response.data);
                    response.data.ciFiscalCodeList.forEach((ciFiscalCode: string) => this.retrieveDetails(ciFiscalCode));
                }
                else if (this.props.bundle.type === "PRIVATE" && response.data.ciFiscalCodeList.length > 0) {
                    this.handleChange(response.data);
                }
                else if (this.props.bundle.type === "GLOBAL" && response.data.ciFiscalCodeList.length === 0) {
                    const alert = {
                        show: true,
                        message: "Tutti gli EC sono sottoscitti a questo pacchetto. Nessun EC ha aggiunto attributi personalizzati."
                    };
                    this.setState({alert});
                }
                else if (response.data.ciFiscalCodeList.length === 0) {
                    const alert = {
                        show: true,
                        message: "Nessun EC si è sottoscritto al pacchetto."
                    };
                    this.setState({alert});
                }
            }
            else {
                if (this.props.bundle.type === "GLOBAL") {
                    const alert = {
                        show: true,
                        message: "Tutti gli EC fanno parte di questo pacchetto. Nessun EC ha aggiunto attributi personalizzati."
                    };
                    this.setState({alert});
                }
                else {
                    toast.error(response.data.detail, {theme: "colored"});
                }
            }
        }).catch((err) => {
            toast.error(err.response.data.detail, {theme: "colored"});
        }).finally(() => {
            toast.dismiss(info);
        });
    }

    retrieveDetails(ciFiscalCode: string) {
        const info = toast.info("Caricamento dettagli sottoscrizione...");
        axios.get(`${this.props.beUrl}/${ciFiscalCode}`).then((response:any) => {
            if (response.status === 200) {
                this.handleChangeDetails(response.data);
            }
            else {
                toast.error(response.data.detail, {theme: "colored"});
            }
        }).catch((err) => {
            toast.error(err.response.data.detail, {theme: "colored"});
        }).finally(() => {
            toast.dismiss(info);
        });
    }

    handleChange(content: any): void {
        this.setState({content});
    }

    handleChangeDetails(details: any): void {
        this.setState({details});
    }

    render(): React.ReactNode {
        return (
            <Modal size="lg" show={this.props.show} onHide={() => this.props.handleClose("ko")} onShow={this.loading}>
                <Modal.Header closeButton>
                    <Modal.Title>EC aderenti</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        this.state.alert.show &&
						<p className="alert alert-primary">{this.state.alert.message}</p>
                    }
                    {
                        !this.state.alert.show &&
                        <>
						    <pre className="code">{JSON.stringify(this.state.content, undefined, 2)}</pre>
                            <h6>Dettagli pacchetto</h6>
                            <pre className="code">{JSON.stringify(this.state.details, undefined, 2)}</pre>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.props.handleClose("ko")}>
                        Chiudi
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
