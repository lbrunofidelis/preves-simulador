
var diaAtual = new Date().getDate();
var mesAtual = new Date().getMonth();
mesAtual++;    // getMonth() retorna o mês atual entre 0 e 11. Com o incremento o valor fica entre 1 e 12.
var anoAtual = new Date().getFullYear();

/** 
 * @param {Object} data - Objeto do tipo 'date' que representa a data de nascimento.
 * @return {object} - objeto com os valores da idade em anos, meses, dias e em decimal.
 * @description - cálculo da idade em anos, meses, dias e decimal.
 */
export default function CalculaIdade(data) {
    var diaNascimento = data.getDate();
    var mesNascimento = data.getMonth() + 1;
    var anoNascimento = data.getFullYear();

    var ultimoDiaMes = VerificaQuantidadeDiasMes(data);    // Variável que armazena a quantidade de dias do mês atual.
    var anosIdade = anoAtual - anoNascimento;
    var mesesIdade = 0;
    var diasIdade = 0;
    var mesesCorridosAno = mesAtual - 1;

    // Condicional caso 1: antes do mês de aniversário.
    if(mesAtual < mesNascimento) {
        anosIdade--;
        // Caso 1.1: antes do dia do aniversário.
        if(diaAtual < diaNascimento) {
            mesesIdade = mesesCorridosAno + (12 - mesNascimento);
            diasIdade = (ultimoDiaMes - diaNascimento + diaAtual);
        // Caso 1.2: dia do aniversário (onde faltam meses exatos para o aniversário).
        } else if(diaAtual === diaNascimento) {
            mesesIdade = (12 - mesNascimento) + mesesCorridosAno + 1;
            diasIdade = 0;
        } else if(diaAtual > diaNascimento) {
            mesesIdade = mesesCorridosAno + (12 - mesNascimento) + 1;
            diasIdade = diaAtual - diaNascimento;
        } else {
        }

    // Caso 2: mês de aniversário.
    } else if(mesAtual === mesNascimento) {
        // Caso 2.1: antes do dia de aniversário.
        if(diaAtual < diaNascimento) {
            anosIdade--;
            mesesIdade = 11;
            diasIdade = (ultimoDiaMes - diaNascimento + diaAtual) + 1;
        // Caso 2.2: dia do aniversário ou superior, onde os dias de idade são diaAtual menos o diaNascimento ou zero (caso seja o data do aniversário).
        } else {
            mesesIdade = 0;
            diasIdade = diaAtual - diaNascimento;
        }

    // Caso 3: passado o mês de aniverário.
    } else if(mesAtual > mesNascimento) {
        // Caso 3.1: antes do dia do aniversário.
        if(diaAtual < diaNascimento) {
            mesesIdade = mesesCorridosAno - mesNascimento;
            diasIdade = (ultimoDiaMes - diaNascimento + diaAtual) + 1;
        // Caso 3.2: dia do aniversário.
        } else if(diaAtual === diaNascimento) {
            mesesIdade = mesesCorridosAno - mesNascimento + 1;
            diasIdade = diaAtual - diaNascimento;
        // Caso 3.3: passado o dia de aniversário.
        } else if(diaAtual > diaNascimento) {
            mesesIdade = mesesCorridosAno - mesNascimento + 1;
            diasIdade = diaAtual - diaNascimento;
        }
    } else {
    }

    if(anosIdade < 0 || isNaN(anosIdade))
        anosIdade = 0;

    var idadeAnosMesesDias = { anos: anosIdade, meses: mesesIdade, dias: diasIdade, idadeDecimal: CalculaIdadeDecimal(anosIdade, mesesIdade, diasIdade) };
    return idadeAnosMesesDias;
}

/**
 * @param {Object} dataObjeto - objeto do tipo 'date'.
 * @return {number} - quantidade de dias que o mês da data recebida tem.
 * @description - função que retorna a quantidade de dias que o mês da data recebida tem.
 */
function VerificaQuantidadeDiasMes(dataObjeto) {
    var data = new Date();
    
    data.setMonth(dataObjeto.getMonth() + 1);
    data.setDate(1);
    data.setDate(data.getDate() - 1);
    return(data.getDate());
}

/**
 * @param {number} anos - anos completos.
 * @param {number} meses - meses completos.
 * @param {number} dias - dias completos.
 * @return {number} Idade mais precisa com valor decimal.
 * @description Função que calcula o valor da idade em anos no formato decimal a partir dos anos, meses e dias completos (valores inteiros).
 */
function CalculaIdadeDecimal(anos, meses, dias) {
    var idadeDecimal = dias / 30;    // 0,5 - representa 50% de um mês.
    idadeDecimal += meses;
    idadeDecimal = idadeDecimal / 12; 
    idadeDecimal += anos;

    return idadeDecimal;
}
