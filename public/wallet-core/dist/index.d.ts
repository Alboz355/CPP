import { TW } from "./generated/core_proto";
import { WalletCore } from "./src/wallet-core";
import * as KeyStore from "./src/keystore";
declare function load(): Promise<WalletCore>;
export declare const initWasm: typeof load;
export { TW, WalletCore, KeyStore };
