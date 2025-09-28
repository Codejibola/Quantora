export default async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.body && { "Content-Type": "application/json" }),
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 || res.status === 403) {
    // Only alert if there was actually a token
    if (token) alert("Your session has expired. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "/admin";
    return;
  }

  return res;
}
