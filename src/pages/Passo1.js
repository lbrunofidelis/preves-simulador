import React from "react";
import Campo from "./_shared/Campo";
import Combo from "./_shared/Combo";
import calculaIdade from "./_shared/Idade";
import DataInvalida from "./_shared/Data";
import { IndiceService } from "../services";

var indiceService = new IndiceService();

var codigoIndiceRGPS = "RGPS3";

const textos = require("./Textos");

export default class Passo1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.state;

        this.handleInputChange = props.handleInputChange.bind(this);
        this.toggleTermos = this.toggleTermos.bind(this);
        this.onBlurData = this.onBlurData.bind(this);
        this.onBlurValidaRemuneracaoInicial = this.onBlurValidaRemuneracaoInicial.bind(this);
        this.onBlurValidaRemuneracaoFinal = this.onBlurValidaRemuneracaoFinal.bind(this);
        this.validaExtremosComboAposentadoria = this.validaExtremosComboAposentadoria.bind(this);
        this.validaPasso = this.validaPasso.bind(this);
        this.validarCampoVazio = this.validarCampoVazio.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onBlurInput = this.onBlurInput.bind(this);
        this.converteStringFloat = this.converteStringFloat.bind(this);
        this.refreshTempoSobrevivencia = this.refreshTempoSobrevivencia.bind(this);
    }

    /**
     * @description Método do ciclo de vida do React. Chamado apenas uma vez, após a renderização do componente. Nesse contexto, busca o índice RGPS e armazena
     * no state, caso tenha sucesso na busca.
     */
    componentDidMount() {
        window.scrollTo(0, 0);

        // Busca último índice do RGPS na tabela 'TB_IND_VALORES'.
        var self = this;
        indiceService.BuscarUltimoPorCodigo(codigoIndiceRGPS, (result) => {
            self.setState({
                rgps: result.data.VALORES[0].VALOR_IND
            });
        }, (err) => {
            alert("Ocorreu um erro ao buscar o valor do índice!");
        });
    }

    onVisible(state) {
        this.setState(state);
    }

    /**
     * @description Atualiza o state 'termosAceitos', que é necessário que esteja com o valor 'true' para prosseguir.
     */
    toggleTermos() {
        this.setState({ termosAceitos: !this.state.termosAceitos });
    }
    
    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método que atualiza o state do campo que disparou o evento ao alterar valor, chamando o método 'handleInputChange', que realiza um callback, caso tenha.
     */
    onChangeInput(event) {
        this.handleInputChange(event);
    }

    /**
     * @param {*} event Evento enviado pelo componente.
     * @description Método que atualiza o state do campo que disparou o evento ao remover o foco.
     */
    onBlurInput(event) {
        const target = event.target;
        var valor = this.converteStringFloat(target.value);
        var nomeCampo = target.name;
        this.setState({ 
            [nomeCampo]: valor
        });
    }

    /**
     * @param {string} valor Valor a ser convertido para float. Dependendo do tamanho da string, esse valor vem com ponto (.) ou vírgula (,) devido a 
     * máscara existente nos campos.
     * @returns {number} Valor convertido para float.
     */
    converteStringFloat(valor) {
        valor = valor.replace(/\./g, '');   // Troca todos os pontos por espaços vazios (pontos que separam os milhares).
        valor = valor.replace(',', '.');    // Troca a única vírgula por ponto.
        valor = parseFloat(valor);
        return valor;
    }

    /**
     * @description Método que atualiza o state da data e da idade ao tirar o foco do campo Data de Nascimento. Utiliza uma função externa que checa 
     * se a Data é válida ou não para informar o usuário.
     */
    onBlurData(event) {
        const target = event.target;
        var data = target.value;
        
        var dataObjeto = this.converteData(data);

        var dataInvalida = DataInvalida(dataObjeto, data);

        this.setState({
            erroDataInvalida: dataInvalida,
            idade: calculaIdade(dataObjeto).anos,
            idadeDecimal: calculaIdade(dataObjeto).idadeDecimal,
            dataNascimento: dataObjeto
        }, () => {
            if(this.state.erroDataInvalida)
                this.setState({ idade: 40 });
        });
    }

    /**
     * @param {string} dataString Data a ser convertida para Date().
     * @description Método responsável por converter a data recebida (no formato 'dd/mm/aaaa') para date (Objeto).
     */
    converteData(dataString) {
        var dataPartes = dataString.split("/");
        return new Date(dataPartes[2], dataPartes[1] - 1, dataPartes[0]);
    }

    /**
     * @description Método que faz a seguinte validação: caso o tipo de ativo seja normal (true) E a remuneração inicial seja menor que o último indice Rgps,
     * 'setta' o state erroRemuneracaoInicialInvalida para true para ser mostrado uma mensagem de erro.
     */
    onBlurValidaRemuneracaoInicial() {
        var remuneracaoInicial = document.getElementById("remuneracaoInicial").value.replace(/\./g, '');
        
        remuneracaoInicial = remuneracaoInicial.replace(',', '.');
        
        if(isNaN(parseFloat(remuneracaoInicial)))   
            remuneracaoInicial = '0.00';

        var rgps = this.state.rgps;
        var ativo = this.state.tipoAtivo;

        if(remuneracaoInicial.replace(',', '.') <= rgps && ativo === "normal") {
            this.setState({
                erroRemuneracaoInicialInvalida: true,
                remuneracaoInicial: remuneracaoInicial
            });
        } else {
            remuneracaoInicial = parseFloat(remuneracaoInicial.replace(',', '.'));
            this.setState({ 
                erroRemuneracaoInicialInvalida: false,
                remuneracaoInicial: remuneracaoInicial
            });
        }
    }

    /**
     * @returns {boolean} Valor que representa se a remuneração final está inválida.
     * @description Método que acessa o campo e valida o valor da remuneração final, que deve ser maior que a remuneração inicial.
     */
    onBlurValidaRemuneracaoFinal() {
        var remuneracaoFinal = document.getElementById("remuneracaoFinal").value.replace(/\./g, '');
        
        remuneracaoFinal = remuneracaoFinal.replace(',', '.');
        
        if(isNaN(parseFloat(remuneracaoFinal)))   
            remuneracaoFinal = '0.00';
        
        if(remuneracaoFinal < this.state.remuneracaoInicial)
            return true;
        
        if(remuneracaoFinal >= this.state.remuneracaoInicial)
            return false;
    }

    /**
     * @param {string} valor Valor do campo no momento da validação (tentativa de mudar de passo).
     * @param {string} campoErro State a ser alterado para o valor 'true' se o campo estiver em branco, ou 'false' se não.
     * @returns {boolean} Valor que informa se o campo está em branco ou não para a renderização de uma mensagem de erro.
     * @description Método que checa se o campo está vazio ou não, alterando o state
     */
    validarCampoVazio(valor, campoErro) {
        var campoInvalido = (valor === "" || valor === 0);
        this.setState({
            [campoErro]: campoInvalido
        });
        return campoInvalido;
    }

    /**
     * @description Método que checa se os campos não estão vazios ou inválidos (por meio dos states) para prosseguir para o próximo passo.
     * @return Sem retorno, mas caso a validação esteja ok, 'setta' o passo ativo como 2.
     */
    validaPasso() {
        // Verificação de campos obrigatórios.
        var nomeVazio = this.validarCampoVazio(this.state.nome, "erroNome");
        var remuneracaoInicialVazia = this.validarCampoVazio(this.state.remuneracaoInicial, "erroRemuneracaoInicial");
        var remuneracaoFinalVazia = this.validarCampoVazio(this.state.remuneracaoFinal, "erroRemuneracaoFinal");

        // Validações específicas: remuneração inicial e final.
        var remuneracaoInicialInvalida = this.state.erroRemuneracaoInicialInvalida;
        var remuneracaoFinalInvalida = this.onBlurValidaRemuneracaoFinal();

        // Verificação de sobrevivência: Caso tempoSobrevivencia seja diferente de zero, significa que o usuário terá sobrevivência e os campos de contribuições de sobrevivência do 2° passo deverão estar habilitados
        var tempoSobrevivencia = document.getElementById("tempoSobrevivencia").value;

        // Validação da data.
        var dataString = document.getElementById("dataNascimento").value;
        var dataInvalida = false;

        // Verifica se o state dataNascimento é um objeto do tipo Date, para então realizar outras validações.
        if(Object.prototype.toString.call(this.state.dataNascimento) === "[object Date]") {

            dataInvalida = DataInvalida(this.state.dataNascimento, dataString);

            if(isNaN(this.state.dataNascimento.getTime())) {
                dataInvalida = DataInvalida(this.state.dataNascimento, dataString);
            }
            else {
                dataInvalida = DataInvalida(this.state.dataNascimento, dataString);
            }
        } 
        else {
            dataInvalida = true;
        }

        this.setState({
            erroDataInvalida: dataInvalida,
            erroRemuneracaoFinalInvalida: remuneracaoFinalInvalida,
            temSobrevivencia: tempoSobrevivencia !== '0'
        }, () => {

            // Verificação das variáveis que armazenam a ocorrência de erro.
            if(!nomeVazio && !remuneracaoInicialVazia && !remuneracaoFinalVazia && !dataInvalida && !remuneracaoInicialInvalida && !remuneracaoFinalInvalida) {
                this.props.setPassoAtivo(2, this.state);
            }
            else {
                window.scrollTo(0, 300);
                console.log(this.state);
            }
        });
    }

    /**
     * @returns {number} Número inteiro que representa o número mínimo dentro do combo de tempo de aposentadoria.
     * @description Método que checa o state da idade e 'setta' os valores do combo dentro dos limites.
     */
    validaExtremosComboAposentadoria() {
        if(this.state.idade < 40)
            return 40;
        else if(this.state.idade >= 40 & this.state.idade <= 75)
            return parseFloat(this.state.idade);
        else if(this.state.idade === isNaN(this.state.idade))
            return 40;
        else if(this.state.idade > 75)
            return 75;
    }

    /**
     * @param {Object} event Evento enviado pelo componente.
     * @description Método responsável por atualizar os states 'temSobrevivencia', 'tempoSobrevivencia' e 'sobrevivenciaPatrocinador', que dependem do tempo da sobrevivência.
     */
    refreshTempoSobrevivencia(event) {
        const target = event.target;
        var valor = target.value;

        if(valor === '0') {
            this.setState({ sobrevivenciaPatrocinador: '0.00' });
        }

        this.setState({
            temSobrevivencia: valor !== '0',
            tempoSobrevivencia: valor
        });
        
    }

    render() {
        return (
            <div id="passo1" hidden={this.props.hidden}>
                <Campo id="nome" label="Qual o seu nome?" mensagemErro="Campo Obrigatório" mostrarErro={this.state.erroNome}>
                    <div className="col">
                        <input id="nome" name="nome" type="text" className="form-control name" maxLength="80" placeholder="Insira seu nome" onChange={this.onChangeInput} value={this.state.nome} />
                    </div>
                </Campo>

                <Campo id="dataNascimento" label="Qual a sua data de nascimento?" mensagemErro="Data inválida" mostrarErro={this.state.erroDataInvalida}>
                    <div className="col-lg-2 col-5">
                        <input type="text" className="form-control date" id="dataNascimento" name="dataNascimento" placeholder="__/__/____" onBlur={this.onBlurData} onChange={this.onChangeInput} />
                    </div>
                </Campo>

                <Campo id="tipoAtivoNormal" label="Você é um" usaBotaoAjuda textoModal={textos.tiposAtivo}>
                    <div className="col-lg-2 col-5">
                        <div className="form-check">
                            <input name="tipoAtivo" className="form-check-input" type="radio" id="tipoAtivoNormal" defaultChecked onBlur={this.onBlurValidaRemuneracaoInicial.bind(this)} onChange={this.onChangeInput} value="normal" ></input>
                            <label className="form-check-label" htmlFor="tipoAtivoNormal">Ativo</label>
                        </div>
                        <div className="form-check">
                            <input name="tipoAtivo" className="form-check-input" type="radio" id="tipoAtivoFacultativo" onBlur={this.onBlurValidaRemuneracaoInicial.bind(this)} onChange={this.onChangeInput} value="facultativo"></input>
                            <label className="form-check-label" htmlFor="tipoAtivoFacultativo">Ativo Facultativo</label>
                        </div>
                        <div className="form-check">
                            <input name="tipoAtivo" className="form-check-input" type="radio" id="tipoAtivoParticipante" onBlur={this.onBlurValidaRemuneracaoInicial.bind(this)} onChange={this.onChangeInput} value="participante"></input>
                            <label className="form-check-label" htmlFor="tipoAtivoParticipante">Participante CDT</label>
                        </div>
                    </div>
                </Campo>

                <Campo id="idadeAposentadoria" label="Você pretende se aposentar com quantos anos?">
                    <div className="col-lg-1 col-4">
                        <Combo id="idadeAposentadoria" min={this.validaExtremosComboAposentadoria()} max={75} incremento={1} onChange={this.onChangeInput} />
                    </div>
                </Campo>

                <Campo id="tempoAposentadoria" label="Por quantos anos você pretende receber sua aposentadoria?">
                    <div className="col-lg-1 col-4">
                        <Combo id="tempoAposentadoria" min={20} max={50} onChange={this.onChangeInput} />
                    </div>
                </Campo>

                <Campo id="tempoSobrevivencia" label="Por quantos anos você pretende receber sobrevivência?">
                    <div className="col-lg-1 col-4">
                        <Combo id="tempoSobrevivencia" min={5} max={20} onChange={this.refreshTempoSobrevivencia} comboTempoSobrevivencia />
                    </div>
                </Campo>

                <Campo id="remuneracaoInicial" label="Remuneração inicial" labelSecundaria="(conforme tabela de progressão)" usaBotaoAjuda textoModal={textos.remuneracaoInicial} mensagemErro="Campo Obrigatório" mostrarErro={this.state.erroRemuneracaoInicial} mensagemErroValidacao={"Para os Ativos, a remuneração inicial deverá ser superior ao teto do RPPS/RGPS, atualmente em R$ " + this.state.rgps.toFixed(2).replace('.', ',')} mostrarErroValidacao={this.state.erroRemuneracaoInicialInvalida}>
                    <div className="col-lg-3 col-10">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">R$</span>
                            </div>

                            <input type="text" name="remuneracaoInicial" className="form-control money" maxLength="10" aria-label="Amount" placeholder="Insira a remuneração inicial" id="remuneracaoInicial" required onBlur={this.onBlurValidaRemuneracaoInicial.bind(this)} onChange={this.onChangeInput} />
                        </div>
                    </div>
                </Campo>

                <Campo id="remuneracaoFinal" label="Remuneração final" labelSecundaria="(conforme tabela de progressão)" usaBotaoAjuda textoModal={textos.remuneracaoFinal} mensagemErro="Campo Obrigatório" mostrarErro={this.state.erroRemuneracaoFinal} mensagemErroValidacao={"A Remuneração Final deve ser igual ou superior à Remuneração Inicial"} mostrarErroValidacao={this.state.erroRemuneracaoFinalInvalida}>
                    <div className="col-lg-3 col-10">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">R$</span>
                            </div>
                            
                            <input type="text" name="remuneracaoFinal" className="form-control money" maxLength="10" aria-label="Amount" placeholder="Insira a remuneração final" id="remuneracaoFinal" required onChange={this.onChangeInput} onBlur={this.onBlurInput.bind(this)} />
                        </div>
                    </div>
                </Campo>

                <Campo id="taxaCrescimentoSalarial" label="Taxa de crescimento salarial a cada dois anos" usaBotaoAjuda textoModal={textos.taxaCrescimentoSalarial}>
                    <div className="col-lg-2 col-10">
                        <div className="input-group">
                            <Combo id="taxaCrescimentoSalarial" min={2} max={3} decimais incremento={1} value={this.state.taxaCrescimentoSalarial} onChange={this.onChangeInput} />
                            <div className="input-group-append">
                                <span className="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                </Campo>

                <Campo id="taxaJurosReal" label="Taxa de Juros Real" labelSecundaria="(meta financeira)" usaBotaoAjuda textoModal={textos.taxaJurosReal}>
                    <div className="col-lg-1 col-2">
                        <label className="form-control-plaintext form-control-lg font-weight-bold text-primary">4,5%</label>
                    </div>
                </Campo>
                <br/>
                <div className="alert alert-danger">
                    <h4>Antes de continuar, é muito importante entender as informações abaixo:</h4>
                    <p align="justify">
                        A) As informações constantes nesta simulação partem de dados informados pelos participantes no ato da opção pela previdência complementar. B) A simulação
                        apresentará resultado diferenciado, caso o participante altere, durante sua vida funcional, os dados aqui fornecidos. C) Toda simulação trabalha com eventos
                        futuros incertos e seus resultados são completamente estimados em relação a estes eventos. D) O valor da remuneração paga pelo rpps somente será efetivamente
                        conhecido quando o servidor tornar-se elegível ao benefício requerido. E) A preves não se responsabiliza pelas informações prestadas pelo participante para a 
                        geração da simulação previdenciária. F) Os resultados apresentados, referentes a esta simulação, não são garantia de benefício futuro. G) Benefício Pecúlio por 
                        Morte (598) N° Processo SUSEP: 15414.005367/2012-77 H) Benefício Pecúlio por Invalidez (599) N° Processo SUSEP: 15414.005364/2012-33 I) O registro destes planos 
                        na SUSEP não implica, por parte da Autarquia, incentivo ou recomendação para sua comercialização. J) BENEFÍCIOS DE RISCO - PECÚLIOS GARANTIDOS PELA MONGERAL AEGON 
                        SEGUROS E PREVIDÊNCIA S.A - CNPJ: 33.608.308/0001-73
                    </p>
                    <hr/>

                    <h4 className="col">
                        <input className="form-check-input" type="checkbox" id="agree" onChange={this.toggleTermos.bind(this)} />
                        <label className="form-check-label" htmlFor="agree">Li e entendi!</label>
                    </h4>
                </div>

                <div className="text-center">
                    <button className="btn btn-primary btn-lg" id="submit-button" onClick={() => this.validaPasso()} disabled={!this.state.termosAceitos}>Continuar</button>
                </div>
            </div>
        );
    }
}
