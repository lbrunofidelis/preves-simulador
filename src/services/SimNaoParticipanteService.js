import BaseService from './BaseService';

export default class SimNaoParticipanteService extends BaseService {

    CalcularSimulacao(dados, resolve, reject) {
        return this.CriarRequisicao("POST", `/simnaoparticipante/calcular`, dados)
        .then(resolve)
        .catch(reject);
    }

    EnviarEmail(dados, resolve, reject) {
        return this.CriarRequisicao("POST", `/email/enviar`, dados)
        .then(resolve)
        .catch(reject);
    }

}
