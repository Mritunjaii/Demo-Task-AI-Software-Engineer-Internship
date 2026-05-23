
exports.validateAgainstSchema = function(schemaJson, data) {
  const errors = [];
  if (!schemaJson || typeof schemaJson !== 'object' || Array.isArray(schemaJson)) {
    errors.push('Invalid schema definition');
    return errors;
  }
  const { fields } = schemaJson;
  if (!Array.isArray(fields)) {
    errors.push('Schema must contain a fields array');
    return errors;
  }
  // Validate each field
  for (const field of fields) {
    const { name, type, required } = field;
    const value = data[name];
    if (required && (value === undefined || value === null || value === '')) {
      errors.push(`Field "${name}" is required`);
      continue;
    }
    // Skip type check if value is undefined and not required
    if (value === undefined || value === null) continue;
    switch (type) {
      case 'text':
        if (typeof value !== 'string') errors.push(`Field "${name}" must be a string`);
        break;
      case 'number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors.push(`Field "${name}" must be a number`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') errors.push(`Field "${name}" must be a boolean`);
        break;
      case 'date':
        if (isNaN(Date.parse(value))) errors.push(`Field "${name}" must be a valid date`);
        break;
      default:
        errors.push(`Unsupported field type "${type}" for field "${name}"`);
    }
  }
  return errors;
}
