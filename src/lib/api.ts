// NestJS HTTP client — configure base URL via VITE_API_URL env var
// Replace stub calls with real fetch/axios calls as BE endpoints are ready

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  listing: {
    getAll:  ()           => request("/listing"),
    getOne:  (id: number) => request(`/listing/${id}`),
    search:  (q: string)  => request(`/listing/search?q=${encodeURIComponent(q)}`),
  },
  apartment: {
    getAll:  ()           => request("/apartment"),
    getOne:  (id: number) => request(`/apartment/${id}`),
  },
};
