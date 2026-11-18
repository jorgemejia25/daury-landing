// Importa a Daury Admin los documentos migrados desde los artifacts de Claude, Claude Design,
// el programa ILAN y las notas del proyecto (content/docs). Crea carpetas, metadatos
// (wikiPages) y cuerpos Markdown (wikiContent) solo cuando no existen: nunca sobrescribe.
//
//   node scripts/import-docs.mjs          # muestra lo que falta
//   node scripts/import-docs.mjs --apply  # importa los registros inexistentes
//
// Igual que seed-wiki.mjs, requiere Firebase CLI instalada y autenticada con la cuenta administradora.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const project = 'daury-wiki-jorgemejia';
const owner = 'devjorgemejia@gmail.com';
const apply = process.argv.includes('--apply');
const base = 'content/docs';
const now = new Date().toISOString();
const meta = { revision: 1, archived: false, createdAt: now, updatedAt: now, createdBy: owner, updatedBy: owner };
const manifest = JSON.parse(fs.readFileSync(path.join(base, 'manifest.json'), 'utf8'));

/** Quita el frontmatter YAML: los metadatos van en wikiPages. */
const body = (file) => fs.readFileSync(path.join(base, file), 'utf8').replace(/^---\n[\s\S]*?\n---\n+/, '');

const records = [
  ...manifest.folders.map(({ id, name, color }) => ['folders', id, { name, parentId: '', color }]),
];
for (const page of manifest.pages) {
  const text = body(page.file);
  if (text.length > 100000) throw Error(`${page.file} supera los 100 000 caracteres.`);
  if (page.tags.length > 12 || page.title.length > 200 || page.description.length > 3000) throw Error(`${page.file}: metadatos fuera de los límites.`);
  records.push(['wikiPages', page.id, { title: page.title, description: page.description, folderId: page.folderId, tags: page.tags }]);
  records.push(['wikiContent', page.id, { body: text }]);
}

function value(input) {
  if (typeof input === 'string') return { stringValue: input };
  if (typeof input === 'boolean') return { booleanValue: input };
  if (typeof input === 'number') return { integerValue: String(input) };
  if (Array.isArray(input)) return { arrayValue: { values: input.map(value) } };
  return { mapValue: { fields: fields(input) } };
}
function fields(input) { return Object.fromEntries(Object.entries(input).map(([key, item]) => [key, value(item)])); }

(async () => {
  if (JSON.parse(fs.readFileSync('.firebaserc', 'utf8')).projects.default !== project) throw Error('Proyecto inesperado.');
  const root = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
  const lib = path.join(root, 'firebase-tools/lib');
  const auth = (await import(pathToFileURL(path.join(lib, 'auth.js')).href)).default;
  const { requireAuth } = (await import(pathToFileURL(path.join(lib, 'requireAuth.js')).href)).default;
  const { Client } = (await import(pathToFileURL(path.join(lib, 'apiv2.js')).href)).default;
  const account = auth.getGlobalDefaultAccount();
  if (account?.user.email !== owner) throw Error('La importación requiere la cuenta administradora esperada de Firebase CLI.');
  await requireAuth({ project, user: account.user, tokens: account.tokens, nonInteractive: true });
  const client = new Client({ urlPrefix: 'https://firestore.googleapis.com', apiVersion: 'v1' });
  const resource = `projects/${project}/databases/(default)/documents`;

  const writes = [];
  for (const [collection, id, data] of records) {
    const name = `${resource}/${collection}/${id}`;
    let exists = false;
    try { await client.get('/' + name, { skipLog: { resBody: true } }); exists = true; }
    catch (error) { if (error.status !== 404 && error.context?.response?.statusCode !== 404) throw error; }
    if (exists) { console.log(`Conservado ${collection}/${id}`); continue; }
    writes.push({ update: { name, fields: fields({ ...data, ...meta }) }, currentDocument: { exists: false } });
    console.log(`${apply ? 'Preparado' : 'Previsto'} ${collection}/${id}`);
  }
  // Las carpetas van primero; un commit admite 500 escrituras.
  if (apply) for (let i = 0; i < writes.length; i += 400) {
    await client.post('/' + resource + ':commit', { writes: writes.slice(i, i + 400) }, { skipLog: { reqBody: true, resBody: true } });
  }
  console.log(`${apply ? 'Importados' : 'Por importar'}: ${writes.length} registros (${manifest.folders.length} carpetas y ${manifest.pages.length} artículos en total); se conservan los existentes.`);
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
