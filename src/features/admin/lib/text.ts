/** Normaliza texto para búsquedas sin acentos ni mayúsculas. */
export const normalizeText = (value: string) =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
