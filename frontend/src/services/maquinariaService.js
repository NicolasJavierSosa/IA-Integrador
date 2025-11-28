import { client } from './client';

export const maquinariaService = {
    list: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return client.request(`/maquinaria/?${query}`);
    },
    create: (data) => client.request('/maquinaria/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    delete: (id) => client.request(`/maquinaria/${id}/`, {
        method: 'DELETE',
    }),
    update: (id, data) => client.request(`/maquinaria/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
};

export const tipoMaquinariaService = {
    list: () => client.request('/tipo-maquinaria/'),
};
