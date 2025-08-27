export const clientFetch = async (url: string, options?: RequestInit) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    accept: "application/json",
  };
  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options?.headers || {}),
    },
  };
  const res = await fetch(url, mergedOptions);
  if (!res.ok) {
    let errorMsg = res.statusText;
    try {
      const error = await res.json();
      if (error && error.message) errorMsg = error.message;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
};