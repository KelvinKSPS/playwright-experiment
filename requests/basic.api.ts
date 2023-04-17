import got from 'got';
import { test } from '@playwright/test';

export default class BasicApi {
    protected baseUrl: string;

    protected async execute(options) {
        const requestTitle = `[${options.method}] ${this.baseUrl}${options.url}, json: ${JSON.stringify(options.json) || 'none'}`;
        try {
            // Adding a custom step on reports
            test.step(requestTitle, () => true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const resp: any = await got({ ...options, url: this.baseUrl + options.url });

            if ((resp.headers['content-type'] || '').startsWith('application/json')) {
                resp.json = JSON.parse(resp.body);
            }
             // Adding a custom step on reports
            test.info().attach(`[RESULT][STATUS=${resp.statusCode}]${requestTitle}`, { body: JSON.stringify(resp.json, null, 4) });
            return resp;
        } catch (e) {
            // Catching the exception and return selected data because got.js exceptions give a lot of extra information, not needed on project
            if (e.response) {
                const resp = e.response;
                if ((resp.headers['content-type'] || '').startsWith('application/json')) {
                    resp.json = JSON.parse(resp.body);
                }
                const errorBody = {
                    statusCode: resp.statusCode,
                    json: resp.json,
                };
                 // Adding a custom step on reports
                test.info().attach(`[RESULT][STATUS=${resp.statusCode}]${requestTitle}`, { body: JSON.stringify(errorBody, null, 4) });
                throw errorBody;
            }

            throw e;
        }
    }

    /**
     * Basic API Methods
     */
    protected async put(url: string, options = {}) {
        return this.execute({ url, ...options, method: 'PUT' });
    }

    protected async post(url: string, options = {}) {
        return this.execute({ url, ...options, method: 'POST' });
    }

    protected async get(url: string, options = {}) {
        return this.execute({ url, ...options, method: 'GET' });
    }

    protected async patch(url: string, options = {}) {
        return this.execute({ url, ...options, method: 'PATCH' });
    }

    protected async delete(url: string, options = {}) {
        return this.execute({ url, ...options, method: 'DELETE' });
    }

    protected async options(url: string, options = {}) {
        return this.execute({ url, ...options, method: 'OPTIONS' });
    }
}
