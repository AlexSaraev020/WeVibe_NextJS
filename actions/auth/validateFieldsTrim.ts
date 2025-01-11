export const validateFieldsTrim = (fields: { [key: string]: string }) => {
  const trimmedFields: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === "") {
      if (key === "bio" || key === "description" || key === "updatePassword") {
        continue;
      } else {
        return {
          error: `${key.charAt(0).toUpperCase() + key.slice(1)} is required`,
        };
      }
    }
    trimmedFields[key] = value.trim();
  }
  return { error: null, fields: trimmedFields };
};
