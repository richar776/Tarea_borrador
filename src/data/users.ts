export interface StoredUser {
  nombre: string;
  correo: string;
  password: string;
  comuna: string;
}

const KEY = 'sifcom-users';

const readAll = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
};

export const findRegisteredUser = (correo: string) =>
  readAll().find((u) => u.correo.toLowerCase() === correo.toLowerCase());

export const saveRegisteredUser = (user: StoredUser) => {
  const rest = readAll().filter((u) => u.correo.toLowerCase() !== user.correo.toLowerCase());
  localStorage.setItem(KEY, JSON.stringify([...rest, user]));
};
