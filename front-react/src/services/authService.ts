export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const decodeToken = (token: string): { userId: number } => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { userId: payload.userId };
};