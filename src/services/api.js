import APP_CONFIG from '../constants/appConfig';

async function apiRequest(
  endpoint,
  options = {},
) {
  if (!APP_CONFIG.API_BASE_URL) {
    throw new Error(
      'API_BASE_URL is not configured yet.',
    );
  }

  const response = await fetch(
    `${APP_CONFIG.API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    },
  );

  const rawText =
    await response.text();

  let data = null;

  try {
    data = rawText
      ? JSON.parse(rawText)
      : null;
  } catch {
    data = rawText;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`,
    );
  }

  return data;
}

export default apiRequest;