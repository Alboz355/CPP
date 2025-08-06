import * as Types from "./types";
export declare class FileSystemStorage implements Types.IStorage {
    private readonly directory;
    constructor(directory: string);
    getFilename(id: any): string;
    get(id: string): Promise<Types.Wallet>;
    set(id: string, wallet: Types.Wallet): Promise<void>;
    loadAll(): Promise<Types.Wallet[]>;
    delete(id: string, password: string): Promise<void>;
}
