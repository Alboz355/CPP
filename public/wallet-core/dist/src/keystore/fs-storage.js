"use strict";
// SPDX-License-Identifier: Apache-2.0
//
// Copyright © 2017 Trust Wallet.
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemStorage = void 0;
var fs = require("fs/promises");
// FileSystem Storage
var FileSystemStorage = /** @class */ (function () {
    function FileSystemStorage(directory) {
        this.directory = directory.endsWith("/") ? directory : directory + "/";
    }
    FileSystemStorage.prototype.getFilename = function (id) {
        return this.directory + id + ".json";
    };
    FileSystemStorage.prototype.get = function (id) {
        return fs
            .readFile(this.getFilename(id))
            .then(function (data) { return JSON.parse(data.toString()); });
    };
    FileSystemStorage.prototype.set = function (id, wallet) {
        return fs.writeFile(this.getFilename(id), JSON.stringify(wallet));
    };
    FileSystemStorage.prototype.loadAll = function () {
        var _this = this;
        return fs.readdir(this.directory).then(function (files) {
            return Promise.all(files
                .filter(function (file) { return file.endsWith(".json"); })
                .map(function (file) { return _this.get(file.replace(".json", "")); }));
        });
    };
    FileSystemStorage.prototype.delete = function (id, password) {
        return fs.unlink(this.getFilename(id));
    };
    return FileSystemStorage;
}());
exports.FileSystemStorage = FileSystemStorage;
