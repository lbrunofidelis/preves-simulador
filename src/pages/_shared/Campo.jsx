import React from 'react';
import renderHTML from 'react-render-html';

export default class Campo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisivel: false
        }
        this.renderBotaoAjuda = this.renderBotaoAjuda.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    renderBotaoAjuda() {
        if (this.props.usaBotaoAjuda) {
            return (
                <div className="col-1">
                    <button type="button" className="btn btn-outline-dark rounded-circle bg-dark text-white" onClick={() => this.toggleModal()}>
                        <i className="fa fa-question"></i>
                    </button>

                    {this.renderModal()}
                </div>
            )
        } else {
            return "";
        }
    }

    renderErro() {
        if(this.props.mostrarErro) {
            if(this.props.mensagemErro) {
                return (
                    <div className="text-danger col-lg-6 col-12 offset-lg-5 mt-2 mb-2">
                        <i className="fas fa-exclamation-circle"></i>&nbsp;
                        {this.props.mensagemErro}
                    </div>
                );
            } else {
                return "";
            }

        } else {
            return "";
        }
    }

    renderErroValidacao() {
        if(this.props.mostrarErroValidacao) {
            if(this.props.mensagemErroValidacao) {
                return (
                    <div className="text-danger col-lg-6 col-12 offset-lg-5 mt-2 mb-2">
                        <i className="fas fa-exclamation-circle"></i>&nbsp;
                        {this.props.mensagemErroValidacao}
                    </div>
                );
            } else {
                return "";
            }

        } else {
            return "";
        }
    }


    renderModal() {
        if (this.state.modalVisivel) {
            return (
                <div className="modal" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="basicPercentModalTitle">Informações</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.toggleModal()}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {renderHTML(this.props.textoModal)}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => this.toggleModal()}>Ok, entendi!</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else
        {
            return <div></div>
        }
    }

    toggleModal() {
        this.setState({ modalVisivel: !this.state.modalVisivel });
    }

    render() {
        return (
            <div className="form-group row">
                <label className="col-lg-5 col-md-12 text-lg-right col-form-label" htmlFor={this.props.id}>
                    <b>{this.props.label}</b>
                    <div className="text-secondary">{this.props.labelSecundaria}</div>
                </label>

                {this.props.children}

                {this.renderBotaoAjuda()}
                
                {this.renderErro()}

                {this.renderErroValidacao()}
            </div>
        );
    }
}
