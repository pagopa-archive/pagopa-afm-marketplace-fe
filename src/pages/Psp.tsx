import React from 'react';
import {Button, Form, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import {
    FaGlobe,
    FaLock,
    FaLockOpen,
    FaQuestionCircle,
    FaShareSquare,
    FaCheck,
    FaEdit,
    FaEye,
    FaPlus,
    FaSearch,
    FaSpinner,
    FaTimes,
    FaTrash
} from "react-icons/fa";
import {toast} from "react-toastify";
import {getConfig} from "../util/config"
import axios from "axios";

interface IProps {
    history: {
        push(url: string): void;
    };
}

interface IState {
    code: string;
    bundles: [];
}

export default class Psp extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            code: "1234567890",
            bundles: []
        };
    }

    componentDidMount(): void {
        this.getBundles();
    }

    getBundles() {
        const baseUrl = getConfig("BE_HOST") as string;
        const basePath = getConfig("BE_BASEPATH") as string;
        const url = `${baseUrl}${basePath}/psps/${this.state.code}/bundles`;
        axios.get(url).then((response:any) => {
            console.log("response", response)
            if (response.status === 200) {
                this.setState({bundles: response.data.bundles})
            }
        }).catch(() => {
            console.error("response")
        });
    }

    getDate(date: string) {
        return date == null ? "?" : new Date(date).toLocaleDateString()
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
                    <td className="">{item.paymentAmount}</td>
                    <td className="">{item.minPaymentAmount} / {item.maxPaymentAmount}</td>
                    <td className="">{item.paymentMethod}</td>
                    <td className="">{item.touchpoint}</td>
                    <td className="">{item.transferCategoryList.join(" ")}</td>
                    <td className="">{this.getDate(item.validityDateFrom)} - {this.getDate(item.validityDateTo)}</td>
                    <td className="">{this.getDate(item.insertedDate)}</td>
                    <td className="">{this.getDate(item.lastUpdatedDate)}</td>
                    <td className="">
                        {
                            item.type != "GLOBAL" &&
                            <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Visualizza EC aderenti</Tooltip>}>
                                <button className="btn btn-secondary btn-sm mr-1">
								    <FaEye/>
								</button>
							</OverlayTrigger>
                        }
                        {
                            item.type === "PRIVATE" &&
							<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Offri ad EC</Tooltip>}>
                                <button className="btn btn-primary btn-sm mr-1">
									<FaShareSquare />
                                </button>
                            </OverlayTrigger>
                        }
                        {
                            item.type === "PUBLIC" &&
							<OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Visualizza richieste EC</Tooltip>}>
                                <button className="btn btn-primary btn-sm mr-1">
									<FaQuestionCircle />
                                </button>
							</OverlayTrigger>
                        }
                        <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${index}`}>Cancella</Tooltip>}>
                            <button className="btn btn-danger btn-sm mr-1">
                                <FaTrash/>
                            </button>
                        </OverlayTrigger>

                    </td>
                </tr>
        ))
    }

    render(): React.ReactNode {

        return (
            <div className="container-fluid creditor-institutions">
                <div className="row">
                    <div className="col-md-10 mb-3">
                        <h2>PSP</h2>
                    </div>
                    {/*<div className="col-md-2 text-right">*/}
                    {/*    <Button>Nuovo <FaPlus/></Button>*/}
                    {/*</div>*/}
                    <div className="col-md-12">
                        <h3>Lista Pacchetti</h3>
                    </div>
                    <div className="col-md-12">
                        <Table hover responsive size="sm" className="xsd-table">
                            <thead>
                            <tr>
                                <th className="">Nome</th>
                                <th className="">Descrizione</th>
                                <th className="">Tipo</th>
                                <th className="">Importo</th>
                                <th className="">Fascia</th>
                                <th className="">Metodo Pagamento</th>
                                <th className="">Touchpoint</th>
                                <th className="">Tassonomia</th>
                                <th className="">Validità (da/a)</th>
                                <th className="">Inserimento</th>
                                <th className="">Ultimo aggiornamento</th>
                                <th className=""></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.getBundleRows()}
                            <tr>
                            </tr>

                            </tbody>
                        </Table>
                    </div>
                </div>

            </div>
        );
    }
}
