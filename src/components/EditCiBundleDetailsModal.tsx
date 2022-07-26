import React from "react";
import { Modal, Button } from 'react-bootstrap';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import {toast} from "react-toastify";
import axios from "axios";

interface IProps {
    beUrl: string;
    content: any;
    show: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    handleClose: Function;
}

interface IState {
    content: any;
    details: any;
    shown: boolean;
}

export default class EditCiBundleDetailsModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            content: {},
            details: {},
            shown: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.removeAll = this.removeAll.bind(this);
        this.save = this.save.bind(this);
        this.loading = this.loading.bind(this);
    }

    loading(): void {
        this.handleChange(this.props.content);
        // const info = toast.info("Caricamento...");
        // axios.get(this.props.beUrl).then((response:any) => {
        //     if (response.status === 200) {
        //         console.log("SETTING DATA", response.data);
        //         this.handleChange(response.data);
        //         this.setState({shown: true});
        //     }
        //     else {
        //         toast.error(response.data.detail, {theme: "colored"});
        //     }
        // }).catch(() => {
        //     toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        // }).finally(() => {
        //     toast.dismiss(info);
        //     this.render();
        // });
    }

    handleChange(content: any): void {
        this.setState({content});
    }

    remove(idBundleAttribute: string) {
        const url = `${this.props.beUrl}/${idBundleAttribute}`;
        return axios.delete(url);
    }

    removeAll(): void {
        void axios.all(this.state.content.attributes.map((attribute: any) => this.remove(attribute.idBundleAttribute))).then(
                () => {
                    this.props.handleClose("ok");
                }
        );
    }

    save(): void {
        const info = toast.info("Salvataggio...");
        const data = {
            maxPaymentAmount: this.state.content.attributes[0].maxPaymentAmount,
            transferCategory: this.state.content.attributes[0].transferCategory,
            transferCategoryRelation: this.state.content.attributes[0].transferCategoryRelation
        };
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        axios.put(this.props.beUrl + "/" + this.state.content.attributes[0].idBundleAttribute, data).then((response:any) => {
            if (response.status === 200) {
                this.props.handleClose("ok");
            }
            else {
                toast.error(response.data.detail, {theme: "colored"});
            }
        }).catch(() => {
            toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        }).finally(() => {
            toast.dismiss(info);
            this.render();
        });
    }

    render(): React.ReactNode {
        return (
            <Modal size="lg" show={this.props.show} onHide={() => this.props.handleClose("ko")} onShow={this.loading}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica attributi pacchetto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Editor value={this.props.content} onChange={this.handleChange} />

                </Modal.Body>
                <Modal.Footer>

                    <Button variant="success" onClick={this.save}>
                        Salva
                    </Button>

                    <Button variant="danger" onClick={this.removeAll}>
                        Cancella attributi
                    </Button>

                    <Button variant="secondary" onClick={() => this.props.handleClose("ko")}>
                        Chiudi
                    </Button>

                </Modal.Footer>
            </Modal>
        );
    }
}
