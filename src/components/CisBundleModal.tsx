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

export default class CisBundleModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            content: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.loading = this.loading.bind(this);
    }

    loading(): void {
        const info = toast.info("Caricamento lista...");
        axios.get(this.props.beUrl).then((response:any) => {
            if (response.status === 200) {
                this.handleChange(response.data);
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

    handleChange(content: any): void {
        this.setState({content});
    }

    render(): React.ReactNode {
        return (
            <Modal size="lg" show={this.props.show} onHide={() => this.props.handleClose("ko")} onShow={this.loading}>
                <Modal.Header closeButton>
                    <Modal.Title>EC aderenti</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <pre className="code">{JSON.stringify(this.state.content, undefined, 2)}</pre>
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
