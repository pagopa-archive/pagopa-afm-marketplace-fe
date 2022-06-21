import React from 'react';
import {Button, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import {
    FaCheck,
    FaEye,
    FaGlobe,
    FaLock,
    FaLockOpen,
    FaPlus,
    FaShareSquare,
    FaTimes,
    FaTrash,
} from "react-icons/fa";
import {toast} from "react-toastify";
import {getConfig} from "../util/config"
import axios from "axios";
import CreateBundleModal from "../components/CreateBundleModal";
import BundleOfferModal from "../components/BundleOfferModal";
import CisBundleModal from "../components/CisBundleModal";

interface IProps {
    history: {
        push(url: string): void;
    };
}

interface IState {
    beUrl: string;
    code: string;
    cisBundle: string;
    createBundle: string;
    offerBundle: string;
    bundles: [];
    bundleRequests: [];
    showCisBundleModal: boolean;
    showCreateBundleModal: boolean;
    showOfferBundleModal: boolean;
}

export default class Psp extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const baseUrl = getConfig("BE_HOST") as string;
        const basePath = getConfig("BE_BASEPATH") as string;
        const code = "1234567890";
        this.state = {
            code: code,
            bundles: [],
            bundleRequests: [],
            showCisBundleModal: false,
            showCreateBundleModal: false,
            showOfferBundleModal: false,
            beUrl: baseUrl + basePath,
            cisBundle: `${baseUrl}${basePath}/psps/${code}/bundles/IDBUNDLE/creditorInstitutions`,
            createBundle: `${baseUrl}${basePath}/psps/${code}/bundles`,
            offerBundle: `${baseUrl}${basePath}/psps/${code}/bundles/IDBUNDLE/offers`,
        };

        this.openBundleCreation = this.openBundleCreation.bind(this);
        this.setRequestStatus = this.setRequestStatus.bind(this);
    }

    componentDidMount(): void {
        this.getBundles();
        this.getBundleRequests();
    }

    openBundleCreation() {
        this.setState({showCreateBundleModal: true});
    }

    closeBundleCreation = (status: string) => {
        this.setState({showCreateBundleModal: false});
        if (status === "ok") {
            this.getBundles();
        }
    }

    openOfferBundle(idBundle: string) {
        const offerBundle = this.state.offerBundle.replace("IDBUNDLE", idBundle);
        this.setState({offerBundle, showOfferBundleModal: true});
    }

    closeBundleOffer = () => {
        this.setState({showOfferBundleModal: false});
    }

    openCisBundle(idBundle: string) {
        const cisBundle = this.state.cisBundle.replace("IDBUNDLE", idBundle);
        this.setState({cisBundle, showCisBundleModal: true});
    }

    closeCisBundle = () => {
        this.setState({showCisBundleModal: false});
    }

    openBundleCreation() {
        this.setState({showCreateBundleModal: true});
    }

    closeBundleCreation = (status: string) => {
        this.setState({showCreateBundleModal: false});
        if (status === "ok") {
            this.getBundles();
        }
    }

    getBundles() {
        const url = `${this.state.beUrl}/psps/${this.state.code}/bundles`;
        const info = toast.info("Caricamento...");
        axios.get(url).then((response:any) => {
            if (response.status === 200) {
                this.setState({bundles: response.data.bundles})
            }
            else {
                toast.error(response.data.detail, {theme: "colored"});
            }
        }).catch(() => {
            console.error("response")
            toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        }).finally(() => {
            toast.dismiss(info);
        });
    }

    removeBundle(idBundle: string) {
        const url = `${this.state.beUrl}/psps/${this.state.code}/bundles/${idBundle}`;
        const info = toast.info("Rimozione in corso...");
        axios.delete(url).then((response:any) => {
            if (response.status === 200) {
                this.getBundles()
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

    getBundleRequests() {
        const url = `${this.state.beUrl}/psps/${this.state.code}/requests`;
        const info = toast.info("Caricamento...");
        axios.get(url).then((response:any) => {
            if (response.status === 200) {
                this.setState({bundleRequests: response.data.requests})
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
                            item.type != "GLOBAL" &&
                            <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Visualizza EC aderenti</Tooltip>}>
                                <button className="btn btn-secondary btn-sm mr-1" onClick={() => this.openCisBundle(item.idBundle)}>
								    <FaEye />
								</button>
							</OverlayTrigger>
                        }
                        {
                            item.type === "PRIVATE" &&
							<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Offri ad EC</Tooltip>}>
                                <button className="btn btn-primary btn-sm mr-1" onClick={() => this.openOfferBundle(item.idBundle)}>
									<FaShareSquare />
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
                        <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Cancella</Tooltip>}>
                            <button className="btn btn-danger btn-sm mr-1" onClick={() => this.removeBundle(item.idBundle)}>
                                <FaTrash />
                            </button>
                        </OverlayTrigger>

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

    setRequestStatus(idBundleRequest:string, status: string) {
        const url = `${this.state.beUrl}/psps/${this.state.code}/requests/${idBundleRequest}/${status}`;
        const info = toast.info("Operazione in corso...");
        axios.post(url).then((response:any) => {
            if (response.status != 200) {
                toast.error(response.data.detail, {theme: "colored"});
            }
        }).catch(() => {
            toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        }).finally(() => {
            toast.dismiss(info);
            this.getBundleRequests();
        });
    }

    getBundleRequestRows() {
        return this.state.bundleRequests.map((item: any, index: number) => (
                <tr key={index}>
                    <td className="">{item.idBundle}</td>
                    <td className="">{item.ciFiscalCode}</td>
                    <td className=""><pre className="code">{JSON.stringify(item.ciBundleAttributes)}</pre></td>
                    <td className="">{this.getStatus(item.acceptedDate, item.rejectionDate)}</td>
                    <td className="text-right">
                        {
                            item.acceptedDate == null && item.rejectionDate == null &&
                            <>
                                <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Accetta</Tooltip>}>
                                    <button className="btn btn-success btn-sm mr-1" onClick={() => this.setRequestStatus(item.idBundleRequest, "accept")}>
                                        <FaCheck />
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Rifiuta</Tooltip>}>
                                    <button className="btn btn-danger btn-sm mr-1" onClick={() => this.setRequestStatus(item.idBundleRequest, "reject")}>
                                        <FaTimes />
                                    </button>
                                </OverlayTrigger>
                            </>
                        }
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
        return date == null ? "?" : new Date(date).toLocaleDateString()
    }

    setRequestStatus(idBundleRequest:string, status: string) {
        const url = `${this.state.beUrl}/psps/${this.state.code}/requests/${idBundleRequest}/${status}`;
        const info = toast.info("Operazione in corso...");
        axios.post(url).then((response:any) => {
            if (response.status != 200) {
                toast.error(response.data.details, {theme: "colored"});
            }
        }).catch(() => {
            toast.error("Operazione non avvenuta a causa di un errore", {theme: "colored"});
        }).finally(() => {
            toast.dismiss(info);
            this.getBundleRequests();
        });
    }

    getBundleRequestRows() {
        return this.state.bundleRequests.map((item: any, index: number) => (
                <tr key={index}>
                    <td className="">{item.idBundle}</td>
                    <td className="">{item.ciFiscalCode}</td>
                    <td className=""><pre className="code">{JSON.stringify(item.ciBundleAttributes)}</pre></td>
                    <td className="">{this.getStatus(item.acceptedDate, item.rejectionDate)}</td>
                    <td className="text-right">
                        {
                            item.acceptedDate == null && item.rejectionDate == null &&
                            <>
                                <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Accetta</Tooltip>}>
                                    <button className="btn btn-success btn-sm mr-1" onClick={() => this.setRequestStatus(item.idBundleRequest, "accept")}>
                                        <FaCheck />
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Rifiuta</Tooltip>}>
                                    <button className="btn btn-danger btn-sm mr-1" onClick={() => this.setRequestStatus(item.idBundleRequest, "reject")}>
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
                        <h2>PSP - {this.state.code}</h2>
                    </div>
                    <div className="col-md-10">
                        <h3>Lista Pacchetti</h3>
                    </div>
                    <div className="col-md-2 text-right">
                        <Button onClick={this.openBundleCreation}>Nuovo <FaPlus/></Button>
                    </div>
                    <div className="col-md-2 text-right">
                        <Button onClick={this.openBundleCreation}>Nuovo <FaPlus/></Button>
                    </div>
                    <div className="col-md-12">
                        <Table hover responsive size="sm" className="xsd-table">
                            <thead>
                            <tr>
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
                        <h3>Richieste Pacchetti Pubblici</h3>
                    </div>
                    <div className="col-md-12">
                        {
                            this.state.bundleRequests.length === 0 &&
                                    <div className="alert alert-warning">Non sono presenti richieste di sottoscrizione</div>
                        }
                        {
                            this.state.bundleRequests.length > 0 &&

							<Table hover responsive size="sm" className="xsd-table">
								<thead>
								<tr>
									<th className="">Nome pacchetto</th>
									<th className="">EC richiedente</th>
									<th className="">Attributi configurati dall'EC</th>
									<th className="">Stato</th>
									<th className="text-right"/>
								</tr>
								</thead>
								<tbody>
                                     {this.getBundleRequestRows()}
								</tbody>
							</Table>
                        }
                    </div>
                </div>
                <CreateBundleModal beUrl={this.state.createBundle} show={this.state.showCreateBundleModal} handleClose={this.closeBundleCreation} />
                <BundleOfferModal beUrl={this.state.offerBundle} show={this.state.showOfferBundleModal} handleClose={this.closeBundleOffer} />
                <CisBundleModal beUrl={this.state.cisBundle} show={this.state.showCisBundleModal} handleClose={this.closeCisBundle} />
            </div>
        )
    }
}
