// src/validators/schemaValidator.js
/**
 * Validate that a schemaJson object follows the allowed structure.
 * Ensures fields array exists and each field has name, type, optional required.
 */
exports.validateSchemaStructure = function(schemaJson) {
  if (!schemaJson || typeof schemaJson !== 'object' || Array.isArray(schemaJson)) {
    throw new Error('schemaJson must be an object');
  }
  const { fields } = schemaJson;
  if (!Array.isArray(fields) || fields.length === 0) {
    throw new Error('schemaJson must contain a non‑empty "fields" array');
  }
  const allowedTypes = ['text', 'number', 'boolean', 'date'];
  for (const field of fields) {
    if (!field.name || typeof field.name !== 'string') {
      throw new Error('Each field must have a string "name"');
    }
    if (!field.type || !allowedTypes.includes(field.type)) {
      throw new Error(`Field "${field.name}" has invalid type. Allowed: ${allowedTypes.join(', ')}`);
    }
    if (field.required !== undefined && typeof field.required !== 'boolean') {
      throw new Error(`Field "${field.name}" optional "required" must be boolean`);
    }
  }
}
