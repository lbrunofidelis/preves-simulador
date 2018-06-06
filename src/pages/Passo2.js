import React from 'react';
import Campo from "./_shared/Campo";
import Combo from "./_shared/Combo";

const textos = require("./Textos");

export default class Passo2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = props.state;

        this.handleInputChange = props.handleInputChange.bind(this);
        this.handlePercentualBasicoChange = this.handlePercentualBasicoChange.bind(this);
        this.handleRiscoInvalidezChange = this.handleRiscoInvalidezChange.bind(this);
        this.handleRiscoPensaoMorteChange = this.handleRiscoPensaoMorteChange.bind(this);
        this.handleSobrevivenciaChange = this.handleSobrevivenciaChange.bind(this);
        this.verificarValorMaximo = this.verificarValorMaximo.bind(this);
        this.adicionalChange = this.adicionalChange.bind(this);
        this.onBlurInput = this.onBlurInput.bind(this);
        this.calculaContribuicaoAdicional = this.calculaContribuicaoAdicional.bind(this);
        this.calculaTaxaAposentadoria = this.calculaTaxaAposentadoria.bind(this);
        this.renderContribuicaoPatrocinador = this.renderContribuicaoPatrocinador.bind(this);
        this.atualizarStatesPatrocinador = this.atualizarStatesPatrocinador.bind(this);
        this.desabilitaCamposSobrevivencia = this.desabilitaCamposSobrevivencia.bind(this);
        this.atualizarStatesSobrevivencia = this.atualizarStatesSobrevivencia.bind(this);
    }

    onVisible(state) {

        this.setState(state, () => {
            this.atualizarStatesSobrevivencia();
        });
    }

    atualizarStatesSobrevivencia() {
        // Caso chegue ao passo 2 sem sobrevivência (state 'temSobrevivencia' = false) deve-se setar a sobrevivência participante e adicional como 0 p/ não influenciar nos cálculos.
        if(!this.state.temSobrevivencia) {
            this.setState({ 
                sobrevivenciaParticipante: "0.00",
                sobrevivenciaAdicional: "0"
            }, () => { 
                this.calculaContribuicaoAdicional();
                this.calculaTaxaAposentadoria();
            })
            // document.getElementById("sobrevivenciaAdicional").value = '0,00';
        }
    }

    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método responsável por atualizar o state do campo que disparou o evento, ao tirar o foco do mesmo.
     */
    onBlurInput(event) { 
        const target = event.target;
        
        var valor = target.value;
        var nomeCampo = target.name;

        this.setState({
            [nomeCampo]: valor
        }, () => { 
            this.calculaContribuicaoAdicional();
        });
    }

    /**
     * @description Método que calcula o valor do Carregamento contribuição adicional e atualiza seu state. Esse cálculo depende dos valores dos campos de 
     * contribuição adicional.
     */
    calculaContribuicaoAdicional() {
        var valores = {
            aposentadoria: this.state.aposentadoriaAdicional,
            invalidez: this.state.invalidezAdicional,
            pensaoMorte: this.state.pensaoMorteAdicional,
            sobrevivencia: this.state.sobrevivenciaAdicional
        }

        valores.aposentadoria = this.converteStringFloat(valores.aposentadoria);
        valores.invalidez = this.converteStringFloat(valores.invalidez);
        valores.pensaoMorte = this.converteStringFloat(valores.pensaoMorte);
        valores.sobrevivencia = this.converteStringFloat(valores.sobrevivencia);
        
        // Checa se o número de entrada é NaN. Caso sim, o valor de entrada torna-se '0' para realização do cálculo.
        if(isNaN(valores.aposentadoria))
            valores.aposentadoria = 0;

        if(isNaN(valores.invalidez))
            valores.invalidez = 0;

        if(isNaN(valores.pensaoMorte))
            valores.pensaoMorte = 0;

        if(isNaN(valores.sobrevivencia))
            valores.sobrevivencia = 0;

        var soma = valores.aposentadoria + valores.invalidez + valores.pensaoMorte + valores.sobrevivencia;
        soma *= 0.06;

        this.setState({
            carregamentoContribuicaoAdicional: soma.toFixed(2)
        }, () => { this.calculaTaxaAposentadoria() });
    }

    calculaTaxaAposentadoria() {
        var contribuicoes = [];
        var totalizadorTaxaAposentadoria = 0;
            
        contribuicoes = {
            percentualBasico: this.state.percentualBasicoParticipante,
            invalidez: this.state.beneficioRiscoInvalidezParticipante,
            pensaoMorte: this.state.beneficioRiscoPensaoMorteParticipante,
            sobrevivencia: this.state.sobrevivenciaParticipante,
            carregamentoContribuicaoBasica: this.state.carregamentoContribuicaoBasicaParticipante,
            aposentadoriaAdicional: this.state.aposentadoriaAdicional
        }

        if(isNaN(contribuicoes.aposentadoriaAdicional)) {
            contribuicoes.aposentadoriaAdicional = parseFloat(contribuicoes.aposentadoriaAdicional.replace(',', '.'));
        }

        totalizadorTaxaAposentadoria = (contribuicoes.percentualBasico - contribuicoes.invalidez - contribuicoes.pensaoMorte - contribuicoes.sobrevivencia - contribuicoes.carregamentoContribuicaoBasica) + contribuicoes.aposentadoriaAdicional * 0.94;

        this.setState({
            totalizadorTaxaAposentadoria: totalizadorTaxaAposentadoria.toFixed(2)
        });

    }

    /**
     * @param {string} valor Valor a ser convertido para float. Dependendo do tamanho da string, esse valor vem com ponto (.) ou vírgula (,) devido a 
     * máscara existente nos campos.
     */
    converteStringFloat(valor) {
        valor = valor.replace(/\./g, '');
        valor = valor.replace(',', '.');
        valor = parseFloat(valor);
        return(valor);
    }

    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método responsável por calcular o valor do Carregamento Contribuição Básica e 'settar' seu state de acordo com o valor do Percentual Básico.
     */
    handlePercentualBasicoChange(event) {
        var valor = parseFloat(event.target.value);

        if(!document.getElementById("aposentadoriaAdicional").disabled)
            this.setState({ aposentadoriaAdicional: '0,00' })

        // Multiplica o valor do percentual basico por 0.06
        this.setState({
            carregamentoContribuicaoBasicaParticipante: (valor * 0.06).toFixed(2)
        }, () => { this.calculaContribuicaoAdicional() });

        this.handleInputChange(event);
    }

    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método responsável por atualizar o state do Benefício de risco Pensão por morte. Além disso, atualiza o state que armazena a soma dos benefícios
     * de risco (Invalidez e Pensão por morte), que não pode ser maior que 1.
     */
    handleRiscoInvalidezChange(event) {
        var valor = parseFloat(event.target.value);
        
        if(!document.getElementById("invalidezAdicional").disabled)
            this.setState({ invalidezAdicional: '0,00', pensaoMorteAdicional: '0,00' })

        this.setState({
            beneficioRiscoPensaoMorteMax: (1 - valor).toFixed(2),
            beneficioRiscoSoma: (parseFloat(valor) + parseFloat(this.state.beneficioRiscoPensaoMorteParticipante)).toFixed(2)
        }, () => { this.calculaContribuicaoAdicional() });

        this.handleInputChange(event);
    }
    
    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método responsável por atualizar o state do Benefício de risco Invalidez. Além disso, atualiza o state que armazena a soma dos benefícios
     * de risco (Invalidez e Pensão por morte), que não pode ser maior que 1.
     */
    handleRiscoPensaoMorteChange(event) {
        var valor = parseFloat(event.target.value);

        if(!document.getElementById("pensaoMorteAdicional").disabled)
            this.setState({ pensaoMorteAdicional: '0,00', invalidezAdicional: '0,00' })

        this.setState({
            beneficioRiscoInvalidezMax: (1 - valor).toFixed(2),
            beneficioRiscoSoma: (parseFloat(valor) + parseFloat(this.state.beneficioRiscoInvalidezParticipante)).toFixed(2)
        }, () => { this.calculaContribuicaoAdicional() });

        this.handleInputChange(event);
    }

    handleSobrevivenciaChange(event) {
        this.calculaContribuicaoAdicional();

        if(!document.getElementById("sobrevivenciaAdicional").disabled) {
            this.setState({
                sobrevivenciaAdicional: '0.00'
            }, () => { 
                this.calculaContribuicaoAdicional();
            });
        }

        this.handleInputChange(event);
    }

    /**
     * @param {string} valor Valor a ser renderizado.
     * @description Método que retorna o valor a ser mostrado ao usuário, que deve estar no formato brasileiro com vírgula (,) no lugar de ponto (.) para separar as casas decimais.
     */
    renderPercentual(valor) {
        return valor.replace('.', ',');
    }

    /**
     * @param {string} valor Valor a ser renderizado.
     * @description Método que retorna o valor da contribuição do patrocinador a ser mostrado na label. A contribuição do patrocinador é igual à contribuição
     * do participante caso o tipo de ativo seja 'Ativo'.
     */
    renderContribuicaoPatrocinador(valor) {
        if(this.state.tipoAtivo === 'normal')
            return valor.replace('.', ',');

        if(this.state.tipoAtivo !== 'normal') {
            return '0,00';
        }
    }

    /**
     * @description Método que atualiza os states das contribuições do patrocinador e 'setta' o passo 3 para realização dos cálculos.
     */
    atualizarStatesPatrocinador() {

        if(this.state.tipoAtivo === 'normal') { 
            this.setState({
                percentualBasicoPatrocinador: this.state.percentualBasicoParticipante,
                beneficioRiscoInvalidezPatrocinador: this.state.beneficioRiscoInvalidezParticipante,
                beneficioRiscoPensaoMortePatrocinador: this.state.beneficioRiscoPensaoMorteParticipante,
                sobrevivenciaPatrocinador: this.state.sobrevivenciaParticipante,
                carregamentoContribuicaoBasicaPatrocinador: this.state.carregamentoContribuicaoBasicaParticipante
            }, () => { 
                console.log(this.state);
                this.props.setPassoAtivo(3, this.state);
            });
        }

        if(this.state.tipoAtivo !== 'normal') { 
            this.setState({
                percentualBasicoPatrocinador: 0.00,
                beneficioRiscoInvalidezPatrocinador: 0.00,
                beneficioRiscoPensaoMortePatrocinador: 0.00,
                sobrevivenciaPatrocinador: 0.00,
                carregamentoContribuicaoBasicaPatrocinador: 0.00
            }, () => { 
                console.log(this.state);
                this.props.setPassoAtivo(3, this.state);
            });
        }
    }

    /**
     * @param {string} campo Valor atual do state a ser verificado.
     * @param {float} valorMaximo Valor máximo a ser comparado.
     * @description Método que verifica se o valor do Combo está ou não no valor máximo. É utilizado dentro da propriedade 'disabled' dos inputs que devem estar
     * desativados quando o valor não é igual ao valor máximo.
     * @returns {boolean} Booleano que informa se o valor do Combo está no máximo ou não.
     */
    verificarValorMaximo(campo, valorMaximo) {
        var valor = parseFloat(campo);

        return valor !== valorMaximo;
    }

    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método que atualiza o state do campo que disparou o evento.
     */
    adicionalChange(event) {
        const target = event.target;
        var nome = target.name;
        var valor = target.value;

        this.setState({
            [nome]: valor
        });
    }

    /**
     * @returns {Boolean} Valor que representa se o campo Sobrevivência Adicional deve ou não ficar desabilitado.
     * @description Método que checa o state 'temSobrevivencia' e a ocorrência do valor máximo no combo Sobrevivência Participante para definir se o campo Sobrevivencia Adicional deve ou não ficar desabilitado.
     */
    desabilitaCamposSobrevivencia() {
        var campoDesabilitado = !this.state.temSobrevivencia || this.verificarValorMaximo(this.state.sobrevivenciaParticipante, 1);
        return campoDesabilitado;
    }

    render() {
        return (
            <div id="passo2" hidden={this.props.hidden}>
                <h2 align="center">Ótimo {this.state.nome}! Agora vamos definir a sua contribuição para o Plano PREVES SE!</h2>
                <br />
                <div className="form-group row">
                    <div className="col-2 offset-5 text-center">
                        <h5 className="text-secondary">Participante</h5>
                    </div>
                    <div className="col-2 text-center">
                        <h5 className="text-secondary">Patrocinador</h5>
                    </div>
                </div>

                <Campo id="percentualBasicoParticipante" label="Percentual Básico" usaBotaoAjuda textoModal={this.state.tipoAtivo === 'normal' ?  textos.percentualBasico : textos.percentualBasicoCDT}>
                    <div className="input-group col-2 text-center">
                        <Combo id="percentualBasicoParticipante" min={3.00} max={8.5} incremento={0.5} decimais 
                            value={this.state.percentualBasicoParticipante} onChange={this.handlePercentualBasicoChange} />
                        <div className="input-group-append">
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                    
                    <div className="form-control-plaintext col-2 text-center">
                        {this.renderContribuicaoPatrocinador(this.state.percentualBasicoParticipante)}%
                    </div>
                </Campo>

                <Campo id="beneficioRiscoInvalidezParticipante" label="Benefício de Risco - Invalidez" usaBotaoAjuda textoModal={this.state.tipoAtivo === 'normal' ? textos.beneficioRisco : textos.beneficioRiscoCDT}>
                    <div className="input-group col-2 text-center">
                        <Combo id="beneficioRiscoInvalidezParticipante" min={0} max={this.state.beneficioRiscoInvalidezMax} incremento={0.10} decimais 
                            value={this.state.beneficioRiscoInvalidezParticipante} onChange={this.handleRiscoInvalidezChange} />
                        <div className="input-group-append">
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                    
                    <div className="form-control-plaintext col-2 text-center">
                        {this.renderContribuicaoPatrocinador(this.state.beneficioRiscoInvalidezParticipante)}%
                    </div>
                </Campo>

                <Campo id="beneficioRiscoPensaoMorteParticipante"label="Benefício de Risco - Pensão por Morte" usaBotaoAjuda textoModal={textos.beneficioRisco}>
                    <div className="input-group col-2 text-center">
                        <Combo id="beneficioRiscoPensaoMorteParticipante" min={0} max={this.state.beneficioRiscoPensaoMorteMax} incremento={0.10} decimais 
                            value={this.state.beneficioRiscoPensaoMorteParticipante} onChange={this.handleRiscoPensaoMorteChange} />
                        <div className="input-group-append">
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                    
                    <div className="form-control-plaintext col-2 text-center">
                        {this.renderContribuicaoPatrocinador(this.state.beneficioRiscoPensaoMorteParticipante)}%
                    </div>
                </Campo>

                <Campo id="sobrevivenciaParticipante" label="Sobrevivência" usaBotaoAjuda textoModal={this.state.tipoAtivo === 'normal' ? textos.sobrevivencia : textos.sobrevivenciaCDT}>
                    <div className="input-group col-2 text-center">
                        <Combo id="sobrevivenciaParticipante" min={0} max={1} incremento={0.1} decimais comboDesativado={!this.state.temSobrevivencia}
                            value={this.state.temSobrevivencia ? this.state.sobrevivenciaParticipante : '0,00'} onChange={this.handleSobrevivenciaChange} />
                        <div className="input-group-append">
                            <span className="input-group-text">%</span>
                        </div>
                    </div>
                    
                    <div className="form-control-plaintext col-2 text-center">
                        {this.renderContribuicaoPatrocinador(this.state.sobrevivenciaParticipante)}%
                    </div>
                </Campo>

                <Campo label="Carregamento Contribuição Básica" usaBotaoAjuda textoModal={this.state.tipoAtivo === 'normal' ? textos.carregamentoContribuicaoBasica : textos.carregamentoContribuicaoAdicionalCDT}>
                    <div className="form-control-plaintext col-2 text-center">
                        {this.renderPercentual(this.state.carregamentoContribuicaoBasicaParticipante)}%
                    </div>
                    
                    <div className="form-control-plaintext col-2 text-center">
                        {this.renderContribuicaoPatrocinador(this.state.carregamentoContribuicaoBasicaParticipante)}%
                    </div>
                </Campo>
                <br/>
                <br/>

                <h3 className="text-center">
                    Que tal contribuir adicionalmente para melhorar sua aposentadoria?
                </h3>
                <br />
                <h5 className="text-center text-secondary">
                    Contribuição adicional sem paridade
                </h5>
                
                <Campo id="aposentadoriaAdicional" label="Aposentadoria" usaBotaoAjuda textoModal={textos.aposentadoriaAdicional}>
                    <div className="col-2">
                        <div className="input-group">
                            <input id="aposentadoriaAdicional" maxLength="6" name="aposentadoriaAdicional" className="form-control percent" placeholder="0,00" disabled={this.verificarValorMaximo(this.state.percentualBasicoParticipante, 8.5)} 
                                onChange={this.adicionalChange} value={this.state.aposentadoriaAdicional.replace('.', ',')} onBlur={this.onBlurInput} />
                            <div className="input-group-append">
                                <span className="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                </Campo>
                
                <Campo id="invalidezAdicional" label="Invalidez" label2="(Risco de aceitação da seguradora)" usaBotaoAjuda textoModal={textos.invalidezAdicional}>
                    <div className="col-2">
                        <div className="input-group">
                            <input id="invalidezAdicional" name="invalidezAdicional" maxLength="6" className="form-control percent" placeholder="0,00" disabled={this.verificarValorMaximo(this.state.beneficioRiscoSoma, 1)} 
                                onChange={this.adicionalChange} value={this.state.invalidezAdicional.replace('.', ',')} onBlur={this.onBlurInput} />
                            <div className="input-group-append">
                                <span className="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                </Campo>
                
                <Campo id="pensaoMorteAdicional" label="Pensão por Morte" label2="(Risco de aceitação da seguradora)" usaBotaoAjuda textoModal={textos.pensaoMorteAdicional}>
                    <div className="col-2">
                        <div className="input-group">
                            <input id="pensaoMorteAdicional" name="pensaoMorteAdicional" maxLength="6" className="form-control percent" placeholder="0,00" disabled={this.verificarValorMaximo(this.state.beneficioRiscoSoma, 1)} 
                                onChange={this.adicionalChange} value={this.state.pensaoMorteAdicional.replace('.', ',')} onBlur={this.onBlurInput} />
                            <div className="input-group-append">
                                <span className="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                </Campo>
                
                <Campo id="sobrevivenciaAdicional" label="Sobrevivência" usaBotaoAjuda textoModal={textos.sobrevivenciaAdicional}>
                    <div className="col-2">
                        <div className="input-group">
                            <input id="sobrevivenciaAdicional" name="sobrevivenciaAdicional" maxLength="6" className="form-control percent" placeholder="0,00" disabled={this.desabilitaCamposSobrevivencia()} 
                                onChange={this.adicionalChange} value={this.state.sobrevivenciaAdicional.replace('.', ',')} onBlur={this.onBlurInput} />
                            <div className="input-group-append">
                                <span className="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                </Campo>
                
                <Campo label="Carregamento contribuição Adicional" usaBotaoAjuda textoModal={this.state.tipoAtivo === 'normal' ? textos.carregamentoContribuicaoAdicional : textos.carregamentoContribuicaoAdicionalCDT}>
                    <div className="form-control-plaintext col-2 text-center">
                        {this.renderPercentual(this.state.carregamentoContribuicaoAdicional)}%
                    </div>
                </Campo>
                <Campo label="Totalizador da Taxa para Aposentadoria">
                    <div className="form-control-plaintext col-2 text-center">
                        {this.renderPercentual(this.state.totalizadorTaxaAposentadoria)}%
                    </div>
                </Campo>
                <br/>

                <div className="row justify-content-center">
                    <button className="btn btn-lg btn-dark mr-3" onClick={() => this.props.setPassoAtivo(1, this.state)}>Voltar</button>
                    <button className="btn btn-lg btn-primary" onClick={() => this.atualizarStatesPatrocinador()}>Continuar</button>
                </div>
            </div>
        );
    }
}
