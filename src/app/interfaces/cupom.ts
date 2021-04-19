export interface Cupom {
    id: number;
    empresaId: number;
    nome: string;
    moedas: number;
    pontos: number;
    desconto: number;
    nivelId: number;
    descricaoCupom: string;
    quantidade: number;
    quantidadeDisponivel: number;
    controlaPeriodo: boolean;
    periodoDe:Date;
    periodoAte:Date;
    geraNumeroAleatorio: boolean;
    numeroCupom: string;
    unicoCadastro: boolean;
    imagem: string;
    latitude: number;
    longitude: number;
}
