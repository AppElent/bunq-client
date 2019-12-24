import BunqClient from './BunqClient';
import BunqJSClient from '@bunq-community/bunq-js-client';

export class Bunq {
    public status: string;
    private storage;
    private genericBunqClient;
    private requestLimiter;
    private bunqClients;

    constructor(customStore) {
        this.status = 'STARTING';
        this.storage = customStore;
        this.genericBunqClient = new BunqJSClient(this.storage);

        this.requestLimiter;
        this.bunqClients = {};
    }

    async load(key, filename, accessToken, encryptionKey, environment, options) {
        this.bunqClients[key] = new BunqClient();
        await this.bunqClients[key].initialize(filename, accessToken, encryptionKey, environment, options);
    }

    getGenericClient(): any {
        //get generic client (to generate keys etc)
        return this.genericBunqClient;
    }

    getClient(identifier): any {
        if (!this.bunqClients[identifier]) throw 'Cannot find bunq connection';
        //get client by identifier
        return this.bunqClients[identifier];
    }
}
