import { IRequestBody, IUpdateUser, IUser } from '../interfaces/reqres.interface';
import { SListUsers, SNewUser, SSingleUser, SUpdateUser } from '../schemas/reqres.schemas';
import BasicApi from './basic.api';

export default class ReqResIn extends BasicApi {
    constructor() {
        super();
        this.baseUrl = 'http://reqres.in';
    }

    async listUsers(delayTime?: number) {
        // adding per_page param as the max of 100. No need to pagination on validations.
        // checking if delayTime is undefined because the value can be 0
        const result = await this.get(`/api/users?${delayTime !== undefined ? `delay=${delayTime}` : 'per_page=100'}`);
        this.assert(result.json, SListUsers());
        return result;
    }

    async createNewUser({ name, job }: IRequestBody) {
        const result = await this.post(`/api/users`, {
            json: {
                name,
                job,
            } as IRequestBody,
        });
        this.assert(result.json, SNewUser());
        return result;
    }

    async updateUser({ userId, name, job }: IUpdateUser) {
        const result = await this.patch(`/api/users/${userId}`, {
            json: {
                name,
                job,
            } as IRequestBody,
        });
        this.assert(result.json, SUpdateUser());
        return result;
    }

    async getSingleUser(userId: number) {
        const result = await this.get(`/api/users/${userId}`);
        this.assert(result.json, SSingleUser());
        return result;
    }

    extractUsersWithOddIdsFromList(list: Array<IUser>) {
        return list.filter((elem) => elem.id % 2);
    }
}
