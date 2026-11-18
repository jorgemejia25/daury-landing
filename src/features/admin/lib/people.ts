import { adminAllowedEmails } from "./access";

/** Nombres para mostrar de las cuentas autorizadas (derivados del correo; solo presentación). */
const names: Record<string, string> = {
  "valeryalarconra@gmail.com": "Valery Alarcón",
  "daniel1ajedrez@gmail.com": "Daniel",
  "yury.alexander2005@gmail.com": "Yury Alexander",
  "fatimacerezo2411@gmail.com": "Fátima Cerezo",
  "devjorgemejia@gmail.com": "Jorge Mejía",
  "estebantrampej@gmail.com": "Esteban Trampe",
};

export function personName(email: string) {
  if (!email) return "Sin asignar";
  if (names[email]) return names[email];
  const local = email.split("@")[0].replace(/[._\d]+/g, " ").trim();
  return local ? local[0].toUpperCase() + local.slice(1) : email;
}

export const memberOptions = [
  { value: "", label: "Sin asignar" },
  ...adminAllowedEmails.map((email) => ({ value: email, label: personName(email) })),
];
