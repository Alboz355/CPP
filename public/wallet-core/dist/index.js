"use strict";
// SPDX-License-Identifier: Apache-2.0
//
// Copyright © 2017 Trust Wallet.
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyStore = exports.TW = exports.initWasm = void 0;
var Loader = require("./lib/wallet-core");
var core_proto_1 = require("./generated/core_proto");
Object.defineProperty(exports, "TW", { enumerable: true, get: function () { return core_proto_1.TW; } });
var KeyStore = require("./src/keystore");
exports.KeyStore = KeyStore;
exports.initWasm = Loader;
