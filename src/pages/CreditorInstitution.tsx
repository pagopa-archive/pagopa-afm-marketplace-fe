import React from 'react';
import {Button, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import {
    FaCheck,
    FaCogs,
    FaGlobe,
    FaLock,
    FaLockOpen,
    FaPlus,
    FaTimes,
} from "react-icons/fa";
import {toast} from "react-toastify";
import {getConfig} from "../util/config"
import axios from "axios";
import BundleSubscriptionModal from "../components/BundleSubscriptionModal";
import CiBundleDetailsModal from "../components/CiBundleDetailsModal";

interface IProps {
    history: {
        push(url: string): void;
    };
}

interface IState {
    beUrl: string;
    code: string;
    bundleAttributes: string;
    getBundles: string;
    getBundleOffers: string;
    bundles: [];
    bundleOffers: [];
    showCiBundleDetailsModal: boolean;
    showBundleSubscriptionModal: boolean;
    showOfferBundleModal: boolean;
}

export default class CreditorInstitution extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const baseUrl = getConfig("AFM_MARKETPLACE_HOST") as string;
        const basePath = getConfig("AFM_MARKETPLACE_BASEPATH") as string;
        const code = "12345";
        this.state = {
            code: code,
            bundles: [],
            bundleOffers: [],
            showCiBundleDetailsModal: false,
            showBundleSubscriptionModal: false,
            showOfferBundleModal: false,
            beUrl: baseUrl + basePath,
            bundleAttributes: `${baseUrl}${basePath}/cis/${code}/bundles/IDBUNDLE/attributes`,
            getBundles: `${baseUrl}${basePath}/cis/${code}/bundles`,
            getBundleOffers: `${baseUrl}${basePath}/cis/${code}/offers`,
        };

        this.openBundleSubscription = this.openBundleSubscription.bind(this);
        this.setOfferStatus = this.setOfferStatus.bind(this);
    }

    componentDidMount(): void {
        this.getBundles();
        this.getBundleOffers();
    }

    openBundleSubscription() {
        this.setState({showBundleSubscriptionModal: true});
    }

    closeBundleSubscription = (status: string) => {
        this.setState({showBundleSubscriptionModal: false});
        if (status === "ok") {
            this.getBundles();
        }
    }

    openCiBundleDetails(idBundle: string) {
        const bundleAttributes = this.state.bundleAttributes.replace("IDBUNDLE", idBundle);
        this.setState({bundleAttributes, showCiBundleDetailsModal: true});
    }

    closeCiBundleDetails = (status: string) => {
        this.setState({showCiBundleDetailsModal: false});
        if (status === "ok") {
            this.getBundles();
        }
    }

    getBundles() {
        const info = toast.info("Caricamento...");
        axios.get(this.state.getBundles).then((response:any) => {
            if (response.status === 200) {
                this.setState({bundles: response.data.bundles})
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

    removeBundle(idBundleOffer: string) {
        console.log("TODO remove bundle offer", idBundleOffer);
        // const url = `${this.state.beUrl}/psps/${this.state.code}/bundles/${idBundle}`;
        // const info = toast.info("Rimozione in corso...");
        // axios.delete(url).then((response:any) => {
        //     if (response.status === 200) {
        //         this.getBundles()
        //     }
        //     else {
        //         toast.error(response.data.detail, {theme: "colored"});
        //     }
        // }).catch(() => {
        //     toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        // }).finally(() => {
        //     toast.dismiss(info);
        // });
    }

    getBundleOffers() {
        const info = toast.info("Caricamento...");
        axios.get(this.state.getBundleOffers).then((response:any) => {
            if (response.status === 200) {
                this.setState({bundleOffers: response.data.offers})
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

    getDate(date: string) {
        return date == null ? "?" : new Date(date).toLocaleDateString()
    }

    getAmount(amount: number) {
        return (amount / 100).toFixed(2);
    }

    getLabels(labelList: any) {
        return labelList.map((label: string, index: number) => <span className="badge badge-primary mr-1" key={index}>{label}</span>)
    }

    getBundleRows() {
        return this.state.bundles.map((item: any, index: number) => (
            <tr key={index}>
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
                <td className="">{this.getDate(item.validityDateFrom)} - {this.getDate(item.validityDateTo)}</td>
                <td className="">{this.getDate(item.insertedDate)}</td>
                <td className="">{this.getDate(item.lastUpdatedDate)}</td>
                <td className="text-right">
                    {
                        item.type != "PRIVATE" &&
                        <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Gestisci attributi</Tooltip>}>
                            <button disabled={item.validityDateTo != null} className="btn btn-secondary btn-sm mr-1" onClick={() => this.openCiBundleDetails(item.idBundle)}>
                                <FaCogs />
                            </button>
                        </OverlayTrigger>
                    }
                    {/*{*/}
                    {/*    item.type === "PUBLIC" &&*/}
                    {/*	<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Visualizza richieste EC</Tooltip>}>*/}
                    {/*        <button className="btn btn-primary btn-sm mr-1">*/}
                    {/*			<FaQuestionCircle />*/}
                    {/*        </button>*/}
                    {/*	</OverlayTrigger>*/}
                    {/*}*/}
                    {/*<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Cancella</Tooltip>}>*/}
                    {/*    <button className="btn btn-danger btn-sm mr-1" onClick={() => this.removeBundle(item.idBundle)}>*/}
                    {/*        <FaTrash />*/}
                    {/*    </button>*/}
                    {/*</OverlayTrigger>*/}

                </td>
            </tr>
        ))
    }

    getStatus(accepted: string, rejected: string) {
        if (accepted == null && rejected == null) {
            return "-";
        }
        else if (accepted != null && rejected == null) {
            return <span><FaCheck className="text-success" /> {this.getDate(accepted)}</span>;
        }
        else if (accepted == null && rejected != null) {
            return <span><FaTimes className="text-danger" /> {this.getDate(rejected)}</span>;
        }
        return "-";
    }

    setOfferStatus(idBundleOffer:string, status: string) {
        const url = `${this.state.getBundleOffers}/${idBundleOffer}/${status}`;
        const info = toast.info("Operazione in corso...");
        axios.post(url).then((response:any) => {
            if (response.status != 200) {
                toast.error(response.data.detail, {theme: "colored"});
            }
        }).catch(() => {
            toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        }).finally(() => {
            toast.dismiss(info);
            this.getBundleOffers();
        });
    }

    getBundleOfferRows() {
        return this.state.bundleOffers.map((item: any, index: number) => (
            <tr key={index}>
                <td className="">{item.idBundle}</td>
                <td className="">{item.idPsp}</td>
                <td className="">{this.getDate(item.insertedDate)}</td>
                <td className="">{this.getStatus(item.acceptedDate, item.rejectionDate)}</td>
                <td className="text-right">
                    {
                        item.acceptedDate == null && item.rejectionDate == null &&
                        <>
                            <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Accetta</Tooltip>}>
                                <button className="btn btn-success btn-sm mr-1" onClick={() => this.setOfferStatus(item.idBundleOffer, "accept")}>
                                    <FaCheck />
                                </button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Rifiuta</Tooltip>}>
                                <button className="btn btn-danger btn-sm mr-1" onClick={() => this.setOfferStatus(item.idBundleOffer, "reject")}>
                                    <FaTimes />
                                </button>
                            </OverlayTrigger>
                        </>
                    }
                </td>
            </tr>
        ))
    }

    render(): React.ReactNode {
        return (
            <div className="container-fluid psp">
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <h2>EC - {this.state.code}</h2>
                    </div>
                    <div className="col-md-10">
                        <h3>Lista Sottoscrizioni</h3>
                    </div>
                    <div className="col-md-2 text-right">
                        <Button onClick={this.openBundleSubscription}>Nuovo <FaPlus/></Button>
                    </div>
                    <div className="col-md-12">
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
                                <th className="">Validità (da/a)</th>
                                <th className="">Inserimento</th>
                                <th className="">Aggiornamento</th>
                                <th className="text-right" />
                            </tr>
                            </thead>
                            <tbody>
                                {this.getBundleRows()}
                            </tbody>
                        </Table>
                    </div>
                    <div className="col-md-12 mt-5">
                        <h3>Offerte di pacchetti privati da parte dei PSP</h3>
                    </div>
                    <div className="col-md-12">
                        {
                            this.state.bundleOffers.length === 0 &&
                                    <div className="alert alert-warning">Non sono presenti offerte di sottoscrizione</div>
                        }
                        {
                            this.state.bundleOffers.length > 0 &&

							<Table hover responsive size="sm" className="xsd-table">
								<thead>
								<tr>
									<th className="">Nome pacchetto</th>
									<th className="">PSP</th>
									<th className="">Data offerta</th>
									<th className="">Stato</th>
									<th className="text-right"/>
								</tr>
								</thead>
								<tbody>
                                     {this.getBundleOfferRows()}
								</tbody>
							</Table>
                        }
                    </div>
                </div>
                <BundleSubscriptionModal code={this.state.code} beUrl={this.state.beUrl} show={this.state.showBundleSubscriptionModal} handleClose={this.closeBundleSubscription} />
                {/*<BundleOfferModal beUrl={this.state.offerBundle} show={this.state.showOfferBundleModal} handleClose={this.closeBundleOffer} />*/}
                <CiBundleDetailsModal beUrl={this.state.bundleAttributes} show={this.state.showCiBundleDetailsModal} handleClose={this.closeCiBundleDetails} />
            </div>
        )
    }
}
