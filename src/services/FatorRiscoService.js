import BaseService from "./BaseService";

export default class FatorRiscoService extends BaseService {
    
    BuscarPorFundacaoPlano(fundacao, plano, idade, resolve, reject) {
        this.CriarRequisicao("GET", `fator/porFundacaoPlano/${fundacao}`, null)
            .then(resolve)
            .catch(reject);
    }

}

