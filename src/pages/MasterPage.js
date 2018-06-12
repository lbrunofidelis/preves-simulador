import React from "react";
import { Passo1, Passo2, Passo3 } from ".";

export default class MasterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passo: 3,

            // States Passo 1:
            nome: "",
            dataNascimento: "",
            idade: "50",
            idadeDecimal: "",
            tipoAtivo: "normal",
            idadeAposentadoria: "40",
            tempoAposentadoria: "20",
            tempoSobrevivencia: "5",
            remuneracaoInicial: "",
            remuneracaoFinal: "",
            taxaCrescimentoSalarial: "2.00",
            taxaJurosReal: "4.5",
            termosAceitos: false,
            rgps: 0,
            
            // States validação 
            erroNome: false,
            erroDataInvalida: false,
            erroRemuneracaoInicialInvalida: false,
            erroRemuneracaoFinal: false,
            erroRemuneracaoFinalInvalida: false,
            temSobrevivencia: true,

            // States Passo 2:
            // Contribuições Participante
            percentualBasicoParticipante: "3.00",
            beneficioRiscoInvalidezParticipante: "0.00",
            beneficioRiscoPensaoMorteParticipante: "0.00",
            sobrevivenciaParticipante: "0.00",
            carregamentoContribuicaoBasicaParticipante: "0.18",     // Valor mínimo que o carregamento contribuição básica do participante pode ter, pois o menor valor do Percentual básico é 3 e o carregamento é (Percentual Básico * 0.06).

            // Contribuições Patrocinador
            percentualBasicoPatrocinador: "0.00",
            beneficioRiscoInvalidezPatrocinador: "0.00",
            beneficioRiscoPensaoMortePatrocinador: "0.00",
            sobrevivenciaPatrocinador: "0.00",
            carregamentoContribuicaoBasicaPatrocinador: "0.00",

            // Contribuições Adicionais
            aposentadoriaAdicional: "0",
            invalidezAdicional: "0",
            pensaoMorteAdicional: "0",
            sobrevivenciaAdicional: "0",
            carregamentoContribuicaoAdicional: "0.00",
            totalizadorTaxaAposentadoria: "0.00",

            // States de validação por Soma e valor Máx.
            beneficioRiscoInvalidezMax: "1.00",
            beneficioRiscoPensaoMorteMax: "1.00",
            beneficioRiscoSoma: "0",
            contribuicaoSobrevivenciaDesabilitada: true,

        };

        this.setPassoAtivo = this.setPassoAtivo.bind(this);
        this.renderAbaPassos = this.renderAbaPassos.bind(this);
        this.renderPassoBotao = this.renderPassoBotao.bind(this);
        this.renderConteudoPassos = this.renderConteudoPassos.bind(this);

        this.passo1 = React.createRef();
        this.passo2 = React.createRef();
        this.passo3 = React.createRef();
    }

    /**
     * @description Método de ciclo de vida do React. É chamado apenas uma vez, antes do render.
     */
    componentWillMount() {
        window.scrollTo(0, 0);
    }

    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método que atualiza o state a partir do nome e valor do campo que disparou o evento.
     */
    handleInputChange(event) {
        const target = event.target;

        // Caso o input seja radio (Tipo de ativo), seu valor será true para 'Ativo'. Caso o input seja normal, o valor é o valor de entrada trocando vírgula por ponto, para realização dos cálculos.
        var value;
        if(target.type === "radio")
            value = target.value;
        else
            value = target.value.replace(',', '.');

        const name = target.name;

        // var self = this;
        this.setState({
            [name]: value
        });
    }

    /**
     * @param {int} passo Passo do simulador, de 1 a 3.
     * @description Método que 'setta' o state do passo recebido para mudar o passo do simulador.
     */
    setPassoAtivo(passo, state) {
        window.scrollTo(0, 0);

        this.setState(state, () => {
            this.setState({
                passo: passo
            }, () => {
                
                switch(passo)
                {
                    case 1:
                        this.passo1.current.onVisible(this.state);
                        break;
                    case 2:
                        this.passo2.current.onVisible(this.state);
                        break;
                    case 3:
                        this.passo3.current.onVisible(this.state);
                        break;
                    default:
                        break;
                }
            });
        });
    }

    /**
     * @description Método que atualiza o state modalVisivel, que fica com o valor 'true' quando a modal estiver aberta.
     */
    toggleModal() {
        this.setState({ modalVisivel: !this.state.modalVisivel })
    }

    /**
     * @param {int} id Id do botão a ser renderizado, de 1 a 3. 
     * @param {string} titulo Título principal do botão.
     * @param {string} subtitulo Subtítulo do botão, texto abaixo do título.
     * @description Método responsável pela renderização e comportamento dos botões de passo. Esses botões alteram sua cor de acordo com o passo ativo e ficam desativados caso o passo ativo seja menor que o id do botão.
     */
    renderPassoBotao(id, titulo, subtitulo) {
        return (
            <button className={"btn " + estadoPasso(id, this.state.passo)} disabled={this.state.passo < id}
                    onClick={() => this.setPassoAtivo(id)}> 
                <span>{titulo}</span>
                <h3>{subtitulo}</h3>
            </button>
        )
    }

    /**
     * @description Método que renderiza a aba de passos com os botões de passos. São 3 botões que renderizam 3 passos diferentes. 
     */
    renderAbaPassos() {
        return(
            <div id="passos">
                {this.renderPassoBotao(1, "Passo 1", "Dados Básicos")}
                {this.renderPassoBotao(2, "Passo 2", "Contribuição")}
                {this.renderPassoBotao(3, "Passo 3", "Resultado")}
            </div>
        );
    }

    /**
     * @description Método responsável por renderizar todo o conteúdo dos passos. Nele existem 3 componentes: Passo1, Passo2 e Passo3, que contém o conteúdo de cada passo, mas estão visíveis apenas se o passo atual for o mesmo do passo informado no componente, pelo atributo 'hidden'.
     */
    renderConteudoPassos() {
        return (
            <div>
                <Passo1 setPassoAtivo={this.setPassoAtivo} state={this.state} handleInputChange={this.handleInputChange}
                        hidden={this.state.passo !== 1} ref={this.passo1} />
                <Passo2 setPassoAtivo={this.setPassoAtivo} state={this.state} handleInputChange={this.handleInputChange}
                        hidden={this.state.passo !== 2} ref={this.passo2} />
                <Passo3 setPassoAtivo={this.setPassoAtivo} state={this.state} handleInputChange={this.handleInputChange}
                        hidden={this.state.passo !== 3} ref={this.passo3} />
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                <div align="center">
                    <img className="logo figure-img" src="img/logo.png" alt="" />
                    <h2>Bem vindo ao Simulador de Benefício</h2>

                    {this.renderAbaPassos()}
                </div>

                {this.renderConteudoPassos()}
            </div>
        );
    }
}

/**
 * @param {int} id Id do botão, entre 1 e 3.
 * @param {int} passoAtivo Passo atual. Esse valor é obtido do state 'passo'.
 * @description Função que retorna uma string com a classe de botões do bootstrap. Caso o passo ativo seja igual ao id do botão, sua cor será 'btn-secondary' (rosa). Se o passo atual for maior que o id do botão, esse botão fica da cor 'btn-primary' (verde). E se o id for maior que o passo ativo, esse botão fica claro e desativado.
 */
function estadoPasso(id, passoAtivo) {
    if(passoAtivo === id)
        return "btn-secondary";
    else if(passoAtivo > id)
        return "btn-primary";
    else
        return "btn-light";
}
