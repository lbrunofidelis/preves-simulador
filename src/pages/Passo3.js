import React from 'react';
import BotaoAjuda from "./_shared/BotaoAjuda";
import { SimNaoParticipanteService } from '../services';

var simuladorService = new SimNaoParticipanteService();

export default class Passo3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;

        this.renderResultado = this.renderResultado.bind(this);
        this.novaSimulacao = this.novaSimulacao.bind(this);

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
        
        simuladorService.CalcularSimulacao(dados, (result) => {
            this.mostrarResultado(result.data, this);
        }, (err) => {
            console.error(err);
        });
    }

    mostrarResultado(dados, context) {
        context.setState({
            contribuicaoInicialAposentadoriaParticipante: dados.contribuicaoInicialAposentadoriaParticipante,
            contribuicaoInicialAposentadoriaPatrocinador: dados.contribuicaoInicialAposentadoriaPatrocinador,
            contribuicaoInicialInvalidezParticipante: dados.contribuicaoInicialInvalidezParticipante,
            contribuicaoInicialInvalidezPatrocinador: dados.contribuicaoInicialInvalidezPatrocinador,
            contribuicaoInicialPensaoMorteParticipante: dados.contribuicaoInicialPensaoMorteParticipante,
            contribuicaoInicialPensaoMortePatrocinador: dados.contribuicaoInicialPensaoMortePatrocinador,
            contribuicaoInicialSobrevivenciaParticipante: dados.contribuicaoInicialSobrevivenciaParticipante,
            contribuicaoInicialSobrevivenciaPatrocinador: dados.contribuicaoInicialSobrevivenciaPatrocinador,
            carregamentoTotalParticipante: dados.carregamentoTotalParticipante,
            carregamentoTotalPatrocinador: dados.carregamentoTotalPatrocinador,
            contribuicaoInicialTotalAposentadoria: dados.contribuicaoInicialTotalAposentadoria,
            contribuicaoInicialTotalInvalidez: dados.contribuicaoInicialTotalInvalidez,
            contribuicaoInicialTotalPensaoMorte: dados.contribuicaoInicialTotalPensaoMorte,
            contribuicaoInicialTotalSobrevivencia: dados.contribuicaoInicialTotalSobrevivencia,
            contribuicaoInicialTotalCarregamentoTotal: dados.contribuicaoInicialTotalCarregamentoTotal,
            contribuicaoTotalParticipante: dados.contribuicaoTotalParticipante,
            contribuicaoTotalPatrocinador: dados.contribuicaoTotalPatrocinador,
            contribuicaoTotal: dados.contribuicaoTotal,
            montanteAposentadoria: dados.montanteAposentadoria,
            montanteInvalidez: dados.montanteInvalidez,
            montantePensaoMorte: dados.montantePensaoMorte,
            montanteSobrevivencia: dados.montanteSobrevivencia
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
                                    <td><BotaoAjuda /></td>
                                </tr>

                                <tr>
                                    <td>Benefício de Risco - Invalidez</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialInvalidezParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialInvalidezPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalInvalidez)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.montanteInvalidez)}</label></td>
                                    <td><BotaoAjuda /></td>
                                </tr>

                                <tr>
                                    <td>Benefício de Risco - Pensão por Morte</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialPensaoMorteParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialPensaoMortePatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalPensaoMorte)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.montantePensaoMorte)}</label></td>
                                    <td><BotaoAjuda /></td>
                                </tr>

                                <tr>
                                    <td>Sobrevivência</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialSobrevivenciaParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialSobrevivenciaPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalSobrevivencia)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.montanteSobrevivencia)}</label></td>
                                    <td><BotaoAjuda /></td>
                                </tr>

                                <tr>
                                    <td>Carregamento Total</td>
                                    <td><label>R$ {this.renderResultado(this.state.carregamentoTotalParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.carregamentoTotalPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoInicialTotalCarregamentoTotal)}</label></td>
                                    <td>-</td>
                                    <td><BotaoAjuda /></td>
                                </tr>

                                <tr>
                                    <td>Contribuição Total</td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoTotalParticipante)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoTotalPatrocinador)}</label></td>
                                    <td><label>R$ {this.renderResultado(this.state.contribuicaoTotal)}</label></td>
                                    <td></td>
                                    <td><BotaoAjuda /></td>
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
                                    <td><label>R$ {}</label></td>
                                    <td><label>R$ {}</label></td>
                                </tr>
                                <tr>
                                    <td>Benefício de risco - Invalidez</td>
                                    <td><label>R$ {}</label></td>
                                    <td><label>R$ {}</label></td>
                                </tr>
                                <tr>
                                    <td>Benefício de risco - Pensão por Morte</td>
                                    <td><label>R$ {}</label></td>
                                    <td><label>R$ {}</label></td>
                                </tr>
                                <tr>
                                    <td>Sobrevivência</td>
                                    <td><label>R$ {}</label></td>
                                    <td><label>R$ {}</label></td>
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
                                        <td>R$ {}</td>
                                    </tr>
                                    <tr>
                                        <td>Remuneração Máxima paga pelo RPPS/RGPS na aposentadoria</td>
                                        <td>R$ {}</td>
                                    </tr>
                                    <tr>
                                        <td>Remuneração Adicional Desejada na Aposentadoria</td>
                                        <td>R$ {}</td>
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
                </div>
            </div>
        );
    }
}
