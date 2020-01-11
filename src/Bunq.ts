import BunqClient from './BunqClient';
import BunqJSClient from '@bunq-community/bunq-js-client';
import RequestLimitFactory from '@bunq-community/bunq-js-client/dist/RequestLimitFactory';
import StorageInterface from '@bunq-community/bunq-js-client/dist/Interfaces/StorageInterface';

interface BunqClients {
    [key: string]: BunqClient;
}

export default class Bunq {
    public status: string;
    private storage: StorageInterface;
    private genericBunqClient: BunqJSClient;
    private requestLimiter: RequestLimitFactory;
    private bunqClients: BunqClients;

    constructor(customStore: StorageInterface) {
        this.status = 'STARTING';
        this.storage = customStore;
        this.genericBunqClient = new BunqJSClient(this.storage);

        this.requestLimiter;
        this.bunqClients = {};
    }

    async load(
        key: string,
        filename: string,
        accessToken: string,
        encryptionKey: string,
        environment: string,
        options: {},
    ): Promise<void> {
        this.bunqClients[key] = new BunqClient();
        await this.bunqClients[key].initialize(filename, accessToken, encryptionKey, environment, options);
    }

    getGenericClient(): BunqJSClient {
        //get generic client (to generate keys etc)
        return this.genericBunqClient;
    }

    getClient(identifier: string): BunqClient {
        if (!this.bunqClients[identifier]) throw 'Cannot find bunq connection';
        //get client by identifier
        return this.bunqClients[identifier];
    }
}
