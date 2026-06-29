const API_BASE = '/rest';

async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API Error');
    return data;
}

export const loginUser = (email, password) => apiFetch('/onboardings/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
});

export const registerUser = (name, email, password) => apiFetch('/onboardings/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
});

export const logoutUser = () => apiFetch('/onboardings/logout', { method: 'POST' });

export const getReimbursements = () => apiFetch('/reimbursements');
export const createReimbursement = (title, amount, description) => apiFetch('/reimbursements', {
    method: 'POST',
    body: JSON.stringify({ title, amount: parseFloat(amount), description })
});

export const updateReimbursementStatus = (id, status) => apiFetch(`/reimbursements`, {
    method: 'PATCH',
    body: JSON.stringify({ reimbursementId: parseInt(id), status })
});

export const getEmployees = () => apiFetch('/employees');

export const assignRole = (userId, role) => apiFetch('/roles/assign', {
    method: 'POST',
    body: JSON.stringify({ userId: parseInt(userId), role })
});

export const assignManager = (employeeId, managerId) => apiFetch('/employees/assign', {
    method: 'POST',
    body: JSON.stringify({ employeeId: parseInt(employeeId), managerId: parseInt(managerId) })
});
