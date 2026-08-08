import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../src/settings/config';

// Собирает заголовок Basic Auth с логином/паролем супер-админа для тестов.
export function generateBasicAuthToken() {
  const credentials = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
}