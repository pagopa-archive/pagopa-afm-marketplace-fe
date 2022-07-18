import React from "react";
import { Modal, Button, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import {
    FaGlobe,
    FaLock,
    FaLockOpen,
} from "react-icons/fa";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { JsonEditor as Editor } from 'jsoneditor-react';
import {toast} from "react-toastify";
import axios from "axios";

interface IProps {
    beUrl: string;
    code: string;
    show: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    handleClose: Function;
}

interface IState {
    bundle: any;
    bundles: any;
    content: any;
}

export default class BundleSubscriptionModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            bundle: null,
            bundles: [],
            content: null
        };

        this.handleBundle = this.handleBundle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onShow = this.onShow.bind(this);
    }

    componentDidMount(): void {
        this.initializeContent();
    }

    onShow(): void {
        this.initializeContent();
        this.retrieveBundles();
        this.setState({bundle: null});
    }

    handleBundle(bundle: any): void {
        this.setState({bundle});
    }

    handleChange(content: any): void {
        this.setState({content});
    }

    retrieveBundles() {
        axios.get(this.props.beUrl + "/bundles?types=GLOBAL,PUBLIC", this.state.content).then((response:any) => {
            if (response.status === 200) {
                this.setState({bundles: response.data.bundles});
            }
            else {
                toast.error(response.data.detail, {theme: "colored"});
            }
        }).catch(() => {
            toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        });
    }

    initializeContent() {
        const content = [{
            "maxPaymentAmount": 20000,
            "transferCategory": "PO",
            "transferCategoryRelation": "EQUAL"
        }];
        this.setState({content});
    }

    save() {
        if (this.state.bundle == null) {
            toast.warning("Selezionare un pacchetto", {theme: "colored"});
        }
        else if (this.state.bundle.type === "GLOBAL") {
            const info = toast.info("Salvataggio...");
            const url = `${this.props.beUrl}/cis/${this.props.code}/bundles/${this.state.bundle.idBundle}/attributes`;
            axios.post(url, this.state.content[0]).then((response:any) => {
                if (response.status === 201) {
                    toast.success("Sottoscrizione al pacchetto globale effettuata con successo", {theme: "colored"});
                    this.props.handleClose("ok");
                }
                else {
                    toast.error(response.data.detail, {theme: "colored"});
                }
            }).catch(() => {
                toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
            }).finally(() => {
                toast.dismiss(info);
            });
        }
        else if (this.state.bundle.type === "PUBLIC") {
            const info = toast.info("Salvataggio...");
            const url = `${this.props.beUrl}/cis/${this.props.code}/requests`;
            const data = {
                "idBundle": this.state.bundle.idBundle,
                "attributes": this.state.content
            };
            axios.post(url, data).then((response:any) => {
                if (response.status === 201) {
                    toast.success("Richiesta di sottoscrizione al pacchetto pubblico effettuata con successo", {theme: "colored"});
                    this.props.handleClose("ok");
                }
                else {
                    toast.error(response.data.detail, {theme: "colored"});
                }
            }).catch(() => {
                toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
            }).finally(() => {
                toast.dismiss(info);
            });
        }
    }

    getDate(date: string) {
        return date == null ? "?" : new Date(date).toLocaleDateString();
    }

    getAmount(amount: number) {
        return (amount / 100).toFixed(2);
    }

    getLabels(labelList: any) {
        return labelList.map((label: string, index: number) => <span className="badge badge-primary mr-1" key={index}>{label}</span>);
    }

    isActive(bundle: any) {
        return this.state.bundle != null && this.state.bundle.idBundle === bundle.idBundle ? "table-primary" : "";
    }

    getBundleRows() {
        return this.state.bundles.map((item: any, index: number) => (
                <tr className={this.isActive(item)} key={index} onClick={() => this.handleBundle(item)}>
                    <td className="">{item.idPsp}</td>
                    <td className="">{item.name}</td>
                    <td className="">{item.description}</td>
                    <td className="">
                        {
                            item.type === "GLOBAL" &&
							<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Globale</Tooltip>}>
								<FaGlobe />
							</OverlayTrigger>
                        }
                        {
                            item.type === "PUBLIC" &&
							<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Pubblico</Tooltip>}>
								<FaLockOpen className="mr-1"/>
							</OverlayTrigger>
                        }
                        {
                            item.type === "PRIVATE" &&
							<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Privato</Tooltip>}>
								<FaLock className="mr-1"/>
							</OverlayTrigger>
                        }
                    </td>
                    <td className="">{this.getAmount(item.paymentAmount)}</td>
                    <td className="">{this.getAmount(item.minPaymentAmount)} / {this.getAmount(item.maxPaymentAmount)}</td>
                    <td className="">{item.paymentMethod}</td>
                    <td className="">{item.touchpoint}</td>
                    <td className="">{this.getLabels(item.transferCategoryList)}</td>
                </tr>
        ));
    }

    render(): React.ReactNode {
        return (
            <Modal size="xl" show={this.props.show} onHide={() => this.props.handleClose("ko")} onShow={this.onShow}>
                <Modal.Header closeButton>
                    <Modal.Title>Configurazione pacchetto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Selezionare pacchetto a cui sottoscriversi.</p>
                    <Table hover responsive size="sm" className="xsd-table">
                        <thead>
                        <tr>
                            <th className="">PSP</th>
                            <th className="">Nome</th>
                            <th className="">Descrizione</th>
                            <th className="">Tipo</th>
                            <th className="">Commissione</th>
                            <th className="">Fascia</th>
                            <th className="">Metodo Pagamento</th>
                            <th className="">Touchpoint</th>
                            <th className="">Tassonomia</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.getBundleRows()}
                        </tbody>
                    </Table>
                    <p>Attributi da aggiungere.</p>
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
