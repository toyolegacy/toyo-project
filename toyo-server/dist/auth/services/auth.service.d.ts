export declare class AuthService {
    private readonly SECRET_KEY;
    private readonly GOOGLE_URL;
    private readonly DATA_URL;
    private readonly GRANT_TYPE;
    private readonly CLIENT_ID;
    private readonly CLIENT_SECRET;
    getCredentials(): Promise<Record<string, string> | void>;
    getAccessToken(): Promise<string | void>;
    validateHuman(token: string): Promise<boolean | void>;
}
