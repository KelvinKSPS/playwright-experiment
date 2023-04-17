export interface IRequestBody {
    name: string;
    job: string;
}

export interface IUpdateUser extends IRequestBody {
    userId: number;
}

export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    // TODO: Enhancement - Add a schema validator for email and avatar (url)
    email: string;
    avatar: string;
}
