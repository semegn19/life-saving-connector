/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const MODELS_DIR = path.join(__dirname, '..', 'models');

function shouldSkipPath(pathName) {
  return (
    pathName === '__v' ||
    pathName === '_id' ||
    pathName === 'createdAt' ||
    pathName === 'updatedAt'
  );
}

function isRequired(schemaType) {
  const r = schemaType?.options?.required;
  if (typeof r === 'function') return true;
  if (Array.isArray(r)) return !!r[0];
  return !!r;
}

function pickEnum(schemaType) {
  const e = schemaType?.enumValues;
  return Array.isArray(e) && e.length ? e[0] : undefined;
}

function getRefName(schemaType) {
  // ObjectId ref
  if (schemaType?.options?.ref) return schemaType.options.ref;
  // Array<ObjectId> ref
  if (schemaType?.caster?.options?.ref) return schemaType.caster.options.ref;
  return null;
}

function setDeep(obj, dottedPath, value) {
  const parts = dottedPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const k = parts[i];
    if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

function makeString(modelName, pathName, idx) {
  const key = pathName.toLowerCase();

  if (key.includes('email')) return `${modelName.toLowerCase()}_${idx}@seed.local`;
  if (key.includes('phone')) return `+1555${String(1000000 + idx).slice(-7)}`;
  if (key.includes('name')) return `${modelName} ${idx}`;
  if (key.includes('title')) return `${modelName} Title ${idx}`;
  if (key.includes('description')) return `${modelName} description ${idx}`;
  if (key.includes('address')) return `Address ${idx}, Test City`;
  if (key.includes('location')) return `Location ${idx}`;
  if (key.includes('status')) return 'active';
  if (key.includes('type')) return 'general';
  if (key.includes('blood')) return 'O+';
  return `${pathName}_${idx}`;
}

function pickRefId(refModelName, idx, refIdsByModel) {
  const ids = refModelName ? refIdsByModel.get(refModelName) : null;
  if (ids && ids.length) return ids[idx % ids.length];
  return new mongoose.Types.ObjectId();
}

function makeValueForType(modelName, pathName, schemaType, idx, refIdsByModel) {
  const enumVal = pickEnum(schemaType);
  if (enumVal !== undefined) return enumVal;

  // Arrays
  if (schemaType?.$isMongooseArray) {
    const caster = schemaType.caster;

    // array of ObjectId refs
    if (caster && caster.instance === 'ObjectId') {
      const ref = getRefName(schemaType);
      return [pickRefId(ref, idx, refIdsByModel)];
    }

    // array of primitives
    return [makeValueForType(modelName, pathName, caster || schemaType, idx, refIdsByModel)];
  }

  // ObjectId refs
  if (schemaType?.instance === 'ObjectId') {
    const ref = getRefName(schemaType);
    return pickRefId(ref, idx, refIdsByModel);
  }

  // Primitives
  switch (schemaType?.instance) {
    case 'String': {
      const base = makeString(modelName, pathName, idx);

      // Never mutate login-critical fields
      if (modelName === 'User' && pathName === 'email') return base;
      if (modelName === 'User' && pathName === 'password') return base;

      // For other unique strings: ensure uniqueness
      if (schemaType?.options?.unique) return `${base}_${idx}_${Date.now()}`;

      return base;
    }
    case 'Number':
      return idx + 1;
    case 'Boolean':
      return idx % 2 === 0;
    case 'Date':
      return new Date(Date.now() - idx * 86400000);
    case 'Mixed':
      return { seeded: true, idx };
    default:
      return makeString(modelName, pathName, idx);
  }
}

function buildDependencyGraph(modelsByName) {
  const deps = new Map(); // model -> Set(models it depends on)
  for (const [name, Model] of modelsByName.entries()) {
    const set = new Set();
    for (const [pathName, schemaType] of Object.entries(Model.schema.paths)) {
      if (shouldSkipPath(pathName)) continue;
      const ref = getRefName(schemaType);
      if (ref && modelsByName.has(ref) && ref !== name) set.add(ref);
    }
    deps.set(name, set);
  }
  return deps;
}

function topoSort(deps) {
  const inDeg = new Map();
  const dependents = new Map(); // ref -> Set(dependent models)

  for (const [m, ds] of deps.entries()) {
    inDeg.set(m, ds.size);
    for (const d of ds) {
      if (!dependents.has(d)) dependents.set(d, new Set());
      dependents.get(d).add(m);
    }
  }

  const q = [];
  for (const [m, deg] of inDeg.entries()) if (deg === 0) q.push(m);

  const out = [];
  while (q.length) {
    const m = q.shift();
    out.push(m);
    const kids = dependents.get(m);
    if (!kids) continue;
    for (const k of kids) {
      inDeg.set(k, inDeg.get(k) - 1);
      if (inDeg.get(k) === 0) q.push(k);
    }
  }

  // If cycles exist, append remaining
  if (out.length !== deps.size) {
    for (const m of deps.keys()) if (!out.includes(m)) out.push(m);
  }
  return out;
}

async function insertSafely(Model, docs) {
  try {
    return await Model.insertMany(docs, { ordered: false });
  } catch (err) {
    console.warn(`[seed] insertMany failed for ${Model.modelName}. Inserting one-by-one. Reason: ${err.message}`);
  }

  const inserted = [];
  for (const d of docs) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await mongoose.connection.collection(Model.collection.name).insertOne(d);
      inserted.push({ ...d, _id: res.insertedId });
    } catch (e) {
      // Skip duplicates
      if (e && (e.code === 11000 || String(e.message).includes('E11000'))) continue;
      throw e;
    }
  }
  return inserted;
}

async function seedUsers(UserModel, count) {
  const hashed = await bcrypt.hash('Password123!', 10);

  // Provide a few “known” accounts for UI testing
  const base = [
    { email: 'admin@lsc.local', roles: [ROLES.PLATFORM_ADMIN] },
    { email: 'volunteer@lsc.local', roles: [ROLES.VOLUNTEER] },
    { email: 'bloodadmin@lsc.local', roles: [ROLES.BLOOD_ADMIN] },
    { email: 'organadmin@lsc.local', roles: [ROLES.ORGAN_ADMIN] },
    { email: 'voladmin@lsc.local', roles: [ROLES.VOLUNTEER_ADMIN] },
  ];

  const extras = Array.from({ length: Math.max(0, count - base.length) }, (_, i) => ({
    email: `user${i + 1}@lsc.local`,
    roles: [ROLES.VOLUNTEER],
  }));

  const usersToCreate = [...base, ...extras].slice(0, count);

  const docs = usersToCreate.map((u, i) => ({
    _id: new mongoose.Types.ObjectId(),
    firstName: 'Seed',
    lastName: `User${i}`,
    email: u.email.toLowerCase(),
    password: hashed,
    userRoles: u.roles,
    isActive: true,
    isVerified: true,
    isBlocked: false,
  }));

  return insertSafely(UserModel, docs);
}

function getCommonOptionalPathsToFill() {
  // Fill these even if not required (helps UI display)
  return ['name', 'title', 'description', 'status', 'type', 'email', 'phone', 'location'];
}

async function seedGeneric(Model, count, refIdsByModel) {
  const modelName = Model.modelName;

  const oneToOneUserModels = new Set(['VolunteerProfile', 'BloodDonor', 'OrganDonor']);
  const userIds = refIdsByModel.get('User') || [];

  const docs = [];
  for (let i = 0; i < count; i += 1) {
    const doc = { _id: new mongoose.Types.ObjectId() };

    for (const [pathName, schemaType] of Object.entries(Model.schema.paths)) {
      if (shouldSkipPath(pathName)) continue;

      const required = isRequired(schemaType);
      const looksCommon = getCommonOptionalPathsToFill().some((k) => pathName.toLowerCase().includes(k));

      if (!required && !looksCommon) continue;

      // Handle 1:1 userId uniqueness
      if (oneToOneUserModels.has(modelName) && pathName === 'userId' && userIds.length) {
        setDeep(doc, pathName, userIds[i % userIds.length]);
        continue;
      }

      const val = makeValueForType(modelName, pathName, schemaType, i, refIdsByModel);
      if (val !== undefined) setDeep(doc, pathName, val);
    }

    docs.push(doc);
  }

  return insertSafely(Model, docs);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');

  const drop = process.argv.includes('--drop');
  const countArgIdx = process.argv.findIndex((a) => a === '--count');
  const parsedCount = countArgIdx !== -1 ? Number(process.argv[countArgIdx + 1]) : 10;
  const count = Number.isFinite(parsedCount) && parsedCount > 0 ? parsedCount : 10;

  // Load all models from src/models
  const files = fs.readdirSync(MODELS_DIR).filter((f) => f.endsWith('.js'));
  for (const f of files) require(path.join(MODELS_DIR, f));

  const modelsByName = new Map(Object.entries(mongoose.models));

  await mongoose.connect(uri);

  if (drop) {
    console.log('[seed] Dropping database...');
    await mongoose.connection.dropDatabase();
  }

  const deps = buildDependencyGraph(modelsByName);
  const order = topoSort(deps);

  const refIdsByModel = new Map();

  console.log(`[seed] Seeding ${order.length} models (count=${count}) into ${uri}`);

  // Seed Users first (login must work)
  if (modelsByName.has('User')) {
    const insertedUsers = await seedUsers(modelsByName.get('User'), count);
    refIdsByModel.set('User', insertedUsers.map((u) => u._id));
    console.log(`[seed] User -> inserted ${insertedUsers.length} docs into "${modelsByName.get('User').collection.name}"`);
  }

  // Seed everything else
  for (const modelName of order) {
    if (modelName === 'User') continue;

    const Model = modelsByName.get(modelName);
    if (!Model) continue;

    // Make VolunteerProfile count match user count (common 1:1)
    const effectiveCount = modelName === 'VolunteerProfile' ? (refIdsByModel.get('User')?.length || count) : count;

    // eslint-disable-next-line no-await-in-loop
    const inserted = await seedGeneric(Model, effectiveCount, refIdsByModel);
    refIdsByModel.set(modelName, inserted.map((d) => d._id));
    console.log(`[seed] ${modelName} -> inserted ${inserted.length} docs into "${Model.collection.name}"`);
  }

  console.log('\n[seed] Known login credentials:');
  console.log('  admin@lsc.local / Password123!   (platform-admin)');
  console.log('  volunteer@lsc.local / Password123! (volunteer)');
  console.log('  bloodadmin@lsc.local / Password123! (blood-bank-admin)');
  console.log('  organadmin@lsc.local / Password123! (organ-approval-admin)');
  console.log('  voladmin@lsc.local / Password123! (volunteer-org-admin)');

  await mongoose.disconnect();
  console.log('[seed] Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});