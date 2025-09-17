
export const CheckAuthentication = async (): Promise<{ valid: boolean, username: string, role: string }> => {
    const token = localStorage.getItem("auth_token");
    if (!token) return { valid: false, username: '', role: '' };

    try {
        const res = await fetch("http://127.0.0.1:8080/api/users/ping", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data: { username: string, role: string } = await res.json();
        return { valid: res.ok, ...data };
    } catch {
        return { valid: false, username: '', role: '' };
    }
}
