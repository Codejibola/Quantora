export default async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, { ...options, headers });

  // Handle expired/invalid session
  if (res.status === 401 || res.status === 403) {
    alert("Your session has expired. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "/admin";  
    return;
  }

  return res;
}
