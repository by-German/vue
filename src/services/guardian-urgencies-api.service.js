import http from './common/http.common';

class GuardianUrgenciesApiService {
    getAll(guardianId) {
        return http.get(`guardians/${guardianId}/urgencies`);
    }
    create(guardianId, data) {
        return http.post(`guardians/${guardianId}/urgencies`, data);
    }
    update(id, data) {
        // todo: add GuardianService
        return http.put(`/urgencies/${id}`, data);
    }
    delete(id) {
        return http.delete(`/urgencies/${id}`);
    }
}

export default new GuardianUrgenciesApiService()