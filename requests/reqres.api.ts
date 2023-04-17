import BasicApi from './basic.api';

export default class ReqResIn extends BasicApi {
    constructor() {
        super();
        this.baseUrl = 'http://reqres.in';
    }

    async listUsers(delayTime?) {
        // adding per_page param as the max of 100. No need to pagination on validations.
        // checking if delayTime is undefined because the value can be 0
        return this.get(`/api/users?${delayTime !== undefined ? `delay=${delayTime}` : 'per_page=100'}`);
    }

    async createNewUser({ name, job }) {
        return this.post(`/api/users`, {
            json: {
                name,
                job,
            },
        });
    }

    async updateUser({ userId, name, job }) {
        return this.patch(`/api/users/${userId}`, {
            json: {
                name,
                job,
            },
        });
    }

    async getSingleUser(userId) {
        return this.get(`/api/users/${userId}`);
    }

    extractUsersWithOddIdsFromList(list) {
        return list.filter((elem) => elem.id % 2);
    }
}
