import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
const project = 'daury-wiki-jorgemejia';
const owner = 'devjorgemejia@gmail.com';
const apply = process.argv.includes('--apply');
const meta = { revision: 1, archived: false, createdAt: new Date().toISOString(), updatedAt: '', createdBy: owner, updatedBy: owner };
meta.updatedAt = meta.createdAt;
const columns = { todo: { name: 'Pendiente', done: false }, progress: { name: 'En curso', done: false }, review: { name: 'En revisión', done: false }, done: { name: 'Hecho', done: true } };
const records = [
  ['boards', 'producto', { name: 'Producto', description: 'Trabajo y seguimiento de Daury.', color: 'violet', columns, columnOrder: Object.keys(columns) }],
  ['folders', 'general', { name: 'Daury', parentId: '', color: 'blue' }],
  ...JSON.parse(fs.readFileSync('content/calendars.json', 'utf8')).map(({ id, name, color }) => ['calendars', id, { name, color, description: '' }]),
];
const navigation = JSON.parse(fs.readFileSync('content/wiki/navigation.json', 'utf8')).flatMap((group) => group.items);
for (const slug of ['producto', 'diseno', 'tecnologia', 'documentacion']) {
  const page = navigation.find((entry) => entry.slug === slug);
  records.push(['wikiPages', slug, { title: page.title, description: page.description, folderId: 'general', tags: [] }]);
  records.push(['wikiContent', slug, { body: fs.readFileSync(`content/wiki/${slug}.md`, 'utf8') }]);
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
  const base = path.join(root, 'firebase-tools/lib');
  const auth = (await import(pathToFileURL(path.join(base, 'auth.js')).href)).default;
  const { requireAuth } = (await import(pathToFileURL(path.join(base, 'requireAuth.js')).href)).default;
  const { Client } = (await import(pathToFileURL(path.join(base, 'apiv2.js')).href)).default;
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
  if (apply && writes.length) await client.post('/' + resource + ':commit', { writes }, { skipLog: { reqBody: true, resBody: true } });
  console.log(`${apply ? 'Importados' : 'Por importar'}: ${writes.length}; se conservan todos los registros existentes.`);
  if (apply) {
    const { body: tx } = await client.post('/' + resource + ':beginTransaction', { options: { readWrite: {} } }, { skipLog: { reqBody: true, resBody: true } });
    try { await client.get('/' + resource + '/boards/producto', { queryParams: { transaction: tx.transaction }, skipLog: { resBody: true } }); }
    finally { await client.post('/' + resource + ':rollback', { transaction: tx.transaction }, { skipLog: { reqBody: true, resBody: true } }); }
    console.log('Transacción REST real: lectura y rollback verificados.');
  }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
