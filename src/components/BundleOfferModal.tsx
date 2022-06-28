import React from "react";
import { Modal, Button } from 'react-bootstrap';
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import {toast} from "react-toastify";
import axios from "axios";

interface IProps {
    beUrl: string;
    show: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    handleClose: Function;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IState {
    content: any;
}

export default class BundleOfferModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            content: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.onShow = this.onShow.bind(this);
    }

    onShow(): void {
        this.initializeContent();
    }

    handleChange(content: any): void {
        this.setState({content});
    }

    initializeContent() {
        const content = {
            "ciFiscalCodeList": [
                "fiscalCode1",
                "fiscalCode2",
            ]
        };
        this.setState({content});
    }

    save() {
        const info = toast.info("Invio offerta...");
        axios.post(this.props.beUrl, this.state.content).then((response:any) => {
            if (response.status === 201) {
                this.props.handleClose("ok");
            }
            else {
                toast.error(response.data.details, {theme: "colored"});
            }
        }).catch(() => {
            toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        }).finally(() => {
            toast.dismiss(info);
        });
    }

    render(): React.ReactNode {
        return (
            <Modal size="lg" show={this.props.show} onHide={() => this.props.handleClose("ko")} onShow={this.onShow}>
                <Modal.Header closeButton>
                    <Modal.Title>Crea pacchetto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Editor value={this.state.content} onChange={this.handleChange} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => this.props.handleClose("ko")}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={() => this.save()}>
                        Salva
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
