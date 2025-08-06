import { Storage } from "webextension-polyfill";
import * as Types from "./types";
export declare class ExtensionStorage implements Types.IStorage {
    readonly storage: Storage.StorageArea;
    readonly walletIdsKey: string;
    constructor(walletIdsKey: string, storage: Storage.StorageArea);
    get(id: string): Promise<Types.Wallet>;
    set(id: string, wallet: Types.Wallet): Promise<void>;
    loadAll(): Promise<Types.Wallet[]>;
    delete(id: string, password: string): Promise<void>;
    private getWalletIds;
}
