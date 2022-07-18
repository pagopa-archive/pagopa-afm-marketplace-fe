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

interface IState {
    content: any;
}

export default class CreateBundleModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            content: this.props.bundle
        };

        this.onShow = this.onShow.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(): void {
        this.initializeContent();
    }

    onShow(): void {
        this.handleChange(this.props.bundle);
    }

    handleChange(content: any): void {
        this.setState({content});
    }

    initializeContent() {
        const content = {
            "name": "Nome pacchetto",
            "description": "Descrizione",
            "paymentAmount": 100,
            "minPaymentAmount": 0,
            "maxPaymentAmount": 10000,
            "paymentMethod": "CP",
            "touchpoint": "IO",
            "type": "GLOBAL",
            "transferCategoryList": ["9/0115111TS/", "9/0201115AP/"],
            "validityDateFrom": null,
            "validityDateTo": null
        };
        this.setState({content});
    }

    save() {
        const info = toast.info("Salvataggio...");
        axios.put(this.props.beUrl, this.state.content).then((response:any) => {
            if (response.status === 200) {
                this.props.handleClose("ok");
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

    render(): React.ReactNode {

        return (
            <Modal size="lg" show={this.props.show} onHide={() => this.props.handleClose("ko")} onShow={this.onShow}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica pacchetto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Editor value={this.props.bundle} onChange={this.handleChange} />
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
