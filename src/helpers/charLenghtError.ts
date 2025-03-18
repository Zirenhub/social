function getMinCharError(field: string, minChar: number) {
  return { message: `${field} must be ${minChar} or more characters long.` };
}

function getMaxCharError(field: string, maxChar: number) {
  return { message: `${field} must be no longer than ${maxChar} characters.` };
}

export { getMinCharError, getMaxCharError };
