import React from 'react';
import BotaoAjuda from "./_shared/BotaoAjuda";
import Campo from "./_shared/Campo"
import { SimNaoParticipanteService } from '../services';

var service = new SimNaoParticipanteService();

export default class Passo3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;

        this.handleInputChange = props.handleInputChange.bind(this);
        this.renderResultado = this.renderResultado.bind(this);
        this.novaSimulacao = this.novaSimulacao.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.enviarEmail = this.enviarEmail.bind(this);
        this.emailValido = this.emailValido.bind(this);
        this.telefoneValido = this.telefoneValido.bind(this);
        this.renderizaErro = this.renderizaErro.bind(this);
        this.gerarCorpoEmail = this.gerarCorpoEmail.bind(this);
    }

    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método que atualiza o state do campo que disparou o evento ao alterar valor, chamando o método 'handleInputChange', que realiza um callback, caso tenha.
     */
    onChangeInput(event) {
        this.handleInputChange(event);
    }

    onVisible(state) {
        this.setState(state);

        if(state.aposentadoriaAdicional === '')
            state.aposentadoriaAdicional = '0,00';

        if(state.invalidezAdicional === '')
            state.invalidezAdicional = '0,00';

        if(state.pensaoMorteAdicional === '')
            state.pensaoMorteAdicional = '0,00';

        if(state.sobrevivenciaAdicional === '')
            state.sobrevivenciaAdicional = '0,00';

        var dados = {
            idade: state.idade,
            idadeDecimal: state.idadeDecimal.toFixed(2),
            tipoAtivo: state.tipoAtivo,
            idadeAposentadoria: state.idadeAposentadoria,
            tempoAposentadoria: state.tempoAposentadoria,
            tempoSobrevivencia: state.tempoSobrevivencia,
            remuneracaoInicial: state.remuneracaoInicial,
            remuneracaoFinal: state.remuneracaoFinal,
            taxaCrescimentoSalarial: state.taxaCrescimentoSalarial,
            taxaJurosReal: state.taxaJurosReal,

            percentualBasicoParticipante: state.percentualBasicoParticipante,
            beneficioRiscoInvalidezParticipante: state.beneficioRiscoInvalidezParticipante,
            beneficioRiscoPensaoMorteParticipante: state.beneficioRiscoPensaoMorteParticipante,
            sobrevivenciaParticipante: state.sobrevivenciaParticipante,
            carregamentoContribuicaoBasicaParticipante: state.carregamentoContribuicaoBasicaParticipante,

            percentualBasicoPatrocinador: state.percentualBasicoPatrocinador,
            beneficioRiscoInvalidezPatrocinador: state.beneficioRiscoInvalidezPatrocinador,
            beneficioRiscoPensaoMortePatrocinador: state.beneficioRiscoPensaoMortePatrocinador,
            sobrevivenciaPatrocinador: state.sobrevivenciaPatrocinador,
            carregamentoContribuicaoBasicaPatrocinador: state.carregamentoContribuicaoBasicaPatrocinador,

            contribuicaoAdicionalAposentadoria: state.aposentadoriaAdicional.replace(',', '.'),
            contribuicaoAdicionalInvalidez: state.invalidezAdicional.replace(',', '.'),
            contribuicaoAdicionalPensaoMorte: state.pensaoMorteAdicional.replace(',', '.'),
            contribuicaoAdicionalSobrevivencia: state.sobrevivenciaAdicional.replace(',', '.'),
            carregamentoContribuicaoAdicional: state.carregamentoContribuicaoAdicional
        }
        
        service.CalcularSimulacao(dados, (result) => {
            this.mostrarResultado(result.data, this);
        }, (err) => {
            console.error(err);
        });
    }

    mostrarResultado(dados, context) {
        context.setState({
            contribuicaoInicialAposentadoriaParticipante: dados.contribuicaoInicialAposentadoriaParticipante.toFixed(2),
            contribuicaoInicialAposentadoriaPatrocinador: dados.contribuicaoInicialAposentadoriaPatrocinador.toFixed(2),
            contribuicaoInicialInvalidezParticipante: dados.contribuicaoInicialInvalidezParticipante.toFixed(2),
            contribuicaoInicialInvalidezPatrocinador: dados.contribuicaoInicialInvalidezPatrocinador.toFixed(2),
            contribuicaoInicialPensaoMorteParticipante: dados.contribuicaoInicialPensaoMorteParticipante.toFixed(2),
            contribuicaoInicialPensaoMortePatrocinador: dados.contribuicaoInicialPensaoMortePatrocinador.toFixed(2),
            contribuicaoInicialSobrevivenciaParticipante: dados.contribuicaoInicialSobrevivenciaParticipante.toFixed(2),
            contribuicaoInicialSobrevivenciaPatrocinador: dados.contribuicaoInicialSobrevivenciaPatrocinador.toFixed(2),
            carregamentoTotalParticipante: dados.carregamentoTotalParticipante.toFixed(2),
            carregamentoTotalPatrocinador: dados.carregamentoTotalPatrocinador.toFixed(2),
            contribuicaoInicialTotalAposentadoria: dados.contribuicaoInicialTotalAposentadoria.toFixed(2),
            contribuicaoInicialTotalInvalidez: dados.contribuicaoInicialTotalInvalidez.toFixed(2),
            contribuicaoInicialTotalPensaoMorte: dados.contribuicaoInicialTotalPensaoMorte.toFixed(2),
            contribuicaoInicialTotalSobrevivencia: dados.contribuicaoInicialTotalSobrevivencia.toFixed(2),
            contribuicaoInicialTotalCarregamentoTotal: dados.contribuicaoInicialTotalCarregamentoTotal.toFixed(2),
            contribuicaoTotalParticipante: dados.contribuicaoTotalParticipante.toFixed(2),
            contribuicaoTotalPatrocinador: dados.contribuicaoTotalPatrocinador.toFixed(2),
            contribuicaoTotal: dados.contribuicaoTotal.toFixed(2),
            montanteAposentadoria: dados.montanteAposentadoria.toFixed(2),
            montanteInvalidez: dados.montanteInvalidez.toFixed(2),
            montantePensaoMorte: dados.montantePensaoMorte.toFixed(2),
            montanteSobrevivencia: dados.montanteSobrevivencia.toFixed(2),
            beneficioMensalAposentadoria: dados.beneficioMensalAposentadoria,
            beneficioMensalInvalidez: dados.beneficioMensalInvalidez,
            beneficioMensalPensaoMorte: dados.beneficioMensalPensaoMorte,
            beneficioMensalSobrevivencia: dados.beneficioMensalSobrevivencia,
            remuneracaoFinalCrescimentoBianual: dados.remuneracaoFinalCrescimentoBianual
        })
    }

    /**
     * @param {string} valor Valor a ser renderizado.
     * @description Método que retorna o valor a ser mostrado ao usuário, que deve estar no formato brasileiro com vírgula (,) no lugar de ponto (.) para separar as casas decimais.
     * Além disso, deve ter o separador de milhares (.).
     */
    renderResultado(valor) {
        if(isNaN(valor))
            valor = '0,00';
            
        valor = parseFloat(valor);
        valor = valor.toFixed(2).split('.');
        valor[0] = valor[0].split(/(?=(?:...)*$)/).join('.');   // Regex utilizada para colocar um (.) a cada 3 casas decimais antes da vírgula, para separar os milhares.

        return valor.join(',');
    }

    /**
     * @description Método responsável por dar refresh na página, resetando os states e consequentemente settando o passo para 1.
     */
    novaSimulacao() {
        window.location.reload();
    }

    /**
     * @description Método que verifica se os campos estão corretamente preenchidos e envia o e-mail.
     */
    enviarEmail() {
        var emailValido = this.emailValido();
        var telefoneValido = this.telefoneValido();

        // Envia-se o 'NOT' do valor válido pois o método que renderiza o erro checa se o valor é Inválido (não válido).
        this.renderizaErro("erroEmail", !emailValido);
        this.renderizaErro("erroTelefone", !telefoneValido);

        var dadosEmail = {
            Destinatario: this.state.email,
            Assunto: "Resultados Simulador Não Participantes",
            Corpo: ""
        }
        
        if(emailValido && telefoneValido) {
            dadosEmail.Corpo = this.gerarCorpoEmail();
            service.EnviarEmail(dadosEmail, () => {
                this.setState({emailEnviado: true});
            }, (err) => console.error(err));
        }
    }

    /**
     * @returns {boolean} Valor que representa se o e-mail é válido ou não.
     * @description Método que valida o e-mail. Um e-mail válido deve ter: ao menos um caractere antes do '@', ao menos 3 caracteres no domínio (letra, ponto e caractere após o ponto),
     * usuário e domínio não pode conter '@', usuário e domínio não pode conter espaço em branco, domínio deve conter ponto, a posição do primeiro ponto deve
     * ser maior ou igual a 1 e a posição do último ponto deve ser menor que a posição do último caractere (pois o domínio deve finalizar com um caractere diferente
     * de ponto.) 
     */
    emailValido() {
        // usuario armazena toda a string antes do '@', e dominio armazena toda string após o '@'.
        var usuario = this.state.email.substring(0, this.state.email.indexOf("@"));
        var dominio = this.state.email.substring(this.state.email.indexOf("@") + 1, this.state.email.length);

        var usuarioValido = (usuario.length >= 1) && (usuario.search(" ") === -1) && (usuario.search("@") === -1);
        var dominioValido = (dominio.length >= 3) && (dominio.search(" ") === -1) && (dominio.search("@") === -1);
        
        var pontoPosicaoValida = (dominio.search(".") !== -1) && (dominio.indexOf(".") >= 1) && (dominio.lastIndexOf(".") < dominio.length - 1);

        if(usuarioValido && dominioValido && pontoPosicaoValida) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @returns {boolean} Valor que representa se o telefone é válido ou não.
     * @description Método que checa se o telefone é válido. Para isso, a string deve conter 15 caracteres (onze números, dois parênteses, um espaço e um hífen (já contidos na máscara)).
     */
    telefoneValido() {
        if(this.state.telefone.length === 15) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {string} campoErro Valor que representa o state do erro a ser alterado. 
     * @param {boolean} valor Valor a ser armazenado no state de erro.
     * @description Método que altera o state de erro. Ao alterar o state de erro a mensagem é renderizada (ou deixa de ser mostrada caso já esteja renderizada).
     */
    renderizaErro(campoErro, valor) {
        this.setState({
            [campoErro]: valor
        })
    }

    /**
     * @returns {string} Corpo do e-mail com os dados do usuário e os resultados gerados pelo simulador.
     * @description Método que gera a mensagem do e-mail a partir dos states.
     */
    gerarCorpoEmail() {
        var dataNascimento = document.getElementById("dataNascimento").value;
        var remuneracaoAdicional = this.state.remuneracaoFinalCrescimentoBianual - this.state.rgps;
        var rgps = this.state.rgps;
        if(this.state.tipoAtivo !== 'normal')
            rgps = 0;

        var mensagem = "Dados pessoais do Não Participante:<br>" +
        "Nome: " + this.state.nome + "<br>" + 
        "Data de nascimento: " + dataNascimento + "<br>" +
        "Idade: " + this.state.idadeDecimal.toFixed(2) + "<br>" +
        "Telefone: " + this.state.telefone + "<br>" + 
        "E-mail: " + this.state.email + "<br><br>" + 

        "Dados de entrada do Não Participante no Simulador: <br>" + 
        "Tipo de Ativo: " + this.state.tipoAtivo + "<br>" +
        "Idade de aposentadoria: " + this.state.idadeAposentadoria + " anos<br>" +
        "Tempo de aposentadoria: " + this.state.tempoAposentadoria + " anos<br>" +
        "Tempo de sobrevivência: " + this.state.tempoSobrevivencia + " anos<br>" +
        "Remuneração inicial: R$ " + this.state.remuneracaoInicial + "<br>" +
        "Remuneração final: R$ " + this.state.remuneracaoFinal + "<br>" +
        "Taxa de crescimento salarial: " + this.state.taxaCrescimentoSalarial + "% a cada dois anos<br>" +
        "Taxa de juros real: " + this.state.taxaJurosReal + "%<br>" +
        "Percentual Básico do Participante: " + this.state.percentualBasicoParticipante + "%<br>" +
        "Percentual Básico do Patrocinador: " + this.state.percentualBasicoPatrocinador + "%<br>" +
        "Benefício de Risco por Invalidez do Participante: " + this.state.beneficioRiscoInvalidezParticipante + "%<br>" + 
        "Benefício de Risco por Invalidez do Patrocinador: " + this.state.beneficioRiscoInvalidezPatrocinador + "%<br>" + 
        "Benefício de Risco por Pensão por Morte do Participante: " + this.state.beneficioRiscoPensaoMorteParticipante + "%<br>" + 
        "Benefício de Risco por Pensão por Morte do Patrocinador: " + this.state.beneficioRiscoPensaoMortePatrocinador + "%<br>" + 
        "Sobrevivência do Participante: " + this.state.sobrevivenciaParticipante + "%<br>" + 
        "Sobrevivência do Patrocinador: " + this.state.sobrevivenciaPatrocinador + "%<br>" + 
        "Carregamento Contribuição Básica do Participante: " + this.state.carregamentoContribuicaoBasicaParticipante + "%<br>" + 
        "Carregamento Contribuição Básica do Patrocinador: " + this.state.carregamentoContribuicaoBasicaPatrocinador + "%<br>" + 
        "Contribuição Adicional - Aposentadoria: " + this.state.aposentadoriaAdicional + "%<br>" +
        "Contribuição Adicional - Invalidez: " + this.state.invalidezAdicional + "%<br>" +
        "Contribuição Adicional - Pensão por Morte: " + this.state.pensaoMorteAdicional + "%<br>" +
        "Contribuição Adicional - Sobrevivência: " + this.state.sobrevivenciaAdicional + "%<br>" +
        "Carregamento Contribuição Adicional: " + this.state.carregamentoContribuicaoAdicional + "%<br>" +
        "Totalizador da taxa para aposentadoria: " + this.state.totalizadorTaxaAposentadoria + "%<br><br><br>" + 

        "Resultados gerados pelo Simulador:<br><br>" + 
        "Valores das Contribuições Iniciais: <br>" + 
        "Aposentadoria - Contribuição Inicial Participante: R$ " + this.state.contribuicaoInicialAposentadoriaParticipante + "<br>" +
        "Benefício de Risco por Invalidez - Contribuição Inicial Participante: R$ " + this.state.contribuicaoInicialInvalidezParticipante + "<br>" + 
        "Benefício de Risco por Pensão por Morte - Contribuição Inicial Participante: R$ " + this.state.contribuicaoInicialPensaoMorteParticipante + "<br>" + 
        "Sobrevivência - Contribuição Inicial Participante: R$ " + this.state.contribuicaoInicialSobrevivenciaParticipante + "<br>" + 
        "Carregamento Total - Contribuição Inicial Participante: R$ " + this.state.carregamentoTotalParticipante + "<br>" + 
        "Contribuição Inicial Participante - Contribuição Total: R$ " + this.state.contribuicaoTotalParticipante + "<br><br>" + 

        "Aposentadoria - Contribuição Inicial Patrocinador: R$ " + this.state.contribuicaoInicialAposentadoriaPatrocinador + "<br>" +
        "Benefício de Risco por Invalidez - Contribuição Inicial Patrocinador: R$ " + this.state.contribuicaoInicialInvalidezPatrocinador + "<br>" + 
        "Benefício de Risco por Pensão por Morte - Contribuição Inicial Patrocinador: R$ " + this.state.contribuicaoInicialPensaoMortePatrocinador + "<br>" + 
        "Sobrevivência - Contribuição Inicial Patrocinador: R$ " + this.state.contribuicaoInicialSobrevivenciaPatrocinador + "<br>" + 
        "Carregamento Total - Contribuição Inicial Patrocinador: R$ " + this.state.carregamentoTotalPatrocinador + "<br>" + 
        "Contribuição Inicial Patrocinador - Contribuição Total: R$ " + this.state.contribuicaoTotalPatrocinador + "<br><br>" +
        "CONTRIBUIÇÃO INICIAL TOTAL: R$ " + this.state.contribuicaoTotal + "<br><br>" +

        "Valores dos Montantes Acumulados:<br>" + 
        "Aposentadoria: R$ " + this.state.montanteAposentadoria + "<br>" +
        "Benefício de Risco - Invalidez: R$ " + this.state.montanteInvalidez + "<br>" + 
        "Benefício de Risco - Pensão por Morte: R$ " + this.state.montantePensaoMorte + "<br>" + 
        "Sobrevivência: R$ " + this.state.montanteSobrevivencia + "<br><br>" + 
        
        "Valores do Benefício Mensal Simulado: <br>" + 
        "Aposentadoria: R$ " + this.state.beneficioMensalAposentadoria.toFixed(2) + "<br>" +
        "Benefício de Risco - Invalidez: R$ " + this.state.beneficioMensalInvalidez.toFixed(2) + "<br>" + 
        "Benefício de Risco - Pensão por Morte: R$ " + this.state.beneficioMensalPensaoMorte.toFixed(2) + "<br>" + 
        "Sobrevivência: R$ " + this.state.beneficioMensalSobrevivencia.toFixed(2) + "<br><br>" + 

        "Outras Informações: <br>" + 
        "Remuneração Final estipulada pelo Crescimento Bianual: R$ " + this.state.remuneracaoFinalCrescimentoBianual.toFixed(2) + "<br>" + 
        "Remuneração Máxima paga pelo RPPS/RGPS na aposentadoria: R$ " + rgps + "<br>" +
        "Remuneração Adicional Desejada na Aposentadoria: R$ " + remuneracaoAdicional.toFixed(2);

        return mensagem;
    }

    render() {
        return (
            <div id="passo3" hidden={this.props.hidden}>
                <h3 align="center">{this.state.nome}, vamos ver quanto você vai contribuir inicialmente e quanto você vai acumular até a data da sua aposentadoria!</h3>
                <div className="container" aling="center">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Contrib. Inicial Participante</th>
                                    <th>Contrib. Inicial Patrocinador</th>
                                    <th>Contribuição Inicial Total</th>
                                    <th>Montante Acumulado</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Aposentadoria</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialAposentadoriaParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialAposentadoriaPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalAposentadoria)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.montanteAposentadoria)}</label></td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td>Benefício de Risco - Invalidez</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialInvalidezParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialInvalidezPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalInvalidez)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.montanteInvalidez)}</label></td>
                                    <td><BotaoAjuda textoModal="Sujeito a aceitação da Seguradora." /></td>
                                </tr>

                                <tr>
                                    <td>Benefício de Risco - Pensão por Morte</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialPensaoMorteParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialPensaoMortePatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalPensaoMorte)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.montantePensaoMorte)}</label></td>
                                    <td><BotaoAjuda textoModal="Sujeito a aceitação da Seguradora." /></td>
                                </tr>

                                <tr>
                                    <td>Sobrevivência</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialSobrevivenciaParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialSobrevivenciaPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalSobrevivencia)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.montanteSobrevivencia)}</label></td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td>Carregamento Total</td>
                                    <td><label>R$ {this.renderResultado(this.state.carregamentoTotalParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.carregamentoTotalPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalCarregamentoTotal)}</label></td>
                                    <td>-</td>
                                    <td></td>
                                </tr>

                                <tr>
                                    <td>Contribuição Total</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoTotalParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoTotalPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoTotal)}</label></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div align="center">
                        <h3>Com base nos parâmetros informados e nas projeções </h3>
                        <h3>calculadas, esses são os resultados comparativos estimados:</h3><br /><br />
                    </div>

                    <div className="responsive-table">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>BENEFÍCIO MENSAL SIMULADO</th>
                                    <th>PREVES</th>
                                    <th>PREVES + RPPS/RGPS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Aposentadoria</td>
                                    <td><label>R$ {this.renderResultado(this.state.beneficioMensalAposentadoria)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.tipoAtivo === 'normal' ? this.state.beneficioMensalAposentadoria + this.state.rgps : this.state.beneficioMensalAposentadoria)}</label></td>
                                </tr>
                                <tr>
                                    <td>Benefício de risco - Invalidez</td>
                                    <td><label>R$ {this.renderResultado(this.state.beneficioMensalInvalidez)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.tipoAtivo === 'normal' ? this.state.beneficioMensalInvalidez + this.state.rgps : this.state.beneficioMensalInvalidez)}</label></td>
                                </tr>
                                <tr>
                                    <td>Benefício de risco - Pensão por Morte</td>
                                    <td><label>R$ {this.renderResultado(this.state.beneficioMensalPensaoMorte)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.tipoAtivo === 'normal' ? this.state.beneficioMensalPensaoMorte + this.state.rgps: this.state.beneficioMensalPensaoMorte)}</label></td>
                                </tr>
                                <tr>
                                    <td>Sobrevivência</td>
                                    <td><label>R$ {this.renderResultado(this.state.beneficioMensalSobrevivencia)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.tipoAtivo === 'normal' ? this.state.beneficioMensalSobrevivencia + this.state.rgps : this.state.beneficioMensalSobrevivencia)}</label></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="row">
                        <div className="col">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>OUTRAS INFORMAÇÕES</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Remuneração final estimulada pelo Crescimento Bianual</td>
                                        <td>R$ {this.renderResultado(this.state.remuneracaoFinalCrescimentoBianual)}</td>
                                    </tr>
                                    <tr>
                                        <td>Remuneração Máxima paga pelo RPPS/RGPS na aposentadoria</td>
                                        <td>{this.state.tipoAtivo === 'normal' ? "R$ " + this.renderResultado(this.state.rgps) : "-"}</td>
                                    </tr>
                                    <tr>
                                        <td>Remuneração Adicional Desejada na Aposentadoria</td>
                                        <td>R$ {this.renderResultado(this.state.tipoAtivo === 'normal' ? this.state.remuneracaoFinalCrescimentoBianual - this.state.rgps : this.state.remuneracaoFinalCrescimentoBianual)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <br />

                    <div className="row justify-content-center">
                        <button type="button" className="btn btn-lg btn-dark mr-3" onClick={() => this.props.setPassoAtivo(2, this.state)}>Voltar</button>
                        <button type="button" className="btn btn-lg btn-primary" onClick={() => this.novaSimulacao()}>Realizar nova Simulação</button>
                    </div>
                    <br />

                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                        
                        <div className="card-header">
                            <div className="row justify-content-center">
                                <h3>Entre em contato conosco!</h3>
                            </div>
                        </div>

                            <div className="card-body">
                                <Campo id="email" label="Seu e-mail:" mensagemErro="Campo Inválido!" mostrarErro={this.state.erroEmail}>
                                    <div className="col-5">
                                        <input id="email" name="email" type="text" className="form-control" maxLength="80" onChange={this.onChangeInput} value={this.state.email} />
                                    </div>
                                </Campo>
                                <Campo id="telefone" label="Seu telefone:" mensagemErro="Campo Inválido!" mostrarErro={this.state.erroTelefone}>
                                    <div className="col-5">
                                        <input id="telefone" name="telefone" type="text" className="form-control telefone" maxLength="80" onChange={this.onChangeInput} value={this.state.telefone} />
                                    </div>
                                </Campo>
                                <div className="row justify-content-center">
                                    <button type="button" className="btn btn-md btn-primary" onClick={() => this.enviarEmail()}>Enviar Resultado</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center">
                                {this.state.emailEnviado &&
                                    <div className="text text-primary" role="alert">
                                        <i className="fas fa-check" />&nbsp;
                                        E-mail enviado com sucesso!
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
