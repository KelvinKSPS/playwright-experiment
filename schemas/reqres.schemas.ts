import Joi from 'joi';

function SUserData() {
    return Joi.object({
        id: Joi.number().required(),
        email: Joi.string().email().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        avatar: Joi.string().uri().required(),
    });
}

export function SUpdateUser() {
    return Joi.object({
        name: Joi.string().required(),
        job: Joi.string().required(),
        updatedAt: Joi.string().isoDate().required(),
    });
}

export function SNewUser() {
    return Joi.object({
        name: Joi.string().required(),
        job: Joi.string().required(),
        id: Joi.string().required(),
        createdAt: Joi.string().isoDate().required(),
    });
}

export function SSupport() {
    return Joi.object({
        text: Joi.string(),
        url: Joi.string(),
    });
}

export function SSingleUser() {
    return Joi.object({
        data: SUserData(),
        support: SSupport().optional(),
    });
}

export function SListUsers() {
    return Joi.object({
        data: Joi.array().items(SUserData()),
        page: Joi.number().required(),
        per_page: Joi.number().required(),
        support: SSupport().optional(),
        total: Joi.number().required(),
        total_pages: Joi.number().required(),
    });
}
