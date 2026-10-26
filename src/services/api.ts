import axios from 'axios';

export const TOKEN_KEY = 'sifcom-token';
export const USER_KEY = 'sifcom-user';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url || '');
    const isAuth = url.includes('/auth/login') || url.includes('/auth/register');
    if (error.response?.status === 401 && !isAuth) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    const message = error.response?.data?.error || error.message || 'Error de red';
    return Promise.reject(new Error(message));
  },
);

export default api;

export const pick = (row: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return undefined;
};

export type Contrato = {
  IdContrato: number;
  Empresa: string;
  Giro: string;
  Presupuesto: string | number;
  Vigencia: string;
};

export type Fiscalizacion = {
  IdFiscalizacion: number;
  Obra: string;
  Ubicacion: string | null;
  Foto: string | null;
  Observaciones: string | null;
  FechaFisc: string;
  Estado: string;
  IdUser: number;
  IdContrato: number;
};

export const asContrato = (row: Record<string, unknown>): Contrato => ({
  IdContrato: Number(pick(row, 'IdContrato', 'idcontrato')),
  Empresa: String(pick(row, 'Empresa', 'empresa') ?? ''),
  Giro: String(pick(row, 'Giro', 'giro') ?? ''),
  Presupuesto: (pick(row, 'Presupuesto', 'presupuesto') as string | number) ?? '',
  Vigencia: String(pick(row, 'Vigencia', 'vigencia') ?? ''),
});

export const asFiscalizacion = (row: Record<string, unknown>): Fiscalizacion => ({
  IdFiscalizacion: Number(pick(row, 'IdFiscalizacion', 'idfiscalizacion')),
  Obra: String(pick(row, 'Obra', 'obra') ?? ''),
  Ubicacion: (pick(row, 'Ubicacion', 'ubicacion') as string | null) ?? null,
  Foto: (pick(row, 'Foto', 'foto') as string | null) ?? null,
  Observaciones: (pick(row, 'Observaciones', 'observaciones') as string | null) ?? null,
  FechaFisc: String(pick(row, 'FechaFisc', 'fechafisc') ?? ''),
  Estado: String(pick(row, 'Estado', 'estado') ?? ''),
  IdUser: Number(pick(row, 'IdUser', 'iduser')),
  IdContrato: Number(pick(row, 'IdContrato', 'idcontrato')),
});

export const listContratos = async () => {
  const { data } = await api.get('/contratos');
  return (data as Record<string, unknown>[]).map(asContrato);
};

export const createContrato = async (payload: Omit<Contrato, 'IdContrato'>) => {
  const { data } = await api.post('/contratos', payload);
  return asContrato(data);
};

export const updateContrato = async (id: number, payload: Omit<Contrato, 'IdContrato'>) => {
  const { data } = await api.put(`/contratos/${id}`, payload);
  return asContrato(data);
};

export const deleteContrato = async (id: number) => {
  await api.delete(`/contratos/${id}`);
};

export const listFiscalizaciones = async () => {
  const { data } = await api.get('/fiscalizaciones');
  return (data as Record<string, unknown>[]).map(asFiscalizacion);
};

export const createFiscalizacion = async (payload: {
  Obra: string;
  Ubicacion?: string;
  Foto?: string;
  Observaciones?: string;
  FechaFisc?: string;
  Estado?: string;
  IdContrato: number;
}) => {
  const { data } = await api.post('/fiscalizaciones', payload);
  return asFiscalizacion(data);
};

export const updateFiscalizacion = async (
  id: number,
  payload: {
    Obra: string;
    Ubicacion?: string | null;
    Foto?: string | null;
    Observaciones?: string | null;
    FechaFisc?: string | null;
    Estado?: string | null;
    IdUser?: number;
    IdContrato: number;
  },
) => {
  const { data } = await api.put(`/fiscalizaciones/${id}`, payload);
  return asFiscalizacion(data);
};

export const deleteFiscalizacion = async (id: number) => {
  await api.delete(`/fiscalizaciones/${id}`);
};
