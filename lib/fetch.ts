export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const data = (await response.json().catch(() => null)) as T | { error?: string } | null;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data && data.error ? data.error : "Something went wrong";

    throw new Error(message);
  }

  return data as T;
}
