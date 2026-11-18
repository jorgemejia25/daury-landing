// Crea en el kanban de Daury Admin las tareas de content/tasks/*.json (por ejemplo, las que salieron
// de la pizarra «Cuaderno de Daury»). Crea tableros y tareas solo cuando no existen: nunca sobrescribe.
// "board": "redes" apunta al tablero existente «Redes sociales»; cualquier otro valor, a un tablero del archivo.
//
//   node scripts/import-tasks.mjs content/tasks/cuaderno-de-daury.json          # muestra lo que falta
//   node scripts/import-tasks.mjs content/tasks/cuaderno-de-daury.json --apply  # crea lo que falta
//
// Igual que import-docs.mjs, requiere Firebase CLI autenticada con la cuenta administradora.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const project = 'daury-wiki-jorgemejia';
const owner = 'devjorgemejia@gmail.com';
const apply = process.argv.includes('--apply');
const file = process.argv.find((arg) => arg.endsWith('.json'));
if (!file) throw Error('Indica el archivo de tareas.');
const plan = JSON.parse(fs.readFileSync(file, 'utf8'));
const access = fs.readFileSync('src/features/admin/lib/access.ts', 'utf8');
const now = new Date().toISOString();
const meta = { revision: 1, archived: false, createdAt: now, updatedAt: now, createdBy: owner, updatedBy: owner };
const columns = { columns: { todo: { name: 'Pendiente', done: false }, progress: { name: 'En curso', done: false }, review: { name: 'En revisión', done: false }, done: { name: 'Hecho', done: true } }, columnOrder: ['todo', 'progress', 'review', 'done'] };
const validId = (id) => /^[A-Za-z0-9_-]{1,128}$/.test(id);

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
  const get = async (collection, id) => {
    try { return (await client.get(`/${resource}/${collection}/${id}`, { skipLog: { resBody: true } })).body; }
    catch (error) { if (error.status === 404 || error.context?.response?.statusCode === 404) return null; throw error; }
  };

  const boards = await client.get(`/${resource}/boards?pageSize=300`, { skipLog: { resBody: true } });
  const social = (boards.body.documents ?? []).find((doc) => doc.fields.name?.stringValue === 'Redes sociales' && !doc.fields.archived?.booleanValue);
  if (!social) throw Error('No existe el tablero «Redes sociales».');
  const boardIds = { redes: social.name.split('/').pop() };
  for (const board of plan.boards) boardIds[board.id] = board.id;
  if (plan.articleId && !(await get('wikiPages', plan.articleId))) throw Error(`No existe el artículo ${plan.articleId}.`);

  const records = plan.boards.map((board) => ['boards', board.id, { name: board.name, description: board.description, color: board.color, ...structuredClone(columns) }]);
  for (const task of plan.tasks) {
    if (!validId(task.id) || !boardIds[task.board]) throw Error(`Tarea inválida: ${task.id}`);
    if (task.assignee && !access.includes(`"${task.assignee}"`)) throw Error(`${task.id}: responsable sin acceso.`);
    if (task.title.length > 200 || task.description.length > 12000 || task.tags.length > 12 || task.checklist.length > 30) throw Error(`${task.id}: fuera de los límites.`);
    records.push(['tasks', task.id, {
      title: task.title, description: task.description, boardId: boardIds[task.board], status: 'todo',
      priority: task.priority, type: task.type, assignee: task.assignee, dueDate: task.dueDate ?? '', tags: task.tags, points: task.points ?? 0,
      articleId: plan.articleId ?? '', comments: [],
      checklist: task.checklist.map((title, index) => ({ id: `${task.id}-${index + 1}`, title, done: false, createdBy: owner, createdAt: now })),
    }]);
  }

  const writes = [];
  for (const [collection, id, data] of records) {
    if (await get(collection, id)) { console.log(`Conservado ${collection}/${id}`); continue; }
    writes.push({ update: { name: `${resource}/${collection}/${id}`, fields: fields({ ...data, ...meta }) }, currentDocument: { exists: false } });
    console.log(`${apply ? 'Preparado' : 'Previsto'} ${collection}/${id} · ${data.name ?? data.title}`);
  }
  // Los tableros van antes que sus tareas en el mismo commit.
  if (apply && writes.length) await client.post(`/${resource}:commit`, { writes }, { skipLog: { reqBody: true, resBody: true } });
  console.log(`${apply ? 'Importados' : 'Por importar'}: ${writes.length} registros; se conservan los existentes.`);
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
