import BaseService from "./BaseService";

export default class IndiceService extends BaseService {

    BuscarUltimoPorCodigo(codigoIndice, resolve, reject) {
        this.CriarRequisicao("GET", `/indice/ultimoPorCodigo/${codigoIndice}`, null)
            .then(resolve)
            .catch(reject);
    }

}
