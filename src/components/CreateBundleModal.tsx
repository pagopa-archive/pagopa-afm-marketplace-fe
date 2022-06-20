import React from "react";
import { Modal, Button } from 'react-bootstrap';


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

export default class CreateBundleModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            content: null
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(): void {
        this.initializeContent();
    }

    initializeContent() {
        const content = {
            "name": "Nome pacchetto",
            "description": "Descrizione",
            "paymentAmount": 100,
            "minPaymentAmount": 0,
            "maxPaymentAmount": 100,
            "paymentMethod": "CP",
            "touchpoint": "",
            "type": "GLOBAL",
            "transferCategoryList": [],
            "validityDateFrom": null,
            "validityDateTo": null
        };
        this.setState({content});
    }

    handleChange(event: any) {
        console.log("HANDLE CHANGE", event);
    }

    save() {
        console.log("SAVEEE", this.state.beUrl);
        this.props.handleClose("ok");
    }

    render(): React.ReactNode {
        return (
            <Modal show={this.props.show} onHide={() => this.props.handleClose("ko")}>
                <Modal.Header closeButton>
                    <Modal.Title>Crea pacchetto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <pre className="code" onChange={(event) => this.handleChange(event)}>
                        {JSON.stringify(this.state.content, undefined, 2)}
                    </pre>

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
