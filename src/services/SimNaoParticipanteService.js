import BaseService from './BaseService';

export default class SimNaoParticipanteService extends BaseService {

    CalcularSimulacao(dados, resolve, reject) {
        this.CriarRequisicao("POST", `/simnaoparticipante/calcular`, dados)
            .then(resolve)
            .catch(reject);
    }
}
