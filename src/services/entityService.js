const prisma = require('../prisma/client.js');
const { ValidationError } = require('../utils/response.js');

function validateSchemaStructure(schemaJson) {
  if (!schemaJson || typeof schemaJson !== 'object' || Array.isArray(schemaJson)) {
    throw new ValidationError('schemaJson must be an object');
  }
  const { fields } = schemaJson;
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new ValidationError('schemaJson must contain a non‑empty "fields" array');
  }
  const allowedTypes = ['text', 'number', 'boolean', 'date'];
  for (const field of fields) {
    if (!field.name || typeof field.name !== 'string') {
      throw new ValidationError('Each field must have a string "name"');
    }
    if (!field.type || !allowedTypes.includes(field.type)) {
      throw new ValidationError(`Field "${field.name}" has invalid type. Allowed: ${allowedTypes.join(', ')}`);
    }
    // required is optional – default false
    if (field.required !== undefined && typeof field.required !== 'boolean') {
      throw new ValidationError(`Field "${field.name}" optional "required" must be boolean`);
    }
  }
}

exports.createEntity = async function(appId, name, schemaJson) {
  validateSchemaStructure(schemaJson);
  const existing = await prisma.entity.findFirst({ where: { appId, name } });
  if (existing) {
    throw new ValidationError('Entity with this name already exists in the app');
  }
  const entity = await prisma.entity.create({
    data: { appId, name, schemaJson },
    select: { id: true, name: true, schemaJson: true },
  });
  return entity;
}

exports.listEntities = async function(appId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [entities, total] = await Promise.all([
    prisma.entity.findMany({
      where: { appId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.entity.count({ where: { appId } }),
  ]);
  return { entities, total, page, limit };
}

exports.getEntityById = async function(appId, entityId) {
  const entity = await prisma.entity.findFirst({
    where: { id: entityId, appId },
  });
  if (!entity) {
    throw new ValidationError('Entity not found or access denied');
  }
  return entity;
}

exports.updateEntity = async function(appId, entityId, schemaJson) {
  validateSchemaStructure(schemaJson);
  await exports.getEntityById(appId, entityId);
  const updated = await prisma.entity.update({
    where: { id: entityId },
    data: { schemaJson },
    select: { id: true, name: true, schemaJson: true },
  });
  return updated;
}

exports.deleteEntity = async function(appId, entityId) {
  await exports.getEntityById(appId, entityId);
  await prisma.entity.update({
    where: { id: entityId },
    data: { deletedAt: new Date() },
  });
  return { success: true };
}
