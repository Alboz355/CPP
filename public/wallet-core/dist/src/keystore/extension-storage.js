"use strict";
// SPDX-License-Identifier: Apache-2.0
//
// Copyright © 2017 Trust Wallet.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionStorage = void 0;
var Types = require("./types");
// Extension KeyStore
var ExtensionStorage = /** @class */ (function () {
    function ExtensionStorage(walletIdsKey, storage) {
        this.walletIdsKey = walletIdsKey;
        this.storage = storage;
    }
    ExtensionStorage.prototype.get = function (id) {
        return this.storage.get(id).then(function (object) {
            var wallet = object[id];
            if (wallet === undefined) {
                throw Types.Error.WalletNotFound;
            }
            return wallet;
        });
    };
    ExtensionStorage.prototype.set = function (id, wallet) {
        var _this = this;
        return this.getWalletIds().then(function (ids) {
            var _a;
            if (ids.indexOf(id) === -1) {
                ids.push(id);
            }
            return _this.storage.set((_a = {},
                _a[id] = wallet,
                _a[_this.walletIdsKey] = ids,
                _a));
        });
    };
    ExtensionStorage.prototype.loadAll = function () {
        var _this = this;
        return this.getWalletIds().then(function (ids) {
            if (ids.length === 0) {
                return [];
            }
            return _this.storage
                .get(ids)
                .then(function (wallets) { return Object.keys(wallets).map(function (key) { return wallets[key]; }); });
        });
    };
    ExtensionStorage.prototype.delete = function (id, password) {
        var _this = this;
        return this.getWalletIds().then(function (ids) {
            var index = ids.indexOf(id);
            if (index === -1) {
                return;
            }
            ids.splice(index, 1);
            return _this.storage
                .remove(id)
                .then(function () {
                var _a;
                return _this.storage.set((_a = {}, _a[_this.walletIdsKey] = ids, _a));
            });
        });
    };
    ExtensionStorage.prototype.getWalletIds = function () {
        var _this = this;
        return this.storage.get(this.walletIdsKey).then(function (object) {
            var ids = object[_this.walletIdsKey];
            return ids === undefined ? [] : ids;
        });
    };
    return ExtensionStorage;
}());
exports.ExtensionStorage = ExtensionStorage;
