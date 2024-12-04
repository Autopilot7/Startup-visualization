export function handleApiError(response: Response) {
    if (response.status === 400) return 'Bad request';
    if (response.status === 401) return 'Unauthorized';
    if (response.status === 500) return 'Internal server error';
    return 'An unexpected error occurred';
  }
  