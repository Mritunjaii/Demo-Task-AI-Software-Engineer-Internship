const prisma = require('../prisma/client.js');
const { ValidationError } = require('../utils/response.js');

exports.createApp = async function(name, ownerId) {
  if (!name) {
    throw new ValidationError('App name is required');
  }
  const app = await prisma.app.create({
    data: { name, ownerId },
    select: { id: true, name: true, ownerId: true },
  });
  return app;
}

exports.getAppsByOwner = async function(ownerId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [apps, total] = await Promise.all([
    prisma.app.findMany({
      where: { ownerId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.app.count({ where: { ownerId } }),
  ]);
  return { apps, total, page, limit };
}

exports.getAppById = async function(appId, ownerId) {
  const app = await prisma.app.findFirst({
    where: { id: appId, ownerId },
  });
  if (!app) {
    throw new ValidationError('App not found or access denied');
  }
  return app;
}

exports.updateApp = async function(appId, ownerId, data) {
  const app = await exports.getAppById(appId, ownerId);
  const updated = await prisma.app.update({
    where: { id: app.id },
    data: { name: data.name },
    select: { id: true, name: true, ownerId: true },
  });
  return updated;
}

exports.deleteApp = async function(appId, ownerId) {
  await exports.getAppById(appId, ownerId);
  await prisma.app.update({
    where: { id: appId },
    data: { deletedAt: new Date() },
  });
  return { success: true };
}
