import { Paciente } from './paciente';

export class Signosvitales{
    public idsignosvitales: number;
    public pulso: number;
    public temperatura: number;
    public ritmo_respiratorio: string;
    public paciente: Paciente;
    public fecha: string;
}