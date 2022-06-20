import React from 'react';
import {Button, Form, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import {
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

interface IProps {
    history: {
        push(url: string): void;
    };
}

interface IState {
}

export default class CreditorInstitution extends React.Component<IProps, IState> {
    // static contextType = MsalContext;

    constructor(props: IProps) {
        super(props);

        this.state = {
        };
    }

    componentDidMount(): void {
    }

    render(): React.ReactNode {

        return (
            <div className="container-fluid creditor-institution">
                <div className="row">
                    <div className="col-md-10 mb-3">
                        <h2>Ente Creditore</h2>
                    </div>
                    <div className="col-md-12">
                        todo
                    </div>
                </div>

            </div>
        );
    }
}
