import { test, expect } from '@playwright/test';
import ReqResIn from '../requests/reqres.api';

import data from '../resources/api-data-mass.json';

test.describe('api-automation', () => {
    test('Validation 1: Get users, validate response code and print users with odd IDs', async () => {
        const reqRes = new ReqResIn();

        // Get a list of users
        const result = await reqRes.listUsers();

        // Validate that the response code is `200`
        expect.soft(result.statusCode).toEqual(200);

        // Print all users with odd ID numbers
        const oddList = reqRes.extractUsersWithOddIdsFromList(result.json.data);
        for (const element of oddList) {
            expect.soft(element.id % 2).toBe(1);
            console.log(element);

            // Also adding to the report
            test.info().attach(`ID: ${element.id}`, {
                body: JSON.stringify(element, null, 4),
            });
        }
    });

    test('Validation 2: Create a new user, check response code and creation date', async () => {
        const reqRes = new ReqResIn();

        // Create a new user
        const result = await reqRes.createNewUser(data.user_creation);
        const currentDate = new Date();

        //  Validate that the response code is `201`
        expect.soft(result.statusCode).toEqual(201);

        //  Validate that the creation date is today
        const returnedDate = new Date(result.json.createdAt);
        expect.soft(returnedDate.getDate()).toEqual(currentDate.getDate());
        expect.soft(returnedDate.getMonth()).toEqual(currentDate.getMonth());
        expect.soft(returnedDate.getFullYear()).toEqual(currentDate.getFullYear());
    });

    test('Validation 3: Update user, verify response code and all fields', async () => {
        const reqRes = new ReqResIn();
        // Update a user
        const result = await reqRes.updateUser({ userId: 1, ...data.user_creation });

        // Validate that the response code is `200`
        expect.soft(result.statusCode).toEqual(200);

        // Validate that the response body matches the request body where applicable. Do a recursive comparison if possible.
        expect.soft(result.json.job).toEqual(data.user_creation.job);
        expect.soft(result.json.name).toEqual(data.user_creation.name);

        // check if updatedAt is on a valid ISOString format
        expect.soft(new Date(result.json.updatedAt).toISOString()).toEqual(result.json.updatedAt);
    });

    test('Validation 4: Call list users with delays coming from a parameter', async () => {
        const reqRes = new ReqResIn();

        // Write a parameterized validation with the values `0` and `3`
        const delayOptions = [0, 3];

        // Get a list of users passing a delay query parameter with the provided value for the validation
        const results = await Promise.all(
            delayOptions.map(function (elem) {
                return reqRes.listUsers(elem);
            }),
        );

        // Validate that the response time is no longer than `1` second
        for (const result of results) {
            expect.soft(result.timings.phases.total).toBeLessThanOrEqual(1000);
        }
    });

    test('Validation 5: Call list users with delays coming from a parameter', async () => {
        const reqRes = new ReqResIn();

        // Use whatever asynchronous technique you prefer to get `10` single users
        await Promise.all(Array.from(Array(10).keys()).map((number) => reqRes.getSingleUser(number + 1))).then((responses) =>
            // Validate, asynchronously as well, that all response codes are `200s`
            responses.forEach((result) => expect(result.statusCode).toEqual(200)),
        );
    });
});
