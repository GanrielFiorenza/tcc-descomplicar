export const isValidUsername = (username: string): boolean => {
  return username.trim().length > 0;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};