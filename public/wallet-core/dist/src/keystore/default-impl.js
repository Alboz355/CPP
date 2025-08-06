"use strict";
// SPDX-License-Identifier: Apache-2.0
//
// Copyright © 2017 Trust Wallet.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
var Types = require("./types");
var Default = /** @class */ (function () {
    function Default(core, storage) {
        this.core = core;
        this.storage = storage;
    }
    Default.prototype.hasWallet = function (id) {
        return this.storage
            .get(id)
            .then(function (wallet) { return true; })
            .catch(function (error) { return false; });
    };
    Default.prototype.load = function (id) {
        return this.storage.get(id);
    };
    Default.prototype.loadAll = function () {
        return this.storage.loadAll();
    };
    Default.prototype.delete = function (id, password) {
        return this.storage.delete(id, password);
    };
    Default.prototype.mapWallet = function (storedKey) {
        var json = storedKey.exportJSON();
        return JSON.parse(Buffer.from(json).toString());
    };
    Default.prototype.mapStoredKey = function (wallet) {
        var json = Buffer.from(JSON.stringify(wallet));
        return this.core.StoredKey.importJSON(json);
    };
    Default.prototype.importWallet = function (wallet) {
        return this.storage.set(wallet.id, wallet);
    };
    Default.prototype.import = function (mnemonic, name, password, coins, encryption) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a = _this.core, Mnemonic = _a.Mnemonic, StoredKey = _a.StoredKey, HDWallet = _a.HDWallet, StoredKeyEncryption = _a.StoredKeyEncryption;
            if (!Mnemonic.isValid(mnemonic)) {
                throw Types.Error.InvalidMnemonic;
            }
            var pass = Buffer.from(password);
            var storedKey = StoredKey.importHDWalletWithEncryption(mnemonic, name, pass, coins[0], encryption);
            var hdWallet = HDWallet.createWithMnemonic(mnemonic, "");
            coins.forEach(function (coin) {
                storedKey.accountForCoin(coin, hdWallet);
            });
            var wallet = _this.mapWallet(storedKey);
            storedKey.delete();
            hdWallet.delete();
            _this.importWallet(wallet)
                .then(function () { return resolve(wallet); })
                .catch(function (error) { return reject(error); });
        });
    };
    Default.prototype.importKey = function (key, name, password, coin, encryption, derivation) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a = _this.core, StoredKey = _a.StoredKey, PrivateKey = _a.PrivateKey, Curve = _a.Curve, StoredKeyEncryption = _a.StoredKeyEncryption;
            // FIXME: get curve from coin
            if (!PrivateKey.isValid(key, Curve.secp256k1) ||
                !PrivateKey.isValid(key, Curve.ed25519)) {
                throw Types.Error.InvalidKey;
            }
            var pass = Buffer.from(password);
            var storedKey = StoredKey.importPrivateKeyWithEncryptionAndDerivation(key, name, pass, coin, encryption, derivation);
            var wallet = _this.mapWallet(storedKey);
            storedKey.delete();
            _this.importWallet(wallet)
                .then(function () { return resolve(wallet); })
                .catch(function (error) { return reject(error); });
        });
    };
    Default.prototype.importKeyEncoded = function (key, name, password, coin, encryption, derivation) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a = _this.core, StoredKey = _a.StoredKey, PrivateKey = _a.PrivateKey, Curve = _a.Curve, StoredKeyEncryption = _a.StoredKeyEncryption;
            var pass = Buffer.from(password);
            var storedKey = StoredKey.importPrivateKeyEncodedWithEncryptionAndDerivation(key, name, pass, coin, encryption, derivation);
            var wallet = _this.mapWallet(storedKey);
            storedKey.delete();
            _this.importWallet(wallet)
                .then(function () { return resolve(wallet); })
                .catch(function (error) { return reject(error); });
        });
    };
    Default.prototype.addAccounts = function (id, password, coins) {
        var Derivation = this.core.Derivation;
        var coins_with_derivations = coins.map(function (coin) { return ({
            coin: coin,
            derivation: Derivation.default,
        }); });
        return this.addAccountsWithDerivations(id, password, coins_with_derivations);
    };
    Default.prototype.addAccountsWithDerivations = function (id, password, coins) {
        var _this = this;
        return this.load(id).then(function (wallet) {
            var storedKey = _this.mapStoredKey(wallet);
            var hdWallet = storedKey.wallet(Buffer.from(password));
            coins.forEach(function (item) {
                storedKey.accountForCoinDerivation(item.coin, item.derivation, hdWallet);
            });
            var newWallet = _this.mapWallet(storedKey);
            storedKey.delete();
            hdWallet.delete();
            return _this.importWallet(newWallet).then(function () { return newWallet; });
        });
    };
    Default.prototype.getKey = function (id, password, account) {
        var _this = this;
        return this.load(id).then(function (wallet) {
            var storedKey = _this.mapStoredKey(wallet);
            var coin = _this.core.CoinType.values["" + account.coin];
            var privateKey = storedKey.privateKey(coin, Buffer.from(password));
            storedKey.delete();
            return privateKey;
        });
    };
    Default.prototype.export = function (id, password) {
        var _this = this;
        return this.load(id).then(function (wallet) {
            var storedKey = _this.mapStoredKey(wallet);
            var value;
            switch (wallet.type) {
                case Types.WalletType.Mnemonic:
                    value = storedKey.decryptMnemonic(Buffer.from(password));
                    break;
                case Types.WalletType.PrivateKey:
                    value = storedKey.decryptPrivateKey(Buffer.from(password));
                    break;
                default:
                    throw Types.Error.InvalidJSON;
            }
            storedKey.delete();
            return value;
        });
    };
    Default.prototype.getWalletType = function (id) {
        return this.load(id).then(function (wallet) { return wallet.type; });
    };
    Default.prototype.exportMnemonic = function (id, password) {
        var _this = this;
        return this.load(id).then(function (wallet) {
            if (wallet.type !== Types.WalletType.Mnemonic) {
                throw Types.Error.UnsupportedWalletType;
            }
            var storedKey = _this.mapStoredKey(wallet);
            var value = storedKey.decryptMnemonic(Buffer.from(password));
            storedKey.delete();
            return value;
        });
    };
    Default.prototype.exportPrivateKey = function (id, password) {
        var _this = this;
        return this.load(id).then(function (wallet) {
            if (wallet.type !== Types.WalletType.PrivateKey) {
                throw Types.Error.UnsupportedWalletType;
            }
            var storedKey = _this.mapStoredKey(wallet);
            var value = storedKey.decryptPrivateKey(Buffer.from(password));
            storedKey.delete();
            return value;
        });
    };
    Default.prototype.exportPrivateKeyEncoded = function (id, password) {
        var _this = this;
        return this.load(id).then(function (wallet) {
            if (wallet.type !== Types.WalletType.PrivateKey) {
                throw Types.Error.UnsupportedWalletType;
            }
            var storedKey = _this.mapStoredKey(wallet);
            var value = storedKey.decryptPrivateKeyEncoded(Buffer.from(password));
            storedKey.delete();
            return value;
        });
    };
    return Default;
}());
exports.Default = Default;
