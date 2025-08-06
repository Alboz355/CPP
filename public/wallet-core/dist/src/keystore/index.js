"use strict";
// SPDX-License-Identifier: Apache-2.0
//
// Copyright © 2017 Trust Wallet.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionStorage = exports.FileSystemStorage = exports.Default = void 0;
var default_impl_1 = require("./default-impl");
Object.defineProperty(exports, "Default", { enumerable: true, get: function () { return default_impl_1.Default; } });
__exportStar(require("./types"), exports);
var fs_storage_1 = require("./fs-storage");
Object.defineProperty(exports, "FileSystemStorage", { enumerable: true, get: function () { return fs_storage_1.FileSystemStorage; } });
var extension_storage_1 = require("./extension-storage");
Object.defineProperty(exports, "ExtensionStorage", { enumerable: true, get: function () { return extension_storage_1.ExtensionStorage; } });
