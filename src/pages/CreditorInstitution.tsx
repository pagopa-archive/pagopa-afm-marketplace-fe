import React from 'react';

interface IProps {
    history: {
        push(url: string): void;
    };
}

interface IState {
}

export default class CreditorInstitution extends React.Component<IProps, IState> {

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
