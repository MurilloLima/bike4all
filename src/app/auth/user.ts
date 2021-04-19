export interface User {
    id: number;
    nome: string;
    telefone: string;
    dataNascimento:string;
    sexo: string;
    email: string;
    username: string;
    senha: string;
    aceitaNoticias: boolean;
    aceitouTermo: boolean;
    cupons:[];
}
