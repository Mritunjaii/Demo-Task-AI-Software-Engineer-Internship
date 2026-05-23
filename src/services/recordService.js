const prisma = require('../prisma/client.js');
const { ValidationError } = require('../utils/response.js');
const { validateAgainstSchema } = require('../validators/dynamicValidator.js');

exports.createRecord = async function(appId, entityName, data, userId) {
  const entity = await prisma.entity.findFirst({
    where: { appId, name: entityName },
  });
  if (!entity) {
    throw new ValidationError('Entity not found for this app');
  }

  const errors = validateAgainstSchema(entity.schemaJson, data);
  if (errors.length) {
    throw new ValidationError('Validation failed', errors);
  }

  const record = await prisma.record.create({
    data: {
      entityId: entity.id,
      data,
      createdBy: userId,
    },
    select: { id: true, data: true, createdAt: true, updatedAt: true },
  });
  return record;
}

exports.getRecords = async function(appId, entityName, query) {
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', ...filters } = query;
  const skip = (page - 1) * limit;

  const entity = await prisma.entity.findFirst({
    where: { appId, name: entityName },
  });
  if (!entity) {
    throw new ValidationError('Entity not found for this app');
  }

  const whereClause = {
    entityId: entity.id,
    ...Object.entries(filters).reduce((acc, [key, val]) => {
      acc['data'] = { ...(acc['data'] || {}), [key]: val };
      return acc;
    }, {}),
  };

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where: whereClause,
      skip,
      take: Number(limit),
      orderBy: { [sort]: order },
    }),
    prisma.record.count({ where: whereClause }),
  ]);

  return { records, total, page: Number(page), limit: Number(limit) };
}

exports.getRecordById = async function(appId, entityName, recordId) {
  const entity = await prisma.entity.findFirst({ where: { appId, name: entityName } });
  if (!entity) {
    throw new ValidationError('Entity not found for this app');
  }
  const record = await prisma.record.findFirst({
    where: { id: Number(recordId), entityId: entity.id },
  });
  if (!record) {
    throw new ValidationError('Record not found');
  }
  return record;
}

exports.updateRecord = async function(appId, entityName, recordId, data) {
  const entity = await prisma.entity.findFirst({ where: { appId, name: entityName } });
  if (!entity) {
    throw new ValidationError('Entity not found for this app');
  }
  const errors = validateAgainstSchema(entity.schemaJson, data);
  if (errors.length) {
    throw new ValidationError('Validation failed', errors);
  }
  const updated = await prisma.record.update({
    where: { id: Number(recordId), entityId: entity.id },
    data: { data },
    select: { id: true, data: true, updatedAt: true },
  });
  return updated;
}

exports.deleteRecord = async function(appId, entityName, recordId) {
  const entity = await prisma.entity.findFirst({ where: { appId, name: entityName } });
  if (!entity) {
    throw new ValidationError('Entity not found for this app');
  }
  await prisma.record.update({
    where: { id: Number(recordId), entityId: entity.id },
    data: { deletedAt: new Date() },
  });
  return { success: true };
}
