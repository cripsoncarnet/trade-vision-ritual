var viem = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from14, except, desc) => {
    if (from14 && typeof from14 === "object" || typeof from14 === "function") {
      for (let key of __getOwnPropNames(from14))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from14[key], enumerable: !(desc = __getOwnPropDesc(from14, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

  // node_modules/abitype/dist/esm/version.js
  var version;
  var init_version = __esm({
    "node_modules/abitype/dist/esm/version.js"() {
      version = "1.2.3";
    }
  });

  // node_modules/abitype/dist/esm/errors.js
  var BaseError;
  var init_errors = __esm({
    "node_modules/abitype/dist/esm/errors.js"() {
      init_version();
      BaseError = class _BaseError extends Error {
        constructor(shortMessage, args = {}) {
          const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
          const docsPath9 = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
          const message = [
            shortMessage || "An error occurred.",
            "",
            ...args.metaMessages ? [...args.metaMessages, ""] : [],
            ...docsPath9 ? [`Docs: https://abitype.dev${docsPath9}`] : [],
            ...details ? [`Details: ${details}`] : [],
            `Version: abitype@${version}`
          ].join("\n");
          super(message);
          Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "AbiTypeError"
          });
          if (args.cause)
            this.cause = args.cause;
          this.details = details;
          this.docsPath = docsPath9;
          this.metaMessages = args.metaMessages;
          this.shortMessage = shortMessage;
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/regex.js
  function execTyped(regex, string) {
    const match = regex.exec(string);
    return match?.groups;
  }
  var bytesRegex, integerRegex, isTupleRegex;
  var init_regex = __esm({
    "node_modules/abitype/dist/esm/regex.js"() {
      bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
      integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
      isTupleRegex = /^\(.+?\).*?$/;
    }
  });

  // node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
  function formatAbiParameter(abiParameter) {
    let type = abiParameter.type;
    if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
      type = "(";
      const length = abiParameter.components.length;
      for (let i = 0; i < length; i++) {
        const component = abiParameter.components[i];
        type += formatAbiParameter(component);
        if (i < length - 1)
          type += ", ";
      }
      const result = execTyped(tupleRegex, abiParameter.type);
      type += `)${result?.array || ""}`;
      return formatAbiParameter({
        ...abiParameter,
        type
      });
    }
    if ("indexed" in abiParameter && abiParameter.indexed)
      type = `${type} indexed`;
    if (abiParameter.name)
      return `${type} ${abiParameter.name}`;
    return type;
  }
  var tupleRegex;
  var init_formatAbiParameter = __esm({
    "node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js"() {
      init_regex();
      tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
    }
  });

  // node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
  function formatAbiParameters(abiParameters) {
    let params = "";
    const length = abiParameters.length;
    for (let i = 0; i < length; i++) {
      const abiParameter = abiParameters[i];
      params += formatAbiParameter(abiParameter);
      if (i !== length - 1)
        params += ", ";
    }
    return params;
  }
  var init_formatAbiParameters = __esm({
    "node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js"() {
      init_formatAbiParameter();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
  function formatAbiItem(abiItem) {
    if (abiItem.type === "function")
      return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
    if (abiItem.type === "event")
      return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
    if (abiItem.type === "error")
      return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
    if (abiItem.type === "constructor")
      return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
    if (abiItem.type === "fallback")
      return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
    return "receive() external payable";
  }
  var init_formatAbiItem = __esm({
    "node_modules/abitype/dist/esm/human-readable/formatAbiItem.js"() {
      init_formatAbiParameters();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
  function isErrorSignature(signature) {
    return errorSignatureRegex.test(signature);
  }
  function execErrorSignature(signature) {
    return execTyped(errorSignatureRegex, signature);
  }
  function isEventSignature(signature) {
    return eventSignatureRegex.test(signature);
  }
  function execEventSignature(signature) {
    return execTyped(eventSignatureRegex, signature);
  }
  function isFunctionSignature(signature) {
    return functionSignatureRegex.test(signature);
  }
  function execFunctionSignature(signature) {
    return execTyped(functionSignatureRegex, signature);
  }
  function isStructSignature(signature) {
    return structSignatureRegex.test(signature);
  }
  function execStructSignature(signature) {
    return execTyped(structSignatureRegex, signature);
  }
  function isConstructorSignature(signature) {
    return constructorSignatureRegex.test(signature);
  }
  function execConstructorSignature(signature) {
    return execTyped(constructorSignatureRegex, signature);
  }
  function isFallbackSignature(signature) {
    return fallbackSignatureRegex.test(signature);
  }
  function execFallbackSignature(signature) {
    return execTyped(fallbackSignatureRegex, signature);
  }
  function isReceiveSignature(signature) {
    return receiveSignatureRegex.test(signature);
  }
  var errorSignatureRegex, eventSignatureRegex, functionSignatureRegex, structSignatureRegex, constructorSignatureRegex, fallbackSignatureRegex, receiveSignatureRegex, modifiers, eventModifiers, functionModifiers;
  var init_signatures = __esm({
    "node_modules/abitype/dist/esm/human-readable/runtime/signatures.js"() {
      init_regex();
      errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
      eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
      functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
      structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
      constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
      fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
      receiveSignatureRegex = /^receive\(\) external payable$/;
      modifiers = /* @__PURE__ */ new Set([
        "memory",
        "indexed",
        "storage",
        "calldata"
      ]);
      eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
      functionModifiers = /* @__PURE__ */ new Set([
        "calldata",
        "memory",
        "storage"
      ]);
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
  var InvalidAbiItemError, UnknownTypeError, UnknownSolidityTypeError;
  var init_abiItem = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/abiItem.js"() {
      init_errors();
      InvalidAbiItemError = class extends BaseError {
        constructor({ signature }) {
          super("Failed to parse ABI item.", {
            details: `parseAbiItem(${JSON.stringify(signature, null, 2)})`,
            docsPath: "/api/human#parseabiitem-1"
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidAbiItemError"
          });
        }
      };
      UnknownTypeError = class extends BaseError {
        constructor({ type }) {
          super("Unknown type.", {
            metaMessages: [
              `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "UnknownTypeError"
          });
        }
      };
      UnknownSolidityTypeError = class extends BaseError {
        constructor({ type }) {
          super("Unknown type.", {
            metaMessages: [`Type "${type}" is not a valid ABI type.`]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "UnknownSolidityTypeError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
  var InvalidAbiParameterError, InvalidAbiParametersError, InvalidParameterError, SolidityProtectedKeywordError, InvalidModifierError, InvalidFunctionModifierError, InvalidAbiTypeParameterError;
  var init_abiParameter = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js"() {
      init_errors();
      InvalidAbiParameterError = class extends BaseError {
        constructor({ param }) {
          super("Failed to parse ABI parameter.", {
            details: `parseAbiParameter(${JSON.stringify(param, null, 2)})`,
            docsPath: "/api/human#parseabiparameter-1"
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidAbiParameterError"
          });
        }
      };
      InvalidAbiParametersError = class extends BaseError {
        constructor({ params }) {
          super("Failed to parse ABI parameters.", {
            details: `parseAbiParameters(${JSON.stringify(params, null, 2)})`,
            docsPath: "/api/human#parseabiparameters-1"
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidAbiParametersError"
          });
        }
      };
      InvalidParameterError = class extends BaseError {
        constructor({ param }) {
          super("Invalid ABI parameter.", {
            details: param
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidParameterError"
          });
        }
      };
      SolidityProtectedKeywordError = class extends BaseError {
        constructor({ param, name }) {
          super("Invalid ABI parameter.", {
            details: param,
            metaMessages: [
              `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "SolidityProtectedKeywordError"
          });
        }
      };
      InvalidModifierError = class extends BaseError {
        constructor({ param, type, modifier }) {
          super("Invalid ABI parameter.", {
            details: param,
            metaMessages: [
              `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidModifierError"
          });
        }
      };
      InvalidFunctionModifierError = class extends BaseError {
        constructor({ param, type, modifier }) {
          super("Invalid ABI parameter.", {
            details: param,
            metaMessages: [
              `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
              `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidFunctionModifierError"
          });
        }
      };
      InvalidAbiTypeParameterError = class extends BaseError {
        constructor({ abiParameter }) {
          super("Invalid ABI parameter.", {
            details: JSON.stringify(abiParameter, null, 2),
            metaMessages: ["ABI parameter type is invalid."]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidAbiTypeParameterError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/signature.js
  var InvalidSignatureError, UnknownSignatureError, InvalidStructSignatureError;
  var init_signature = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/signature.js"() {
      init_errors();
      InvalidSignatureError = class extends BaseError {
        constructor({ signature, type }) {
          super(`Invalid ${type} signature.`, {
            details: signature
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidSignatureError"
          });
        }
      };
      UnknownSignatureError = class extends BaseError {
        constructor({ signature }) {
          super("Unknown signature.", {
            details: signature
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "UnknownSignatureError"
          });
        }
      };
      InvalidStructSignatureError = class extends BaseError {
        constructor({ signature }) {
          super("Invalid struct signature.", {
            details: signature,
            metaMessages: ["No properties exist."]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidStructSignatureError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/struct.js
  var CircularReferenceError;
  var init_struct = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/struct.js"() {
      init_errors();
      CircularReferenceError = class extends BaseError {
        constructor({ type }) {
          super("Circular reference detected.", {
            metaMessages: [`Struct "${type}" is a circular reference.`]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "CircularReferenceError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
  var InvalidParenthesisError;
  var init_splitParameters = __esm({
    "node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js"() {
      init_errors();
      InvalidParenthesisError = class extends BaseError {
        constructor({ current, depth }) {
          super("Unbalanced parentheses.", {
            metaMessages: [
              `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
            ],
            details: `Depth "${depth}"`
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidParenthesisError"
          });
        }
      };
    }
  });

  // node_modules/abitype/dist/esm/human-readable/runtime/cache.js
  function getParameterCacheKey(param, type, structs) {
    let structKey = "";
    if (structs)
      for (const struct of Object.entries(structs)) {
        if (!struct)
          continue;
        let propertyKey = "";
        for (const property of struct[1]) {
          propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
        }
        structKey += `(${struct[0]}{${propertyKey}})`;
      }
    if (type)
      return `${type}:${param}${structKey}`;
    return `${param}${structKey}`;
  }
  var parameterCache;
  var init_cache = __esm({
    "node_modules/abitype/dist/esm/human-readable/runtime/cache.js"() {
      parameterCache = /* @__PURE__ */ new Map([
        // Unnamed
        ["address", { type: "address" }],
        ["bool", { type: "bool" }],
        ["bytes", { type: "bytes" }],
        ["bytes32", { type: "bytes32" }],
        ["int", { type: "int256" }],
        ["int256", { type: "int256" }],
        ["string", { type: "string" }],
        ["uint", { type: "uint256" }],
        ["uint8", { type: "uint8" }],
        ["uint16", { type: "uint16" }],
        ["uint24", { type: "uint24" }],
        ["uint32", { type: "uint32" }],
        ["uint64", { type: "uint64" }],
        ["uint96", { type: "uint96" }],
        ["uint112", { type: "uint112" }],
        ["uint160", { type: "uint160" }],
        ["uint192", { type: "uint192" }],
        ["uint256", { type: "uint256" }],
        // Named
        ["address owner", { type: "address", name: "owner" }],
        ["address to", { type: "address", name: "to" }],
        ["bool approved", { type: "bool", name: "approved" }],
        ["bytes _data", { type: "bytes", name: "_data" }],
        ["bytes data", { type: "bytes", name: "data" }],
        ["bytes signature", { type: "bytes", name: "signature" }],
        ["bytes32 hash", { type: "bytes32", name: "hash" }],
        ["bytes32 r", { type: "bytes32", name: "r" }],
        ["bytes32 root", { type: "bytes32", name: "root" }],
        ["bytes32 s", { type: "bytes32", name: "s" }],
        ["string name", { type: "string", name: "name" }],
        ["string symbol", { type: "string", name: "symbol" }],
        ["string tokenURI", { type: "string", name: "tokenURI" }],
        ["uint tokenId", { type: "uint256", name: "tokenId" }],
        ["uint8 v", { type: "uint8", name: "v" }],
        ["uint256 balance", { type: "uint256", name: "balance" }],
        ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
        ["uint256 value", { type: "uint256", name: "value" }],
        // Indexed
        [
          "event:address indexed from",
          { type: "address", name: "from", indexed: true }
        ],
        ["event:address indexed to", { type: "address", name: "to", indexed: true }],
        [
          "event:uint indexed tokenId",
          { type: "uint256", name: "tokenId", indexed: true }
        ],
        [
          "event:uint256 indexed tokenId",
          { type: "uint256", name: "tokenId", indexed: true }
        ]
      ]);
    }
  });

  // node_modules/abitype/dist/esm/human-readable/runtime/utils.js
  function parseSignature(signature, structs = {}) {
    if (isFunctionSignature(signature))
      return parseFunctionSignature(signature, structs);
    if (isEventSignature(signature))
      return parseEventSignature(signature, structs);
    if (isErrorSignature(signature))
      return parseErrorSignature(signature, structs);
    if (isConstructorSignature(signature))
      return parseConstructorSignature(signature, structs);
    if (isFallbackSignature(signature))
      return parseFallbackSignature(signature);
    if (isReceiveSignature(signature))
      return {
        type: "receive",
        stateMutability: "payable"
      };
    throw new UnknownSignatureError({ signature });
  }
  function parseFunctionSignature(signature, structs = {}) {
    const match = execFunctionSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "function" });
    const inputParams = splitParameters(match.parameters);
    const inputs = [];
    const inputLength = inputParams.length;
    for (let i = 0; i < inputLength; i++) {
      inputs.push(parseAbiParameter(inputParams[i], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
    const outputs = [];
    if (match.returns) {
      const outputParams = splitParameters(match.returns);
      const outputLength = outputParams.length;
      for (let i = 0; i < outputLength; i++) {
        outputs.push(parseAbiParameter(outputParams[i], {
          modifiers: functionModifiers,
          structs,
          type: "function"
        }));
      }
    }
    return {
      name: match.name,
      type: "function",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs,
      outputs
    };
  }
  function parseEventSignature(signature, structs = {}) {
    const match = execEventSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "event" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++)
      abiParameters.push(parseAbiParameter(params[i], {
        modifiers: eventModifiers,
        structs,
        type: "event"
      }));
    return { name: match.name, type: "event", inputs: abiParameters };
  }
  function parseErrorSignature(signature, structs = {}) {
    const match = execErrorSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "error" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++)
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
    return { name: match.name, type: "error", inputs: abiParameters };
  }
  function parseConstructorSignature(signature, structs = {}) {
    const match = execConstructorSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "constructor" });
    const params = splitParameters(match.parameters);
    const abiParameters = [];
    const length = params.length;
    for (let i = 0; i < length; i++)
      abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
    return {
      type: "constructor",
      stateMutability: match.stateMutability ?? "nonpayable",
      inputs: abiParameters
    };
  }
  function parseFallbackSignature(signature) {
    const match = execFallbackSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "fallback" });
    return {
      type: "fallback",
      stateMutability: match.stateMutability ?? "nonpayable"
    };
  }
  function parseAbiParameter(param, options) {
    const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
    if (parameterCache.has(parameterCacheKey))
      return parameterCache.get(parameterCacheKey);
    const isTuple = isTupleRegex.test(param);
    const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
    if (!match)
      throw new InvalidParameterError({ param });
    if (match.name && isSolidityKeyword(match.name))
      throw new SolidityProtectedKeywordError({ param, name: match.name });
    const name = match.name ? { name: match.name } : {};
    const indexed = match.modifier === "indexed" ? { indexed: true } : {};
    const structs = options?.structs ?? {};
    let type;
    let components = {};
    if (isTuple) {
      type = "tuple";
      const params = splitParameters(match.type);
      const components_ = [];
      const length = params.length;
      for (let i = 0; i < length; i++) {
        components_.push(parseAbiParameter(params[i], { structs }));
      }
      components = { components: components_ };
    } else if (match.type in structs) {
      type = "tuple";
      components = { components: structs[match.type] };
    } else if (dynamicIntegerRegex.test(match.type)) {
      type = `${match.type}256`;
    } else if (match.type === "address payable") {
      type = "address";
    } else {
      type = match.type;
      if (!(options?.type === "struct") && !isSolidityType(type))
        throw new UnknownSolidityTypeError({ type });
    }
    if (match.modifier) {
      if (!options?.modifiers?.has?.(match.modifier))
        throw new InvalidModifierError({
          param,
          type: options?.type,
          modifier: match.modifier
        });
      if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
        throw new InvalidFunctionModifierError({
          param,
          type: options?.type,
          modifier: match.modifier
        });
    }
    const abiParameter = {
      type: `${type}${match.array ?? ""}`,
      ...name,
      ...indexed,
      ...components
    };
    parameterCache.set(parameterCacheKey, abiParameter);
    return abiParameter;
  }
  function splitParameters(params, result = [], current = "", depth = 0) {
    const length = params.trim().length;
    for (let i = 0; i < length; i++) {
      const char = params[i];
      const tail = params.slice(i + 1);
      switch (char) {
        case ",":
          return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
        case "(":
          return splitParameters(tail, result, `${current}${char}`, depth + 1);
        case ")":
          return splitParameters(tail, result, `${current}${char}`, depth - 1);
        default:
          return splitParameters(tail, result, `${current}${char}`, depth);
      }
    }
    if (current === "")
      return result;
    if (depth !== 0)
      throw new InvalidParenthesisError({ current, depth });
    result.push(current.trim());
    return result;
  }
  function isSolidityType(type) {
    return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
  }
  function isSolidityKeyword(name) {
    return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
  }
  function isValidDataLocation(type, isArray) {
    return isArray || type === "bytes" || type === "string" || type === "tuple";
  }
  var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
  var init_utils = __esm({
    "node_modules/abitype/dist/esm/human-readable/runtime/utils.js"() {
      init_regex();
      init_abiItem();
      init_abiParameter();
      init_signature();
      init_splitParameters();
      init_cache();
      init_signatures();
      abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
      abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
      dynamicIntegerRegex = /^u?int$/;
      protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
    }
  });

  // node_modules/abitype/dist/esm/human-readable/runtime/structs.js
  function parseStructs(signatures) {
    const shallowStructs = {};
    const signaturesLength = signatures.length;
    for (let i = 0; i < signaturesLength; i++) {
      const signature = signatures[i];
      if (!isStructSignature(signature))
        continue;
      const match = execStructSignature(signature);
      if (!match)
        throw new InvalidSignatureError({ signature, type: "struct" });
      const properties = match.properties.split(";");
      const components = [];
      const propertiesLength = properties.length;
      for (let k = 0; k < propertiesLength; k++) {
        const property = properties[k];
        const trimmed = property.trim();
        if (!trimmed)
          continue;
        const abiParameter = parseAbiParameter(trimmed, {
          type: "struct"
        });
        components.push(abiParameter);
      }
      if (!components.length)
        throw new InvalidStructSignatureError({ signature });
      shallowStructs[match.name] = components;
    }
    const resolvedStructs = {};
    const entries = Object.entries(shallowStructs);
    const entriesLength = entries.length;
    for (let i = 0; i < entriesLength; i++) {
      const [name, parameters] = entries[i];
      resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
    }
    return resolvedStructs;
  }
  function resolveStructs(abiParameters = [], structs = {}, ancestors = /* @__PURE__ */ new Set()) {
    const components = [];
    const length = abiParameters.length;
    for (let i = 0; i < length; i++) {
      const abiParameter = abiParameters[i];
      const isTuple = isTupleRegex.test(abiParameter.type);
      if (isTuple)
        components.push(abiParameter);
      else {
        const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
        if (!match?.type)
          throw new InvalidAbiTypeParameterError({ abiParameter });
        const { array, type } = match;
        if (type in structs) {
          if (ancestors.has(type))
            throw new CircularReferenceError({ type });
          components.push({
            ...abiParameter,
            type: `tuple${array ?? ""}`,
            components: resolveStructs(structs[type], structs, /* @__PURE__ */ new Set([...ancestors, type]))
          });
        } else {
          if (isSolidityType(type))
            components.push(abiParameter);
          else
            throw new UnknownTypeError({ type });
        }
      }
    }
    return components;
  }
  var typeWithoutTupleRegex;
  var init_structs = __esm({
    "node_modules/abitype/dist/esm/human-readable/runtime/structs.js"() {
      init_regex();
      init_abiItem();
      init_abiParameter();
      init_signature();
      init_struct();
      init_signatures();
      init_utils();
      typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
    }
  });

  // node_modules/abitype/dist/esm/human-readable/parseAbi.js
  function parseAbi(signatures) {
    const structs = parseStructs(signatures);
    const abi2 = [];
    const length = signatures.length;
    for (let i = 0; i < length; i++) {
      const signature = signatures[i];
      if (isStructSignature(signature))
        continue;
      abi2.push(parseSignature(signature, structs));
    }
    return abi2;
  }
  var init_parseAbi = __esm({
    "node_modules/abitype/dist/esm/human-readable/parseAbi.js"() {
      init_signatures();
      init_structs();
      init_utils();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/parseAbiItem.js
  function parseAbiItem(signature) {
    let abiItem;
    if (typeof signature === "string")
      abiItem = parseSignature(signature);
    else {
      const structs = parseStructs(signature);
      const length = signature.length;
      for (let i = 0; i < length; i++) {
        const signature_ = signature[i];
        if (isStructSignature(signature_))
          continue;
        abiItem = parseSignature(signature_, structs);
        break;
      }
    }
    if (!abiItem)
      throw new InvalidAbiItemError({ signature });
    return abiItem;
  }
  var init_parseAbiItem = __esm({
    "node_modules/abitype/dist/esm/human-readable/parseAbiItem.js"() {
      init_abiItem();
      init_signatures();
      init_structs();
      init_utils();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/parseAbiParameter.js
  function parseAbiParameter2(param) {
    let abiParameter;
    if (typeof param === "string")
      abiParameter = parseAbiParameter(param, {
        modifiers
      });
    else {
      const structs = parseStructs(param);
      const length = param.length;
      for (let i = 0; i < length; i++) {
        const signature = param[i];
        if (isStructSignature(signature))
          continue;
        abiParameter = parseAbiParameter(signature, { modifiers, structs });
        break;
      }
    }
    if (!abiParameter)
      throw new InvalidAbiParameterError({ param });
    return abiParameter;
  }
  var init_parseAbiParameter = __esm({
    "node_modules/abitype/dist/esm/human-readable/parseAbiParameter.js"() {
      init_abiParameter();
      init_signatures();
      init_structs();
      init_utils();
    }
  });

  // node_modules/abitype/dist/esm/human-readable/parseAbiParameters.js
  function parseAbiParameters(params) {
    const abiParameters = [];
    if (typeof params === "string") {
      const parameters = splitParameters(params);
      const length = parameters.length;
      for (let i = 0; i < length; i++) {
        abiParameters.push(parseAbiParameter(parameters[i], { modifiers }));
      }
    } else {
      const structs = parseStructs(params);
      const length = params.length;
      for (let i = 0; i < length; i++) {
        const signature = params[i];
        if (isStructSignature(signature))
          continue;
        const parameters = splitParameters(signature);
        const length2 = parameters.length;
        for (let k = 0; k < length2; k++) {
          abiParameters.push(parseAbiParameter(parameters[k], { modifiers, structs }));
        }
      }
    }
    if (abiParameters.length === 0)
      throw new InvalidAbiParametersError({ params });
    return abiParameters;
  }
  var init_parseAbiParameters = __esm({
    "node_modules/abitype/dist/esm/human-readable/parseAbiParameters.js"() {
      init_abiParameter();
      init_signatures();
      init_structs();
      init_utils();
      init_utils();
    }
  });

  // node_modules/abitype/dist/esm/exports/index.js
  var init_exports = __esm({
    "node_modules/abitype/dist/esm/exports/index.js"() {
      init_formatAbiItem();
      init_formatAbiParameters();
      init_parseAbi();
      init_parseAbiItem();
      init_parseAbiParameter();
      init_parseAbiParameters();
      init_abiItem();
      init_abiParameter();
      init_signature();
      init_splitParameters();
      init_struct();
    }
  });

  // node_modules/viem/utils/abi/formatAbiItem.ts
  function formatAbiItem2(abiItem, { includeName = false } = {}) {
    if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
      throw new InvalidDefinitionTypeError(abiItem.type);
    return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
  }
  function formatAbiParams(params, { includeName = false } = {}) {
    if (!params) return "";
    return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
  }
  function formatAbiParam(param, { includeName }) {
    if (param.type.startsWith("tuple")) {
      return `(${formatAbiParams(
        param.components,
        { includeName }
      )})${param.type.slice("tuple".length)}`;
    }
    return param.type + (includeName && param.name ? ` ${param.name}` : "");
  }
  var init_formatAbiItem2 = __esm({
    "node_modules/viem/utils/abi/formatAbiItem.ts"() {
      init_abi();
    }
  });

  // node_modules/viem/utils/data/isHex.ts
  function isHex(value, { strict = true } = {}) {
    if (!value) return false;
    if (typeof value !== "string") return false;
    return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
  }
  var init_isHex = __esm({
    "node_modules/viem/utils/data/isHex.ts"() {
    }
  });

  // node_modules/viem/utils/data/size.ts
  function size(value) {
    if (isHex(value, { strict: false })) return Math.ceil((value.length - 2) / 2);
    return value.length;
  }
  var init_size = __esm({
    "node_modules/viem/utils/data/size.ts"() {
      init_isHex();
    }
  });

  // node_modules/viem/errors/version.ts
  var version2;
  var init_version2 = __esm({
    "node_modules/viem/errors/version.ts"() {
      version2 = "2.54.6";
    }
  });

  // node_modules/viem/errors/base.ts
  function setErrorConfig(config) {
    errorConfig = config;
  }
  function walk(err, fn) {
    if (fn?.(err)) return err;
    if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
      return walk(err.cause, fn);
    return fn ? null : err;
  }
  var errorConfig, BaseError2;
  var init_base = __esm({
    "node_modules/viem/errors/base.ts"() {
      init_version2();
      errorConfig = {
        getDocsUrl: ({
          docsBaseUrl,
          docsPath: docsPath9 = "",
          docsSlug
        }) => docsPath9 ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath9}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
        version: `viem@${version2}`
      };
      BaseError2 = class _BaseError extends Error {
        details;
        docsPath;
        metaMessages;
        shortMessage;
        version;
        name = "BaseError";
        constructor(shortMessage, args = {}) {
          const details = (() => {
            if (args.cause instanceof _BaseError) return args.cause.details;
            if (args.cause?.message) return args.cause.message;
            return args.details;
          })();
          const docsPath9 = (() => {
            if (args.cause instanceof _BaseError)
              return args.cause.docsPath || args.docsPath;
            return args.docsPath;
          })();
          const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath: docsPath9 });
          const message = [
            shortMessage || "An error occurred.",
            "",
            ...args.metaMessages ? [...args.metaMessages, ""] : [],
            ...docsUrl ? [`Docs: ${docsUrl}`] : [],
            ...details ? [`Details: ${details}`] : [],
            ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
          ].join("\n");
          super(message, args.cause ? { cause: args.cause } : void 0);
          this.details = details;
          this.docsPath = docsPath9;
          this.metaMessages = args.metaMessages;
          this.name = args.name ?? this.name;
          this.shortMessage = shortMessage;
          this.version = version2;
        }
        walk(fn) {
          return walk(this, fn);
        }
      };
    }
  });

  // node_modules/viem/errors/abi.ts
  var AbiConstructorNotFoundError, AbiConstructorParamsNotFoundError, AbiDecodingDataSizeInvalidError, AbiDecodingDataSizeTooSmallError, AbiDecodingZeroDataError, AbiEncodingArrayLengthMismatchError, AbiEncodingBytesSizeMismatchError, AbiEncodingLengthMismatchError, AbiErrorInputsNotFoundError, AbiErrorNotFoundError, AbiErrorSignatureNotFoundError, AbiEventSignatureEmptyTopicsError, AbiEventSignatureNotFoundError, AbiEventNotFoundError, AbiFunctionNotFoundError, AbiFunctionOutputsNotFoundError, AbiFunctionSignatureNotFoundError, AbiItemAmbiguityError, BytesSizeMismatchError, DecodeLogDataMismatch, DecodeLogTopicsMismatch, InvalidAbiEncodingTypeError, InvalidAbiDecodingTypeError, InvalidArrayError, InvalidDefinitionTypeError, UnsupportedPackedAbiType;
  var init_abi = __esm({
    "node_modules/viem/errors/abi.ts"() {
      init_formatAbiItem2();
      init_size();
      init_base();
      AbiConstructorNotFoundError = class extends BaseError2 {
        constructor({ docsPath: docsPath9 }) {
          super(
            [
              "A constructor was not found on the ABI.",
              "Make sure you are using the correct ABI and that the constructor exists on it."
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiConstructorNotFoundError"
            }
          );
        }
      };
      AbiConstructorParamsNotFoundError = class extends BaseError2 {
        constructor({ docsPath: docsPath9 }) {
          super(
            [
              "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
              "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiConstructorParamsNotFoundError"
            }
          );
        }
      };
      AbiDecodingDataSizeInvalidError = class extends BaseError2 {
        constructor({ data, size: size5 }) {
          super(
            [
              `Data size of ${size5} bytes is invalid.`,
              "Size must be in increments of 32 bytes (size % 32 === 0)."
            ].join("\n"),
            {
              metaMessages: [`Data: ${data} (${size5} bytes)`],
              name: "AbiDecodingDataSizeInvalidError"
            }
          );
        }
      };
      AbiDecodingDataSizeTooSmallError = class extends BaseError2 {
        data;
        params;
        size;
        constructor({
          data,
          params,
          size: size5
        }) {
          super(
            [`Data size of ${size5} bytes is too small for given parameters.`].join(
              "\n"
            ),
            {
              metaMessages: [
                `Params: (${formatAbiParams(params, { includeName: true })})`,
                `Data:   ${data} (${size5} bytes)`
              ],
              name: "AbiDecodingDataSizeTooSmallError"
            }
          );
          this.data = data;
          this.params = params;
          this.size = size5;
        }
      };
      AbiDecodingZeroDataError = class extends BaseError2 {
        constructor({ cause } = {}) {
          super('Cannot decode zero data ("0x") with ABI parameters.', {
            name: "AbiDecodingZeroDataError",
            cause
          });
        }
      };
      AbiEncodingArrayLengthMismatchError = class extends BaseError2 {
        constructor({
          expectedLength,
          givenLength,
          type
        }) {
          super(
            [
              `ABI encoding array length mismatch for type ${type}.`,
              `Expected length: ${expectedLength}`,
              `Given length: ${givenLength}`
            ].join("\n"),
            { name: "AbiEncodingArrayLengthMismatchError" }
          );
        }
      };
      AbiEncodingBytesSizeMismatchError = class extends BaseError2 {
        constructor({ expectedSize, value }) {
          super(
            `Size of bytes "${value}" (bytes${size(
              value
            )}) does not match expected size (bytes${expectedSize}).`,
            { name: "AbiEncodingBytesSizeMismatchError" }
          );
        }
      };
      AbiEncodingLengthMismatchError = class extends BaseError2 {
        constructor({
          expectedLength,
          givenLength
        }) {
          super(
            [
              "ABI encoding params/values length mismatch.",
              `Expected length (params): ${expectedLength}`,
              `Given length (values): ${givenLength}`
            ].join("\n"),
            { name: "AbiEncodingLengthMismatchError" }
          );
        }
      };
      AbiErrorInputsNotFoundError = class extends BaseError2 {
        constructor(errorName, { docsPath: docsPath9 }) {
          super(
            [
              `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
              "Cannot encode error result without knowing what the parameter types are.",
              "Make sure you are using the correct ABI and that the inputs exist on it."
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiErrorInputsNotFoundError"
            }
          );
        }
      };
      AbiErrorNotFoundError = class extends BaseError2 {
        constructor(errorName, { docsPath: docsPath9 } = {}) {
          super(
            [
              `Error ${errorName ? `"${errorName}" ` : ""}not found on ABI.`,
              "Make sure you are using the correct ABI and that the error exists on it."
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiErrorNotFoundError"
            }
          );
        }
      };
      AbiErrorSignatureNotFoundError = class extends BaseError2 {
        signature;
        constructor(signature, {
          docsPath: docsPath9,
          cause
        }) {
          super(
            [
              `Encoded error signature "${signature}" not found on ABI.`,
              "Make sure you are using the correct ABI and that the error exists on it.",
              `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${signature}.`
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiErrorSignatureNotFoundError",
              cause
            }
          );
          this.signature = signature;
        }
      };
      AbiEventSignatureEmptyTopicsError = class extends BaseError2 {
        constructor({ docsPath: docsPath9 }) {
          super("Cannot extract event signature from empty topics.", {
            docsPath: docsPath9,
            name: "AbiEventSignatureEmptyTopicsError"
          });
        }
      };
      AbiEventSignatureNotFoundError = class extends BaseError2 {
        constructor(signature, { docsPath: docsPath9 }) {
          super(
            [
              `Encoded event signature "${signature}" not found on ABI.`,
              "Make sure you are using the correct ABI and that the event exists on it.",
              `You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiEventSignatureNotFoundError"
            }
          );
        }
      };
      AbiEventNotFoundError = class extends BaseError2 {
        constructor(eventName, { docsPath: docsPath9 } = {}) {
          super(
            [
              `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
              "Make sure you are using the correct ABI and that the event exists on it."
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiEventNotFoundError"
            }
          );
        }
      };
      AbiFunctionNotFoundError = class extends BaseError2 {
        constructor(functionName, { docsPath: docsPath9 } = {}) {
          super(
            [
              `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
              "Make sure you are using the correct ABI and that the function exists on it."
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiFunctionNotFoundError"
            }
          );
        }
      };
      AbiFunctionOutputsNotFoundError = class extends BaseError2 {
        constructor(functionName, { docsPath: docsPath9 }) {
          super(
            [
              `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
              "Cannot decode function result without knowing what the parameter types are.",
              "Make sure you are using the correct ABI and that the function exists on it."
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiFunctionOutputsNotFoundError"
            }
          );
        }
      };
      AbiFunctionSignatureNotFoundError = class extends BaseError2 {
        constructor(signature, { docsPath: docsPath9 }) {
          super(
            [
              `Encoded function signature "${signature}" not found on ABI.`,
              "Make sure you are using the correct ABI and that the function exists on it.",
              `You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`
            ].join("\n"),
            {
              docsPath: docsPath9,
              name: "AbiFunctionSignatureNotFoundError"
            }
          );
        }
      };
      AbiItemAmbiguityError = class extends BaseError2 {
        constructor(x, y) {
          super("Found ambiguous types in overloaded ABI items.", {
            metaMessages: [
              `\`${x.type}\` in \`${formatAbiItem2(x.abiItem)}\`, and`,
              `\`${y.type}\` in \`${formatAbiItem2(y.abiItem)}\``,
              "",
              "These types encode differently and cannot be distinguished at runtime.",
              "Remove one of the ambiguous items in the ABI."
            ],
            name: "AbiItemAmbiguityError"
          });
        }
      };
      BytesSizeMismatchError = class extends BaseError2 {
        constructor({
          expectedSize,
          givenSize
        }) {
          super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
            name: "BytesSizeMismatchError"
          });
        }
      };
      DecodeLogDataMismatch = class extends BaseError2 {
        abiItem;
        data;
        params;
        size;
        constructor({
          abiItem,
          data,
          params,
          size: size5
        }) {
          super(
            [
              `Data size of ${size5} bytes is too small for non-indexed event parameters.`
            ].join("\n"),
            {
              metaMessages: [
                `Params: (${formatAbiParams(params, { includeName: true })})`,
                `Data:   ${data} (${size5} bytes)`
              ],
              name: "DecodeLogDataMismatch"
            }
          );
          this.abiItem = abiItem;
          this.data = data;
          this.params = params;
          this.size = size5;
        }
      };
      DecodeLogTopicsMismatch = class extends BaseError2 {
        abiItem;
        constructor({
          abiItem,
          param
        }) {
          super(
            [
              `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem2(abiItem, { includeName: true })}".`
            ].join("\n"),
            { name: "DecodeLogTopicsMismatch" }
          );
          this.abiItem = abiItem;
        }
      };
      InvalidAbiEncodingTypeError = class extends BaseError2 {
        constructor(type, { docsPath: docsPath9 }) {
          super(
            [
              `Type "${type}" is not a valid encoding type.`,
              "Please provide a valid ABI type."
            ].join("\n"),
            { docsPath: docsPath9, name: "InvalidAbiEncodingType" }
          );
        }
      };
      InvalidAbiDecodingTypeError = class extends BaseError2 {
        constructor(type, { docsPath: docsPath9 }) {
          super(
            [
              `Type "${type}" is not a valid decoding type.`,
              "Please provide a valid ABI type."
            ].join("\n"),
            { docsPath: docsPath9, name: "InvalidAbiDecodingType" }
          );
        }
      };
      InvalidArrayError = class extends BaseError2 {
        constructor(value) {
          super([`Value "${value}" is not a valid array.`].join("\n"), {
            name: "InvalidArrayError"
          });
        }
      };
      InvalidDefinitionTypeError = class extends BaseError2 {
        constructor(type) {
          super(
            [
              `"${type}" is not a valid definition type.`,
              'Valid types: "function", "event", "error"'
            ].join("\n"),
            { name: "InvalidDefinitionTypeError" }
          );
        }
      };
      UnsupportedPackedAbiType = class extends BaseError2 {
        constructor(type) {
          super(`Type "${type}" is not supported for packed encoding.`, {
            name: "UnsupportedPackedAbiType"
          });
        }
      };
    }
  });

  // node_modules/viem/errors/data.ts
  var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError, InvalidBytesLengthError;
  var init_data = __esm({
    "node_modules/viem/errors/data.ts"() {
      init_base();
      SliceOffsetOutOfBoundsError = class extends BaseError2 {
        constructor({
          offset,
          position,
          size: size5
        }) {
          super(
            `Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size5}).`,
            { name: "SliceOffsetOutOfBoundsError" }
          );
        }
      };
      SizeExceedsPaddingSizeError = class extends BaseError2 {
        constructor({
          size: size5,
          targetSize,
          type
        }) {
          super(
            `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size5}) exceeds padding size (${targetSize}).`,
            { name: "SizeExceedsPaddingSizeError" }
          );
        }
      };
      InvalidBytesLengthError = class extends BaseError2 {
        constructor({
          size: size5,
          targetSize,
          type
        }) {
          super(
            `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size5} ${type} long.`,
            { name: "InvalidBytesLengthError" }
          );
        }
      };
    }
  });

  // node_modules/viem/utils/data/pad.ts
  function pad(hexOrBytes, { dir, size: size5 = 32 } = {}) {
    if (typeof hexOrBytes === "string")
      return padHex(hexOrBytes, { dir, size: size5 });
    return padBytes(hexOrBytes, { dir, size: size5 });
  }
  function padHex(hex_, { dir, size: size5 = 32 } = {}) {
    if (size5 === null) return hex_;
    const hex = hex_.replace("0x", "");
    if (hex.length > size5 * 2)
      throw new SizeExceedsPaddingSizeError({
        size: Math.ceil(hex.length / 2),
        targetSize: size5,
        type: "hex"
      });
    return `0x${hex[dir === "right" ? "padEnd" : "padStart"](
      size5 * 2,
      "0"
    )}`;
  }
  function padBytes(bytes, { dir, size: size5 = 32 } = {}) {
    if (size5 === null) return bytes;
    if (bytes.length > size5)
      throw new SizeExceedsPaddingSizeError({
        size: bytes.length,
        targetSize: size5,
        type: "bytes"
      });
    const paddedBytes = new Uint8Array(size5);
    for (let i = 0; i < size5; i++) {
      const padEnd = dir === "right";
      paddedBytes[padEnd ? i : size5 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
  }
  var init_pad = __esm({
    "node_modules/viem/utils/data/pad.ts"() {
      init_data();
    }
  });

  // node_modules/viem/errors/encoding.ts
  var IntegerOutOfRangeError, InvalidBytesBooleanError, InvalidHexBooleanError, InvalidHexValueError, RlpDepthLimitExceededError, RlpListBoundaryExceededError, RlpTrailingBytesError, SizeOverflowError;
  var init_encoding = __esm({
    "node_modules/viem/errors/encoding.ts"() {
      init_base();
      IntegerOutOfRangeError = class extends BaseError2 {
        constructor({
          max,
          min,
          signed,
          size: size5,
          value
        }) {
          super(
            `Number "${value}" is not in safe ${size5 ? `${size5 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`,
            { name: "IntegerOutOfRangeError" }
          );
        }
      };
      InvalidBytesBooleanError = class extends BaseError2 {
        constructor(bytes) {
          super(
            `Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`,
            {
              name: "InvalidBytesBooleanError"
            }
          );
        }
      };
      InvalidHexBooleanError = class extends BaseError2 {
        constructor(hex) {
          super(
            `Hex value "${hex}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`,
            { name: "InvalidHexBooleanError" }
          );
        }
      };
      InvalidHexValueError = class extends BaseError2 {
        constructor(value) {
          super(
            `Hex value "${value}" is an odd length (${value.length}). It must be an even length.`,
            { name: "InvalidHexValueError" }
          );
        }
      };
      RlpDepthLimitExceededError = class extends BaseError2 {
        constructor({ limit }) {
          super(`RLP depth limit of \`${limit}\` exceeded.`, {
            name: "RlpDepthLimitExceededError"
          });
        }
      };
      RlpListBoundaryExceededError = class extends BaseError2 {
        constructor({ consumed, declared }) {
          super(
            `RLP list items consumed \`${consumed}\` bytes but the list declared a length of \`${declared}\`.`,
            { name: "RlpListBoundaryExceededError" }
          );
        }
      };
      RlpTrailingBytesError = class extends BaseError2 {
        constructor({ count }) {
          super(
            `RLP payload encodes a single item, but \`${count}\` trailing ${count === 1 ? "byte remains" : "bytes remain"}.`,
            { name: "RlpTrailingBytesError" }
          );
        }
      };
      SizeOverflowError = class extends BaseError2 {
        constructor({ givenSize, maxSize }) {
          super(
            `Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`,
            { name: "SizeOverflowError" }
          );
        }
      };
    }
  });

  // node_modules/viem/utils/data/trim.ts
  function trim(hexOrBytes, { dir = "left" } = {}) {
    let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
    let sliceLength = 0;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
        sliceLength++;
      else break;
    }
    data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
    if (typeof hexOrBytes === "string") {
      if (data.length === 1 && dir === "right") data = `${data}0`;
      return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
    }
    return data;
  }
  var init_trim = __esm({
    "node_modules/viem/utils/data/trim.ts"() {
    }
  });

  // node_modules/viem/utils/encoding/fromHex.ts
  function assertSize(hexOrBytes, { size: size5 }) {
    if (size(hexOrBytes) > size5)
      throw new SizeOverflowError({
        givenSize: size(hexOrBytes),
        maxSize: size5
      });
  }
  function fromHex(hex, toOrOpts) {
    const opts = typeof toOrOpts === "string" ? { to: toOrOpts } : toOrOpts;
    const to = opts.to;
    if (to === "number") return hexToNumber(hex, opts);
    if (to === "bigint") return hexToBigInt(hex, opts);
    if (to === "string") return hexToString(hex, opts);
    if (to === "boolean") return hexToBool(hex, opts);
    return hexToBytes(hex, opts);
  }
  function hexToBigInt(hex, opts = {}) {
    const { signed } = opts;
    if (opts.size) assertSize(hex, { size: opts.size });
    const value = BigInt(hex);
    if (!signed) return value;
    const size5 = (hex.length - 2) / 2;
    const max = (1n << BigInt(size5) * 8n - 1n) - 1n;
    if (value <= max) return value;
    return value - BigInt(`0x${"f".padStart(size5 * 2, "f")}`) - 1n;
  }
  function hexToBool(hex_, opts = {}) {
    let hex = hex_;
    if (opts.size) {
      assertSize(hex, { size: opts.size });
      hex = trim(hex);
    }
    if (trim(hex) === "0x00") return false;
    if (trim(hex) === "0x01") return true;
    throw new InvalidHexBooleanError(hex);
  }
  function hexToNumber(hex, opts = {}) {
    const value = hexToBigInt(hex, opts);
    const number = Number(value);
    if (!Number.isSafeInteger(number))
      throw new IntegerOutOfRangeError({
        max: `${Number.MAX_SAFE_INTEGER}`,
        min: `${Number.MIN_SAFE_INTEGER}`,
        signed: opts.signed,
        size: opts.size,
        value: `${value}n`
      });
    return number;
  }
  function hexToString(hex, opts = {}) {
    let bytes = hexToBytes(hex);
    if (opts.size) {
      assertSize(bytes, { size: opts.size });
      bytes = trim(bytes, { dir: "right" });
    }
    return new TextDecoder().decode(bytes);
  }
  var init_fromHex = __esm({
    "node_modules/viem/utils/encoding/fromHex.ts"() {
      init_encoding();
      init_size();
      init_trim();
      init_toBytes();
    }
  });

  // node_modules/viem/utils/encoding/toHex.ts
  function toHex(value, opts = {}) {
    if (typeof value === "number" || typeof value === "bigint")
      return numberToHex(value, opts);
    if (typeof value === "string") {
      return stringToHex(value, opts);
    }
    if (typeof value === "boolean") return boolToHex(value, opts);
    return bytesToHex(value, opts);
  }
  function boolToHex(value, opts = {}) {
    const hex = `0x${Number(value)}`;
    if (typeof opts.size === "number") {
      assertSize(hex, { size: opts.size });
      return pad(hex, { size: opts.size });
    }
    return hex;
  }
  function bytesToHex(value, opts = {}) {
    let string = "";
    for (let i = 0; i < value.length; i++) {
      string += hexes[value[i]];
    }
    const hex = `0x${string}`;
    if (typeof opts.size === "number") {
      assertSize(hex, { size: opts.size });
      return pad(hex, { dir: "right", size: opts.size });
    }
    return hex;
  }
  function numberToHex(value_, opts = {}) {
    const { signed, size: size5 } = opts;
    const value = BigInt(value_);
    let maxValue;
    if (size5) {
      if (signed) maxValue = (1n << BigInt(size5) * 8n - 1n) - 1n;
      else maxValue = 2n ** (BigInt(size5) * 8n) - 1n;
    } else if (typeof value_ === "number") {
      maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    }
    const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
    if (maxValue && value > maxValue || value < minValue) {
      const suffix = typeof value_ === "bigint" ? "n" : "";
      throw new IntegerOutOfRangeError({
        max: maxValue ? `${maxValue}${suffix}` : void 0,
        min: `${minValue}${suffix}`,
        signed,
        size: size5,
        value: `${value_}${suffix}`
      });
    }
    const hex = `0x${(signed && value < 0 ? (1n << BigInt(size5 * 8)) + BigInt(value) : value).toString(16)}`;
    if (size5) return pad(hex, { size: size5 });
    return hex;
  }
  function stringToHex(value_, opts = {}) {
    const value = encoder.encode(value_);
    return bytesToHex(value, opts);
  }
  var hexes, encoder;
  var init_toHex = __esm({
    "node_modules/viem/utils/encoding/toHex.ts"() {
      init_encoding();
      init_pad();
      init_fromHex();
      hexes = /* @__PURE__ */ Array.from(
        { length: 256 },
        (_v, i) => i.toString(16).padStart(2, "0")
      );
      encoder = /* @__PURE__ */ new TextEncoder();
    }
  });

  // node_modules/viem/utils/encoding/toBytes.ts
  function toBytes(value, opts = {}) {
    if (typeof value === "number" || typeof value === "bigint")
      return numberToBytes(value, opts);
    if (typeof value === "boolean") return boolToBytes(value, opts);
    if (isHex(value)) return hexToBytes(value, opts);
    return stringToBytes(value, opts);
  }
  function boolToBytes(value, opts = {}) {
    const bytes = new Uint8Array(1);
    bytes[0] = Number(value);
    if (typeof opts.size === "number") {
      assertSize(bytes, { size: opts.size });
      return pad(bytes, { size: opts.size });
    }
    return bytes;
  }
  function charCodeToBase16(char) {
    if (char >= charCodeMap.zero && char <= charCodeMap.nine)
      return char - charCodeMap.zero;
    if (char >= charCodeMap.A && char <= charCodeMap.F)
      return char - (charCodeMap.A - 10);
    if (char >= charCodeMap.a && char <= charCodeMap.f)
      return char - (charCodeMap.a - 10);
    return void 0;
  }
  function hexToBytes(hex_, opts = {}) {
    let hex = hex_;
    if (opts.size) {
      assertSize(hex, { size: opts.size });
      hex = pad(hex, { dir: "right", size: opts.size });
    }
    let hexString = hex.slice(2);
    if (hexString.length % 2) hexString = `0${hexString}`;
    const length = hexString.length / 2;
    const bytes = new Uint8Array(length);
    for (let index2 = 0, j = 0; index2 < length; index2++) {
      const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
      const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
      if (nibbleLeft === void 0 || nibbleRight === void 0) {
        throw new BaseError2(
          `Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`
        );
      }
      bytes[index2] = nibbleLeft * 16 + nibbleRight;
    }
    return bytes;
  }
  function numberToBytes(value, opts) {
    const hex = numberToHex(value, opts);
    return hexToBytes(hex);
  }
  function stringToBytes(value, opts = {}) {
    const bytes = encoder2.encode(value);
    if (typeof opts.size === "number") {
      assertSize(bytes, { size: opts.size });
      return pad(bytes, { dir: "right", size: opts.size });
    }
    return bytes;
  }
  var encoder2, charCodeMap;
  var init_toBytes = __esm({
    "node_modules/viem/utils/encoding/toBytes.ts"() {
      init_base();
      init_isHex();
      init_pad();
      init_fromHex();
      init_toHex();
      encoder2 = /* @__PURE__ */ new TextEncoder();
      charCodeMap = {
        zero: 48,
        nine: 57,
        A: 65,
        F: 70,
        a: 97,
        f: 102
      };
    }
  });

  // node_modules/@noble/hashes/esm/_u64.js
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  var U32_MASK64, _32n, rotlSH, rotlSL, rotlBH, rotlBL;
  var init_u64 = __esm({
    "node_modules/@noble/hashes/esm/_u64.js"() {
      U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
      _32n = /* @__PURE__ */ BigInt(32);
      rotlSH = (h, l, s) => h << s | l >>> 32 - s;
      rotlSL = (h, l, s) => l << s | h >>> 32 - s;
      rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
      rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    }
  });

  // node_modules/@noble/hashes/esm/crypto.js
  var crypto2;
  var init_crypto = __esm({
    "node_modules/@noble/hashes/esm/crypto.js"() {
      crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    }
  });

  // node_modules/@noble/hashes/esm/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function abytes(b, ...lengths) {
    if (!isBytes(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    anumber(h.outputLen);
    anumber(h.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function rotl(word, shift) {
    return word << shift | word >>> 32 - shift >>> 0;
  }
  function byteSwap(word) {
    return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  }
  function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap(arr[i]);
    }
    return arr;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes2(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    abytes(data);
    return data;
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad4 = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad4);
      pad4 += a.length;
    }
    return res;
  }
  function createHasher(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  function randomBytes(bytesLength = 32) {
    if (crypto2 && typeof crypto2.getRandomValues === "function") {
      return crypto2.getRandomValues(new Uint8Array(bytesLength));
    }
    if (crypto2 && typeof crypto2.randomBytes === "function") {
      return Uint8Array.from(crypto2.randomBytes(bytesLength));
    }
    throw new Error("crypto.getRandomValues must be defined");
  }
  var isLE, swap32IfBE, Hash;
  var init_utils2 = __esm({
    "node_modules/@noble/hashes/esm/utils.js"() {
      init_crypto();
      isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
      swap32IfBE = isLE ? (u) => u : byteSwap32;
      Hash = class {
      };
    }
  });

  // node_modules/@noble/hashes/esm/sha3.js
  function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t = 0; t < 24; t++) {
        const shift = SHA3_ROTL[t];
        const Th = rotlH(curH, curL, shift);
        const Tl = rotlL(curH, curL, shift);
        const PI = SHA3_PI[t];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        for (let x = 0; x < 10; x++)
          B[x] = s[y + x];
        for (let x = 0; x < 10; x++)
          s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
      }
      s[0] ^= SHA3_IOTA_H[round];
      s[1] ^= SHA3_IOTA_L[round];
    }
    clean(B);
  }
  var _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, gen, keccak_256;
  var init_sha3 = __esm({
    "node_modules/@noble/hashes/esm/sha3.js"() {
      init_u64();
      init_utils2();
      _0n = BigInt(0);
      _1n = BigInt(1);
      _2n = BigInt(2);
      _7n = BigInt(7);
      _256n = BigInt(256);
      _0x71n = BigInt(113);
      SHA3_PI = [];
      SHA3_ROTL = [];
      _SHA3_IOTA = [];
      for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
        [x, y] = [y, (2 * x + 3 * y) % 5];
        SHA3_PI.push(2 * (5 * y + x));
        SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
        let t = _0n;
        for (let j = 0; j < 7; j++) {
          R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
          if (R & _2n)
            t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
        }
        _SHA3_IOTA.push(t);
      }
      IOTAS = split(_SHA3_IOTA, true);
      SHA3_IOTA_H = IOTAS[0];
      SHA3_IOTA_L = IOTAS[1];
      rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
      rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
      Keccak = class _Keccak extends Hash {
        // NOTE: we accept arguments in bytes instead of bits here.
        constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
          super();
          this.pos = 0;
          this.posOut = 0;
          this.finished = false;
          this.destroyed = false;
          this.enableXOF = false;
          this.blockLen = blockLen;
          this.suffix = suffix;
          this.outputLen = outputLen;
          this.enableXOF = enableXOF;
          this.rounds = rounds;
          anumber(outputLen);
          if (!(0 < blockLen && blockLen < 200))
            throw new Error("only keccak-f1600 function is supported");
          this.state = new Uint8Array(200);
          this.state32 = u32(this.state);
        }
        clone() {
          return this._cloneInto();
        }
        keccak() {
          swap32IfBE(this.state32);
          keccakP(this.state32, this.rounds);
          swap32IfBE(this.state32);
          this.posOut = 0;
          this.pos = 0;
        }
        update(data) {
          aexists(this);
          data = toBytes2(data);
          abytes(data);
          const { blockLen, state } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
              state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
              this.keccak();
          }
          return this;
        }
        finish() {
          if (this.finished)
            return;
          this.finished = true;
          const { state, suffix, pos, blockLen } = this;
          state[pos] ^= suffix;
          if ((suffix & 128) !== 0 && pos === blockLen - 1)
            this.keccak();
          state[blockLen - 1] ^= 128;
          this.keccak();
        }
        writeInto(out) {
          aexists(this, false);
          abytes(out);
          this.finish();
          const bufferOut = this.state;
          const { blockLen } = this;
          for (let pos = 0, len = out.length; pos < len; ) {
            if (this.posOut >= blockLen)
              this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
          }
          return out;
        }
        xofInto(out) {
          if (!this.enableXOF)
            throw new Error("XOF is not possible for this instance");
          return this.writeInto(out);
        }
        xof(bytes) {
          anumber(bytes);
          return this.xofInto(new Uint8Array(bytes));
        }
        digestInto(out) {
          aoutput(out, this);
          if (this.finished)
            throw new Error("digest() was already called");
          this.writeInto(out);
          this.destroy();
          return out;
        }
        digest() {
          return this.digestInto(new Uint8Array(this.outputLen));
        }
        destroy() {
          this.destroyed = true;
          clean(this.state);
        }
        _cloneInto(to) {
          const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
          to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
          to.state32.set(this.state32);
          to.pos = this.pos;
          to.posOut = this.posOut;
          to.finished = this.finished;
          to.rounds = rounds;
          to.suffix = suffix;
          to.outputLen = outputLen;
          to.enableXOF = enableXOF;
          to.destroyed = this.destroyed;
          return to;
        }
      };
      gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
      keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
    }
  });

  // node_modules/viem/utils/hash/keccak256.ts
  function keccak256(value, to_) {
    const to = to_ || "hex";
    const bytes = keccak_256(
      isHex(value, { strict: false }) ? toBytes(value) : value
    );
    if (to === "bytes") return bytes;
    return toHex(bytes);
  }
  var init_keccak256 = __esm({
    "node_modules/viem/utils/hash/keccak256.ts"() {
      init_sha3();
      init_isHex();
      init_toBytes();
      init_toHex();
    }
  });

  // node_modules/viem/utils/hash/hashSignature.ts
  function hashSignature(sig) {
    return hash(sig);
  }
  var hash;
  var init_hashSignature = __esm({
    "node_modules/viem/utils/hash/hashSignature.ts"() {
      init_toBytes();
      init_keccak256();
      hash = (value) => keccak256(toBytes(value));
    }
  });

  // node_modules/viem/utils/hash/normalizeSignature.ts
  function normalizeSignature(signature) {
    let active = true;
    let current = "";
    let level = 0;
    let result = "";
    let valid = false;
    for (let i = 0; i < signature.length; i++) {
      const char = signature[i];
      if (["(", ")", ","].includes(char)) active = true;
      if (char === "(") level++;
      if (char === ")") level--;
      if (!active) continue;
      if (level === 0) {
        if (char === " " && ["event", "function", ""].includes(result))
          result = "";
        else {
          result += char;
          if (char === ")") {
            valid = true;
            break;
          }
        }
        continue;
      }
      if (char === " ") {
        if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
          current = "";
          active = false;
        }
        continue;
      }
      result += char;
      current += char;
    }
    if (!valid) throw new BaseError2("Unable to normalize signature.");
    return result;
  }
  var init_normalizeSignature = __esm({
    "node_modules/viem/utils/hash/normalizeSignature.ts"() {
      init_base();
    }
  });

  // node_modules/viem/utils/hash/toSignature.ts
  var toSignature;
  var init_toSignature = __esm({
    "node_modules/viem/utils/hash/toSignature.ts"() {
      init_exports();
      init_normalizeSignature();
      toSignature = (def) => {
        const def_ = (() => {
          if (typeof def === "string") return def;
          return formatAbiItem(def);
        })();
        return normalizeSignature(def_);
      };
    }
  });

  // node_modules/viem/utils/hash/toSignatureHash.ts
  function toSignatureHash(fn) {
    return hashSignature(toSignature(fn));
  }
  var init_toSignatureHash = __esm({
    "node_modules/viem/utils/hash/toSignatureHash.ts"() {
      init_hashSignature();
      init_toSignature();
    }
  });

  // node_modules/viem/utils/hash/toEventSelector.ts
  var toEventSelector;
  var init_toEventSelector = __esm({
    "node_modules/viem/utils/hash/toEventSelector.ts"() {
      init_toSignatureHash();
      toEventSelector = toSignatureHash;
    }
  });

  // node_modules/viem/errors/address.ts
  var InvalidAddressError;
  var init_address = __esm({
    "node_modules/viem/errors/address.ts"() {
      init_base();
      InvalidAddressError = class extends BaseError2 {
        constructor({ address }) {
          super(`Address "${address}" is invalid.`, {
            metaMessages: [
              "- Address must be a hex value of 20 bytes (40 hex characters).",
              "- Address must match its checksum counterpart."
            ],
            name: "InvalidAddressError"
          });
        }
      };
    }
  });

  // node_modules/viem/utils/lru.ts
  var LruMap;
  var init_lru = __esm({
    "node_modules/viem/utils/lru.ts"() {
      LruMap = class extends Map {
        maxSize;
        constructor(size5) {
          super();
          this.maxSize = size5;
        }
        get(key) {
          const value = super.get(key);
          if (super.has(key)) {
            super.delete(key);
            super.set(key, value);
          }
          return value;
        }
        set(key, value) {
          if (super.has(key)) super.delete(key);
          super.set(key, value);
          if (this.maxSize && this.size > this.maxSize) {
            const firstKey = super.keys().next().value;
            if (firstKey !== void 0) super.delete(firstKey);
          }
          return this;
        }
      };
    }
  });

  // node_modules/viem/utils/address/getAddress.ts
  function checksumAddress(address_, chainId) {
    if (checksumAddressCache.has(`${address_}.${chainId}`))
      return checksumAddressCache.get(`${address_}.${chainId}`);
    const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
    const hash3 = keccak256(stringToBytes(hexAddress), "bytes");
    const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
    for (let i = 0; i < 40; i += 2) {
      if (hash3[i >> 1] >> 4 >= 8 && address[i]) {
        address[i] = address[i].toUpperCase();
      }
      if ((hash3[i >> 1] & 15) >= 8 && address[i + 1]) {
        address[i + 1] = address[i + 1].toUpperCase();
      }
    }
    const result = `0x${address.join("")}`;
    checksumAddressCache.set(`${address_}.${chainId}`, result);
    return result;
  }
  function getAddress(address, chainId) {
    if (!isAddress(address, { strict: false }))
      throw new InvalidAddressError({ address });
    return checksumAddress(address, chainId);
  }
  var checksumAddressCache;
  var init_getAddress = __esm({
    "node_modules/viem/utils/address/getAddress.ts"() {
      init_address();
      init_toBytes();
      init_keccak256();
      init_lru();
      init_isAddress();
      checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
    }
  });

  // node_modules/viem/utils/address/isAddress.ts
  function isAddress(address, options) {
    const { strict = true } = options ?? {};
    const cacheKey2 = `${address}.${strict}`;
    if (isAddressCache.has(cacheKey2)) return isAddressCache.get(cacheKey2);
    const result = (() => {
      if (!addressRegex.test(address)) return false;
      if (address.toLowerCase() === address) return true;
      if (strict) return checksumAddress(address) === address;
      return true;
    })();
    isAddressCache.set(cacheKey2, result);
    return result;
  }
  var addressRegex, isAddressCache;
  var init_isAddress = __esm({
    "node_modules/viem/utils/address/isAddress.ts"() {
      init_lru();
      init_getAddress();
      addressRegex = /^0x[a-fA-F0-9]{40}$/;
      isAddressCache = /* @__PURE__ */ new LruMap(8192);
    }
  });

  // node_modules/viem/utils/data/concat.ts
  function concat(values) {
    if (typeof values[0] === "string")
      return concatHex(values);
    return concatBytes2(values);
  }
  function concatBytes2(values) {
    let length = 0;
    for (const arr of values) {
      length += arr.length;
    }
    const result = new Uint8Array(length);
    let offset = 0;
    for (const arr of values) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }
  function concatHex(values) {
    return `0x${values.reduce(
      (acc, x) => acc + x.replace("0x", ""),
      ""
    )}`;
  }
  var init_concat = __esm({
    "node_modules/viem/utils/data/concat.ts"() {
    }
  });

  // node_modules/viem/utils/data/slice.ts
  function slice(value, start, end, { strict } = {}) {
    if (isHex(value, { strict: false }))
      return sliceHex(value, start, end, {
        strict
      });
    return sliceBytes(value, start, end, {
      strict
    });
  }
  function assertStartOffset(value, start) {
    if (typeof start === "number" && start > 0 && start > size(value) - 1)
      throw new SliceOffsetOutOfBoundsError({
        offset: start,
        position: "start",
        size: size(value)
      });
  }
  function assertEndOffset(value, start, end) {
    if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
      throw new SliceOffsetOutOfBoundsError({
        offset: end,
        position: "end",
        size: size(value)
      });
    }
  }
  function sliceBytes(value_, start, end, { strict } = {}) {
    assertStartOffset(value_, start);
    const value = value_.slice(start, end);
    if (strict) assertEndOffset(value, start, end);
    return value;
  }
  function sliceHex(value_, start, end, { strict } = {}) {
    assertStartOffset(value_, start);
    const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
    if (strict) assertEndOffset(value, start, end);
    return value;
  }
  var init_slice = __esm({
    "node_modules/viem/utils/data/slice.ts"() {
      init_data();
      init_isHex();
      init_size();
    }
  });

  // node_modules/viem/utils/regex.ts
  var arrayRegex, bytesRegex2, integerRegex2;
  var init_regex2 = __esm({
    "node_modules/viem/utils/regex.ts"() {
      arrayRegex = /^(.*)\[([0-9]*)\]$/;
      bytesRegex2 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
      integerRegex2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
    }
  });

  // node_modules/viem/utils/abi/encodeAbiParameters.ts
  function encodeAbiParameters(params, values) {
    if (params.length !== values.length)
      throw new AbiEncodingLengthMismatchError({
        expectedLength: params.length,
        givenLength: values.length
      });
    const preparedParams = prepareParams({
      params,
      values
    });
    return encodeParams(preparedParams);
  }
  function prepareParams({
    params,
    values
  }) {
    const preparedParams = [];
    for (let i = 0; i < params.length; i++) {
      preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
    }
    return preparedParams;
  }
  function prepareParam({
    param,
    value
  }) {
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return encodeArray(value, { length, param: { ...param, type } });
    }
    if (param.type === "tuple") {
      return encodeTuple(value, {
        param
      });
    }
    if (param.type === "address") {
      return encodeAddress(value);
    }
    if (param.type === "bool") {
      return encodeBool(value);
    }
    if (param.type.startsWith("uint") || param.type.startsWith("int")) {
      const signed = param.type.startsWith("int");
      const [, , size5 = "256"] = integerRegex2.exec(param.type) ?? [];
      return encodeNumber(value, {
        signed,
        size: Number(size5)
      });
    }
    if (param.type.startsWith("bytes")) {
      return encodeBytes(value, { param });
    }
    if (param.type === "string") {
      return encodeString(value);
    }
    throw new InvalidAbiEncodingTypeError(param.type, {
      docsPath: "/docs/contract/encodeAbiParameters"
    });
  }
  function encodeParams(preparedParams) {
    let staticSize = 0;
    for (let i = 0; i < preparedParams.length; i++) {
      const { dynamic, encoded } = preparedParams[i];
      if (dynamic) staticSize += 32;
      else staticSize += size(encoded);
    }
    const staticParams = [];
    const dynamicParams = [];
    let dynamicSize = 0;
    for (let i = 0; i < preparedParams.length; i++) {
      const { dynamic, encoded } = preparedParams[i];
      if (dynamic) {
        staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
        dynamicParams.push(encoded);
        dynamicSize += size(encoded);
      } else {
        staticParams.push(encoded);
      }
    }
    return concatHex([...staticParams, ...dynamicParams]);
  }
  function encodeAddress(value) {
    if (!isAddress(value)) throw new InvalidAddressError({ address: value });
    return { dynamic: false, encoded: padHex(value.toLowerCase()) };
  }
  function encodeArray(value, {
    length,
    param
  }) {
    const dynamic = length === null;
    if (!Array.isArray(value)) throw new InvalidArrayError(value);
    if (!dynamic && value.length !== length)
      throw new AbiEncodingArrayLengthMismatchError({
        expectedLength: length,
        givenLength: value.length,
        type: `${param.type}[${length}]`
      });
    let dynamicChild = value.length === 0 && isDynamicType(param);
    const preparedParams = [];
    for (let i = 0; i < value.length; i++) {
      const preparedParam = prepareParam({ param, value: value[i] });
      if (preparedParam.dynamic) dynamicChild = true;
      preparedParams.push(preparedParam);
    }
    if (dynamic || dynamicChild) {
      const data = encodeParams(preparedParams);
      if (dynamic) {
        const length2 = numberToHex(preparedParams.length, { size: 32 });
        return {
          dynamic: true,
          encoded: concatHex([length2, data])
        };
      }
      if (dynamicChild) return { dynamic: true, encoded: data };
    }
    return {
      dynamic: false,
      encoded: concatHex(preparedParams.map(({ encoded }) => encoded))
    };
  }
  function encodeBytes(value, { param }) {
    const [, paramSize] = param.type.split("bytes");
    const bytesSize = size(value);
    if (!paramSize) {
      let value_ = value;
      if (bytesSize % 32 !== 0)
        value_ = padHex(value_, {
          dir: "right",
          size: Math.ceil((value.length - 2) / 2 / 32) * 32
        });
      return {
        dynamic: true,
        encoded: concatHex([
          padHex(numberToHex(bytesSize, { size: 32 })),
          value_
        ])
      };
    }
    if (bytesSize !== Number.parseInt(paramSize, 10))
      throw new AbiEncodingBytesSizeMismatchError({
        expectedSize: Number.parseInt(paramSize, 10),
        value
      });
    return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
  }
  function encodeBool(value) {
    if (typeof value !== "boolean")
      throw new BaseError2(
        `Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`
      );
    return { dynamic: false, encoded: padHex(boolToHex(value)) };
  }
  function encodeNumber(value, { signed, size: size5 = 256 }) {
    if (typeof size5 === "number") {
      const max = 2n ** (BigInt(size5) - (signed ? 1n : 0n)) - 1n;
      const min = signed ? -max - 1n : 0n;
      if (value > max || value < min)
        throw new IntegerOutOfRangeError({
          max: max.toString(),
          min: min.toString(),
          signed,
          size: size5 / 8,
          value: value.toString()
        });
    }
    return {
      dynamic: false,
      encoded: numberToHex(value, {
        size: 32,
        signed
      })
    };
  }
  function encodeString(value) {
    const hexValue = stringToHex(value);
    const partsLength = Math.ceil(size(hexValue) / 32);
    const parts = [];
    for (let i = 0; i < partsLength; i++) {
      parts.push(
        padHex(slice(hexValue, i * 32, (i + 1) * 32), {
          dir: "right"
        })
      );
    }
    return {
      dynamic: true,
      encoded: concatHex([
        padHex(numberToHex(size(hexValue), { size: 32 })),
        ...parts
      ])
    };
  }
  function encodeTuple(value, { param }) {
    let dynamic = false;
    const preparedParams = [];
    for (let i = 0; i < param.components.length; i++) {
      const param_ = param.components[i];
      const index2 = Array.isArray(value) ? i : param_.name;
      const preparedParam = prepareParam({
        param: param_,
        value: value[index2]
      });
      preparedParams.push(preparedParam);
      if (preparedParam.dynamic) dynamic = true;
    }
    return {
      dynamic,
      encoded: dynamic ? encodeParams(preparedParams) : concatHex(preparedParams.map(({ encoded }) => encoded))
    };
  }
  function getArrayComponents(type) {
    const matches = type.match(/^(.*)\[(\d+)?\]$/);
    return matches ? (
      // Return `null` if the array is dynamic.
      [matches[2] ? Number(matches[2]) : null, matches[1]]
    ) : void 0;
  }
  function isDynamicType(param) {
    const { type } = param;
    if (type === "string") return true;
    if (type === "bytes") return true;
    if (type.endsWith("[]")) return true;
    if (type === "tuple")
      return param.components.some(isDynamicType);
    const arrayComponents = getArrayComponents(type);
    if (arrayComponents)
      return isDynamicType({ ...param, type: arrayComponents[1] });
    return false;
  }
  var init_encodeAbiParameters = __esm({
    "node_modules/viem/utils/abi/encodeAbiParameters.ts"() {
      init_abi();
      init_address();
      init_base();
      init_encoding();
      init_isAddress();
      init_concat();
      init_pad();
      init_size();
      init_slice();
      init_toHex();
      init_regex2();
    }
  });

  // node_modules/viem/utils/hash/toFunctionSelector.ts
  var toFunctionSelector;
  var init_toFunctionSelector = __esm({
    "node_modules/viem/utils/hash/toFunctionSelector.ts"() {
      init_slice();
      init_toSignatureHash();
      toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);
    }
  });

  // node_modules/viem/utils/abi/getAbiItem.ts
  function getAbiItem(parameters) {
    const { abi: abi2, args = [], name } = parameters;
    const isSelector = isHex(name, { strict: false });
    const abiItems = abi2.filter((abiItem) => {
      if (isSelector) {
        if (abiItem.type === "function")
          return toFunctionSelector(abiItem) === name;
        if (abiItem.type === "event") return toEventSelector(abiItem) === name;
        return false;
      }
      return "name" in abiItem && abiItem.name === name;
    });
    if (abiItems.length === 0)
      return void 0;
    if (abiItems.length === 1)
      return abiItems[0];
    let matchedAbiItem;
    for (const abiItem of abiItems) {
      if (!("inputs" in abiItem)) continue;
      if (!args || args.length === 0) {
        if (!abiItem.inputs || abiItem.inputs.length === 0)
          return abiItem;
        continue;
      }
      if (!abiItem.inputs) continue;
      if (abiItem.inputs.length === 0) continue;
      if (abiItem.inputs.length !== args.length) continue;
      const matched = args.every((arg, index2) => {
        const abiParameter = "inputs" in abiItem && abiItem.inputs[index2];
        if (!abiParameter) return false;
        return isArgOfType(arg, abiParameter);
      });
      if (matched) {
        if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
          const ambiguousTypes = getAmbiguousTypes(
            abiItem.inputs,
            matchedAbiItem.inputs,
            args
          );
          if (ambiguousTypes)
            throw new AbiItemAmbiguityError(
              {
                abiItem,
                type: ambiguousTypes[0]
              },
              {
                abiItem: matchedAbiItem,
                type: ambiguousTypes[1]
              }
            );
        }
        matchedAbiItem = abiItem;
      }
    }
    if (matchedAbiItem)
      return matchedAbiItem;
    return abiItems[0];
  }
  function isArgOfType(arg, abiParameter) {
    const argType = typeof arg;
    const abiParameterType = abiParameter.type;
    switch (abiParameterType) {
      case "address":
        return isAddress(arg, { strict: false });
      case "bool":
        return argType === "boolean";
      case "function":
        return argType === "string";
      case "string":
        return argType === "string";
      default: {
        if (abiParameterType === "tuple" && "components" in abiParameter)
          return Object.values(abiParameter.components).every(
            (component, index2) => {
              return argType === "object" && isArgOfType(
                Object.values(arg)[index2],
                component
              );
            }
          );
        if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(
          abiParameterType
        ))
          return argType === "number" || argType === "bigint";
        if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
          return argType === "string" || arg instanceof Uint8Array;
        if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
          return Array.isArray(arg) && arg.every(
            (x) => isArgOfType(x, {
              ...abiParameter,
              // Pop off `[]` or `[M]` from end of type
              type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
            })
          );
        }
        return false;
      }
    }
  }
  function getAmbiguousTypes(sourceParameters, targetParameters, args) {
    for (const parameterIndex in sourceParameters) {
      const sourceParameter = sourceParameters[parameterIndex];
      const targetParameter = targetParameters[parameterIndex];
      if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
        return getAmbiguousTypes(
          sourceParameter.components,
          targetParameter.components,
          args[parameterIndex]
        );
      const types = [sourceParameter.type, targetParameter.type];
      const ambiguous = (() => {
        if (types.includes("address") && types.includes("bytes20")) return true;
        if (types.includes("address") && types.includes("string"))
          return isAddress(args[parameterIndex], { strict: false });
        if (types.includes("address") && types.includes("bytes"))
          return isAddress(args[parameterIndex], { strict: false });
        return false;
      })();
      if (ambiguous) return types;
    }
    return;
  }
  var init_getAbiItem = __esm({
    "node_modules/viem/utils/abi/getAbiItem.ts"() {
      init_abi();
      init_isHex();
      init_isAddress();
      init_toEventSelector();
      init_toFunctionSelector();
    }
  });

  // node_modules/viem/accounts/utils/parseAccount.ts
  function parseAccount(account) {
    if (typeof account === "string")
      return { address: account, type: "json-rpc" };
    return account;
  }
  var init_parseAccount = __esm({
    "node_modules/viem/accounts/utils/parseAccount.ts"() {
    }
  });

  // node_modules/viem/utils/abi/prepareEncodeFunctionData.ts
  function prepareEncodeFunctionData(parameters) {
    const { abi: abi2, args, functionName } = parameters;
    let abiItem = abi2[0];
    if (functionName) {
      const item = getAbiItem({
        abi: abi2,
        args,
        name: functionName
      });
      if (!item) throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath2 });
      abiItem = item;
    }
    if (abiItem.type !== "function")
      throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath2 });
    return {
      abi: [abiItem],
      functionName: toFunctionSelector(formatAbiItem2(abiItem))
    };
  }
  var docsPath2;
  var init_prepareEncodeFunctionData = __esm({
    "node_modules/viem/utils/abi/prepareEncodeFunctionData.ts"() {
      init_abi();
      init_toFunctionSelector();
      init_formatAbiItem2();
      init_getAbiItem();
      docsPath2 = "/docs/contract/encodeFunctionData";
    }
  });

  // node_modules/viem/utils/abi/encodeFunctionData.ts
  function encodeFunctionData(parameters) {
    const { args } = parameters;
    const { abi: abi2, functionName } = (() => {
      if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x"))
        return parameters;
      return prepareEncodeFunctionData(parameters);
    })();
    const abiItem = abi2[0];
    const signature = functionName;
    const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0;
    return concatHex([signature, data ?? "0x"]);
  }
  var init_encodeFunctionData = __esm({
    "node_modules/viem/utils/abi/encodeFunctionData.ts"() {
      init_concat();
      init_encodeAbiParameters();
      init_prepareEncodeFunctionData();
    }
  });

  // node_modules/viem/constants/solidity.ts
  var panicReasons, solidityError, solidityPanic;
  var init_solidity = __esm({
    "node_modules/viem/constants/solidity.ts"() {
      panicReasons = {
        1: "An `assert` condition failed.",
        17: "Arithmetic operation resulted in underflow or overflow.",
        18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
        33: "Attempted to convert to an invalid type.",
        34: "Attempted to access a storage byte array that is incorrectly encoded.",
        49: "Performed `.pop()` on an empty array",
        50: "Array index is out of bounds.",
        65: "Allocated too much memory or created an array which is too large.",
        81: "Attempted to call a zero-initialized variable of internal function type."
      };
      solidityError = {
        inputs: [
          {
            name: "message",
            type: "string"
          }
        ],
        name: "Error",
        type: "error"
      };
      solidityPanic = {
        inputs: [
          {
            name: "reason",
            type: "uint256"
          }
        ],
        name: "Panic",
        type: "error"
      };
    }
  });

  // node_modules/viem/errors/cursor.ts
  var NegativeOffsetError, PositionOutOfBoundsError, RecursiveReadLimitExceededError;
  var init_cursor = __esm({
    "node_modules/viem/errors/cursor.ts"() {
      init_base();
      NegativeOffsetError = class extends BaseError2 {
        constructor({ offset }) {
          super(`Offset \`${offset}\` cannot be negative.`, {
            name: "NegativeOffsetError"
          });
        }
      };
      PositionOutOfBoundsError = class extends BaseError2 {
        constructor({ length, position }) {
          super(
            `Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`,
            { name: "PositionOutOfBoundsError" }
          );
        }
      };
      RecursiveReadLimitExceededError = class extends BaseError2 {
        constructor({ count, limit }) {
          super(
            `Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`,
            { name: "RecursiveReadLimitExceededError" }
          );
        }
      };
    }
  });

  // node_modules/viem/utils/cursor.ts
  function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
    const cursor = Object.create(staticCursor);
    cursor.bytes = bytes;
    cursor.dataView = new DataView(
      bytes.buffer ?? bytes,
      bytes.byteOffset,
      bytes.byteLength
    );
    cursor.positionReadCount = /* @__PURE__ */ new Map();
    cursor.recursiveReadLimit = recursiveReadLimit;
    return cursor;
  }
  var staticCursor;
  var init_cursor2 = __esm({
    "node_modules/viem/utils/cursor.ts"() {
      init_cursor();
      staticCursor = {
        bytes: new Uint8Array(),
        dataView: new DataView(new ArrayBuffer(0)),
        position: 0,
        positionReadCount: /* @__PURE__ */ new Map(),
        recursiveReadCount: 0,
        recursiveReadLimit: Number.POSITIVE_INFINITY,
        assertReadLimit() {
          if (this.recursiveReadCount >= this.recursiveReadLimit)
            throw new RecursiveReadLimitExceededError({
              count: this.recursiveReadCount + 1,
              limit: this.recursiveReadLimit
            });
        },
        assertPosition(position) {
          if (position < 0 || position > this.bytes.length - 1)
            throw new PositionOutOfBoundsError({
              length: this.bytes.length,
              position
            });
        },
        decrementPosition(offset) {
          if (offset < 0) throw new NegativeOffsetError({ offset });
          const position = this.position - offset;
          this.assertPosition(position);
          this.position = position;
        },
        getReadCount(position) {
          return this.positionReadCount.get(position || this.position) || 0;
        },
        incrementPosition(offset) {
          if (offset < 0) throw new NegativeOffsetError({ offset });
          const position = this.position + offset;
          this.assertPosition(position);
          this.position = position;
        },
        inspectByte(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position);
          return this.bytes[position];
        },
        inspectBytes(length, position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position + length - 1);
          return this.bytes.subarray(position, position + length);
        },
        inspectUint8(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position);
          return this.bytes[position];
        },
        inspectUint16(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position + 1);
          return this.dataView.getUint16(position);
        },
        inspectUint24(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position + 2);
          return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
        },
        inspectUint32(position_) {
          const position = position_ ?? this.position;
          this.assertPosition(position + 3);
          return this.dataView.getUint32(position);
        },
        pushByte(byte) {
          this.assertPosition(this.position);
          this.bytes[this.position] = byte;
          this.position++;
        },
        pushBytes(bytes) {
          this.assertPosition(this.position + bytes.length - 1);
          this.bytes.set(bytes, this.position);
          this.position += bytes.length;
        },
        pushUint8(value) {
          this.assertPosition(this.position);
          this.bytes[this.position] = value;
          this.position++;
        },
        pushUint16(value) {
          this.assertPosition(this.position + 1);
          this.dataView.setUint16(this.position, value);
          this.position += 2;
        },
        pushUint24(value) {
          this.assertPosition(this.position + 2);
          this.dataView.setUint16(this.position, value >> 8);
          this.dataView.setUint8(this.position + 2, value & ~4294967040);
          this.position += 3;
        },
        pushUint32(value) {
          this.assertPosition(this.position + 3);
          this.dataView.setUint32(this.position, value);
          this.position += 4;
        },
        readByte() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectByte();
          this.position++;
          return value;
        },
        readBytes(length, size5) {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectBytes(length);
          this.position += size5 ?? length;
          return value;
        },
        readUint8() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectUint8();
          this.position += 1;
          return value;
        },
        readUint16() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectUint16();
          this.position += 2;
          return value;
        },
        readUint24() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectUint24();
          this.position += 3;
          return value;
        },
        readUint32() {
          this.assertReadLimit();
          this._touch();
          const value = this.inspectUint32();
          this.position += 4;
          return value;
        },
        get remaining() {
          return this.bytes.length - this.position;
        },
        setPosition(position) {
          const oldPosition = this.position;
          this.assertPosition(position);
          this.position = position;
          return () => this.position = oldPosition;
        },
        _touch() {
          if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
          const count = this.getReadCount();
          this.positionReadCount.set(this.position, count + 1);
          if (count > 0) this.recursiveReadCount++;
        }
      };
    }
  });

  // node_modules/viem/utils/encoding/fromBytes.ts
  function fromBytes(bytes, toOrOpts) {
    const opts = typeof toOrOpts === "string" ? { to: toOrOpts } : toOrOpts;
    const to = opts.to;
    if (to === "number")
      return bytesToNumber(bytes, opts);
    if (to === "bigint")
      return bytesToBigInt(bytes, opts);
    if (to === "boolean")
      return bytesToBool(bytes, opts);
    if (to === "string")
      return bytesToString(bytes, opts);
    return bytesToHex(bytes, opts);
  }
  function bytesToBigInt(bytes, opts = {}) {
    if (typeof opts.size !== "undefined") assertSize(bytes, { size: opts.size });
    const hex = bytesToHex(bytes, opts);
    return hexToBigInt(hex, opts);
  }
  function bytesToBool(bytes_, opts = {}) {
    let bytes = bytes_;
    if (typeof opts.size !== "undefined") {
      assertSize(bytes, { size: opts.size });
      bytes = trim(bytes);
    }
    if (bytes.length > 1 || bytes[0] > 1)
      throw new InvalidBytesBooleanError(bytes);
    return Boolean(bytes[0]);
  }
  function bytesToNumber(bytes, opts = {}) {
    if (typeof opts.size !== "undefined") assertSize(bytes, { size: opts.size });
    const hex = bytesToHex(bytes, opts);
    return hexToNumber(hex, opts);
  }
  function bytesToString(bytes_, opts = {}) {
    let bytes = bytes_;
    if (typeof opts.size !== "undefined") {
      assertSize(bytes, { size: opts.size });
      bytes = trim(bytes, { dir: "right" });
    }
    return new TextDecoder().decode(bytes);
  }
  var init_fromBytes = __esm({
    "node_modules/viem/utils/encoding/fromBytes.ts"() {
      init_encoding();
      init_trim();
      init_fromHex();
      init_toHex();
    }
  });

  // node_modules/viem/utils/abi/decodeAbiParameters.ts
  function decodeAbiParameters(params, data) {
    const bytes = typeof data === "string" ? hexToBytes(data) : data;
    const cursor = createCursor(bytes);
    if (size(bytes) === 0 && params.length > 0)
      throw new AbiDecodingZeroDataError();
    if (size(data) && size(data) < 32)
      throw new AbiDecodingDataSizeTooSmallError({
        data: typeof data === "string" ? data : bytesToHex(data),
        params,
        size: size(data)
      });
    let consumed = 0;
    const values = [];
    for (let i = 0; i < params.length; ++i) {
      const param = params[i];
      if (consumed < bytes.length) cursor.setPosition(consumed);
      const [data2, consumed_] = decodeParameter(cursor, param, {
        staticPosition: 0
      });
      consumed += consumed_;
      values.push(data2);
    }
    return values;
  }
  function decodeParameter(cursor, param, { staticPosition }) {
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return decodeArray(cursor, { ...param, type }, { length, staticPosition });
    }
    if (param.type === "tuple")
      return decodeTuple(cursor, param, { staticPosition });
    if (param.type === "address") return decodeAddress(cursor);
    if (param.type === "bool") return decodeBool(cursor);
    if (param.type.startsWith("bytes"))
      return decodeBytes(cursor, param, { staticPosition });
    if (param.type.startsWith("uint") || param.type.startsWith("int"))
      return decodeNumber(cursor, param);
    if (param.type === "string") return decodeString(cursor, { staticPosition });
    throw new InvalidAbiDecodingTypeError(param.type, {
      docsPath: "/docs/contract/decodeAbiParameters"
    });
  }
  function decodeAddress(cursor) {
    const value = cursor.readBytes(32);
    return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
  }
  function decodeArray(cursor, param, { length, staticPosition }) {
    if (length === null) {
      const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      const startOfData = start + sizeOfLength;
      cursor.setPosition(start);
      const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
      const dynamicChild = hasDynamicChild(param);
      let consumed2 = 0;
      const value2 = [];
      for (let i = 0; i < length2; ++i) {
        cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
        const [data, consumed_] = decodeParameter(cursor, param, {
          staticPosition: startOfData
        });
        consumed2 += consumed_;
        value2.push(data);
        if (consumed_ === 0) {
          cursor.assertReadLimit();
          cursor._touch();
        }
      }
      cursor.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    if (hasDynamicChild(param)) {
      const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      const value2 = [];
      for (let i = 0; i < length; ++i) {
        cursor.setPosition(start + i * 32);
        const [data] = decodeParameter(cursor, param, {
          staticPosition: start
        });
        value2.push(data);
      }
      cursor.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    let consumed = 0;
    const value = [];
    for (let i = 0; i < length; ++i) {
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: staticPosition + consumed
      });
      consumed += consumed_;
      value.push(data);
      if (consumed_ === 0) {
        cursor.assertReadLimit();
        cursor._touch();
      }
    }
    return [value, consumed];
  }
  function decodeBool(cursor) {
    return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
  }
  function decodeBytes(cursor, param, { staticPosition }) {
    const [_, size5] = param.type.split("bytes");
    if (!size5) {
      const offset = bytesToNumber(cursor.readBytes(32));
      cursor.setPosition(staticPosition + offset);
      const length = bytesToNumber(cursor.readBytes(32));
      if (length === 0) {
        cursor.setPosition(staticPosition + 32);
        return ["0x", 32];
      }
      const data = cursor.readBytes(length);
      cursor.setPosition(staticPosition + 32);
      return [bytesToHex(data), 32];
    }
    const value = bytesToHex(cursor.readBytes(Number.parseInt(size5, 10), 32));
    return [value, 32];
  }
  function decodeNumber(cursor, param) {
    const signed = param.type.startsWith("int");
    const size5 = Number.parseInt(param.type.split("int")[1] || "256", 10);
    const value = cursor.readBytes(32);
    return [
      size5 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
      32
    ];
  }
  function decodeTuple(cursor, param, { staticPosition }) {
    const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
    const value = hasUnnamedChild ? [] : {};
    let consumed = 0;
    if (hasDynamicChild(param)) {
      const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
      const start = staticPosition + offset;
      for (let i = 0; i < param.components.length; ++i) {
        const component = param.components[i];
        cursor.setPosition(start + consumed);
        const [data, consumed_] = decodeParameter(cursor, component, {
          staticPosition: start
        });
        consumed += consumed_;
        value[hasUnnamedChild ? i : component?.name] = data;
      }
      cursor.setPosition(staticPosition + 32);
      return [value, 32];
    }
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition
      });
      value[hasUnnamedChild ? i : component?.name] = data;
      consumed += consumed_;
    }
    return [value, consumed];
  }
  function decodeString(cursor, { staticPosition }) {
    const offset = bytesToNumber(cursor.readBytes(32));
    const start = staticPosition + offset;
    cursor.setPosition(start);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["", 32];
    }
    const data = cursor.readBytes(length, 32);
    const value = bytesToString(trim(data));
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  function hasDynamicChild(param) {
    const { type } = param;
    if (type === "string") return true;
    if (type === "bytes") return true;
    if (type.endsWith("[]")) return true;
    if (type === "tuple") return param.components?.some(hasDynamicChild);
    const arrayComponents = getArrayComponents(param.type);
    if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
      return true;
    return false;
  }
  var sizeOfLength, sizeOfOffset;
  var init_decodeAbiParameters = __esm({
    "node_modules/viem/utils/abi/decodeAbiParameters.ts"() {
      init_abi();
      init_getAddress();
      init_cursor2();
      init_size();
      init_slice();
      init_trim();
      init_fromBytes();
      init_toBytes();
      init_toHex();
      init_encodeAbiParameters();
      sizeOfLength = 32;
      sizeOfOffset = 32;
    }
  });

  // node_modules/viem/utils/abi/decodeErrorResult.ts
  function decodeErrorResult(parameters) {
    const { abi: abi2, data, cause } = parameters;
    const signature = slice(data, 0, 4);
    if (signature === "0x") throw new AbiDecodingZeroDataError({ cause });
    const abi_ = [...abi2 || [], solidityError, solidityPanic];
    const abiItem = abi_.find(
      (x) => x.type === "error" && signature === toFunctionSelector(formatAbiItem2(x))
    );
    if (!abiItem)
      throw new AbiErrorSignatureNotFoundError(signature, {
        docsPath: "/docs/contract/decodeErrorResult",
        cause
      });
    return {
      abiItem,
      args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice(data, 4)) : void 0,
      errorName: abiItem.name
    };
  }
  var init_decodeErrorResult = __esm({
    "node_modules/viem/utils/abi/decodeErrorResult.ts"() {
      init_solidity();
      init_abi();
      init_slice();
      init_toFunctionSelector();
      init_decodeAbiParameters();
      init_formatAbiItem2();
    }
  });

  // node_modules/viem/utils/stringify.ts
  var stringify;
  var init_stringify = __esm({
    "node_modules/viem/utils/stringify.ts"() {
      stringify = (value, replacer, space) => JSON.stringify(
        value,
        (key, value_) => {
          const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
          return typeof replacer === "function" ? replacer(key, value2) : value2;
        },
        space
      );
    }
  });

  // node_modules/viem/utils/abi/formatAbiItemWithArgs.ts
  function formatAbiItemWithArgs({
    abiItem,
    args,
    includeFunctionName = true,
    includeName = false
  }) {
    if (!("name" in abiItem)) return;
    if (!("inputs" in abiItem)) return;
    if (!abiItem.inputs) return;
    return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map(
      (input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? stringify(args[i]) : args[i]}`
    ).join(", ")})`;
  }
  var init_formatAbiItemWithArgs = __esm({
    "node_modules/viem/utils/abi/formatAbiItemWithArgs.ts"() {
      init_stringify();
    }
  });

  // node_modules/viem/constants/unit.ts
  var etherUnits, gweiUnits, weiUnits;
  var init_unit = __esm({
    "node_modules/viem/constants/unit.ts"() {
      etherUnits = {
        gwei: 9,
        wei: 18
      };
      gweiUnits = {
        ether: -9,
        wei: 9
      };
      weiUnits = {
        ether: -18,
        gwei: -9
      };
    }
  });

  // node_modules/viem/utils/unit/formatUnits.ts
  function formatUnits(value, decimals) {
    let display = value.toString();
    const negative = display.startsWith("-");
    if (negative) display = display.slice(1);
    display = display.padStart(decimals, "0");
    let [integer, fraction] = [
      display.slice(0, display.length - decimals),
      display.slice(display.length - decimals)
    ];
    fraction = fraction.replace(/(0+)$/, "");
    return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
  }
  var init_formatUnits = __esm({
    "node_modules/viem/utils/unit/formatUnits.ts"() {
    }
  });

  // node_modules/viem/utils/unit/formatEther.ts
  function formatEther(wei, unit = "wei") {
    return formatUnits(wei, etherUnits[unit]);
  }
  var init_formatEther = __esm({
    "node_modules/viem/utils/unit/formatEther.ts"() {
      init_unit();
      init_formatUnits();
    }
  });

  // node_modules/viem/utils/unit/formatGwei.ts
  function formatGwei(wei, unit = "wei") {
    return formatUnits(wei, gweiUnits[unit]);
  }
  var init_formatGwei = __esm({
    "node_modules/viem/utils/unit/formatGwei.ts"() {
      init_unit();
      init_formatUnits();
    }
  });

  // node_modules/viem/errors/stateOverride.ts
  function prettyStateMapping(stateMapping) {
    return stateMapping.reduce((pretty, { slot, value }) => {
      return `${pretty}        ${slot}: ${value}
`;
    }, "");
  }
  function prettyStateOverride(stateOverride) {
    return stateOverride.reduce((pretty, { address, ...state }) => {
      let val = `${pretty}    ${address}:
`;
      if (state.nonce) val += `      nonce: ${state.nonce}
`;
      if (state.balance) val += `      balance: ${state.balance}
`;
      if (state.code) val += `      code: ${state.code}
`;
      if (state.state) {
        val += "      state:\n";
        val += prettyStateMapping(state.state);
      }
      if (state.stateDiff) {
        val += "      stateDiff:\n";
        val += prettyStateMapping(state.stateDiff);
      }
      return val;
    }, "  State Override:\n").slice(0, -1);
  }
  var AccountStateConflictError, StateAssignmentConflictError;
  var init_stateOverride = __esm({
    "node_modules/viem/errors/stateOverride.ts"() {
      init_base();
      AccountStateConflictError = class extends BaseError2 {
        constructor({ address }) {
          super(`State for account "${address}" is set multiple times.`, {
            name: "AccountStateConflictError"
          });
        }
      };
      StateAssignmentConflictError = class extends BaseError2 {
        constructor() {
          super("state and stateDiff are set on the same account.", {
            name: "StateAssignmentConflictError"
          });
        }
      };
    }
  });

  // node_modules/viem/errors/transaction.ts
  function prettyPrint(args) {
    const entries = Object.entries(args).map(([key, value]) => {
      if (value === void 0 || value === false) return null;
      return [key, value];
    }).filter(Boolean);
    const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
    return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
  }
  var FeeConflictError, InvalidLegacyVError, InvalidYParityError, InvalidSerializableTransactionError, InvalidSerializedTransactionTypeError, InvalidSerializedTransactionError, InvalidStorageKeySizeError, TransactionExecutionError, TransactionNotFoundError, TransactionReceiptNotFoundError, TransactionReceiptRevertedError, WaitForTransactionReceiptTimeoutError;
  var init_transaction = __esm({
    "node_modules/viem/errors/transaction.ts"() {
      init_formatEther();
      init_formatGwei();
      init_base();
      FeeConflictError = class extends BaseError2 {
        constructor() {
          super(
            [
              "Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.",
              "Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others."
            ].join("\n"),
            { name: "FeeConflictError" }
          );
        }
      };
      InvalidLegacyVError = class extends BaseError2 {
        constructor({ v }) {
          super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
            name: "InvalidLegacyVError"
          });
        }
      };
      InvalidYParityError = class extends BaseError2 {
        constructor({ yParity }) {
          super(`Invalid \`yParity\` value "${yParity}". Expected 0 or 1.`, {
            name: "InvalidYParityError"
          });
        }
      };
      InvalidSerializableTransactionError = class extends BaseError2 {
        constructor({ transaction }) {
          super("Cannot infer a transaction type from provided transaction.", {
            metaMessages: [
              "Provided Transaction:",
              "{",
              prettyPrint(transaction),
              "}",
              "",
              "To infer the type, either provide:",
              "- a `type` to the Transaction, or",
              "- an EIP-1559 Transaction with `maxFeePerGas`, or",
              "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
              "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
              "- an EIP-7702 Transaction with `authorizationList`, or",
              "- a Legacy Transaction with `gasPrice`"
            ],
            name: "InvalidSerializableTransactionError"
          });
        }
      };
      InvalidSerializedTransactionTypeError = class extends BaseError2 {
        serializedType;
        constructor({ serializedType }) {
          super(`Serialized transaction type "${serializedType}" is invalid.`, {
            name: "InvalidSerializedTransactionType"
          });
          this.serializedType = serializedType;
        }
      };
      InvalidSerializedTransactionError = class extends BaseError2 {
        serializedTransaction;
        type;
        constructor({
          attributes,
          serializedTransaction,
          type
        }) {
          const missing = Object.entries(attributes).map(([key, value]) => typeof value === "undefined" ? key : void 0).filter(Boolean);
          super(`Invalid serialized transaction of type "${type}" was provided.`, {
            metaMessages: [
              `Serialized Transaction: "${serializedTransaction}"`,
              missing.length > 0 ? `Missing Attributes: ${missing.join(", ")}` : ""
            ].filter(Boolean),
            name: "InvalidSerializedTransactionError"
          });
          this.serializedTransaction = serializedTransaction;
          this.type = type;
        }
      };
      InvalidStorageKeySizeError = class extends BaseError2 {
        constructor({ storageKey }) {
          super(
            `Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor(
              (storageKey.length - 2) / 2
            )} bytes.`,
            { name: "InvalidStorageKeySizeError" }
          );
        }
      };
      TransactionExecutionError = class extends BaseError2 {
        cause;
        constructor(cause, {
          account,
          docsPath: docsPath9,
          chain,
          data,
          gas,
          gasPrice,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to,
          value
        }) {
          const prettyArgs = prettyPrint({
            chain: chain && `${chain?.name} (id: ${chain?.id})`,
            from: account?.address,
            to,
            value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
            data,
            gas,
            gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
            maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
            maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
            nonce
          });
          super(cause.shortMessage, {
            cause,
            docsPath: docsPath9,
            metaMessages: [
              ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
              "Request Arguments:",
              prettyArgs
            ].filter(Boolean),
            name: "TransactionExecutionError"
          });
          this.cause = cause;
        }
      };
      TransactionNotFoundError = class extends BaseError2 {
        constructor({
          blockHash,
          blockNumber,
          blockTag,
          hash: hash3,
          index: index2
        }) {
          let identifier = "Transaction";
          if (blockTag && index2 !== void 0)
            identifier = `Transaction at block time "${blockTag}" at index "${index2}"`;
          if (blockHash && index2 !== void 0)
            identifier = `Transaction at block hash "${blockHash}" at index "${index2}"`;
          if (blockNumber && index2 !== void 0)
            identifier = `Transaction at block number "${blockNumber}" at index "${index2}"`;
          if (hash3) identifier = `Transaction with hash "${hash3}"`;
          super(`${identifier} could not be found.`, {
            name: "TransactionNotFoundError"
          });
        }
      };
      TransactionReceiptNotFoundError = class extends BaseError2 {
        constructor({ hash: hash3 }) {
          super(
            `Transaction receipt with hash "${hash3}" could not be found. The Transaction may not be processed on a block yet.`,
            {
              name: "TransactionReceiptNotFoundError"
            }
          );
        }
      };
      TransactionReceiptRevertedError = class extends BaseError2 {
        receipt;
        constructor({ receipt }) {
          super(`Transaction with hash "${receipt.transactionHash}" reverted.`, {
            metaMessages: [
              'The receipt marked the transaction as "reverted". This could mean that the function on the contract you are trying to call threw an error.',
              " ",
              "You can attempt to extract the revert reason by:",
              "- calling the `simulateContract` or `simulateCalls` Action with the `abi` and `functionName` of the contract",
              "- using the `call` Action with raw `data`"
            ],
            name: "TransactionReceiptRevertedError"
          });
          this.receipt = receipt;
        }
      };
      WaitForTransactionReceiptTimeoutError = class extends BaseError2 {
        constructor({ hash: hash3 }) {
          super(
            `Timed out while waiting for transaction with hash "${hash3}" to be confirmed.`,
            { name: "WaitForTransactionReceiptTimeoutError" }
          );
        }
      };
    }
  });

  // node_modules/viem/errors/utils.ts
  function getAbortError(signal) {
    if (signal?.reason) return signal.reason;
    if (typeof DOMException === "function")
      return new DOMException("This operation was aborted", "AbortError");
    const error = new Error("This operation was aborted");
    error.name = "AbortError";
    return error;
  }
  function isAbortError(error) {
    return typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
  }
  var getContractAddress, getUrl;
  var init_utils3 = __esm({
    "node_modules/viem/errors/utils.ts"() {
      getContractAddress = (address) => address;
      getUrl = (url) => {
        try {
          const parsed = new URL(url);
          if (!parsed.username && !parsed.password) return url;
          parsed.username = "";
          parsed.password = "";
          return parsed.toString();
        } catch {
          return url;
        }
      };
    }
  });

  // node_modules/viem/errors/contract.ts
  var CallExecutionError, ContractFunctionExecutionError, ContractFunctionRevertedError, ContractFunctionZeroDataError, CounterfactualDeploymentFailedError, RawContractError;
  var init_contract = __esm({
    "node_modules/viem/errors/contract.ts"() {
      init_parseAccount();
      init_solidity();
      init_decodeErrorResult();
      init_formatAbiItem2();
      init_formatAbiItemWithArgs();
      init_getAbiItem();
      init_formatEther();
      init_formatGwei();
      init_abi();
      init_base();
      init_stateOverride();
      init_transaction();
      init_utils3();
      CallExecutionError = class extends BaseError2 {
        cause;
        constructor(cause, {
          account: account_,
          docsPath: docsPath9,
          chain,
          data,
          gas,
          gasPrice,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to,
          value,
          stateOverride
        }) {
          const account = account_ ? parseAccount(account_) : void 0;
          let prettyArgs = prettyPrint({
            from: account?.address,
            to,
            value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
            data,
            gas,
            gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
            maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
            maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
            nonce
          });
          if (stateOverride) {
            prettyArgs += `
${prettyStateOverride(stateOverride)}`;
          }
          super(cause.shortMessage, {
            cause,
            docsPath: docsPath9,
            metaMessages: [
              ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
              "Raw Call Arguments:",
              prettyArgs
            ].filter(Boolean),
            name: "CallExecutionError"
          });
          this.cause = cause;
        }
      };
      ContractFunctionExecutionError = class extends BaseError2 {
        abi;
        args;
        cause;
        contractAddress;
        formattedArgs;
        functionName;
        sender;
        constructor(cause, {
          abi: abi2,
          args,
          contractAddress,
          docsPath: docsPath9,
          functionName,
          sender
        }) {
          const abiItem = getAbiItem({ abi: abi2, args, name: functionName });
          const formattedArgs = abiItem ? formatAbiItemWithArgs({
            abiItem,
            args,
            includeFunctionName: false,
            includeName: false
          }) : void 0;
          const functionWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
          const prettyArgs = prettyPrint({
            address: contractAddress && getContractAddress(contractAddress),
            function: functionWithParams,
            args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
            sender
          });
          super(
            cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`,
            {
              cause,
              docsPath: docsPath9,
              metaMessages: [
                ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
                prettyArgs && "Contract Call:",
                prettyArgs
              ].filter(Boolean),
              name: "ContractFunctionExecutionError"
            }
          );
          this.abi = abi2;
          this.args = args;
          this.cause = cause;
          this.contractAddress = contractAddress;
          this.functionName = functionName;
          this.sender = sender;
        }
      };
      ContractFunctionRevertedError = class extends BaseError2 {
        data;
        raw;
        reason;
        signature;
        constructor({
          abi: abi2,
          data,
          functionName,
          message,
          cause: error
        }) {
          let cause;
          let decodedData;
          let metaMessages;
          let reason;
          if (data && data !== "0x") {
            try {
              decodedData = decodeErrorResult({ abi: abi2, data, cause: error });
              const { abiItem, errorName, args: errorArgs } = decodedData;
              if (errorName === "Error") {
                reason = errorArgs[0];
              } else if (errorName === "Panic") {
                const [firstArg] = errorArgs;
                reason = panicReasons[firstArg];
              } else {
                const errorWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
                const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
                  abiItem,
                  args: errorArgs,
                  includeFunctionName: false,
                  includeName: false
                }) : void 0;
                metaMessages = [
                  errorWithParams ? `Error: ${errorWithParams}` : "",
                  formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
                ];
              }
            } catch (err) {
              cause = err;
            }
          } else if (message) reason = message;
          let signature;
          if (cause instanceof AbiErrorSignatureNotFoundError) {
            signature = cause.signature;
            metaMessages = [
              `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
              "Make sure you are using the correct ABI and that the error exists on it.",
              `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${signature}.`
            ];
          }
          super(
            reason && reason !== "execution reverted" || signature ? [
              `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
              reason || signature
            ].join("\n") : `The contract function "${functionName}" reverted.`,
            {
              cause: cause ?? error,
              metaMessages,
              name: "ContractFunctionRevertedError"
            }
          );
          this.data = decodedData;
          this.raw = data;
          this.reason = reason;
          this.signature = signature;
        }
      };
      ContractFunctionZeroDataError = class extends BaseError2 {
        constructor({
          functionName,
          cause
        }) {
          super(`The contract function "${functionName}" returned no data ("0x").`, {
            metaMessages: [
              "This could be due to any of the following:",
              `  - The contract does not have the function "${functionName}",`,
              "  - The parameters passed to the contract function may be invalid, or",
              "  - The address is not a contract."
            ],
            name: "ContractFunctionZeroDataError",
            cause
          });
        }
      };
      CounterfactualDeploymentFailedError = class extends BaseError2 {
        constructor({ factory }) {
          super(
            `Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`,
            {
              metaMessages: [
                "Please ensure:",
                "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
                "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
              ],
              name: "CounterfactualDeploymentFailedError"
            }
          );
        }
      };
      RawContractError = class extends BaseError2 {
        code = 3;
        data;
        constructor({
          data,
          message
        }) {
          super(message || "", { name: "RawContractError" });
          this.data = data;
        }
      };
    }
  });

  // node_modules/viem/errors/request.ts
  var HttpRequestError, ResponseBodyTooLargeError, WebSocketRequestError, RpcRequestError, SocketClosedError, TimeoutError;
  var init_request = __esm({
    "node_modules/viem/errors/request.ts"() {
      init_stringify();
      init_base();
      init_utils3();
      HttpRequestError = class extends BaseError2 {
        body;
        headers;
        status;
        url;
        constructor({
          body,
          cause,
          details,
          headers,
          status,
          url
        }) {
          super("HTTP request failed.", {
            cause,
            details,
            metaMessages: [
              status && `Status: ${status}`,
              `URL: ${getUrl(url)}`,
              body && `Request body: ${stringify(body)}`
            ].filter(Boolean),
            name: "HttpRequestError"
          });
          this.body = body;
          this.headers = headers;
          this.status = status;
          this.url = url;
        }
      };
      ResponseBodyTooLargeError = class extends BaseError2 {
        maxSize;
        size;
        constructor({ maxSize, size: size5 }) {
          super("HTTP response body exceeded the size limit.", {
            metaMessages: [`Max: ${maxSize} bytes`, `Received: ${size5} bytes`],
            name: "ResponseBodyTooLargeError"
          });
          this.maxSize = maxSize;
          this.size = size5;
        }
      };
      WebSocketRequestError = class extends BaseError2 {
        url;
        constructor({
          body,
          cause,
          details,
          url
        }) {
          super("WebSocket request failed.", {
            cause,
            details,
            metaMessages: [
              `URL: ${getUrl(url)}`,
              body && `Request body: ${stringify(body)}`
            ].filter(Boolean),
            name: "WebSocketRequestError"
          });
          this.url = url;
        }
      };
      RpcRequestError = class extends BaseError2 {
        code;
        data;
        url;
        constructor({
          body,
          error,
          url
        }) {
          super("RPC Request failed.", {
            cause: error,
            details: error.message,
            metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
            name: "RpcRequestError"
          });
          this.code = error.code;
          this.data = error.data;
          this.url = url;
        }
      };
      SocketClosedError = class extends BaseError2 {
        url;
        constructor({
          url
        } = {}) {
          super("The socket has been closed.", {
            metaMessages: [url && `URL: ${getUrl(url)}`].filter(Boolean),
            name: "SocketClosedError"
          });
          this.url = url;
        }
      };
      TimeoutError = class extends BaseError2 {
        url;
        constructor({
          body,
          url
        }) {
          super("The request took too long to respond.", {
            details: "The request timed out.",
            metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
            name: "TimeoutError"
          });
          this.url = url;
        }
      };
    }
  });

  // node_modules/viem/errors/rpc.ts
  var unknownErrorCode, RpcError, ProviderRpcError, ParseRpcError, InvalidRequestRpcError, MethodNotFoundRpcError, InvalidParamsRpcError, InternalRpcError, InvalidInputRpcError, ResourceNotFoundRpcError, ResourceUnavailableRpcError, TransactionRejectedRpcError, MethodNotSupportedRpcError, LimitExceededRpcError, JsonRpcVersionUnsupportedError, UserRejectedRequestError, UnauthorizedProviderError, UnsupportedProviderMethodError, ProviderDisconnectedError, ChainDisconnectedError, SwitchChainError, UnsupportedNonOptionalCapabilityError, UnsupportedChainIdError, DuplicateIdError, UnknownBundleIdError, BundleTooLargeError, AtomicReadyWalletRejectedUpgradeError, AtomicityNotSupportedError, WalletConnectSessionSettlementError, UnknownRpcError;
  var init_rpc = __esm({
    "node_modules/viem/errors/rpc.ts"() {
      init_base();
      init_request();
      unknownErrorCode = -1;
      RpcError = class extends BaseError2 {
        code;
        constructor(cause, {
          code,
          docsPath: docsPath9,
          metaMessages,
          name,
          shortMessage
        }) {
          super(shortMessage, {
            cause,
            docsPath: docsPath9,
            metaMessages: metaMessages || cause?.metaMessages,
            name: name || "RpcError"
          });
          this.name = name || cause.name;
          this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
        }
      };
      ProviderRpcError = class extends RpcError {
        data;
        constructor(cause, options) {
          super(cause, options);
          this.data = options.data;
        }
      };
      ParseRpcError = class _ParseRpcError extends RpcError {
        static code = -32700;
        constructor(cause) {
          super(cause, {
            code: _ParseRpcError.code,
            name: "ParseRpcError",
            shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
          });
        }
      };
      InvalidRequestRpcError = class _InvalidRequestRpcError extends RpcError {
        static code = -32600;
        constructor(cause) {
          super(cause, {
            code: _InvalidRequestRpcError.code,
            name: "InvalidRequestRpcError",
            shortMessage: "JSON is not a valid request object."
          });
        }
      };
      MethodNotFoundRpcError = class _MethodNotFoundRpcError extends RpcError {
        static code = -32601;
        constructor(cause, { method } = {}) {
          super(cause, {
            code: _MethodNotFoundRpcError.code,
            name: "MethodNotFoundRpcError",
            shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
          });
        }
      };
      InvalidParamsRpcError = class _InvalidParamsRpcError extends RpcError {
        static code = -32602;
        constructor(cause) {
          super(cause, {
            code: _InvalidParamsRpcError.code,
            name: "InvalidParamsRpcError",
            shortMessage: [
              "Invalid parameters were provided to the RPC method.",
              "Double check you have provided the correct parameters."
            ].join("\n")
          });
        }
      };
      InternalRpcError = class _InternalRpcError extends RpcError {
        static code = -32603;
        constructor(cause) {
          super(cause, {
            code: _InternalRpcError.code,
            name: "InternalRpcError",
            shortMessage: "An internal error was received."
          });
        }
      };
      InvalidInputRpcError = class _InvalidInputRpcError extends RpcError {
        static code = -32e3;
        constructor(cause) {
          super(cause, {
            code: _InvalidInputRpcError.code,
            name: "InvalidInputRpcError",
            shortMessage: [
              "Missing or invalid parameters.",
              "Double check you have provided the correct parameters."
            ].join("\n")
          });
        }
      };
      ResourceNotFoundRpcError = class _ResourceNotFoundRpcError extends RpcError {
        name = "ResourceNotFoundRpcError";
        static code = -32001;
        constructor(cause) {
          super(cause, {
            code: _ResourceNotFoundRpcError.code,
            name: "ResourceNotFoundRpcError",
            shortMessage: "Requested resource not found."
          });
        }
      };
      ResourceUnavailableRpcError = class _ResourceUnavailableRpcError extends RpcError {
        static code = -32002;
        constructor(cause) {
          super(cause, {
            code: _ResourceUnavailableRpcError.code,
            name: "ResourceUnavailableRpcError",
            shortMessage: "Requested resource not available."
          });
        }
      };
      TransactionRejectedRpcError = class _TransactionRejectedRpcError extends RpcError {
        static code = -32003;
        constructor(cause) {
          super(cause, {
            code: _TransactionRejectedRpcError.code,
            name: "TransactionRejectedRpcError",
            shortMessage: "Transaction creation failed."
          });
        }
      };
      MethodNotSupportedRpcError = class _MethodNotSupportedRpcError extends RpcError {
        static code = -32004;
        constructor(cause, { method } = {}) {
          super(cause, {
            code: _MethodNotSupportedRpcError.code,
            name: "MethodNotSupportedRpcError",
            shortMessage: `Method${method ? ` "${method}"` : ""} is not supported.`
          });
        }
      };
      LimitExceededRpcError = class _LimitExceededRpcError extends RpcError {
        static code = -32005;
        constructor(cause) {
          super(cause, {
            code: _LimitExceededRpcError.code,
            name: "LimitExceededRpcError",
            shortMessage: "Request exceeds defined limit."
          });
        }
      };
      JsonRpcVersionUnsupportedError = class _JsonRpcVersionUnsupportedError extends RpcError {
        static code = -32006;
        constructor(cause) {
          super(cause, {
            code: _JsonRpcVersionUnsupportedError.code,
            name: "JsonRpcVersionUnsupportedError",
            shortMessage: "Version of JSON-RPC protocol is not supported."
          });
        }
      };
      UserRejectedRequestError = class _UserRejectedRequestError extends ProviderRpcError {
        static code = 4001;
        constructor(cause) {
          super(cause, {
            code: _UserRejectedRequestError.code,
            name: "UserRejectedRequestError",
            shortMessage: "User rejected the request."
          });
        }
      };
      UnauthorizedProviderError = class _UnauthorizedProviderError extends ProviderRpcError {
        static code = 4100;
        constructor(cause) {
          super(cause, {
            code: _UnauthorizedProviderError.code,
            name: "UnauthorizedProviderError",
            shortMessage: "The requested method and/or account has not been authorized by the user."
          });
        }
      };
      UnsupportedProviderMethodError = class _UnsupportedProviderMethodError extends ProviderRpcError {
        static code = 4200;
        constructor(cause, { method } = {}) {
          super(cause, {
            code: _UnsupportedProviderMethodError.code,
            name: "UnsupportedProviderMethodError",
            shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
          });
        }
      };
      ProviderDisconnectedError = class _ProviderDisconnectedError extends ProviderRpcError {
        static code = 4900;
        constructor(cause) {
          super(cause, {
            code: _ProviderDisconnectedError.code,
            name: "ProviderDisconnectedError",
            shortMessage: "The Provider is disconnected from all chains."
          });
        }
      };
      ChainDisconnectedError = class _ChainDisconnectedError extends ProviderRpcError {
        static code = 4901;
        constructor(cause) {
          super(cause, {
            code: _ChainDisconnectedError.code,
            name: "ChainDisconnectedError",
            shortMessage: "The Provider is not connected to the requested chain."
          });
        }
      };
      SwitchChainError = class _SwitchChainError extends ProviderRpcError {
        static code = 4902;
        constructor(cause) {
          super(cause, {
            code: _SwitchChainError.code,
            name: "SwitchChainError",
            shortMessage: "An error occurred when attempting to switch chain."
          });
        }
      };
      UnsupportedNonOptionalCapabilityError = class _UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
        static code = 5700;
        constructor(cause) {
          super(cause, {
            code: _UnsupportedNonOptionalCapabilityError.code,
            name: "UnsupportedNonOptionalCapabilityError",
            shortMessage: "This Wallet does not support a capability that was not marked as optional."
          });
        }
      };
      UnsupportedChainIdError = class _UnsupportedChainIdError extends ProviderRpcError {
        static code = 5710;
        constructor(cause) {
          super(cause, {
            code: _UnsupportedChainIdError.code,
            name: "UnsupportedChainIdError",
            shortMessage: "This Wallet does not support the requested chain ID."
          });
        }
      };
      DuplicateIdError = class _DuplicateIdError extends ProviderRpcError {
        static code = 5720;
        constructor(cause) {
          super(cause, {
            code: _DuplicateIdError.code,
            name: "DuplicateIdError",
            shortMessage: "There is already a bundle submitted with this ID."
          });
        }
      };
      UnknownBundleIdError = class _UnknownBundleIdError extends ProviderRpcError {
        static code = 5730;
        constructor(cause) {
          super(cause, {
            code: _UnknownBundleIdError.code,
            name: "UnknownBundleIdError",
            shortMessage: "This bundle id is unknown / has not been submitted"
          });
        }
      };
      BundleTooLargeError = class _BundleTooLargeError extends ProviderRpcError {
        static code = 5740;
        constructor(cause) {
          super(cause, {
            code: _BundleTooLargeError.code,
            name: "BundleTooLargeError",
            shortMessage: "The call bundle is too large for the Wallet to process."
          });
        }
      };
      AtomicReadyWalletRejectedUpgradeError = class _AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
        static code = 5750;
        constructor(cause) {
          super(cause, {
            code: _AtomicReadyWalletRejectedUpgradeError.code,
            name: "AtomicReadyWalletRejectedUpgradeError",
            shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
          });
        }
      };
      AtomicityNotSupportedError = class _AtomicityNotSupportedError extends ProviderRpcError {
        static code = 5760;
        constructor(cause) {
          super(cause, {
            code: _AtomicityNotSupportedError.code,
            name: "AtomicityNotSupportedError",
            shortMessage: "The wallet does not support atomic execution but the request requires it."
          });
        }
      };
      WalletConnectSessionSettlementError = class _WalletConnectSessionSettlementError extends ProviderRpcError {
        static code = 7e3;
        constructor(cause) {
          super(cause, {
            code: _WalletConnectSessionSettlementError.code,
            name: "WalletConnectSessionSettlementError",
            shortMessage: "WalletConnect session settlement failed."
          });
        }
      };
      UnknownRpcError = class extends RpcError {
        constructor(cause) {
          super(cause, {
            name: "UnknownRpcError",
            shortMessage: "An unknown RPC error occurred."
          });
        }
      };
    }
  });

  // node_modules/@noble/hashes/esm/_md.js
  function setBigUint64(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n2 = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n2 & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD, SHA256_IV;
  var init_md = __esm({
    "node_modules/@noble/hashes/esm/_md.js"() {
      init_utils2();
      HashMD = class extends Hash {
        constructor(blockLen, outputLen, padOffset, isLE2) {
          super();
          this.finished = false;
          this.length = 0;
          this.pos = 0;
          this.destroyed = false;
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE2;
          this.buffer = new Uint8Array(blockLen);
          this.view = createView(this.buffer);
        }
        update(data) {
          aexists(this);
          data = toBytes2(data);
          abytes(data);
          const { view, buffer: buffer2, blockLen } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = createView(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              continue;
            }
            buffer2.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
        digestInto(out) {
          aexists(this);
          aoutput(out, this);
          this.finished = true;
          const { buffer: buffer2, view, blockLen, isLE: isLE2 } = this;
          let { pos } = this;
          buffer2[pos++] = 128;
          clean(this.buffer.subarray(pos));
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          for (let i = pos; i < blockLen; i++)
            buffer2[i] = 0;
          setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
          this.process(view, 0);
          const oview = createView(out);
          const len = this.outputLen;
          if (len % 4)
            throw new Error("_sha2: outputLen should be aligned to 32bit");
          const outLen = len / 4;
          const state = this.get();
          if (outLen > state.length)
            throw new Error("_sha2: outputLen bigger than state");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE2);
        }
        digest() {
          const { buffer: buffer2, outputLen } = this;
          this.digestInto(buffer2);
          const res = buffer2.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneInto(to) {
          to || (to = new this.constructor());
          to.set(...this.get());
          const { blockLen, buffer: buffer2, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (length % blockLen)
            to.buffer.set(buffer2);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
      };
      SHA256_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
    }
  });

  // node_modules/@noble/hashes/esm/sha2.js
  var SHA256_K, SHA256_W, SHA256, sha256;
  var init_sha2 = __esm({
    "node_modules/@noble/hashes/esm/sha2.js"() {
      init_md();
      init_utils2();
      SHA256_K = /* @__PURE__ */ Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      SHA256 = class extends HashMD {
        constructor(outputLen = 32) {
          super(64, outputLen, 8, false);
          this.A = SHA256_IV[0] | 0;
          this.B = SHA256_IV[1] | 0;
          this.C = SHA256_IV[2] | 0;
          this.D = SHA256_IV[3] | 0;
          this.E = SHA256_IV[4] | 0;
          this.F = SHA256_IV[5] | 0;
          this.G = SHA256_IV[6] | 0;
          this.H = SHA256_IV[7] | 0;
        }
        get() {
          const { A, B, C, D, E, F, G, H } = this;
          return [A, B, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
          for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
          }
          let { A, B, C, D, E, F, G, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = sigma0 + Maj(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B = B + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B, C, D, E, F, G, H);
        }
        roundClean() {
          clean(SHA256_W);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          clean(this.buffer);
        }
      };
      sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
    }
  });

  // node_modules/@noble/hashes/esm/hmac.js
  var HMAC, hmac;
  var init_hmac = __esm({
    "node_modules/@noble/hashes/esm/hmac.js"() {
      init_utils2();
      HMAC = class extends Hash {
        constructor(hash3, _key) {
          super();
          this.finished = false;
          this.destroyed = false;
          ahash(hash3);
          const key = toBytes2(_key);
          this.iHash = hash3.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("Expected instance of class which extends utils.Hash");
          this.blockLen = this.iHash.blockLen;
          this.outputLen = this.iHash.outputLen;
          const blockLen = this.blockLen;
          const pad4 = new Uint8Array(blockLen);
          pad4.set(key.length > blockLen ? hash3.create().update(key).digest() : key);
          for (let i = 0; i < pad4.length; i++)
            pad4[i] ^= 54;
          this.iHash.update(pad4);
          this.oHash = hash3.create();
          for (let i = 0; i < pad4.length; i++)
            pad4[i] ^= 54 ^ 92;
          this.oHash.update(pad4);
          clean(pad4);
        }
        update(buf) {
          aexists(this);
          this.iHash.update(buf);
          return this;
        }
        digestInto(out) {
          aexists(this);
          abytes(out, this.outputLen);
          this.finished = true;
          this.iHash.digestInto(out);
          this.oHash.update(out);
          this.oHash.digestInto(out);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to || (to = Object.create(Object.getPrototypeOf(this), {}));
          const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
          to.oHash = oHash._cloneInto(to.oHash);
          to.iHash = iHash._cloneInto(to.iHash);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
        destroy() {
          this.destroyed = true;
          this.oHash.destroy();
          this.iHash.destroy();
        }
      };
      hmac = (hash3, key, message) => new HMAC(hash3, key).update(message).digest();
      hmac.create = (hash3, key) => new HMAC(hash3, key);
    }
  });

  // node_modules/@noble/curves/esm/abstract/utils.js
  function isBytes2(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function abytes2(item) {
    if (!isBytes2(item))
      throw new Error("Uint8Array expected");
  }
  function abool(title, value) {
    if (typeof value !== "boolean")
      throw new Error(title + " boolean expected, got " + value);
  }
  function numberToHexUnpadded(num2) {
    const hex = num2.toString(16);
    return hex.length & 1 ? "0" + hex : hex;
  }
  function hexToNumber2(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return hex === "" ? _0n2 : BigInt("0x" + hex);
  }
  function bytesToHex2(bytes) {
    abytes2(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += hexes2[bytes[i]];
    }
    return hex;
  }
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  function hexToBytes2(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    if (hasHexBuiltin)
      return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber2(bytesToHex2(bytes));
  }
  function bytesToNumberLE(bytes) {
    abytes2(bytes);
    return hexToNumber2(bytesToHex2(Uint8Array.from(bytes).reverse()));
  }
  function numberToBytesBE(n, len) {
    return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
  }
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === "string") {
      try {
        res = hexToBytes2(hex);
      } catch (e) {
        throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
      }
    } else if (isBytes2(hex)) {
      res = Uint8Array.from(hex);
    } else {
      throw new Error(title + " must be hex string or Uint8Array");
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(title + " of length " + expectedLength + " expected, got " + len);
    return res;
  }
  function concatBytes3(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes2(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad4 = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad4);
      pad4 += a.length;
    }
    return res;
  }
  function utf8ToBytes2(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n2; n >>= _1n2, len += 1)
      ;
    return len;
  }
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== "number" || hashLen < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset2 = () => {
      v.fill(1);
      k.fill(0);
      i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b);
    const reseed = (seed = u8n(0)) => {
      k = h(u8fr([0]), seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(u8fr([1]), seed);
      v = h();
    };
    const gen2 = () => {
      if (i++ >= 1e3)
        throw new Error("drbg: tried 1000 values");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes3(...out);
    };
    const genUntil = (seed, pred) => {
      reset2();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen2())))
        reseed();
      reset2();
      return res;
    };
    return genUntil;
  }
  function validateObject(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
      const checkVal = validatorFns[type];
      if (typeof checkVal !== "function")
        throw new Error("invalid validator function");
      const val = object[fieldName];
      if (isOptional && val === void 0)
        return;
      if (!checkVal(val, object)) {
        throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
      }
    };
    for (const [fieldName, type] of Object.entries(validators))
      checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
      checkField(fieldName, type, true);
    return object;
  }
  function memoized(fn) {
    const map = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map.set(arg, computed);
      return computed;
    };
  }
  var _0n2, _1n2, hasHexBuiltin, hexes2, asciis, isPosBig, bitMask, u8n, u8fr, validatorFns;
  var init_utils4 = __esm({
    "node_modules/@noble/curves/esm/abstract/utils.js"() {
      _0n2 = /* @__PURE__ */ BigInt(0);
      _1n2 = /* @__PURE__ */ BigInt(1);
      hasHexBuiltin = // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function";
      hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
      isPosBig = (n) => typeof n === "bigint" && _0n2 <= n;
      bitMask = (n) => (_1n2 << BigInt(n)) - _1n2;
      u8n = (len) => new Uint8Array(len);
      u8fr = (arr) => Uint8Array.from(arr);
      validatorFns = {
        bigint: (val) => typeof val === "bigint",
        function: (val) => typeof val === "function",
        boolean: (val) => typeof val === "boolean",
        string: (val) => typeof val === "string",
        stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
        isSafeInteger: (val) => Number.isSafeInteger(val),
        array: (val) => Array.isArray(val),
        field: (val, object) => object.Fp.isValid(val),
        hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
      };
    }
  });

  // node_modules/@noble/curves/esm/abstract/modular.js
  function mod(a, b) {
    const result = a % b;
    return result >= _0n3 ? result : b + result;
  }
  function pow2(x, power, modulo) {
    let res = x;
    while (power-- > _0n3) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number, modulo) {
    if (number === _0n3)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n3)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n3, y = _1n3, u = _1n3, v = _0n3;
    while (a !== _0n3) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n3)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  function sqrt3mod4(Fp, n) {
    const p1div4 = (Fp.ORDER + _1n3) / _4n;
    const root = Fp.pow(n, p1div4);
    if (!Fp.eql(Fp.sqr(root), n))
      throw new Error("Cannot find square root");
    return root;
  }
  function sqrt5mod8(Fp, n) {
    const p5div8 = (Fp.ORDER - _5n) / _8n;
    const n2 = Fp.mul(n, _2n2);
    const v = Fp.pow(n2, p5div8);
    const nv = Fp.mul(n, v);
    const i = Fp.mul(Fp.mul(nv, _2n2), v);
    const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
    if (!Fp.eql(Fp.sqr(root), n))
      throw new Error("Cannot find square root");
    return root;
  }
  function tonelliShanks(P) {
    if (P < BigInt(3))
      throw new Error("sqrt is not defined for small field");
    let Q = P - _1n3;
    let S = 0;
    while (Q % _2n2 === _0n3) {
      Q /= _2n2;
      S++;
    }
    let Z = _2n2;
    const _Fp = Field(P);
    while (FpLegendre(_Fp, Z) === 1) {
      if (Z++ > 1e3)
        throw new Error("Cannot find square root: probably non-prime P");
    }
    if (S === 1)
      return sqrt3mod4;
    let cc = _Fp.pow(Z, Q);
    const Q1div2 = (Q + _1n3) / _2n2;
    return function tonelliSlow(Fp, n) {
      if (Fp.is0(n))
        return n;
      if (FpLegendre(Fp, n) !== 1)
        throw new Error("Cannot find square root");
      let M = S;
      let c = Fp.mul(Fp.ONE, cc);
      let t = Fp.pow(n, Q);
      let R = Fp.pow(n, Q1div2);
      while (!Fp.eql(t, Fp.ONE)) {
        if (Fp.is0(t))
          return Fp.ZERO;
        let i = 1;
        let t_tmp = Fp.sqr(t);
        while (!Fp.eql(t_tmp, Fp.ONE)) {
          i++;
          t_tmp = Fp.sqr(t_tmp);
          if (i === M)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n3 << BigInt(M - i - 1);
        const b = Fp.pow(c, exponent);
        M = i;
        c = Fp.sqr(b);
        t = Fp.mul(t, c);
        R = Fp.mul(R, b);
      }
      return R;
    };
  }
  function FpSqrt(P) {
    if (P % _4n === _3n)
      return sqrt3mod4;
    if (P % _8n === _5n)
      return sqrt5mod8;
    return tonelliShanks(P);
  }
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "isSafeInteger",
      BITS: "isSafeInteger"
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
      map[val] = "function";
      return map;
    }, initial);
    return validateObject(field, opts);
  }
  function FpPow(Fp, num2, power) {
    if (power < _0n3)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n3)
      return Fp.ONE;
    if (power === _1n3)
      return num2;
    let p = Fp.ONE;
    let d = num2;
    while (power > _0n3) {
      if (power & _1n3)
        p = Fp.mul(p, d);
      d = Fp.sqr(d);
      power >>= _1n3;
    }
    return p;
  }
  function FpInvertBatch(Fp, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num2, i) => {
      if (Fp.is0(num2))
        return acc;
      inverted[i] = acc;
      return Fp.mul(acc, num2);
    }, Fp.ONE);
    const invertedAcc = Fp.inv(multipliedAcc);
    nums.reduceRight((acc, num2, i) => {
      if (Fp.is0(num2))
        return acc;
      inverted[i] = Fp.mul(acc, inverted[i]);
      return Fp.mul(acc, num2);
    }, invertedAcc);
    return inverted;
  }
  function FpLegendre(Fp, n) {
    const p1mod2 = (Fp.ORDER - _1n3) / _2n2;
    const powered = Fp.pow(n, p1mod2);
    const yes = Fp.eql(powered, Fp.ONE);
    const zero = Fp.eql(powered, Fp.ZERO);
    const no = Fp.eql(powered, Fp.neg(Fp.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function nLength(n, nBitLength) {
    if (nBitLength !== void 0)
      anumber(nBitLength);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
    if (ORDER <= _0n3)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
    if (BYTES > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let sqrtP;
    const f = Object.freeze({
      ORDER,
      isLE: isLE2,
      BITS,
      BYTES,
      MASK: bitMask(BITS),
      ZERO: _0n3,
      ONE: _1n3,
      create: (num2) => mod(num2, ORDER),
      isValid: (num2) => {
        if (typeof num2 !== "bigint")
          throw new Error("invalid field element: expected bigint, got " + typeof num2);
        return _0n3 <= num2 && num2 < ORDER;
      },
      is0: (num2) => num2 === _0n3,
      isOdd: (num2) => (num2 & _1n3) === _1n3,
      neg: (num2) => mod(-num2, ORDER),
      eql: (lhs, rhs) => lhs === rhs,
      sqr: (num2) => mod(num2 * num2, ORDER),
      add: (lhs, rhs) => mod(lhs + rhs, ORDER),
      sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
      mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
      pow: (num2, power) => FpPow(f, num2, power),
      div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
      // Same as above, but doesn't normalize
      sqrN: (num2) => num2 * num2,
      addN: (lhs, rhs) => lhs + rhs,
      subN: (lhs, rhs) => lhs - rhs,
      mulN: (lhs, rhs) => lhs * rhs,
      inv: (num2) => invert(num2, ORDER),
      sqrt: redef.sqrt || ((n) => {
        if (!sqrtP)
          sqrtP = FpSqrt(ORDER);
        return sqrtP(f, n);
      }),
      toBytes: (num2) => isLE2 ? numberToBytesLE(num2, BYTES) : numberToBytesBE(num2, BYTES),
      fromBytes: (bytes) => {
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        return isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
      },
      // TODO: we don't need it here, move out to separate fn
      invertBatch: (lst) => FpInvertBatch(f, lst),
      // We can't move this out because Fp6, Fp12 implement it
      // and it's unclear what to return in there.
      cmov: (a, b, c) => c ? b : a
    });
    return Object.freeze(f);
  }
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  function mapHashToField(key, fieldOrder, isLE2 = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num2 = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
    const reduced = mod(num2, fieldOrder - _1n3) + _1n3;
    return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }
  var _0n3, _1n3, _2n2, _3n, _4n, _5n, _8n, FIELD_FIELDS;
  var init_modular = __esm({
    "node_modules/@noble/curves/esm/abstract/modular.js"() {
      init_utils2();
      init_utils4();
      _0n3 = BigInt(0);
      _1n3 = BigInt(1);
      _2n2 = /* @__PURE__ */ BigInt(2);
      _3n = /* @__PURE__ */ BigInt(3);
      _4n = /* @__PURE__ */ BigInt(4);
      _5n = /* @__PURE__ */ BigInt(5);
      _8n = /* @__PURE__ */ BigInt(8);
      FIELD_FIELDS = [
        "create",
        "isValid",
        "is0",
        "neg",
        "inv",
        "sqrt",
        "sqr",
        "eql",
        "add",
        "sub",
        "mul",
        "pow",
        "div",
        "addN",
        "subN",
        "mulN",
        "sqrN"
      ];
    }
  });

  // node_modules/@noble/curves/esm/abstract/curve.js
  function constTimeNegate(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  function calcWOpts(W, scalarBits) {
    validateW(W, scalarBits);
    const windows = Math.ceil(scalarBits / W) + 1;
    const windowSize = 2 ** (W - 1);
    const maxNumber = 2 ** W;
    const mask = bitMask(W);
    const shiftBy = BigInt(W);
    return { windows, windowSize, mask, maxNumber, shiftBy };
  }
  function calcOffsets(n, window2, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n & mask);
    let nextN = n >> shiftBy;
    if (wbits > windowSize) {
      wbits -= maxNumber;
      nextN += _1n4;
    }
    const offsetStart = window2 * windowSize;
    const offset = offsetStart + Math.abs(wbits) - 1;
    const isZero = wbits === 0;
    const isNeg = wbits < 0;
    const isNegF = window2 % 2 !== 0;
    const offsetF = offsetStart;
    return { nextN, offset, isZero, isNeg, isNegF, offsetF };
  }
  function validateMSMPoints(points, c) {
    if (!Array.isArray(points))
      throw new Error("array expected");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      if (!field.isValid(s))
        throw new Error("invalid scalar at index " + i);
    });
  }
  function getW(P) {
    return pointWindowSizes.get(P) || 1;
  }
  function wNAF(c, bits) {
    return {
      constTimeNegate,
      hasPrecomputes(elm) {
        return getW(elm) !== 1;
      },
      // non-const time multiplication ladder
      unsafeLadder(elm, n, p = c.ZERO) {
        let d = elm;
        while (n > _0n4) {
          if (n & _1n4)
            p = p.add(d);
          d = d.double();
          n >>= _1n4;
        }
        return p;
      },
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @param elm Point instance
       * @param W window size
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(elm, W) {
        const { windows, windowSize } = calcWOpts(W, bits);
        const points = [];
        let p = elm;
        let base = p;
        for (let window2 = 0; window2 < windows; window2++) {
          base = p;
          points.push(base);
          for (let i = 1; i < windowSize; i++) {
            base = base.add(p);
            points.push(base);
          }
          p = base.double();
        }
        return points;
      },
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @returns real and fake (for const-time) points
       */
      wNAF(W, precomputes, n) {
        let p = c.ZERO;
        let f = c.BASE;
        const wo = calcWOpts(W, bits);
        for (let window2 = 0; window2 < wo.windows; window2++) {
          const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window2, wo);
          n = nextN;
          if (isZero) {
            f = f.add(constTimeNegate(isNegF, precomputes[offsetF]));
          } else {
            p = p.add(constTimeNegate(isNeg, precomputes[offset]));
          }
        }
        return { p, f };
      },
      /**
       * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @param acc accumulator point to add result of multiplication
       * @returns point
       */
      wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
        const wo = calcWOpts(W, bits);
        for (let window2 = 0; window2 < wo.windows; window2++) {
          if (n === _0n4)
            break;
          const { nextN, offset, isZero, isNeg } = calcOffsets(n, window2, wo);
          n = nextN;
          if (isZero) {
            continue;
          } else {
            const item = precomputes[offset];
            acc = acc.add(isNeg ? item.negate() : item);
          }
        }
        return acc;
      },
      getPrecomputes(W, P, transform) {
        let comp = pointPrecomputes.get(P);
        if (!comp) {
          comp = this.precomputeWindow(P, W);
          if (W !== 1)
            pointPrecomputes.set(P, transform(comp));
        }
        return comp;
      },
      wNAFCached(P, n, transform) {
        const W = getW(P);
        return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
      },
      wNAFCachedUnsafe(P, n, transform, prev) {
        const W = getW(P);
        if (W === 1)
          return this.unsafeLadder(P, n, prev);
        return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
      },
      // We calculate precomputes for elliptic curve point multiplication
      // using windowed method. This specifies window size and
      // stores precomputed values. Usually only base point would be precomputed.
      setWindowSize(P, W) {
        validateW(W, bits);
        pointWindowSizes.set(P, W);
        pointPrecomputes.delete(P);
      }
    };
  }
  function pippenger(c, fieldN, points, scalars) {
    validateMSMPoints(points, c);
    validateMSMScalars(scalars, fieldN);
    const plength = points.length;
    const slength = scalars.length;
    if (plength !== slength)
      throw new Error("arrays of points and scalars must have equal length");
    const zero = c.ZERO;
    const wbits = bitLen(BigInt(plength));
    let windowSize = 1;
    if (wbits > 12)
      windowSize = wbits - 3;
    else if (wbits > 4)
      windowSize = wbits - 2;
    else if (wbits > 0)
      windowSize = 2;
    const MASK = bitMask(windowSize);
    const buckets = new Array(Number(MASK) + 1).fill(zero);
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(zero);
      for (let j = 0; j < slength; j++) {
        const scalar = scalars[j];
        const wbits2 = Number(scalar >> BigInt(i) & MASK);
        buckets[wbits2] = buckets[wbits2].add(points[j]);
      }
      let resI = zero;
      for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
        sumI = sumI.add(buckets[j]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j = 0; j < windowSize; j++)
          sum = sum.double();
    }
    return sum;
  }
  function validateBasic(curve) {
    validateField(curve.Fp);
    validateObject(curve, {
      n: "bigint",
      h: "bigint",
      Gx: "field",
      Gy: "field"
    }, {
      nBitLength: "isSafeInteger",
      nByteLength: "isSafeInteger"
    });
    return Object.freeze({
      ...nLength(curve.n, curve.nBitLength),
      ...curve,
      ...{ p: curve.Fp.ORDER }
    });
  }
  var _0n4, _1n4, pointPrecomputes, pointWindowSizes;
  var init_curve = __esm({
    "node_modules/@noble/curves/esm/abstract/curve.js"() {
      init_modular();
      init_utils4();
      _0n4 = BigInt(0);
      _1n4 = BigInt(1);
      pointPrecomputes = /* @__PURE__ */ new WeakMap();
      pointWindowSizes = /* @__PURE__ */ new WeakMap();
    }
  });

  // node_modules/@noble/curves/esm/abstract/weierstrass.js
  function validateSigVerOpts(opts) {
    if (opts.lowS !== void 0)
      abool("lowS", opts.lowS);
    if (opts.prehash !== void 0)
      abool("prehash", opts.prehash);
  }
  function validatePointOpts(curve) {
    const opts = validateBasic(curve);
    validateObject(opts, {
      a: "field",
      b: "field"
    }, {
      allowInfinityPoint: "boolean",
      allowedPrivateKeyLengths: "array",
      clearCofactor: "function",
      fromBytes: "function",
      isTorsionFree: "function",
      toBytes: "function",
      wrapPrivateKey: "boolean"
    });
    const { endo, Fp, a } = opts;
    if (endo) {
      if (!Fp.eql(a, Fp.ZERO)) {
        throw new Error("invalid endo: CURVE.a must be 0");
      }
      if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
        throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
      }
    }
    return Object.freeze({ ...opts });
  }
  function numToSizedHex(num2, size5) {
    return bytesToHex2(numberToBytesBE(num2, size5));
  }
  function weierstrassPoints(opts) {
    const CURVE = validatePointOpts(opts);
    const { Fp } = CURVE;
    const Fn = Field(CURVE.n, CURVE.nBitLength);
    const toBytes4 = CURVE.toBytes || ((_c, point, _isCompressed) => {
      const a = point.toAffine();
      return concatBytes3(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
    });
    const fromBytes5 = CURVE.fromBytes || ((bytes) => {
      const tail = bytes.subarray(1);
      const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
      const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
      return { x, y };
    });
    function weierstrassEquation(x) {
      const { a, b } = CURVE;
      const x2 = Fp.sqr(x);
      const x3 = Fp.mul(x2, x);
      return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
    }
    function isValidXY(x, y) {
      const left = Fp.sqr(y);
      const right = weierstrassEquation(x);
      return Fp.eql(left, right);
    }
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
    const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
    if (Fp.is0(Fp.add(_4a3, _27b2)))
      throw new Error("bad curve params: a or b");
    function isWithinCurveOrder(num2) {
      return inRange(num2, _1n5, CURVE.n);
    }
    function normPrivateKeyToScalar(key) {
      const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
      if (lengths && typeof key !== "bigint") {
        if (isBytes2(key))
          key = bytesToHex2(key);
        if (typeof key !== "string" || !lengths.includes(key.length))
          throw new Error("invalid private key");
        key = key.padStart(nByteLength * 2, "0");
      }
      let num2;
      try {
        num2 = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
      } catch (error) {
        throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
      }
      if (wrapPrivateKey)
        num2 = mod(num2, N);
      aInRange("private key", num2, _1n5, N);
      return num2;
    }
    function aprjpoint(other) {
      if (!(other instanceof Point2))
        throw new Error("ProjectivePoint expected");
    }
    const toAffineMemo = memoized((p, iz) => {
      const { px: x, py: y, pz: z } = p;
      if (Fp.eql(z, Fp.ONE))
        return { x, y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(z);
      const ax = Fp.mul(x, iz);
      const ay = Fp.mul(y, iz);
      const zz = Fp.mul(z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    });
    const assertValidMemo = memoized((p) => {
      if (p.is0()) {
        if (CURVE.allowInfinityPoint && !Fp.is0(p.py))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not FE");
      if (!isValidXY(x, y))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    class Point2 {
      constructor(px, py, pz) {
        if (px == null || !Fp.isValid(px))
          throw new Error("x required");
        if (py == null || !Fp.isValid(py) || Fp.is0(py))
          throw new Error("y required");
        if (pz == null || !Fp.isValid(pz))
          throw new Error("z required");
        this.px = px;
        this.py = py;
        this.pz = pz;
        Object.freeze(this);
      }
      // Does not validate if the point is on-curve.
      // Use fromHex instead, or call assertValidity() later.
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point2)
          throw new Error("projective point not allowed");
        const is0 = (i) => Fp.eql(i, Fp.ZERO);
        if (is0(x) && is0(y))
          return Point2.ZERO;
        return new Point2(x, y, Fp.ONE);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       * Takes a bunch of Projective Points but executes only one
       * inversion on all of them. Inversion is very slow operation,
       * so this improves performance massively.
       * Optimization: converts a list of projective points to a list of identical points with Z=1.
       */
      static normalizeZ(points) {
        const toInv = FpInvertBatch(Fp, points.map((p) => p.pz));
        return points.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
      }
      /**
       * Converts hash string or Uint8Array to Point.
       * @param hex short/long ECDSA hex
       */
      static fromHex(hex) {
        const P = Point2.fromAffine(fromBytes5(ensureBytes("pointHex", hex)));
        P.assertValidity();
        return P;
      }
      // Multiplies generator point by privateKey.
      static fromPrivateKey(privateKey) {
        return Point2.BASE.multiply(normPrivateKeyToScalar(privateKey));
      }
      // Multiscalar Multiplication
      static msm(points, scalars) {
        return pippenger(Point2, Fn, points, scalars);
      }
      // "Private method", don't use it directly
      _setWindowSize(windowSize) {
        wnaf.setWindowSize(this, windowSize);
      }
      // A point on curve is valid if it conforms to equation.
      assertValidity() {
        assertValidMemo(this);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (Fp.isOdd)
          return !Fp.isOdd(y);
        throw new Error("Field doesn't support isOdd");
      }
      /**
       * Compare one point to another.
       */
      equals(other) {
        aprjpoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
        const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
        return U1 && U2;
      }
      /**
       * Flips point to one corresponding to (x, -y) in Affine coordinates.
       */
      negate() {
        return new Point2(this.px, Fp.neg(this.py), this.pz);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a, b } = CURVE;
        const b3 = Fp.mul(b, _3n2);
        const { px: X1, py: Y1, pz: Z1 } = this;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        let t0 = Fp.mul(X1, X1);
        let t1 = Fp.mul(Y1, Y1);
        let t2 = Fp.mul(Z1, Z1);
        let t3 = Fp.mul(X1, Y1);
        t3 = Fp.add(t3, t3);
        Z3 = Fp.mul(X1, Z1);
        Z3 = Fp.add(Z3, Z3);
        X3 = Fp.mul(a, Z3);
        Y3 = Fp.mul(b3, t2);
        Y3 = Fp.add(X3, Y3);
        X3 = Fp.sub(t1, Y3);
        Y3 = Fp.add(t1, Y3);
        Y3 = Fp.mul(X3, Y3);
        X3 = Fp.mul(t3, X3);
        Z3 = Fp.mul(b3, Z3);
        t2 = Fp.mul(a, t2);
        t3 = Fp.sub(t0, t2);
        t3 = Fp.mul(a, t3);
        t3 = Fp.add(t3, Z3);
        Z3 = Fp.add(t0, t0);
        t0 = Fp.add(Z3, t0);
        t0 = Fp.add(t0, t2);
        t0 = Fp.mul(t0, t3);
        Y3 = Fp.add(Y3, t0);
        t2 = Fp.mul(Y1, Z1);
        t2 = Fp.add(t2, t2);
        t0 = Fp.mul(t2, t3);
        X3 = Fp.sub(X3, t0);
        Z3 = Fp.mul(t2, t1);
        Z3 = Fp.add(Z3, Z3);
        Z3 = Fp.add(Z3, Z3);
        return new Point2(X3, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        aprjpoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        const a = CURVE.a;
        const b3 = Fp.mul(CURVE.b, _3n2);
        let t0 = Fp.mul(X1, X2);
        let t1 = Fp.mul(Y1, Y2);
        let t2 = Fp.mul(Z1, Z2);
        let t3 = Fp.add(X1, Y1);
        let t4 = Fp.add(X2, Y2);
        t3 = Fp.mul(t3, t4);
        t4 = Fp.add(t0, t1);
        t3 = Fp.sub(t3, t4);
        t4 = Fp.add(X1, Z1);
        let t5 = Fp.add(X2, Z2);
        t4 = Fp.mul(t4, t5);
        t5 = Fp.add(t0, t2);
        t4 = Fp.sub(t4, t5);
        t5 = Fp.add(Y1, Z1);
        X3 = Fp.add(Y2, Z2);
        t5 = Fp.mul(t5, X3);
        X3 = Fp.add(t1, t2);
        t5 = Fp.sub(t5, X3);
        Z3 = Fp.mul(a, t4);
        X3 = Fp.mul(b3, t2);
        Z3 = Fp.add(X3, Z3);
        X3 = Fp.sub(t1, Z3);
        Z3 = Fp.add(t1, Z3);
        Y3 = Fp.mul(X3, Z3);
        t1 = Fp.add(t0, t0);
        t1 = Fp.add(t1, t0);
        t2 = Fp.mul(a, t2);
        t4 = Fp.mul(b3, t4);
        t1 = Fp.add(t1, t2);
        t2 = Fp.sub(t0, t2);
        t2 = Fp.mul(a, t2);
        t4 = Fp.add(t4, t2);
        t0 = Fp.mul(t1, t4);
        Y3 = Fp.add(Y3, t0);
        t0 = Fp.mul(t5, t4);
        X3 = Fp.mul(t3, X3);
        X3 = Fp.sub(X3, t0);
        t0 = Fp.mul(t3, t1);
        Z3 = Fp.mul(t5, Z3);
        Z3 = Fp.add(Z3, t0);
        return new Point2(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point2.ZERO);
      }
      wNAF(n) {
        return wnaf.wNAFCached(this, n, Point2.normalizeZ);
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed private key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(sc) {
        const { endo: endo2, n: N } = CURVE;
        aInRange("scalar", sc, _0n5, N);
        const I = Point2.ZERO;
        if (sc === _0n5)
          return I;
        if (this.is0() || sc === _1n5)
          return this;
        if (!endo2 || wnaf.hasPrecomputes(this))
          return wnaf.wNAFCachedUnsafe(this, sc, Point2.normalizeZ);
        let { k1neg, k1, k2neg, k2 } = endo2.splitScalar(sc);
        let k1p = I;
        let k2p = I;
        let d = this;
        while (k1 > _0n5 || k2 > _0n5) {
          if (k1 & _1n5)
            k1p = k1p.add(d);
          if (k2 & _1n5)
            k2p = k2p.add(d);
          d = d.double();
          k1 >>= _1n5;
          k2 >>= _1n5;
        }
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new Point2(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
        return k1p.add(k2p);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        const { endo: endo2, n: N } = CURVE;
        aInRange("scalar", scalar, _1n5, N);
        let point, fake;
        if (endo2) {
          const { k1neg, k1, k2neg, k2 } = endo2.splitScalar(scalar);
          let { p: k1p, f: f1p } = this.wNAF(k1);
          let { p: k2p, f: f2p } = this.wNAF(k2);
          k1p = wnaf.constTimeNegate(k1neg, k1p);
          k2p = wnaf.constTimeNegate(k2neg, k2p);
          k2p = new Point2(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
          point = k1p.add(k2p);
          fake = f1p.add(f2p);
        } else {
          const { p, f } = this.wNAF(scalar);
          point = p;
          fake = f;
        }
        return Point2.normalizeZ([point, fake])[0];
      }
      /**
       * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
       * Not using Strauss-Shamir trick: precomputation tables are faster.
       * The trick could be useful if both P and Q are not G (not in our case).
       * @returns non-zero affine point
       */
      multiplyAndAddUnsafe(Q, a, b) {
        const G = Point2.BASE;
        const mul = (P, a2) => a2 === _0n5 || a2 === _1n5 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
        const sum = mul(this, a).add(mul(Q, b));
        return sum.is0() ? void 0 : sum;
      }
      // Converts Projective point to affine (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      // (x, y, z) ∋ (x=x/z, y=y/z)
      toAffine(iz) {
        return toAffineMemo(this, iz);
      }
      isTorsionFree() {
        const { h: cofactor, isTorsionFree } = CURVE;
        if (cofactor === _1n5)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point2, this);
        throw new Error("isTorsionFree() has not been declared for the elliptic curve");
      }
      clearCofactor() {
        const { h: cofactor, clearCofactor } = CURVE;
        if (cofactor === _1n5)
          return this;
        if (clearCofactor)
          return clearCofactor(Point2, this);
        return this.multiplyUnsafe(CURVE.h);
      }
      toRawBytes(isCompressed = true) {
        abool("isCompressed", isCompressed);
        this.assertValidity();
        return toBytes4(Point2, this, isCompressed);
      }
      toHex(isCompressed = true) {
        abool("isCompressed", isCompressed);
        return bytesToHex2(this.toRawBytes(isCompressed));
      }
    }
    Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy, Fp.ONE);
    Point2.ZERO = new Point2(Fp.ZERO, Fp.ONE, Fp.ZERO);
    const { endo, nBitLength } = CURVE;
    const wnaf = wNAF(Point2, endo ? Math.ceil(nBitLength / 2) : nBitLength);
    return {
      CURVE,
      ProjectivePoint: Point2,
      normPrivateKeyToScalar,
      weierstrassEquation,
      isWithinCurveOrder
    };
  }
  function validateOpts(curve) {
    const opts = validateBasic(curve);
    validateObject(opts, {
      hash: "hash",
      hmac: "function",
      randomBytes: "function"
    }, {
      bits2int: "function",
      bits2int_modN: "function",
      lowS: "boolean"
    });
    return Object.freeze({ lowS: true, ...opts });
  }
  function weierstrass(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { Fp, n: CURVE_ORDER, nByteLength, nBitLength } = CURVE;
    const compressedLen = Fp.BYTES + 1;
    const uncompressedLen = 2 * Fp.BYTES + 1;
    function modN2(a) {
      return mod(a, CURVE_ORDER);
    }
    function invN(a) {
      return invert(a, CURVE_ORDER);
    }
    const { ProjectivePoint: Point2, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
      ...CURVE,
      toBytes(_c, point, isCompressed) {
        const a = point.toAffine();
        const x = Fp.toBytes(a.x);
        const cat = concatBytes3;
        abool("isCompressed", isCompressed);
        if (isCompressed) {
          return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
        } else {
          return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
        }
      },
      fromBytes(bytes) {
        const len = bytes.length;
        const head = bytes[0];
        const tail = bytes.subarray(1);
        if (len === compressedLen && (head === 2 || head === 3)) {
          const x = bytesToNumberBE(tail);
          if (!inRange(x, _1n5, Fp.ORDER))
            throw new Error("Point is not on curve");
          const y2 = weierstrassEquation(x);
          let y;
          try {
            y = Fp.sqrt(y2);
          } catch (sqrtError) {
            const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
            throw new Error("Point is not on curve" + suffix);
          }
          const isYOdd = (y & _1n5) === _1n5;
          const isHeadOdd = (head & 1) === 1;
          if (isHeadOdd !== isYOdd)
            y = Fp.neg(y);
          return { x, y };
        } else if (len === uncompressedLen && head === 4) {
          const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
          const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
          return { x, y };
        } else {
          const cl = compressedLen;
          const ul = uncompressedLen;
          throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
        }
      }
    });
    function isBiggerThanHalfOrder(number) {
      const HALF = CURVE_ORDER >> _1n5;
      return number > HALF;
    }
    function normalizeS(s) {
      return isBiggerThanHalfOrder(s) ? modN2(-s) : s;
    }
    const slcNum = (b, from14, to) => bytesToNumberBE(b.slice(from14, to));
    class Signature {
      constructor(r, s, recovery) {
        aInRange("r", r, _1n5, CURVE_ORDER);
        aInRange("s", s, _1n5, CURVE_ORDER);
        this.r = r;
        this.s = s;
        if (recovery != null)
          this.recovery = recovery;
        Object.freeze(this);
      }
      // pair (bytes of r, bytes of s)
      static fromCompact(hex) {
        const l = nByteLength;
        hex = ensureBytes("compactSignature", hex, l * 2);
        return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
      }
      // DER encoded ECDSA signature
      // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
      static fromDER(hex) {
        const { r, s } = DER.toSig(ensureBytes("DER", hex));
        return new Signature(r, s);
      }
      /**
       * @todo remove
       * @deprecated
       */
      assertValidity() {
      }
      addRecoveryBit(recovery) {
        return new Signature(this.r, this.s, recovery);
      }
      recoverPublicKey(msgHash) {
        const { r, s, recovery: rec } = this;
        const h = bits2int_modN(ensureBytes("msgHash", msgHash));
        if (rec == null || ![0, 1, 2, 3].includes(rec))
          throw new Error("recovery id invalid");
        const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
        if (radj >= Fp.ORDER)
          throw new Error("recovery id 2 or 3 invalid");
        const prefix = (rec & 1) === 0 ? "02" : "03";
        const R = Point2.fromHex(prefix + numToSizedHex(radj, Fp.BYTES));
        const ir = invN(radj);
        const u1 = modN2(-h * ir);
        const u2 = modN2(s * ir);
        const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
          throw new Error("point at infinify");
        Q.assertValidity();
        return Q;
      }
      // Signatures should be low-s, to prevent malleability.
      hasHighS() {
        return isBiggerThanHalfOrder(this.s);
      }
      normalizeS() {
        return this.hasHighS() ? new Signature(this.r, modN2(-this.s), this.recovery) : this;
      }
      // DER-encoded
      toDERRawBytes() {
        return hexToBytes2(this.toDERHex());
      }
      toDERHex() {
        return DER.hexFromSig(this);
      }
      // padded bytes of r, then padded bytes of s
      toCompactRawBytes() {
        return hexToBytes2(this.toCompactHex());
      }
      toCompactHex() {
        const l = nByteLength;
        return numToSizedHex(this.r, l) + numToSizedHex(this.s, l);
      }
    }
    const utils = {
      isValidPrivateKey(privateKey) {
        try {
          normPrivateKeyToScalar(privateKey);
          return true;
        } catch (error) {
          return false;
        }
      },
      normPrivateKeyToScalar,
      /**
       * Produces cryptographically secure private key from random of size
       * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
       */
      randomPrivateKey: () => {
        const length = getMinHashLength(CURVE.n);
        return mapHashToField(CURVE.randomBytes(length), CURVE.n);
      },
      /**
       * Creates precompute table for an arbitrary EC point. Makes point "cached".
       * Allows to massively speed-up `point.multiply(scalar)`.
       * @returns cached point
       * @example
       * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
       * fast.multiply(privKey); // much faster ECDH now
       */
      precompute(windowSize = 8, point = Point2.BASE) {
        point._setWindowSize(windowSize);
        point.multiply(BigInt(3));
        return point;
      }
    };
    function getPublicKey(privateKey, isCompressed = true) {
      return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    function isProbPub(item) {
      if (typeof item === "bigint")
        return false;
      if (item instanceof Point2)
        return true;
      const arr = ensureBytes("key", item);
      const len = arr.length;
      const fpl = Fp.BYTES;
      const compLen = fpl + 1;
      const uncompLen = 2 * fpl + 1;
      if (CURVE.allowedPrivateKeyLengths || nByteLength === compLen) {
        return void 0;
      } else {
        return len === compLen || len === uncompLen;
      }
    }
    function getSharedSecret(privateA, publicB, isCompressed = true) {
      if (isProbPub(privateA) === true)
        throw new Error("first arg must be private key");
      if (isProbPub(publicB) === false)
        throw new Error("second arg must be public key");
      const b = Point2.fromHex(publicB);
      return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    const bits2int = CURVE.bits2int || function(bytes) {
      if (bytes.length > 8192)
        throw new Error("input is too large");
      const num2 = bytesToNumberBE(bytes);
      const delta = bytes.length * 8 - nBitLength;
      return delta > 0 ? num2 >> BigInt(delta) : num2;
    };
    const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
      return modN2(bits2int(bytes));
    };
    const ORDER_MASK = bitMask(nBitLength);
    function int2octets(num2) {
      aInRange("num < 2^" + nBitLength, num2, _0n5, ORDER_MASK);
      return numberToBytesBE(num2, nByteLength);
    }
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
      if (["recovered", "canonical"].some((k) => k in opts))
        throw new Error("sign() legacy options not supported");
      const { hash: hash3, randomBytes: randomBytes2 } = CURVE;
      let { lowS, prehash, extraEntropy: ent } = opts;
      if (lowS == null)
        lowS = true;
      msgHash = ensureBytes("msgHash", msgHash);
      validateSigVerOpts(opts);
      if (prehash)
        msgHash = ensureBytes("prehashed msgHash", hash3(msgHash));
      const h1int = bits2int_modN(msgHash);
      const d = normPrivateKeyToScalar(privateKey);
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (ent != null && ent !== false) {
        const e = ent === true ? randomBytes2(Fp.BYTES) : ent;
        seedArgs.push(ensureBytes("extraEntropy", e));
      }
      const seed = concatBytes3(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int(kBytes);
        if (!isWithinCurveOrder(k))
          return;
        const ik = invN(k);
        const q = Point2.BASE.multiply(k).toAffine();
        const r = modN2(q.x);
        if (r === _0n5)
          return;
        const s = modN2(ik * modN2(m + r * d));
        if (s === _0n5)
          return;
        let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n5);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = normalizeS(s);
          recovery ^= 1;
        }
        return new Signature(r, normS, recovery);
      }
      return { seed, k2sig };
    }
    const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
    const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
    function sign(msgHash, privKey, opts = defaultSigOpts) {
      const { seed, k2sig } = prepSig(msgHash, privKey, opts);
      const C = CURVE;
      const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
      return drbg(seed, k2sig);
    }
    Point2.BASE._setWindowSize(8);
    function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
      const sg = signature;
      msgHash = ensureBytes("msgHash", msgHash);
      publicKey = ensureBytes("publicKey", publicKey);
      const { lowS, prehash, format } = opts;
      validateSigVerOpts(opts);
      if ("strict" in opts)
        throw new Error("options.strict was renamed to lowS");
      if (format !== void 0 && format !== "compact" && format !== "der")
        throw new Error("format must be compact or der");
      const isHex2 = typeof sg === "string" || isBytes2(sg);
      const isObj = !isHex2 && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
      if (!isHex2 && !isObj)
        throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
      let _sig = void 0;
      let P;
      try {
        if (isObj)
          _sig = new Signature(sg.r, sg.s);
        if (isHex2) {
          try {
            if (format !== "compact")
              _sig = Signature.fromDER(sg);
          } catch (derError) {
            if (!(derError instanceof DER.Err))
              throw derError;
          }
          if (!_sig && format !== "der")
            _sig = Signature.fromCompact(sg);
        }
        P = Point2.fromHex(publicKey);
      } catch (error) {
        return false;
      }
      if (!_sig)
        return false;
      if (lowS && _sig.hasHighS())
        return false;
      if (prehash)
        msgHash = CURVE.hash(msgHash);
      const { r, s } = _sig;
      const h = bits2int_modN(msgHash);
      const is = invN(s);
      const u1 = modN2(h * is);
      const u2 = modN2(r * is);
      const R = Point2.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
      if (!R)
        return false;
      const v = modN2(R.x);
      return v === r;
    }
    return {
      CURVE,
      getPublicKey,
      getSharedSecret,
      sign,
      verify,
      ProjectivePoint: Point2,
      Signature,
      utils
    };
  }
  function SWUFpSqrtRatio(Fp, Z) {
    const q = Fp.ORDER;
    let l = _0n5;
    for (let o = q - _1n5; o % _2n3 === _0n5; o /= _2n3)
      l += _1n5;
    const c1 = l;
    const _2n_pow_c1_1 = _2n3 << c1 - _1n5 - _1n5;
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n3;
    const c2 = (q - _1n5) / _2n_pow_c1;
    const c3 = (c2 - _1n5) / _2n3;
    const c4 = _2n_pow_c1 - _1n5;
    const c5 = _2n_pow_c1_1;
    const c6 = Fp.pow(Z, c2);
    const c7 = Fp.pow(Z, (c2 + _1n5) / _2n3);
    let sqrtRatio = (u, v) => {
      let tv1 = c6;
      let tv2 = Fp.pow(v, c4);
      let tv3 = Fp.sqr(tv2);
      tv3 = Fp.mul(tv3, v);
      let tv5 = Fp.mul(u, tv3);
      tv5 = Fp.pow(tv5, c3);
      tv5 = Fp.mul(tv5, tv2);
      tv2 = Fp.mul(tv5, v);
      tv3 = Fp.mul(tv5, u);
      let tv4 = Fp.mul(tv3, tv2);
      tv5 = Fp.pow(tv4, c5);
      let isQR = Fp.eql(tv5, Fp.ONE);
      tv2 = Fp.mul(tv3, c7);
      tv5 = Fp.mul(tv4, tv1);
      tv3 = Fp.cmov(tv2, tv3, isQR);
      tv4 = Fp.cmov(tv5, tv4, isQR);
      for (let i = c1; i > _1n5; i--) {
        let tv52 = i - _2n3;
        tv52 = _2n3 << tv52 - _1n5;
        let tvv5 = Fp.pow(tv4, tv52);
        const e1 = Fp.eql(tvv5, Fp.ONE);
        tv2 = Fp.mul(tv3, tv1);
        tv1 = Fp.mul(tv1, tv1);
        tvv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, e1);
        tv4 = Fp.cmov(tvv5, tv4, e1);
      }
      return { isValid: isQR, value: tv3 };
    };
    if (Fp.ORDER % _4n2 === _3n2) {
      const c12 = (Fp.ORDER - _3n2) / _4n2;
      const c22 = Fp.sqrt(Fp.neg(Z));
      sqrtRatio = (u, v) => {
        let tv1 = Fp.sqr(v);
        const tv2 = Fp.mul(u, v);
        tv1 = Fp.mul(tv1, tv2);
        let y1 = Fp.pow(tv1, c12);
        y1 = Fp.mul(y1, tv2);
        const y2 = Fp.mul(y1, c22);
        const tv3 = Fp.mul(Fp.sqr(y1), v);
        const isQR = Fp.eql(tv3, u);
        let y = Fp.cmov(y2, y1, isQR);
        return { isValid: isQR, value: y };
      };
    }
    return sqrtRatio;
  }
  function mapToCurveSimpleSWU(Fp, opts) {
    validateField(Fp);
    if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
    if (!Fp.isOdd)
      throw new Error("Fp.isOdd is not implemented!");
    return (u) => {
      let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
      tv1 = Fp.sqr(u);
      tv1 = Fp.mul(tv1, opts.Z);
      tv2 = Fp.sqr(tv1);
      tv2 = Fp.add(tv2, tv1);
      tv3 = Fp.add(tv2, Fp.ONE);
      tv3 = Fp.mul(tv3, opts.B);
      tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
      tv4 = Fp.mul(tv4, opts.A);
      tv2 = Fp.sqr(tv3);
      tv6 = Fp.sqr(tv4);
      tv5 = Fp.mul(tv6, opts.A);
      tv2 = Fp.add(tv2, tv5);
      tv2 = Fp.mul(tv2, tv3);
      tv6 = Fp.mul(tv6, tv4);
      tv5 = Fp.mul(tv6, opts.B);
      tv2 = Fp.add(tv2, tv5);
      x = Fp.mul(tv1, tv3);
      const { isValid, value } = sqrtRatio(tv2, tv6);
      y = Fp.mul(tv1, u);
      y = Fp.mul(y, value);
      x = Fp.cmov(x, tv3, isValid);
      y = Fp.cmov(y, value, isValid);
      const e1 = Fp.isOdd(u) === Fp.isOdd(y);
      y = Fp.cmov(Fp.neg(y), y, e1);
      const tv4_inv = FpInvertBatch(Fp, [tv4], true)[0];
      x = Fp.mul(x, tv4_inv);
      return { x, y };
    };
  }
  var DERErr, DER, _0n5, _1n5, _2n3, _3n2, _4n2;
  var init_weierstrass = __esm({
    "node_modules/@noble/curves/esm/abstract/weierstrass.js"() {
      init_curve();
      init_modular();
      init_utils4();
      DERErr = class extends Error {
        constructor(m = "") {
          super(m);
        }
      };
      DER = {
        // asn.1 DER encoding utils
        Err: DERErr,
        // Basic building block is TLV (Tag-Length-Value)
        _tlv: {
          encode: (tag, data) => {
            const { Err: E } = DER;
            if (tag < 0 || tag > 256)
              throw new E("tlv.encode: wrong tag");
            if (data.length & 1)
              throw new E("tlv.encode: unpadded data");
            const dataLen = data.length / 2;
            const len = numberToHexUnpadded(dataLen);
            if (len.length / 2 & 128)
              throw new E("tlv.encode: long form length too big");
            const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
            const t = numberToHexUnpadded(tag);
            return t + lenLen + len + data;
          },
          // v - value, l - left bytes (unparsed)
          decode(tag, data) {
            const { Err: E } = DER;
            let pos = 0;
            if (tag < 0 || tag > 256)
              throw new E("tlv.encode: wrong tag");
            if (data.length < 2 || data[pos++] !== tag)
              throw new E("tlv.decode: wrong tlv");
            const first = data[pos++];
            const isLong = !!(first & 128);
            let length = 0;
            if (!isLong)
              length = first;
            else {
              const lenLen = first & 127;
              if (!lenLen)
                throw new E("tlv.decode(long): indefinite length not supported");
              if (lenLen > 4)
                throw new E("tlv.decode(long): byte length is too big");
              const lengthBytes = data.subarray(pos, pos + lenLen);
              if (lengthBytes.length !== lenLen)
                throw new E("tlv.decode: length bytes not complete");
              if (lengthBytes[0] === 0)
                throw new E("tlv.decode(long): zero leftmost byte");
              for (const b of lengthBytes)
                length = length << 8 | b;
              pos += lenLen;
              if (length < 128)
                throw new E("tlv.decode(long): not minimal encoding");
            }
            const v = data.subarray(pos, pos + length);
            if (v.length !== length)
              throw new E("tlv.decode: wrong value length");
            return { v, l: data.subarray(pos + length) };
          }
        },
        // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
        // since we always use positive integers here. It must always be empty:
        // - add zero byte if exists
        // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
        _int: {
          encode(num2) {
            const { Err: E } = DER;
            if (num2 < _0n5)
              throw new E("integer: negative integers are not allowed");
            let hex = numberToHexUnpadded(num2);
            if (Number.parseInt(hex[0], 16) & 8)
              hex = "00" + hex;
            if (hex.length & 1)
              throw new E("unexpected DER parsing assertion: unpadded hex");
            return hex;
          },
          decode(data) {
            const { Err: E } = DER;
            if (data[0] & 128)
              throw new E("invalid signature integer: negative");
            if (data[0] === 0 && !(data[1] & 128))
              throw new E("invalid signature integer: unnecessary leading zero");
            return bytesToNumberBE(data);
          }
        },
        toSig(hex) {
          const { Err: E, _int: int, _tlv: tlv } = DER;
          const data = ensureBytes("signature", hex);
          const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
          if (seqLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
          const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
          if (sLeftBytes.length)
            throw new E("invalid signature: left bytes after parsing");
          return { r: int.decode(rBytes), s: int.decode(sBytes) };
        },
        hexFromSig(sig) {
          const { _tlv: tlv, _int: int } = DER;
          const rs = tlv.encode(2, int.encode(sig.r));
          const ss = tlv.encode(2, int.encode(sig.s));
          const seq = rs + ss;
          return tlv.encode(48, seq);
        }
      };
      _0n5 = BigInt(0);
      _1n5 = BigInt(1);
      _2n3 = BigInt(2);
      _3n2 = BigInt(3);
      _4n2 = BigInt(4);
    }
  });

  // node_modules/@noble/curves/esm/_shortw_utils.js
  function getHash(hash3) {
    return {
      hash: hash3,
      hmac: (key, ...msgs) => hmac(hash3, key, concatBytes(...msgs)),
      randomBytes
    };
  }
  function createCurve(curveDef, defHash) {
    const create2 = (hash3) => weierstrass({ ...curveDef, ...getHash(hash3) });
    return { ...create2(defHash), create: create2 };
  }
  var init_shortw_utils = __esm({
    "node_modules/@noble/curves/esm/_shortw_utils.js"() {
      init_hmac();
      init_utils2();
      init_weierstrass();
    }
  });

  // node_modules/@noble/curves/esm/abstract/hash-to-curve.js
  function i2osp(value, length) {
    anum(value);
    anum(length);
    if (value < 0 || value >= 1 << 8 * length)
      throw new Error("invalid I2OSP input: " + value);
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1; i >= 0; i--) {
      res[i] = value & 255;
      value >>>= 8;
    }
    return new Uint8Array(res);
  }
  function strxor(a, b) {
    const arr = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
      arr[i] = a[i] ^ b[i];
    }
    return arr;
  }
  function anum(item) {
    if (!Number.isSafeInteger(item))
      throw new Error("number expected");
  }
  function expand_message_xmd(msg, DST, lenInBytes, H) {
    abytes2(msg);
    abytes2(DST);
    anum(lenInBytes);
    if (DST.length > 255)
      DST = H(concatBytes3(utf8ToBytes2("H2C-OVERSIZE-DST-"), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
      throw new Error("expand_message_xmd: invalid lenInBytes");
    const DST_prime = concatBytes3(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2);
    const b = new Array(ell);
    const b_0 = H(concatBytes3(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H(concatBytes3(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i <= ell; i++) {
      const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
      b[i] = H(concatBytes3(...args));
    }
    const pseudo_random_bytes = concatBytes3(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
  }
  function expand_message_xof(msg, DST, lenInBytes, k, H) {
    abytes2(msg);
    abytes2(DST);
    anum(lenInBytes);
    if (DST.length > 255) {
      const dkLen = Math.ceil(2 * k / 8);
      DST = H.create({ dkLen }).update(utf8ToBytes2("H2C-OVERSIZE-DST-")).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255)
      throw new Error("expand_message_xof: invalid lenInBytes");
    return H.create({ dkLen: lenInBytes }).update(msg).update(i2osp(lenInBytes, 2)).update(DST).update(i2osp(DST.length, 1)).digest();
  }
  function hash_to_field(msg, count, options) {
    validateObject(options, {
      DST: "stringOrUint8Array",
      p: "bigint",
      m: "isSafeInteger",
      k: "isSafeInteger",
      hash: "hash"
    });
    const { p, k, m, hash: hash3, expand, DST: _DST } = options;
    abytes2(msg);
    anum(count);
    const DST = typeof _DST === "string" ? utf8ToBytes2(_DST) : _DST;
    const log2p = p.toString(2).length;
    const L = Math.ceil((log2p + k) / 8);
    const len_in_bytes = count * m * L;
    let prb;
    if (expand === "xmd") {
      prb = expand_message_xmd(msg, DST, len_in_bytes, hash3);
    } else if (expand === "xof") {
      prb = expand_message_xof(msg, DST, len_in_bytes, k, hash3);
    } else if (expand === "_internal_pass") {
      prb = msg;
    } else {
      throw new Error('expand must be "xmd" or "xof"');
    }
    const u = new Array(count);
    for (let i = 0; i < count; i++) {
      const e = new Array(m);
      for (let j = 0; j < m; j++) {
        const elm_offset = L * (j + i * m);
        const tv = prb.subarray(elm_offset, elm_offset + L);
        e[j] = mod(os2ip(tv), p);
      }
      u[i] = e;
    }
    return u;
  }
  function isogenyMap(field, map) {
    const coeff = map.map((i) => Array.from(i).reverse());
    return (x, y) => {
      const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
      const [xd_inv, yd_inv] = FpInvertBatch(field, [xd, yd], true);
      x = field.mul(xn, xd_inv);
      y = field.mul(y, field.mul(yn, yd_inv));
      return { x, y };
    };
  }
  function createHasher2(Point2, mapToCurve, defaults) {
    if (typeof mapToCurve !== "function")
      throw new Error("mapToCurve() must be defined");
    function map(num2) {
      return Point2.fromAffine(mapToCurve(num2));
    }
    function clear(initial) {
      const P = initial.clearCofactor();
      if (P.equals(Point2.ZERO))
        return Point2.ZERO;
      P.assertValidity();
      return P;
    }
    return {
      defaults,
      // Encodes byte string to elliptic curve.
      // hash_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
      hashToCurve(msg, options) {
        const u = hash_to_field(msg, 2, { ...defaults, DST: defaults.DST, ...options });
        const u0 = map(u[0]);
        const u1 = map(u[1]);
        return clear(u0.add(u1));
      },
      // Encodes byte string to elliptic curve.
      // encode_to_curve from https://www.rfc-editor.org/rfc/rfc9380#section-3
      encodeToCurve(msg, options) {
        const u = hash_to_field(msg, 1, { ...defaults, DST: defaults.encodeDST, ...options });
        return clear(map(u[0]));
      },
      // Same as encodeToCurve, but without hash
      mapToCurve(scalars) {
        if (!Array.isArray(scalars))
          throw new Error("expected array of bigints");
        for (const i of scalars)
          if (typeof i !== "bigint")
            throw new Error("expected array of bigints");
        return clear(map(scalars));
      }
    };
  }
  var os2ip;
  var init_hash_to_curve = __esm({
    "node_modules/@noble/curves/esm/abstract/hash-to-curve.js"() {
      init_modular();
      init_utils4();
      os2ip = bytesToNumberBE;
    }
  });

  // node_modules/@noble/curves/esm/secp256k1.js
  var secp256k1_exports = {};
  __export(secp256k1_exports, {
    encodeToCurve: () => encodeToCurve,
    hashToCurve: () => hashToCurve,
    schnorr: () => schnorr,
    secp256k1: () => secp256k1,
    secp256k1_hasher: () => secp256k1_hasher
  });
  function sqrtMod(y) {
    const P = secp256k1P;
    const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow2(b3, _3n3, P) * b3 % P;
    const b9 = pow2(b6, _3n3, P) * b3 % P;
    const b11 = pow2(b9, _2n4, P) * b2 % P;
    const b22 = pow2(b11, _11n, P) * b11 % P;
    const b44 = pow2(b22, _22n, P) * b22 % P;
    const b88 = pow2(b44, _44n, P) * b44 % P;
    const b176 = pow2(b88, _88n, P) * b88 % P;
    const b220 = pow2(b176, _44n, P) * b44 % P;
    const b223 = pow2(b220, _3n3, P) * b3 % P;
    const t1 = pow2(b223, _23n, P) * b22 % P;
    const t2 = pow2(t1, _6n, P) * b2 % P;
    const root = pow2(t2, _2n4, P);
    if (!Fpk1.eql(Fpk1.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  }
  function taggedHash(tag, ...messages) {
    let tagP = TAGGED_HASH_PREFIXES[tag];
    if (tagP === void 0) {
      const tagH = sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
      tagP = concatBytes3(tagH, tagH);
      TAGGED_HASH_PREFIXES[tag] = tagP;
    }
    return sha256(concatBytes3(tagP, ...messages));
  }
  function schnorrGetExtPubKey(priv) {
    let d_ = secp256k1.utils.normPrivateKeyToScalar(priv);
    let p = Point.fromPrivateKey(d_);
    const scalar = p.hasEvenY() ? d_ : modN(-d_);
    return { scalar, bytes: pointToBytes(p) };
  }
  function lift_x(x) {
    aInRange("x", x, _1n6, secp256k1P);
    const xx = modP(x * x);
    const c = modP(xx * x + BigInt(7));
    let y = sqrtMod(c);
    if (y % _2n4 !== _0n6)
      y = modP(-y);
    const p = new Point(x, y, _1n6);
    p.assertValidity();
    return p;
  }
  function challenge(...args) {
    return modN(num(taggedHash("BIP0340/challenge", ...args)));
  }
  function schnorrGetPublicKey(privateKey) {
    return schnorrGetExtPubKey(privateKey).bytes;
  }
  function schnorrSign(message, privateKey, auxRand = randomBytes(32)) {
    const m = ensureBytes("message", message);
    const { bytes: px, scalar: d } = schnorrGetExtPubKey(privateKey);
    const a = ensureBytes("auxRand", auxRand, 32);
    const t = numTo32b(d ^ num(taggedHash("BIP0340/aux", a)));
    const rand = taggedHash("BIP0340/nonce", t, px, m);
    const k_ = modN(num(rand));
    if (k_ === _0n6)
      throw new Error("sign failed: k is zero");
    const { bytes: rx, scalar: k } = schnorrGetExtPubKey(k_);
    const e = challenge(rx, px, m);
    const sig = new Uint8Array(64);
    sig.set(rx, 0);
    sig.set(numTo32b(modN(k + e * d)), 32);
    if (!schnorrVerify(sig, m, px))
      throw new Error("sign: Invalid signature produced");
    return sig;
  }
  function schnorrVerify(signature, message, publicKey) {
    const sig = ensureBytes("signature", signature, 64);
    const m = ensureBytes("message", message);
    const pub = ensureBytes("publicKey", publicKey, 32);
    try {
      const P = lift_x(num(pub));
      const r = num(sig.subarray(0, 32));
      if (!inRange(r, _1n6, secp256k1P))
        return false;
      const s = num(sig.subarray(32, 64));
      if (!inRange(s, _1n6, secp256k1N))
        return false;
      const e = challenge(numTo32b(r), pointToBytes(P), m);
      const R = GmulAdd(P, s, modN(-e));
      if (!R || !R.hasEvenY() || R.toAffine().x !== r)
        return false;
      return true;
    } catch (error) {
      return false;
    }
  }
  var secp256k1P, secp256k1N, _0n6, _1n6, _2n4, divNearest, Fpk1, secp256k1, TAGGED_HASH_PREFIXES, pointToBytes, numTo32b, modP, modN, Point, GmulAdd, num, schnorr, isoMap, mapSWU, secp256k1_hasher, hashToCurve, encodeToCurve;
  var init_secp256k1 = __esm({
    "node_modules/@noble/curves/esm/secp256k1.js"() {
      init_sha2();
      init_utils2();
      init_shortw_utils();
      init_hash_to_curve();
      init_modular();
      init_utils4();
      init_weierstrass();
      secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
      secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
      _0n6 = BigInt(0);
      _1n6 = BigInt(1);
      _2n4 = BigInt(2);
      divNearest = (a, b) => (a + b / _2n4) / b;
      Fpk1 = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
      secp256k1 = createCurve({
        a: _0n6,
        b: BigInt(7),
        Fp: Fpk1,
        n: secp256k1N,
        Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
        Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
        h: BigInt(1),
        lowS: true,
        // Allow only low-S signatures by default in sign() and verify()
        endo: {
          // Endomorphism, see above
          beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
          splitScalar: (k) => {
            const n = secp256k1N;
            const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
            const b1 = -_1n6 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
            const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
            const b2 = a1;
            const POW_2_128 = BigInt("0x100000000000000000000000000000000");
            const c1 = divNearest(b2 * k, n);
            const c2 = divNearest(-b1 * k, n);
            let k1 = mod(k - c1 * a1 - c2 * a2, n);
            let k2 = mod(-c1 * b1 - c2 * b2, n);
            const k1neg = k1 > POW_2_128;
            const k2neg = k2 > POW_2_128;
            if (k1neg)
              k1 = n - k1;
            if (k2neg)
              k2 = n - k2;
            if (k1 > POW_2_128 || k2 > POW_2_128) {
              throw new Error("splitScalar: Endomorphism failed, k=" + k);
            }
            return { k1neg, k1, k2neg, k2 };
          }
        }
      }, sha256);
      TAGGED_HASH_PREFIXES = {};
      pointToBytes = (point) => point.toRawBytes(true).slice(1);
      numTo32b = (n) => numberToBytesBE(n, 32);
      modP = (x) => mod(x, secp256k1P);
      modN = (x) => mod(x, secp256k1N);
      Point = /* @__PURE__ */ (() => secp256k1.ProjectivePoint)();
      GmulAdd = (Q, a, b) => Point.BASE.multiplyAndAddUnsafe(Q, a, b);
      num = bytesToNumberBE;
      schnorr = /* @__PURE__ */ (() => ({
        getPublicKey: schnorrGetPublicKey,
        sign: schnorrSign,
        verify: schnorrVerify,
        utils: {
          randomPrivateKey: secp256k1.utils.randomPrivateKey,
          lift_x,
          pointToBytes,
          numberToBytesBE,
          bytesToNumberBE,
          taggedHash,
          mod
        }
      }))();
      isoMap = /* @__PURE__ */ (() => isogenyMap(Fpk1, [
        // xNum
        [
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7",
          "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581",
          "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262",
          "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"
        ],
        // xDen
        [
          "0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b",
          "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
          // LAST 1
        ],
        // yNum
        [
          "0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c",
          "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3",
          "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931",
          "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"
        ],
        // yDen
        [
          "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b",
          "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573",
          "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f",
          "0x0000000000000000000000000000000000000000000000000000000000000001"
          // LAST 1
        ]
      ].map((i) => i.map((j) => BigInt(j)))))();
      mapSWU = /* @__PURE__ */ (() => mapToCurveSimpleSWU(Fpk1, {
        A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
        B: BigInt("1771"),
        Z: Fpk1.create(BigInt("-11"))
      }))();
      secp256k1_hasher = /* @__PURE__ */ (() => createHasher2(secp256k1.ProjectivePoint, (scalars) => {
        const { x, y } = mapSWU(Fpk1.create(scalars[0]));
        return isoMap(x, y);
      }, {
        DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
        encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
        p: Fpk1.ORDER,
        m: 1,
        k: 128,
        expand: "xmd",
        hash: sha256
      }))();
      hashToCurve = /* @__PURE__ */ (() => secp256k1_hasher.hashToCurve)();
      encodeToCurve = /* @__PURE__ */ (() => secp256k1_hasher.encodeToCurve)();
    }
  });

  // node_modules/viem/errors/node.ts
  var ExecutionRevertedError, FeeCapTooHighError, FeeCapTooLowError, NonceTooHighError, NonceTooLowError, NonceMaxValueError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, TransactionTypeNotSupportedError, TipAboveFeeCapError, UnknownNodeError;
  var init_node = __esm({
    "node_modules/viem/errors/node.ts"() {
      init_formatGwei();
      init_base();
      ExecutionRevertedError = class extends BaseError2 {
        static code = 3;
        static nodeMessage = /execution reverted|gas required exceeds allowance/;
        constructor({
          cause,
          message
        } = {}) {
          const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
          super(
            `Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`,
            {
              cause,
              name: "ExecutionRevertedError"
            }
          );
        }
      };
      FeeCapTooHighError = class extends BaseError2 {
        static nodeMessage = /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/;
        constructor({
          cause,
          maxFeePerGas
        } = {}) {
          super(
            `The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`,
            {
              cause,
              name: "FeeCapTooHighError"
            }
          );
        }
      };
      FeeCapTooLowError = class extends BaseError2 {
        static nodeMessage = /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/;
        constructor({
          cause,
          maxFeePerGas
        } = {}) {
          super(
            `The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`,
            {
              cause,
              name: "FeeCapTooLowError"
            }
          );
        }
      };
      NonceTooHighError = class extends BaseError2 {
        static nodeMessage = /nonce too high/;
        constructor({
          cause,
          nonce
        } = {}) {
          super(
            `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`,
            { cause, name: "NonceTooHighError" }
          );
        }
      };
      NonceTooLowError = class extends BaseError2 {
        static nodeMessage = /nonce too low|transaction already imported|already known/;
        constructor({
          cause,
          nonce
        } = {}) {
          super(
            [
              `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
              "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
            ].join("\n"),
            { cause, name: "NonceTooLowError" }
          );
        }
      };
      NonceMaxValueError = class extends BaseError2 {
        static nodeMessage = /nonce has max value/;
        constructor({
          cause,
          nonce
        } = {}) {
          super(
            `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`,
            { cause, name: "NonceMaxValueError" }
          );
        }
      };
      InsufficientFundsError = class extends BaseError2 {
        static nodeMessage = /insufficient funds|exceeds transaction sender account balance/;
        constructor({ cause } = {}) {
          super(
            [
              "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
            ].join("\n"),
            {
              cause,
              metaMessages: [
                "This error could arise when the account does not have enough funds to:",
                " - pay for the total gas fee,",
                " - pay for the value to send.",
                " ",
                "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
                " - `gas` is the amount of gas needed for transaction to execute,",
                " - `gas fee` is the gas fee,",
                " - `value` is the amount of ether to send to the recipient."
              ],
              name: "InsufficientFundsError"
            }
          );
        }
      };
      IntrinsicGasTooHighError = class extends BaseError2 {
        static nodeMessage = /intrinsic gas too high|gas limit reached/;
        constructor({
          cause,
          gas
        } = {}) {
          super(
            `The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`,
            {
              cause,
              name: "IntrinsicGasTooHighError"
            }
          );
        }
      };
      IntrinsicGasTooLowError = class extends BaseError2 {
        static nodeMessage = /intrinsic gas too low/;
        constructor({
          cause,
          gas
        } = {}) {
          super(
            `The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`,
            {
              cause,
              name: "IntrinsicGasTooLowError"
            }
          );
        }
      };
      TransactionTypeNotSupportedError = class extends BaseError2 {
        static nodeMessage = /transaction type not valid/;
        constructor({ cause }) {
          super("The transaction type is not supported for this chain.", {
            cause,
            name: "TransactionTypeNotSupportedError"
          });
        }
      };
      TipAboveFeeCapError = class extends BaseError2 {
        static nodeMessage = /max priority fee per gas higher than max fee per gas|tip higher than fee cap/;
        constructor({
          cause,
          maxPriorityFeePerGas,
          maxFeePerGas
        } = {}) {
          super(
            [
              `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`
            ].join("\n"),
            {
              cause,
              name: "TipAboveFeeCapError"
            }
          );
        }
      };
      UnknownNodeError = class extends BaseError2 {
        constructor({ cause }) {
          super(`An error occurred while executing: ${cause?.shortMessage}`, {
            cause,
            name: "UnknownNodeError"
          });
        }
      };
    }
  });

  // node_modules/viem/utils/errors/getNodeError.ts
  function getNodeError(err, args) {
    const message = (err.details || "").toLowerCase();
    const executionRevertedError = err instanceof BaseError2 ? err.walk(
      (e) => e?.code === ExecutionRevertedError.code
    ) : err;
    if (executionRevertedError instanceof BaseError2)
      return new ExecutionRevertedError({
        cause: err,
        message: executionRevertedError.details
      });
    if (ExecutionRevertedError.nodeMessage.test(message))
      return new ExecutionRevertedError({
        cause: err,
        message: err.details
      });
    if (FeeCapTooHighError.nodeMessage.test(message))
      return new FeeCapTooHighError({
        cause: err,
        maxFeePerGas: args?.maxFeePerGas
      });
    if (FeeCapTooLowError.nodeMessage.test(message))
      return new FeeCapTooLowError({
        cause: err,
        maxFeePerGas: args?.maxFeePerGas
      });
    if (NonceTooHighError.nodeMessage.test(message))
      return new NonceTooHighError({ cause: err, nonce: args?.nonce });
    if (NonceTooLowError.nodeMessage.test(message))
      return new NonceTooLowError({ cause: err, nonce: args?.nonce });
    if (NonceMaxValueError.nodeMessage.test(message))
      return new NonceMaxValueError({ cause: err, nonce: args?.nonce });
    if (InsufficientFundsError.nodeMessage.test(message))
      return new InsufficientFundsError({ cause: err });
    if (IntrinsicGasTooHighError.nodeMessage.test(message))
      return new IntrinsicGasTooHighError({ cause: err, gas: args?.gas });
    if (IntrinsicGasTooLowError.nodeMessage.test(message))
      return new IntrinsicGasTooLowError({ cause: err, gas: args?.gas });
    if (TransactionTypeNotSupportedError.nodeMessage.test(message))
      return new TransactionTypeNotSupportedError({ cause: err });
    if (TipAboveFeeCapError.nodeMessage.test(message))
      return new TipAboveFeeCapError({
        cause: err,
        maxFeePerGas: args?.maxFeePerGas,
        maxPriorityFeePerGas: args?.maxPriorityFeePerGas
      });
    return new UnknownNodeError({
      cause: err
    });
  }
  var init_getNodeError = __esm({
    "node_modules/viem/utils/errors/getNodeError.ts"() {
      init_base();
      init_node();
    }
  });

  // node_modules/viem/utils/formatters/extract.ts
  function extract(value_, { format }) {
    if (!format) return {};
    const value = {};
    function extract_(formatted2) {
      const keys = Object.keys(formatted2);
      for (const key of keys) {
        if (key in value_) value[key] = value_[key];
        if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
          extract_(formatted2[key]);
      }
    }
    const formatted = format(value_ || {});
    extract_(formatted);
    return value;
  }
  var init_extract = __esm({
    "node_modules/viem/utils/formatters/extract.ts"() {
    }
  });

  // node_modules/viem/utils/formatters/formatter.ts
  function defineFormatter(type, format) {
    return ({
      exclude,
      format: overrides
    }) => {
      return {
        exclude,
        format: (args, action) => {
          const formatted = format(args, action);
          if (exclude) {
            for (const key of exclude) {
              delete formatted[key];
            }
          }
          return {
            ...formatted,
            ...overrides(args, action)
          };
        },
        type
      };
    };
  }
  var init_formatter = __esm({
    "node_modules/viem/utils/formatters/formatter.ts"() {
    }
  });

  // node_modules/viem/utils/formatters/transactionRequest.ts
  function formatTransactionRequest(request, _) {
    const rpcRequest = {};
    if (typeof request.authorizationList !== "undefined")
      rpcRequest.authorizationList = formatAuthorizationList(
        request.authorizationList
      );
    if (typeof request.accessList !== "undefined")
      rpcRequest.accessList = request.accessList;
    if (typeof request.blobVersionedHashes !== "undefined")
      rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
    if (typeof request.blobs !== "undefined") {
      if (typeof request.blobs[0] !== "string")
        rpcRequest.blobs = request.blobs.map(
          (x) => bytesToHex(x)
        );
      else rpcRequest.blobs = request.blobs;
    }
    if (typeof request.data !== "undefined") rpcRequest.data = request.data;
    if (request.account) rpcRequest.from = request.account.address;
    if (typeof request.from !== "undefined") rpcRequest.from = request.from;
    if (typeof request.gas !== "undefined")
      rpcRequest.gas = numberToHex(request.gas);
    if (typeof request.gasPrice !== "undefined")
      rpcRequest.gasPrice = numberToHex(request.gasPrice);
    if (typeof request.maxFeePerBlobGas !== "undefined")
      rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
    if (typeof request.maxFeePerGas !== "undefined")
      rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
    if (typeof request.maxPriorityFeePerGas !== "undefined")
      rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
    if (typeof request.nonce !== "undefined")
      rpcRequest.nonce = numberToHex(request.nonce);
    if (typeof request.to !== "undefined") rpcRequest.to = request.to;
    if (typeof request.type !== "undefined")
      rpcRequest.type = rpcTransactionType[request.type];
    if (typeof request.value !== "undefined")
      rpcRequest.value = numberToHex(request.value);
    return rpcRequest;
  }
  function formatAuthorizationList(authorizationList) {
    return authorizationList.map(
      (authorization) => ({
        address: authorization.address,
        r: authorization.r ? numberToHex(BigInt(authorization.r)) : authorization.r,
        s: authorization.s ? numberToHex(BigInt(authorization.s)) : authorization.s,
        chainId: numberToHex(authorization.chainId),
        nonce: numberToHex(authorization.nonce),
        ...typeof authorization.yParity !== "undefined" ? { yParity: numberToHex(authorization.yParity) } : {},
        ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: numberToHex(authorization.v) } : {}
      })
    );
  }
  var rpcTransactionType, defineTransactionRequest;
  var init_transactionRequest = __esm({
    "node_modules/viem/utils/formatters/transactionRequest.ts"() {
      init_toHex();
      init_formatter();
      rpcTransactionType = {
        legacy: "0x0",
        eip2930: "0x1",
        eip1559: "0x2",
        eip4844: "0x3",
        eip7702: "0x4"
      };
      defineTransactionRequest = /* @__PURE__ */ defineFormatter(
        "transactionRequest",
        formatTransactionRequest
      );
    }
  });

  // node_modules/viem/utils/stateOverride.ts
  function serializeStateMapping(stateMapping) {
    if (!stateMapping || stateMapping.length === 0) return void 0;
    return stateMapping.reduce((acc, { slot, value }) => {
      if (slot.length !== 66)
        throw new InvalidBytesLengthError({
          size: slot.length,
          targetSize: 66,
          type: "hex"
        });
      if (value.length !== 66)
        throw new InvalidBytesLengthError({
          size: value.length,
          targetSize: 66,
          type: "hex"
        });
      acc[slot] = value;
      return acc;
    }, {});
  }
  function serializeAccountStateOverride(parameters) {
    const { balance, nonce, state, stateDiff, code } = parameters;
    const rpcAccountStateOverride = {};
    if (code !== void 0) rpcAccountStateOverride.code = code;
    if (balance !== void 0)
      rpcAccountStateOverride.balance = numberToHex(balance);
    if (nonce !== void 0) rpcAccountStateOverride.nonce = numberToHex(nonce);
    if (state !== void 0)
      rpcAccountStateOverride.state = serializeStateMapping(state);
    if (stateDiff !== void 0) {
      if (rpcAccountStateOverride.state) throw new StateAssignmentConflictError();
      rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
    }
    return rpcAccountStateOverride;
  }
  function serializeStateOverride(parameters) {
    if (!parameters) return void 0;
    const rpcStateOverride = {};
    for (const { address, ...accountState } of parameters) {
      if (!isAddress(address, { strict: false }))
        throw new InvalidAddressError({ address });
      if (rpcStateOverride[address])
        throw new AccountStateConflictError({ address });
      rpcStateOverride[address] = serializeAccountStateOverride(accountState);
    }
    return rpcStateOverride;
  }
  var init_stateOverride2 = __esm({
    "node_modules/viem/utils/stateOverride.ts"() {
      init_address();
      init_data();
      init_stateOverride();
      init_isAddress();
      init_toHex();
    }
  });

  // node_modules/viem/constants/number.ts
  var maxInt8, maxInt16, maxInt24, maxInt32, maxInt40, maxInt48, maxInt56, maxInt64, maxInt72, maxInt80, maxInt88, maxInt96, maxInt104, maxInt112, maxInt120, maxInt128, maxInt136, maxInt144, maxInt152, maxInt160, maxInt168, maxInt176, maxInt184, maxInt192, maxInt200, maxInt208, maxInt216, maxInt224, maxInt232, maxInt240, maxInt248, maxInt256, minInt8, minInt16, minInt24, minInt32, minInt40, minInt48, minInt56, minInt64, minInt72, minInt80, minInt88, minInt96, minInt104, minInt112, minInt120, minInt128, minInt136, minInt144, minInt152, minInt160, minInt168, minInt176, minInt184, minInt192, minInt200, minInt208, minInt216, minInt224, minInt232, minInt240, minInt248, minInt256, maxUint8, maxUint16, maxUint24, maxUint32, maxUint40, maxUint48, maxUint56, maxUint64, maxUint72, maxUint80, maxUint88, maxUint96, maxUint104, maxUint112, maxUint120, maxUint128, maxUint136, maxUint144, maxUint152, maxUint160, maxUint168, maxUint176, maxUint184, maxUint192, maxUint200, maxUint208, maxUint216, maxUint224, maxUint232, maxUint240, maxUint248, maxUint256;
  var init_number = __esm({
    "node_modules/viem/constants/number.ts"() {
      maxInt8 = 2n ** (8n - 1n) - 1n;
      maxInt16 = 2n ** (16n - 1n) - 1n;
      maxInt24 = 2n ** (24n - 1n) - 1n;
      maxInt32 = 2n ** (32n - 1n) - 1n;
      maxInt40 = 2n ** (40n - 1n) - 1n;
      maxInt48 = 2n ** (48n - 1n) - 1n;
      maxInt56 = 2n ** (56n - 1n) - 1n;
      maxInt64 = 2n ** (64n - 1n) - 1n;
      maxInt72 = 2n ** (72n - 1n) - 1n;
      maxInt80 = 2n ** (80n - 1n) - 1n;
      maxInt88 = 2n ** (88n - 1n) - 1n;
      maxInt96 = 2n ** (96n - 1n) - 1n;
      maxInt104 = 2n ** (104n - 1n) - 1n;
      maxInt112 = 2n ** (112n - 1n) - 1n;
      maxInt120 = 2n ** (120n - 1n) - 1n;
      maxInt128 = 2n ** (128n - 1n) - 1n;
      maxInt136 = 2n ** (136n - 1n) - 1n;
      maxInt144 = 2n ** (144n - 1n) - 1n;
      maxInt152 = 2n ** (152n - 1n) - 1n;
      maxInt160 = 2n ** (160n - 1n) - 1n;
      maxInt168 = 2n ** (168n - 1n) - 1n;
      maxInt176 = 2n ** (176n - 1n) - 1n;
      maxInt184 = 2n ** (184n - 1n) - 1n;
      maxInt192 = 2n ** (192n - 1n) - 1n;
      maxInt200 = 2n ** (200n - 1n) - 1n;
      maxInt208 = 2n ** (208n - 1n) - 1n;
      maxInt216 = 2n ** (216n - 1n) - 1n;
      maxInt224 = 2n ** (224n - 1n) - 1n;
      maxInt232 = 2n ** (232n - 1n) - 1n;
      maxInt240 = 2n ** (240n - 1n) - 1n;
      maxInt248 = 2n ** (248n - 1n) - 1n;
      maxInt256 = 2n ** (256n - 1n) - 1n;
      minInt8 = -(2n ** (8n - 1n));
      minInt16 = -(2n ** (16n - 1n));
      minInt24 = -(2n ** (24n - 1n));
      minInt32 = -(2n ** (32n - 1n));
      minInt40 = -(2n ** (40n - 1n));
      minInt48 = -(2n ** (48n - 1n));
      minInt56 = -(2n ** (56n - 1n));
      minInt64 = -(2n ** (64n - 1n));
      minInt72 = -(2n ** (72n - 1n));
      minInt80 = -(2n ** (80n - 1n));
      minInt88 = -(2n ** (88n - 1n));
      minInt96 = -(2n ** (96n - 1n));
      minInt104 = -(2n ** (104n - 1n));
      minInt112 = -(2n ** (112n - 1n));
      minInt120 = -(2n ** (120n - 1n));
      minInt128 = -(2n ** (128n - 1n));
      minInt136 = -(2n ** (136n - 1n));
      minInt144 = -(2n ** (144n - 1n));
      minInt152 = -(2n ** (152n - 1n));
      minInt160 = -(2n ** (160n - 1n));
      minInt168 = -(2n ** (168n - 1n));
      minInt176 = -(2n ** (176n - 1n));
      minInt184 = -(2n ** (184n - 1n));
      minInt192 = -(2n ** (192n - 1n));
      minInt200 = -(2n ** (200n - 1n));
      minInt208 = -(2n ** (208n - 1n));
      minInt216 = -(2n ** (216n - 1n));
      minInt224 = -(2n ** (224n - 1n));
      minInt232 = -(2n ** (232n - 1n));
      minInt240 = -(2n ** (240n - 1n));
      minInt248 = -(2n ** (248n - 1n));
      minInt256 = -(2n ** (256n - 1n));
      maxUint8 = 2n ** 8n - 1n;
      maxUint16 = 2n ** 16n - 1n;
      maxUint24 = 2n ** 24n - 1n;
      maxUint32 = 2n ** 32n - 1n;
      maxUint40 = 2n ** 40n - 1n;
      maxUint48 = 2n ** 48n - 1n;
      maxUint56 = 2n ** 56n - 1n;
      maxUint64 = 2n ** 64n - 1n;
      maxUint72 = 2n ** 72n - 1n;
      maxUint80 = 2n ** 80n - 1n;
      maxUint88 = 2n ** 88n - 1n;
      maxUint96 = 2n ** 96n - 1n;
      maxUint104 = 2n ** 104n - 1n;
      maxUint112 = 2n ** 112n - 1n;
      maxUint120 = 2n ** 120n - 1n;
      maxUint128 = 2n ** 128n - 1n;
      maxUint136 = 2n ** 136n - 1n;
      maxUint144 = 2n ** 144n - 1n;
      maxUint152 = 2n ** 152n - 1n;
      maxUint160 = 2n ** 160n - 1n;
      maxUint168 = 2n ** 168n - 1n;
      maxUint176 = 2n ** 176n - 1n;
      maxUint184 = 2n ** 184n - 1n;
      maxUint192 = 2n ** 192n - 1n;
      maxUint200 = 2n ** 200n - 1n;
      maxUint208 = 2n ** 208n - 1n;
      maxUint216 = 2n ** 216n - 1n;
      maxUint224 = 2n ** 224n - 1n;
      maxUint232 = 2n ** 232n - 1n;
      maxUint240 = 2n ** 240n - 1n;
      maxUint248 = 2n ** 248n - 1n;
      maxUint256 = 2n ** 256n - 1n;
    }
  });

  // node_modules/viem/utils/transaction/assertRequest.ts
  function assertRequest(args) {
    const { account: account_, maxFeePerGas, maxPriorityFeePerGas, to } = args;
    const account = account_ ? parseAccount(account_) : void 0;
    if (account && !isAddress(account.address))
      throw new InvalidAddressError({ address: account.address });
    if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
    if (maxFeePerGas && maxFeePerGas > maxUint256)
      throw new FeeCapTooHighError({ maxFeePerGas });
    if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
      throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
  }
  var init_assertRequest = __esm({
    "node_modules/viem/utils/transaction/assertRequest.ts"() {
      init_parseAccount();
      init_number();
      init_address();
      init_node();
      init_isAddress();
    }
  });

  // node_modules/viem/utils/block/formatBlockParameter.ts
  function formatBlockParameter(parameters) {
    const { blockHash, blockNumber, blockTag, requireCanonical } = parameters;
    if (requireCanonical !== void 0 && !blockHash)
      throw new BaseError2(
        "`requireCanonical` can only be provided when `blockHash` is set."
      );
    if (blockHash)
      return requireCanonical ? { blockHash, requireCanonical } : { blockHash };
    if (typeof blockNumber === "bigint") return numberToHex(blockNumber);
    return blockTag ?? "latest";
  }
  var init_formatBlockParameter = __esm({
    "node_modules/viem/utils/block/formatBlockParameter.ts"() {
      init_base();
      init_toHex();
    }
  });

  // node_modules/viem/utils/address/isAddressEqual.ts
  function isAddressEqual(a, b) {
    if (!isAddress(a, { strict: false }))
      throw new InvalidAddressError({ address: a });
    if (!isAddress(b, { strict: false }))
      throw new InvalidAddressError({ address: b });
    return a.toLowerCase() === b.toLowerCase();
  }
  var init_isAddressEqual = __esm({
    "node_modules/viem/utils/address/isAddressEqual.ts"() {
      init_address();
      init_isAddress();
    }
  });

  // node_modules/viem/utils/abi/decodeFunctionResult.ts
  function decodeFunctionResult(parameters) {
    const { abi: abi2, args, functionName, data } = parameters;
    let abiItem = abi2[0];
    if (functionName) {
      const item = getAbiItem({ abi: abi2, args, name: functionName });
      if (!item) throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath4 });
      abiItem = item;
    }
    if (abiItem.type !== "function")
      throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath4 });
    if (!abiItem.outputs)
      throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath4 });
    const values = decodeAbiParameters(abiItem.outputs, data);
    if (values && values.length > 1)
      return values;
    if (values && values.length === 1)
      return values[0];
    return void 0;
  }
  var docsPath4;
  var init_decodeFunctionResult = __esm({
    "node_modules/viem/utils/abi/decodeFunctionResult.ts"() {
      init_abi();
      init_decodeAbiParameters();
      init_getAbiItem();
      docsPath4 = "/docs/contract/decodeFunctionResult";
    }
  });

  // node_modules/ox/_esm/core/version.js
  var version3;
  var init_version3 = __esm({
    "node_modules/ox/_esm/core/version.js"() {
      version3 = "0.1.1";
    }
  });

  // node_modules/ox/_esm/core/internal/errors.js
  function getVersion() {
    return version3;
  }
  var init_errors2 = __esm({
    "node_modules/ox/_esm/core/internal/errors.js"() {
      init_version3();
    }
  });

  // node_modules/ox/_esm/core/Errors.js
  function walk2(err, fn) {
    if (fn?.(err))
      return err;
    if (err && typeof err === "object" && "cause" in err && err.cause)
      return walk2(err.cause, fn);
    return fn ? null : err;
  }
  var BaseError3;
  var init_Errors = __esm({
    "node_modules/ox/_esm/core/Errors.js"() {
      init_errors2();
      BaseError3 = class _BaseError extends Error {
        static setStaticOptions(options) {
          _BaseError.prototype.docsOrigin = options.docsOrigin;
          _BaseError.prototype.showVersion = options.showVersion;
          _BaseError.prototype.version = options.version;
        }
        constructor(shortMessage, options = {}) {
          const details = (() => {
            if (options.cause instanceof _BaseError) {
              if (options.cause.details)
                return options.cause.details;
              if (options.cause.shortMessage)
                return options.cause.shortMessage;
            }
            if (options.cause && "details" in options.cause && typeof options.cause.details === "string")
              return options.cause.details;
            if (options.cause?.message)
              return options.cause.message;
            return options.details;
          })();
          const docsPath9 = (() => {
            if (options.cause instanceof _BaseError)
              return options.cause.docsPath || options.docsPath;
            return options.docsPath;
          })();
          const docsBaseUrl = options.docsOrigin ?? _BaseError.prototype.docsOrigin;
          const docs = `${docsBaseUrl}${docsPath9 ?? ""}`;
          const showVersion = Boolean(options.version ?? _BaseError.prototype.showVersion);
          const version4 = options.version ?? _BaseError.prototype.version;
          const message = [
            shortMessage || "An error occurred.",
            ...options.metaMessages ? ["", ...options.metaMessages] : [],
            ...details || docsPath9 || showVersion ? [
              "",
              details ? `Details: ${details}` : void 0,
              docsPath9 ? `See: ${docs}` : void 0,
              showVersion ? `Version: ${version4}` : void 0
            ] : []
          ].filter((x) => typeof x === "string").join("\n");
          super(message, options.cause ? { cause: options.cause } : void 0);
          Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "docs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "docsOrigin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "showVersion", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "cause", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "BaseError"
          });
          this.cause = options.cause;
          this.details = details;
          this.docs = docs;
          this.docsOrigin = docsBaseUrl;
          this.docsPath = docsPath9;
          this.shortMessage = shortMessage;
          this.showVersion = showVersion;
          this.version = version4;
        }
        walk(fn) {
          return walk2(this, fn);
        }
      };
      Object.defineProperty(BaseError3, "defaultStaticOptions", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {
          docsOrigin: "https://oxlib.sh",
          showVersion: false,
          version: `ox@${getVersion()}`
        }
      });
      (() => {
        BaseError3.setStaticOptions(BaseError3.defaultStaticOptions);
      })();
    }
  });

  // node_modules/ox/_esm/core/internal/bytes.js
  function assertSize2(bytes, size_) {
    if (size2(bytes) > size_)
      throw new SizeOverflowError2({
        givenSize: size2(bytes),
        maxSize: size_
      });
  }
  function assertStartOffset2(value, start) {
    if (typeof start === "number" && start > 0 && start > size2(value) - 1)
      throw new SliceOffsetOutOfBoundsError2({
        offset: start,
        position: "start",
        size: size2(value)
      });
  }
  function assertEndOffset2(value, start, end) {
    if (typeof start === "number" && typeof end === "number" && size2(value) !== end - start) {
      throw new SliceOffsetOutOfBoundsError2({
        offset: end,
        position: "end",
        size: size2(value)
      });
    }
  }
  function charCodeToBase162(char) {
    if (char >= charCodeMap2.zero && char <= charCodeMap2.nine)
      return char - charCodeMap2.zero;
    if (char >= charCodeMap2.A && char <= charCodeMap2.F)
      return char - (charCodeMap2.A - 10);
    if (char >= charCodeMap2.a && char <= charCodeMap2.f)
      return char - (charCodeMap2.a - 10);
    return void 0;
  }
  function pad2(bytes, options = {}) {
    const { dir, size: size5 = 32 } = options;
    if (size5 === 0)
      return bytes;
    if (bytes.length > size5)
      throw new SizeExceedsPaddingSizeError2({
        size: bytes.length,
        targetSize: size5,
        type: "Bytes"
      });
    const paddedBytes = new Uint8Array(size5);
    for (let i = 0; i < size5; i++) {
      const padEnd = dir === "right";
      paddedBytes[padEnd ? i : size5 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
  }
  function trim2(value, options = {}) {
    const { dir = "left" } = options;
    let data = value;
    let sliceLength = 0;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
        sliceLength++;
      else
        break;
    }
    data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
    return data;
  }
  var charCodeMap2;
  var init_bytes = __esm({
    "node_modules/ox/_esm/core/internal/bytes.js"() {
      init_Bytes();
      charCodeMap2 = {
        zero: 48,
        nine: 57,
        A: 65,
        F: 70,
        a: 97,
        f: 102
      };
    }
  });

  // node_modules/ox/_esm/core/internal/hex.js
  function assertSize3(hex, size_) {
    if (size3(hex) > size_)
      throw new SizeOverflowError3({
        givenSize: size3(hex),
        maxSize: size_
      });
  }
  function assertStartOffset3(value, start) {
    if (typeof start === "number" && start > 0 && start > size3(value) - 1)
      throw new SliceOffsetOutOfBoundsError3({
        offset: start,
        position: "start",
        size: size3(value)
      });
  }
  function assertEndOffset3(value, start, end) {
    if (typeof start === "number" && typeof end === "number" && size3(value) !== end - start) {
      throw new SliceOffsetOutOfBoundsError3({
        offset: end,
        position: "end",
        size: size3(value)
      });
    }
  }
  function pad3(hex_, options = {}) {
    const { dir, size: size5 = 32 } = options;
    if (size5 === 0)
      return hex_;
    const hex = hex_.replace("0x", "");
    if (hex.length > size5 * 2)
      throw new SizeExceedsPaddingSizeError3({
        size: Math.ceil(hex.length / 2),
        targetSize: size5,
        type: "Hex"
      });
    return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size5 * 2, "0")}`;
  }
  function trim3(value, options = {}) {
    const { dir = "left" } = options;
    let data = value.replace("0x", "");
    let sliceLength = 0;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
        sliceLength++;
      else
        break;
    }
    data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
    if (data === "0")
      return "0x";
    if (dir === "right" && data.length % 2 === 1)
      return `0x${data}0`;
    return `0x${data}`;
  }
  var init_hex = __esm({
    "node_modules/ox/_esm/core/internal/hex.js"() {
      init_Hex();
    }
  });

  // node_modules/ox/_esm/core/Json.js
  function stringify2(value, replacer, space) {
    return JSON.stringify(value, (key, value2) => {
      if (typeof replacer === "function")
        return replacer(key, value2);
      if (typeof value2 === "bigint")
        return value2.toString() + bigIntSuffix;
      return value2;
    }, space);
  }
  var bigIntSuffix;
  var init_Json = __esm({
    "node_modules/ox/_esm/core/Json.js"() {
      bigIntSuffix = "#__bigint";
    }
  });

  // node_modules/ox/_esm/core/Bytes.js
  function assert(value) {
    if (value instanceof Uint8Array)
      return;
    if (!value)
      throw new InvalidBytesTypeError(value);
    if (typeof value !== "object")
      throw new InvalidBytesTypeError(value);
    if (!("BYTES_PER_ELEMENT" in value))
      throw new InvalidBytesTypeError(value);
    if (value.BYTES_PER_ELEMENT !== 1 || value.constructor.name !== "Uint8Array")
      throw new InvalidBytesTypeError(value);
  }
  function from(value) {
    if (value instanceof Uint8Array)
      return value;
    if (typeof value === "string")
      return fromHex2(value);
    return fromArray(value);
  }
  function fromArray(value) {
    return value instanceof Uint8Array ? value : new Uint8Array(value);
  }
  function fromHex2(value, options = {}) {
    const { size: size5 } = options;
    let hex = value;
    if (size5) {
      assertSize3(value, size5);
      hex = padRight(value, size5);
    }
    let hexString = hex.slice(2);
    if (hexString.length % 2)
      hexString = `0${hexString}`;
    const length = hexString.length / 2;
    const bytes = new Uint8Array(length);
    for (let index2 = 0, j = 0; index2 < length; index2++) {
      const nibbleLeft = charCodeToBase162(hexString.charCodeAt(j++));
      const nibbleRight = charCodeToBase162(hexString.charCodeAt(j++));
      if (nibbleLeft === void 0 || nibbleRight === void 0) {
        throw new BaseError3(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
      }
      bytes[index2] = nibbleLeft << 4 | nibbleRight;
    }
    return bytes;
  }
  function fromString(value, options = {}) {
    const { size: size5 } = options;
    const bytes = encoder3.encode(value);
    if (typeof size5 === "number") {
      assertSize2(bytes, size5);
      return padRight2(bytes, size5);
    }
    return bytes;
  }
  function padRight2(value, size5) {
    return pad2(value, { dir: "right", size: size5 });
  }
  function size2(value) {
    return value.length;
  }
  function slice2(value, start, end, options = {}) {
    const { strict } = options;
    assertStartOffset2(value, start);
    const value_ = value.slice(start, end);
    if (strict)
      assertEndOffset2(value_, start, end);
    return value_;
  }
  function toBigInt2(bytes, options = {}) {
    const { size: size5 } = options;
    if (typeof size5 !== "undefined")
      assertSize2(bytes, size5);
    const hex = fromBytes2(bytes, options);
    return toBigInt(hex, options);
  }
  function toBoolean(bytes, options = {}) {
    const { size: size5 } = options;
    let bytes_ = bytes;
    if (typeof size5 !== "undefined") {
      assertSize2(bytes_, size5);
      bytes_ = trimLeft(bytes_);
    }
    if (bytes_.length > 1 || bytes_[0] > 1)
      throw new InvalidBytesBooleanError2(bytes_);
    return Boolean(bytes_[0]);
  }
  function toNumber2(bytes, options = {}) {
    const { size: size5 } = options;
    if (typeof size5 !== "undefined")
      assertSize2(bytes, size5);
    const hex = fromBytes2(bytes, options);
    return toNumber(hex, options);
  }
  function toString(bytes, options = {}) {
    const { size: size5 } = options;
    let bytes_ = bytes;
    if (typeof size5 !== "undefined") {
      assertSize2(bytes_, size5);
      bytes_ = trimRight(bytes_);
    }
    return decoder.decode(bytes_);
  }
  function trimLeft(value) {
    return trim2(value, { dir: "left" });
  }
  function trimRight(value) {
    return trim2(value, { dir: "right" });
  }
  function validate(value) {
    try {
      assert(value);
      return true;
    } catch {
      return false;
    }
  }
  var decoder, encoder3, InvalidBytesBooleanError2, InvalidBytesTypeError, SizeOverflowError2, SliceOffsetOutOfBoundsError2, SizeExceedsPaddingSizeError2;
  var init_Bytes = __esm({
    "node_modules/ox/_esm/core/Bytes.js"() {
      init_Errors();
      init_Hex();
      init_bytes();
      init_hex();
      init_Json();
      decoder = /* @__PURE__ */ new TextDecoder();
      encoder3 = /* @__PURE__ */ new TextEncoder();
      InvalidBytesBooleanError2 = class extends BaseError3 {
        constructor(bytes) {
          super(`Bytes value \`${bytes}\` is not a valid boolean.`, {
            metaMessages: [
              "The bytes array must contain a single byte of either a `0` or `1` value."
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.InvalidBytesBooleanError"
          });
        }
      };
      InvalidBytesTypeError = class extends BaseError3 {
        constructor(value) {
          super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid Bytes value.`, {
            metaMessages: ["Bytes values must be of type `Bytes`."]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.InvalidBytesTypeError"
          });
        }
      };
      SizeOverflowError2 = class extends BaseError3 {
        constructor({ givenSize, maxSize }) {
          super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.SizeOverflowError"
          });
        }
      };
      SliceOffsetOutOfBoundsError2 = class extends BaseError3 {
        constructor({ offset, position, size: size5 }) {
          super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.SliceOffsetOutOfBoundsError"
          });
        }
      };
      SizeExceedsPaddingSizeError2 = class extends BaseError3 {
        constructor({ size: size5, targetSize, type }) {
          super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bytes.SizeExceedsPaddingSizeError"
          });
        }
      };
    }
  });

  // node_modules/ox/_esm/core/Hex.js
  function assert2(value, options = {}) {
    const { strict = false } = options;
    if (!value)
      throw new InvalidHexTypeError(value);
    if (typeof value !== "string")
      throw new InvalidHexTypeError(value);
    if (strict) {
      if (!/^0x[0-9a-fA-F]*$/.test(value))
        throw new InvalidHexValueError2(value);
    }
    if (!value.startsWith("0x"))
      throw new InvalidHexValueError2(value);
  }
  function concat2(...values) {
    return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
  }
  function from2(value) {
    if (value instanceof Uint8Array)
      return fromBytes2(value);
    if (Array.isArray(value))
      return fromBytes2(new Uint8Array(value));
    return value;
  }
  function fromBoolean(value, options = {}) {
    const hex = `0x${Number(value)}`;
    if (typeof options.size === "number") {
      assertSize3(hex, options.size);
      return padLeft(hex, options.size);
    }
    return hex;
  }
  function fromBytes2(value, options = {}) {
    let string = "";
    for (let i = 0; i < value.length; i++)
      string += hexes3[value[i]];
    const hex = `0x${string}`;
    if (typeof options.size === "number") {
      assertSize3(hex, options.size);
      return padRight(hex, options.size);
    }
    return hex;
  }
  function fromNumber(value, options = {}) {
    const { signed, size: size5 } = options;
    const value_ = BigInt(value);
    let maxValue;
    if (size5) {
      if (signed)
        maxValue = (1n << BigInt(size5) * 8n - 1n) - 1n;
      else
        maxValue = 2n ** (BigInt(size5) * 8n) - 1n;
    } else if (typeof value === "number") {
      maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    }
    const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
    if (maxValue && value_ > maxValue || value_ < minValue) {
      const suffix = typeof value === "bigint" ? "n" : "";
      throw new IntegerOutOfRangeError2({
        max: maxValue ? `${maxValue}${suffix}` : void 0,
        min: `${minValue}${suffix}`,
        signed,
        size: size5,
        value: `${value}${suffix}`
      });
    }
    const stringValue = (signed && value_ < 0 ? BigInt.asUintN(size5 * 8, BigInt(value_)) : value_).toString(16);
    const hex = `0x${stringValue}`;
    if (size5)
      return padLeft(hex, size5);
    return hex;
  }
  function fromString2(value, options = {}) {
    return fromBytes2(encoder4.encode(value), options);
  }
  function padLeft(value, size5) {
    return pad3(value, { dir: "left", size: size5 });
  }
  function padRight(value, size5) {
    return pad3(value, { dir: "right", size: size5 });
  }
  function slice3(value, start, end, options = {}) {
    const { strict } = options;
    assertStartOffset3(value, start);
    const value_ = `0x${value.replace("0x", "").slice((start ?? 0) * 2, (end ?? value.length) * 2)}`;
    if (strict)
      assertEndOffset3(value_, start, end);
    return value_;
  }
  function size3(value) {
    return Math.ceil((value.length - 2) / 2);
  }
  function trimLeft2(value) {
    return trim3(value, { dir: "left" });
  }
  function toBigInt(hex, options = {}) {
    const { signed } = options;
    if (options.size)
      assertSize3(hex, options.size);
    const value = BigInt(hex);
    if (!signed)
      return value;
    const size5 = (hex.length - 2) / 2;
    const max_unsigned = (1n << BigInt(size5) * 8n) - 1n;
    const max_signed = max_unsigned >> 1n;
    if (value <= max_signed)
      return value;
    return value - max_unsigned - 1n;
  }
  function toNumber(hex, options = {}) {
    const { signed, size: size5 } = options;
    if (!signed && !size5)
      return Number(hex);
    return Number(toBigInt(hex, options));
  }
  function validate2(value, options = {}) {
    const { strict = false } = options;
    try {
      assert2(value, { strict });
      return true;
    } catch {
      return false;
    }
  }
  var encoder4, hexes3, IntegerOutOfRangeError2, InvalidHexTypeError, InvalidHexValueError2, SizeOverflowError3, SliceOffsetOutOfBoundsError3, SizeExceedsPaddingSizeError3;
  var init_Hex = __esm({
    "node_modules/ox/_esm/core/Hex.js"() {
      init_Errors();
      init_hex();
      init_Json();
      encoder4 = /* @__PURE__ */ new TextEncoder();
      hexes3 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
      IntegerOutOfRangeError2 = class extends BaseError3 {
        constructor({ max, min, signed, size: size5, value }) {
          super(`Number \`${value}\` is not in safe${size5 ? ` ${size5 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.IntegerOutOfRangeError"
          });
        }
      };
      InvalidHexTypeError = class extends BaseError3 {
        constructor(value) {
          super(`Value \`${typeof value === "object" ? stringify2(value) : value}\` of type \`${typeof value}\` is an invalid hex type.`, {
            metaMessages: ['Hex types must be represented as `"0x${string}"`.']
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.InvalidHexTypeError"
          });
        }
      };
      InvalidHexValueError2 = class extends BaseError3 {
        constructor(value) {
          super(`Value \`${value}\` is an invalid hex value.`, {
            metaMessages: [
              'Hex values must start with `"0x"` and contain only hexadecimal characters (0-9, a-f, A-F).'
            ]
          });
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.InvalidHexValueError"
          });
        }
      };
      SizeOverflowError3 = class extends BaseError3 {
        constructor({ givenSize, maxSize }) {
          super(`Size cannot exceed \`${maxSize}\` bytes. Given size: \`${givenSize}\` bytes.`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.SizeOverflowError"
          });
        }
      };
      SliceOffsetOutOfBoundsError3 = class extends BaseError3 {
        constructor({ offset, position, size: size5 }) {
          super(`Slice ${position === "start" ? "starting" : "ending"} at offset \`${offset}\` is out-of-bounds (size: \`${size5}\`).`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.SliceOffsetOutOfBoundsError"
          });
        }
      };
      SizeExceedsPaddingSizeError3 = class extends BaseError3 {
        constructor({ size: size5, targetSize, type }) {
          super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size5}\`) exceeds padding size (\`${targetSize}\`).`);
          Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hex.SizeExceedsPaddingSizeError"
          });
        }
      };
    }
  });

  // node_modules/ox/_esm/core/Withdrawal.js
  function toRpc(withdrawal) {
    return {
      address: withdrawal.address,
      amount: fromNumber(withdrawal.amount),
      index: fromNumber(withdrawal.index),
      validatorIndex: fromNumber(withdrawal.validatorIndex)
    };
  }
  var init_Withdrawal = __esm({
    "node_modules/ox/_esm/core/Withdrawal.js"() {
      init_Hex();
    }
  });

  // node_modules/ox/_esm/core/BlockOverrides.js
  function toRpc2(blockOverrides) {
    return {
      ...typeof blockOverrides.baseFeePerGas === "bigint" && {
        baseFeePerGas: fromNumber(blockOverrides.baseFeePerGas)
      },
      ...typeof blockOverrides.blobBaseFee === "bigint" && {
        blobBaseFee: fromNumber(blockOverrides.blobBaseFee)
      },
      ...typeof blockOverrides.feeRecipient === "string" && {
        feeRecipient: blockOverrides.feeRecipient
      },
      ...typeof blockOverrides.gasLimit === "bigint" && {
        gasLimit: fromNumber(blockOverrides.gasLimit)
      },
      ...typeof blockOverrides.number === "bigint" && {
        number: fromNumber(blockOverrides.number)
      },
      ...typeof blockOverrides.prevRandao === "bigint" && {
        prevRandao: fromNumber(blockOverrides.prevRandao)
      },
      ...typeof blockOverrides.time === "bigint" && {
        time: fromNumber(blockOverrides.time)
      },
      ...blockOverrides.withdrawals && {
        withdrawals: blockOverrides.withdrawals.map(toRpc)
      }
    };
  }
  var init_BlockOverrides = __esm({
    "node_modules/ox/_esm/core/BlockOverrides.js"() {
      init_Hex();
      init_Withdrawal();
    }
  });

  // node_modules/viem/constants/abis.ts
  var multicall3Abi, batchGatewayAbi, universalResolverErrors, universalResolverResolveAbi, universalResolverReverseAbi, textResolverAbi, addressResolverAbi, erc1271Abi, erc6492SignatureValidatorAbi, erc20Abi, erc20Abi_bytes32, erc1155Abi, erc721Abi, erc4626Abi;
  var init_abis = __esm({
    "node_modules/viem/constants/abis.ts"() {
      multicall3Abi = [
        {
          inputs: [
            {
              components: [
                {
                  name: "target",
                  type: "address"
                },
                {
                  name: "allowFailure",
                  type: "bool"
                },
                {
                  name: "callData",
                  type: "bytes"
                }
              ],
              name: "calls",
              type: "tuple[]"
            }
          ],
          name: "aggregate3",
          outputs: [
            {
              components: [
                {
                  name: "success",
                  type: "bool"
                },
                {
                  name: "returnData",
                  type: "bytes"
                }
              ],
              name: "returnData",
              type: "tuple[]"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "addr",
              type: "address"
            }
          ],
          name: "getEthBalance",
          outputs: [
            {
              name: "balance",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "getCurrentBlockTimestamp",
          outputs: [
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        }
      ];
      batchGatewayAbi = [
        {
          name: "query",
          type: "function",
          stateMutability: "view",
          inputs: [
            {
              type: "tuple[]",
              name: "queries",
              components: [
                {
                  type: "address",
                  name: "sender"
                },
                {
                  type: "string[]",
                  name: "urls"
                },
                {
                  type: "bytes",
                  name: "data"
                }
              ]
            }
          ],
          outputs: [
            {
              type: "bool[]",
              name: "failures"
            },
            {
              type: "bytes[]",
              name: "responses"
            }
          ]
        },
        {
          name: "HttpError",
          type: "error",
          inputs: [
            {
              type: "uint16",
              name: "status"
            },
            {
              type: "string",
              name: "message"
            }
          ]
        }
      ];
      universalResolverErrors = [
        {
          inputs: [
            {
              name: "dns",
              type: "bytes"
            }
          ],
          name: "DNSDecodingFailed",
          type: "error"
        },
        {
          inputs: [
            {
              name: "ens",
              type: "string"
            }
          ],
          name: "DNSEncodingFailed",
          type: "error"
        },
        {
          inputs: [],
          name: "EmptyAddress",
          type: "error"
        },
        {
          inputs: [
            {
              name: "status",
              type: "uint16"
            },
            {
              name: "message",
              type: "string"
            }
          ],
          name: "HttpError",
          type: "error"
        },
        {
          inputs: [],
          name: "InvalidBatchGatewayResponse",
          type: "error"
        },
        {
          inputs: [
            {
              name: "errorData",
              type: "bytes"
            }
          ],
          name: "ResolverError",
          type: "error"
        },
        {
          inputs: [
            {
              name: "name",
              type: "bytes"
            },
            {
              name: "resolver",
              type: "address"
            }
          ],
          name: "ResolverNotContract",
          type: "error"
        },
        {
          inputs: [
            {
              name: "name",
              type: "bytes"
            }
          ],
          name: "ResolverNotFound",
          type: "error"
        },
        {
          inputs: [
            {
              name: "primary",
              type: "string"
            },
            {
              name: "primaryAddress",
              type: "bytes"
            }
          ],
          name: "ReverseAddressMismatch",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "selector",
              type: "bytes4"
            }
          ],
          name: "UnsupportedResolverProfile",
          type: "error"
        }
      ];
      universalResolverResolveAbi = [
        ...universalResolverErrors,
        {
          name: "resolveWithGateways",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "name", type: "bytes" },
            { name: "data", type: "bytes" },
            { name: "gateways", type: "string[]" }
          ],
          outputs: [
            { name: "", type: "bytes" },
            { name: "address", type: "address" }
          ]
        }
      ];
      universalResolverReverseAbi = [
        ...universalResolverErrors,
        {
          name: "reverseWithGateways",
          type: "function",
          stateMutability: "view",
          inputs: [
            { type: "bytes", name: "reverseName" },
            { type: "uint256", name: "coinType" },
            { type: "string[]", name: "gateways" }
          ],
          outputs: [
            { type: "string", name: "resolvedName" },
            { type: "address", name: "resolver" },
            { type: "address", name: "reverseResolver" }
          ]
        }
      ];
      textResolverAbi = [
        {
          name: "text",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "name", type: "bytes32" },
            { name: "key", type: "string" }
          ],
          outputs: [{ name: "", type: "string" }]
        }
      ];
      addressResolverAbi = [
        {
          name: "addr",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "name", type: "bytes32" }],
          outputs: [{ name: "", type: "address" }]
        },
        {
          name: "addr",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "name", type: "bytes32" },
            { name: "coinType", type: "uint256" }
          ],
          outputs: [{ name: "", type: "bytes" }]
        }
      ];
      erc1271Abi = [
        {
          name: "isValidSignature",
          type: "function",
          stateMutability: "view",
          inputs: [
            { name: "hash", type: "bytes32" },
            { name: "signature", type: "bytes" }
          ],
          outputs: [{ name: "", type: "bytes4" }]
        }
      ];
      erc6492SignatureValidatorAbi = [
        {
          inputs: [
            {
              name: "_signer",
              type: "address"
            },
            {
              name: "_hash",
              type: "bytes32"
            },
            {
              name: "_signature",
              type: "bytes"
            }
          ],
          stateMutability: "nonpayable",
          type: "constructor"
        },
        {
          inputs: [
            {
              name: "_signer",
              type: "address"
            },
            {
              name: "_hash",
              type: "bytes32"
            },
            {
              name: "_signature",
              type: "bytes"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ],
          stateMutability: "nonpayable",
          type: "function",
          name: "isValidSig"
        }
      ];
      erc20Abi = [
        {
          type: "event",
          name: "Approval",
          inputs: [
            {
              indexed: true,
              name: "owner",
              type: "address"
            },
            {
              indexed: true,
              name: "spender",
              type: "address"
            },
            {
              indexed: false,
              name: "value",
              type: "uint256"
            }
          ]
        },
        {
          type: "event",
          name: "Transfer",
          inputs: [
            {
              indexed: true,
              name: "from",
              type: "address"
            },
            {
              indexed: true,
              name: "to",
              type: "address"
            },
            {
              indexed: false,
              name: "value",
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "allowance",
          stateMutability: "view",
          inputs: [
            {
              name: "owner",
              type: "address"
            },
            {
              name: "spender",
              type: "address"
            }
          ],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "approve",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "spender",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ]
        },
        {
          type: "function",
          name: "balanceOf",
          stateMutability: "view",
          inputs: [
            {
              name: "account",
              type: "address"
            }
          ],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "decimals",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "uint8"
            }
          ]
        },
        {
          type: "function",
          name: "name",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "string"
            }
          ]
        },
        {
          type: "function",
          name: "symbol",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "string"
            }
          ]
        },
        {
          type: "function",
          name: "totalSupply",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "transfer",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "recipient",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ]
        },
        {
          type: "function",
          name: "transferFrom",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "sender",
              type: "address"
            },
            {
              name: "recipient",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ]
        }
      ];
      erc20Abi_bytes32 = [
        {
          type: "event",
          name: "Approval",
          inputs: [
            {
              indexed: true,
              name: "owner",
              type: "address"
            },
            {
              indexed: true,
              name: "spender",
              type: "address"
            },
            {
              indexed: false,
              name: "value",
              type: "uint256"
            }
          ]
        },
        {
          type: "event",
          name: "Transfer",
          inputs: [
            {
              indexed: true,
              name: "from",
              type: "address"
            },
            {
              indexed: true,
              name: "to",
              type: "address"
            },
            {
              indexed: false,
              name: "value",
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "allowance",
          stateMutability: "view",
          inputs: [
            {
              name: "owner",
              type: "address"
            },
            {
              name: "spender",
              type: "address"
            }
          ],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "approve",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "spender",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ]
        },
        {
          type: "function",
          name: "balanceOf",
          stateMutability: "view",
          inputs: [
            {
              name: "account",
              type: "address"
            }
          ],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "decimals",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "uint8"
            }
          ]
        },
        {
          type: "function",
          name: "name",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "bytes32"
            }
          ]
        },
        {
          type: "function",
          name: "symbol",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "bytes32"
            }
          ]
        },
        {
          type: "function",
          name: "totalSupply",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "transfer",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "recipient",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ]
        },
        {
          type: "function",
          name: "transferFrom",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "sender",
              type: "address"
            },
            {
              name: "recipient",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ]
        }
      ];
      erc1155Abi = [
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256"
            }
          ],
          name: "ERC1155InsufficientBalance",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "approver",
              type: "address"
            }
          ],
          name: "ERC1155InvalidApprover",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "idsLength",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "valuesLength",
              type: "uint256"
            }
          ],
          name: "ERC1155InvalidArrayLength",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address"
            }
          ],
          name: "ERC1155InvalidOperator",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address"
            }
          ],
          name: "ERC1155InvalidReceiver",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address"
            }
          ],
          name: "ERC1155InvalidSender",
          type: "error"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address"
            },
            {
              internalType: "address",
              name: "owner",
              type: "address"
            }
          ],
          name: "ERC1155MissingApprovalForAll",
          type: "error"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "account",
              type: "address"
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address"
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool"
            }
          ],
          name: "ApprovalForAll",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address"
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address"
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]"
            },
            {
              indexed: false,
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]"
            }
          ],
          name: "TransferBatch",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address"
            },
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address"
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "id",
              type: "uint256"
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256"
            }
          ],
          name: "TransferSingle",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              internalType: "string",
              name: "value",
              type: "string"
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "id",
              type: "uint256"
            }
          ],
          name: "URI",
          type: "event"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256"
            }
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address[]",
              name: "accounts",
              type: "address[]"
            },
            {
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]"
            }
          ],
          name: "balanceOfBatch",
          outputs: [
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address"
            },
            {
              internalType: "address",
              name: "operator",
              type: "address"
            }
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address"
            },
            {
              internalType: "address",
              name: "to",
              type: "address"
            },
            {
              internalType: "uint256[]",
              name: "ids",
              type: "uint256[]"
            },
            {
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]"
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes"
            }
          ],
          name: "safeBatchTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address"
            },
            {
              internalType: "address",
              name: "to",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256"
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes"
            }
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address"
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool"
            }
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4"
            }
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256"
            }
          ],
          name: "uri",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string"
            }
          ],
          stateMutability: "view",
          type: "function"
        }
      ];
      erc721Abi = [
        {
          type: "event",
          name: "Approval",
          inputs: [
            {
              indexed: true,
              name: "owner",
              type: "address"
            },
            {
              indexed: true,
              name: "spender",
              type: "address"
            },
            {
              indexed: true,
              name: "tokenId",
              type: "uint256"
            }
          ]
        },
        {
          type: "event",
          name: "ApprovalForAll",
          inputs: [
            {
              indexed: true,
              name: "owner",
              type: "address"
            },
            {
              indexed: true,
              name: "operator",
              type: "address"
            },
            {
              indexed: false,
              name: "approved",
              type: "bool"
            }
          ]
        },
        {
          type: "event",
          name: "Transfer",
          inputs: [
            {
              indexed: true,
              name: "from",
              type: "address"
            },
            {
              indexed: true,
              name: "to",
              type: "address"
            },
            {
              indexed: true,
              name: "tokenId",
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "approve",
          stateMutability: "payable",
          inputs: [
            {
              name: "spender",
              type: "address"
            },
            {
              name: "tokenId",
              type: "uint256"
            }
          ],
          outputs: []
        },
        {
          type: "function",
          name: "balanceOf",
          stateMutability: "view",
          inputs: [
            {
              name: "account",
              type: "address"
            }
          ],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "getApproved",
          stateMutability: "view",
          inputs: [
            {
              name: "tokenId",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "address"
            }
          ]
        },
        {
          type: "function",
          name: "isApprovedForAll",
          stateMutability: "view",
          inputs: [
            {
              name: "owner",
              type: "address"
            },
            {
              name: "operator",
              type: "address"
            }
          ],
          outputs: [
            {
              type: "bool"
            }
          ]
        },
        {
          type: "function",
          name: "name",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "string"
            }
          ]
        },
        {
          type: "function",
          name: "ownerOf",
          stateMutability: "view",
          inputs: [
            {
              name: "tokenId",
              type: "uint256"
            }
          ],
          outputs: [
            {
              name: "owner",
              type: "address"
            }
          ]
        },
        {
          type: "function",
          name: "safeTransferFrom",
          stateMutability: "payable",
          inputs: [
            {
              name: "from",
              type: "address"
            },
            {
              name: "to",
              type: "address"
            },
            {
              name: "tokenId",
              type: "uint256"
            }
          ],
          outputs: []
        },
        {
          type: "function",
          name: "safeTransferFrom",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "from",
              type: "address"
            },
            {
              name: "to",
              type: "address"
            },
            {
              name: "id",
              type: "uint256"
            },
            {
              name: "data",
              type: "bytes"
            }
          ],
          outputs: []
        },
        {
          type: "function",
          name: "setApprovalForAll",
          stateMutability: "nonpayable",
          inputs: [
            {
              name: "operator",
              type: "address"
            },
            {
              name: "approved",
              type: "bool"
            }
          ],
          outputs: []
        },
        {
          type: "function",
          name: "symbol",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "string"
            }
          ]
        },
        {
          type: "function",
          name: "tokenByIndex",
          stateMutability: "view",
          inputs: [
            {
              name: "index",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "tokenByIndex",
          stateMutability: "view",
          inputs: [
            {
              name: "owner",
              type: "address"
            },
            {
              name: "index",
              type: "uint256"
            }
          ],
          outputs: [
            {
              name: "tokenId",
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "tokenURI",
          stateMutability: "view",
          inputs: [
            {
              name: "tokenId",
              type: "uint256"
            }
          ],
          outputs: [
            {
              type: "string"
            }
          ]
        },
        {
          type: "function",
          name: "totalSupply",
          stateMutability: "view",
          inputs: [],
          outputs: [
            {
              type: "uint256"
            }
          ]
        },
        {
          type: "function",
          name: "transferFrom",
          stateMutability: "payable",
          inputs: [
            {
              name: "sender",
              type: "address"
            },
            {
              name: "recipient",
              type: "address"
            },
            {
              name: "tokenId",
              type: "uint256"
            }
          ],
          outputs: []
        }
      ];
      erc4626Abi = [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "owner",
              type: "address"
            },
            {
              indexed: true,
              name: "spender",
              type: "address"
            },
            {
              indexed: false,
              name: "value",
              type: "uint256"
            }
          ],
          name: "Approval",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "sender",
              type: "address"
            },
            {
              indexed: true,
              name: "receiver",
              type: "address"
            },
            {
              indexed: false,
              name: "assets",
              type: "uint256"
            },
            {
              indexed: false,
              name: "shares",
              type: "uint256"
            }
          ],
          name: "Deposit",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "from",
              type: "address"
            },
            {
              indexed: true,
              name: "to",
              type: "address"
            },
            {
              indexed: false,
              name: "value",
              type: "uint256"
            }
          ],
          name: "Transfer",
          type: "event"
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "sender",
              type: "address"
            },
            {
              indexed: true,
              name: "receiver",
              type: "address"
            },
            {
              indexed: true,
              name: "owner",
              type: "address"
            },
            {
              indexed: false,
              name: "assets",
              type: "uint256"
            },
            {
              indexed: false,
              name: "shares",
              type: "uint256"
            }
          ],
          name: "Withdraw",
          type: "event"
        },
        {
          inputs: [
            {
              name: "owner",
              type: "address"
            },
            {
              name: "spender",
              type: "address"
            }
          ],
          name: "allowance",
          outputs: [
            {
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "spender",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          name: "approve",
          outputs: [
            {
              type: "bool"
            }
          ],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [],
          name: "asset",
          outputs: [
            {
              name: "assetTokenAddress",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "account",
              type: "address"
            }
          ],
          name: "balanceOf",
          outputs: [
            {
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          name: "convertToAssets",
          outputs: [
            {
              name: "assets",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "assets",
              type: "uint256"
            }
          ],
          name: "convertToShares",
          outputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "assets",
              type: "uint256"
            },
            {
              name: "receiver",
              type: "address"
            }
          ],
          name: "deposit",
          outputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              name: "caller",
              type: "address"
            }
          ],
          name: "maxDeposit",
          outputs: [
            {
              name: "maxAssets",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "caller",
              type: "address"
            }
          ],
          name: "maxMint",
          outputs: [
            {
              name: "maxShares",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "owner",
              type: "address"
            }
          ],
          name: "maxRedeem",
          outputs: [
            {
              name: "maxShares",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "owner",
              type: "address"
            }
          ],
          name: "maxWithdraw",
          outputs: [
            {
              name: "maxAssets",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "shares",
              type: "uint256"
            },
            {
              name: "receiver",
              type: "address"
            }
          ],
          name: "mint",
          outputs: [
            {
              name: "assets",
              type: "uint256"
            }
          ],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              name: "assets",
              type: "uint256"
            }
          ],
          name: "previewDeposit",
          outputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          name: "previewMint",
          outputs: [
            {
              name: "assets",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          name: "previewRedeem",
          outputs: [
            {
              name: "assets",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "assets",
              type: "uint256"
            }
          ],
          name: "previewWithdraw",
          outputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "shares",
              type: "uint256"
            },
            {
              name: "receiver",
              type: "address"
            },
            {
              name: "owner",
              type: "address"
            }
          ],
          name: "redeem",
          outputs: [
            {
              name: "assets",
              type: "uint256"
            }
          ],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [],
          name: "totalAssets",
          outputs: [
            {
              name: "totalManagedAssets",
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              type: "uint256"
            }
          ],
          stateMutability: "view",
          type: "function"
        },
        {
          inputs: [
            {
              name: "to",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          name: "transfer",
          outputs: [
            {
              type: "bool"
            }
          ],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              name: "from",
              type: "address"
            },
            {
              name: "to",
              type: "address"
            },
            {
              name: "amount",
              type: "uint256"
            }
          ],
          name: "transferFrom",
          outputs: [
            {
              type: "bool"
            }
          ],
          stateMutability: "nonpayable",
          type: "function"
        },
        {
          inputs: [
            {
              name: "assets",
              type: "uint256"
            },
            {
              name: "receiver",
              type: "address"
            },
            {
              name: "owner",
              type: "address"
            }
          ],
          name: "withdraw",
          outputs: [
            {
              name: "shares",
              type: "uint256"
            }
          ],
          stateMutability: "nonpayable",
          type: "function"
        }
      ];
    }
  });

  // node_modules/viem/constants/contract.ts
  var aggregate3Signature;
  var init_contract2 = __esm({
    "node_modules/viem/constants/contract.ts"() {
      aggregate3Signature = "0x82ad56cb";
    }
  });

  // node_modules/viem/constants/contracts.ts
  var deploylessCallViaBytecodeBytecode, deploylessCallViaFactoryBytecode, erc6492SignatureValidatorByteCode, multicall3Bytecode;
  var init_contracts = __esm({
    "node_modules/viem/constants/contracts.ts"() {
      deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
      deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
      erc6492SignatureValidatorByteCode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
      multicall3Bytecode = "0x608060405234801561001057600080fd5b506115b9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e14610325578063bce38bd714610350578063c3077fa914610380578063ee82ac5e146103b2576100f3565b80634d2301cc1461026257806372425d9d1461029f57806382ad56cb146102ca57806386d516e8146102fa576100f3565b80633408e470116100c65780633408e470146101af578063399542e9146101da5780633e64a6961461020c57806342cbb15c14610237576100f3565b80630f28c97d146100f8578063174dea7114610123578063252dba421461015357806327e86d6e14610184575b600080fd5b34801561010457600080fd5b5061010d6103ef565b60405161011a9190610c0a565b60405180910390f35b61013d60048036038101906101389190610c94565b6103f7565b60405161014a9190610e94565b60405180910390f35b61016d60048036038101906101689190610f0c565b610615565b60405161017b92919061101b565b60405180910390f35b34801561019057600080fd5b506101996107ab565b6040516101a69190611064565b60405180910390f35b3480156101bb57600080fd5b506101c46107b7565b6040516101d19190610c0a565b60405180910390f35b6101f460048036038101906101ef91906110ab565b6107bf565b6040516102039392919061110b565b60405180910390f35b34801561021857600080fd5b506102216107e1565b60405161022e9190610c0a565b60405180910390f35b34801561024357600080fd5b5061024c6107e9565b6040516102599190610c0a565b60405180910390f35b34801561026e57600080fd5b50610289600480360381019061028491906111a7565b6107f1565b6040516102969190610c0a565b60405180910390f35b3480156102ab57600080fd5b506102b4610812565b6040516102c19190610c0a565b60405180910390f35b6102e460048036038101906102df919061122a565b61081a565b6040516102f19190610e94565b60405180910390f35b34801561030657600080fd5b5061030f6109e4565b60405161031c9190610c0a565b60405180910390f35b34801561033157600080fd5b5061033a6109ec565b6040516103479190611286565b60405180910390f35b61036a600480360381019061036591906110ab565b6109f4565b6040516103779190610e94565b60405180910390f35b61039a60048036038101906103959190610f0c565b610ba6565b6040516103a99392919061110b565b60405180910390f35b3480156103be57600080fd5b506103d960048036038101906103d491906112cd565b610bca565b6040516103e69190611064565b60405180910390f35b600042905090565b60606000808484905090508067ffffffffffffffff81111561041c5761041b6112fa565b5b60405190808252806020026020018201604052801561045557816020015b610442610bd5565b81526020019060019003908161043a5790505b5092503660005b828110156105c957600085828151811061047957610478611329565b5b6020026020010151905087878381811061049657610495611329565b5b90506020028101906104a89190611367565b925060008360400135905080860195508360000160208101906104cb91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16818580606001906104f2919061138f565b604051610500929190611431565b60006040518083038185875af1925050503d806000811461053d576040519150601f19603f3d011682016040523d82523d6000602084013e610542565b606091505b5083600001846020018290528215151515815250505081516020850135176105bc577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b826001019250505061045c565b5082341461060c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610603906114a7565b60405180910390fd5b50505092915050565b6000606043915060008484905090508067ffffffffffffffff81111561063e5761063d6112fa565b5b60405190808252806020026020018201604052801561067157816020015b606081526020019060019003908161065c5790505b5091503660005b828110156107a157600087878381811061069557610694611329565b5b90506020028101906106a791906114c7565b92508260000160208101906106bc91906111a7565b73ffffffffffffffffffffffffffffffffffffffff168380602001906106e2919061138f565b6040516106f0929190611431565b6000604051808303816000865af19150503d806000811461072d576040519150601f19603f3d011682016040523d82523d6000602084013e610732565b606091505b5086848151811061074657610745611329565b5b60200260200101819052819250505080610795576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078c9061153b565b60405180910390fd5b81600101915050610678565b5050509250929050565b60006001430340905090565b600046905090565b6000806060439250434091506107d68686866109f4565b905093509350939050565b600048905090565b600043905090565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b600044905090565b606060008383905090508067ffffffffffffffff81111561083e5761083d6112fa565b5b60405190808252806020026020018201604052801561087757816020015b610864610bd5565b81526020019060019003908161085c5790505b5091503660005b828110156109db57600084828151811061089b5761089a611329565b5b602002602001015190508686838181106108b8576108b7611329565b5b90506020028101906108ca919061155b565b92508260000160208101906108df91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060400190610905919061138f565b604051610913929190611431565b6000604051808303816000865af19150503d8060008114610950576040519150601f19603f3d011682016040523d82523d6000602084013e610955565b606091505b5082600001836020018290528215151515815250505080516020840135176109cf577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b8160010191505061087e565b50505092915050565b600045905090565b600041905090565b606060008383905090508067ffffffffffffffff811115610a1857610a176112fa565b5b604051908082528060200260200182016040528015610a5157816020015b610a3e610bd5565b815260200190600190039081610a365790505b5091503660005b82811015610b9c576000848281518110610a7557610a74611329565b5b60200260200101519050868683818110610a9257610a91611329565b5b9050602002810190610aa491906114c7565b9250826000016020810190610ab991906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060200190610adf919061138f565b604051610aed929190611431565b6000604051808303816000865af19150503d8060008114610b2a576040519150601f19603f3d011682016040523d82523d6000602084013e610b2f565b606091505b508260000183602001829052821515151581525050508715610b90578060000151610b8f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b869061153b565b60405180910390fd5b5b81600101915050610a58565b5050509392505050565b6000806060610bb7600186866107bf565b8093508194508295505050509250925092565b600081409050919050565b6040518060400160405280600015158152602001606081525090565b6000819050919050565b610c0481610bf1565b82525050565b6000602082019050610c1f6000830184610bfb565b92915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f840112610c5457610c53610c2f565b5b8235905067ffffffffffffffff811115610c7157610c70610c34565b5b602083019150836020820283011115610c8d57610c8c610c39565b5b9250929050565b60008060208385031215610cab57610caa610c25565b5b600083013567ffffffffffffffff811115610cc957610cc8610c2a565b5b610cd585828601610c3e565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60008115159050919050565b610d2281610d0d565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d62578082015181840152602081019050610d47565b83811115610d71576000848401525b50505050565b6000601f19601f8301169050919050565b6000610d9382610d28565b610d9d8185610d33565b9350610dad818560208601610d44565b610db681610d77565b840191505092915050565b6000604083016000830151610dd96000860182610d19565b5060208301518482036020860152610df18282610d88565b9150508091505092915050565b6000610e0a8383610dc1565b905092915050565b6000602082019050919050565b6000610e2a82610ce1565b610e348185610cec565b935083602082028501610e4685610cfd565b8060005b85811015610e825784840389528151610e638582610dfe565b9450610e6e83610e12565b925060208a01995050600181019050610e4a565b50829750879550505050505092915050565b60006020820190508181036000830152610eae8184610e1f565b905092915050565b60008083601f840112610ecc57610ecb610c2f565b5b8235905067ffffffffffffffff811115610ee957610ee8610c34565b5b602083019150836020820283011115610f0557610f04610c39565b5b9250929050565b60008060208385031215610f2357610f22610c25565b5b600083013567ffffffffffffffff811115610f4157610f40610c2a565b5b610f4d85828601610eb6565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000610f918383610d88565b905092915050565b6000602082019050919050565b6000610fb182610f59565b610fbb8185610f64565b935083602082028501610fcd85610f75565b8060005b858110156110095784840389528151610fea8582610f85565b9450610ff583610f99565b925060208a01995050600181019050610fd1565b50829750879550505050505092915050565b60006040820190506110306000830185610bfb565b81810360208301526110428184610fa6565b90509392505050565b6000819050919050565b61105e8161104b565b82525050565b60006020820190506110796000830184611055565b92915050565b61108881610d0d565b811461109357600080fd5b50565b6000813590506110a58161107f565b92915050565b6000806000604084860312156110c4576110c3610c25565b5b60006110d286828701611096565b935050602084013567ffffffffffffffff8111156110f3576110f2610c2a565b5b6110ff86828701610eb6565b92509250509250925092565b60006060820190506111206000830186610bfb565b61112d6020830185611055565b818103604083015261113f8184610e1f565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061117482611149565b9050919050565b61118481611169565b811461118f57600080fd5b50565b6000813590506111a18161117b565b92915050565b6000602082840312156111bd576111bc610c25565b5b60006111cb84828501611192565b91505092915050565b60008083601f8401126111ea576111e9610c2f565b5b8235905067ffffffffffffffff81111561120757611206610c34565b5b60208301915083602082028301111561122357611222610c39565b5b9250929050565b6000806020838503121561124157611240610c25565b5b600083013567ffffffffffffffff81111561125f5761125e610c2a565b5b61126b858286016111d4565b92509250509250929050565b61128081611169565b82525050565b600060208201905061129b6000830184611277565b92915050565b6112aa81610bf1565b81146112b557600080fd5b50565b6000813590506112c7816112a1565b92915050565b6000602082840312156112e3576112e2610c25565b5b60006112f1848285016112b8565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b60008235600160800383360303811261138357611382611358565b5b80830191505092915050565b600080833560016020038436030381126113ac576113ab611358565b5b80840192508235915067ffffffffffffffff8211156113ce576113cd61135d565b5b6020830192506001820236038313156113ea576113e9611362565b5b509250929050565b600081905092915050565b82818337600083830152505050565b600061141883856113f2565b93506114258385846113fd565b82840190509392505050565b600061143e82848661140c565b91508190509392505050565b600082825260208201905092915050565b7f4d756c746963616c6c333a2076616c7565206d69736d61746368000000000000600082015250565b6000611491601a8361144a565b915061149c8261145b565b602082019050919050565b600060208201905081810360008301526114c081611484565b9050919050565b6000823560016040038336030381126114e3576114e2611358565b5b80830191505092915050565b7f4d756c746963616c6c333a2063616c6c206661696c6564000000000000000000600082015250565b600061152560178361144a565b9150611530826114ef565b602082019050919050565b6000602082019050818103600083015261155481611518565b9050919050565b60008235600160600383360303811261157757611576611358565b5b8083019150509291505056fea264697066735822122020c1bc9aacf8e4a6507193432a895a8e77094f45a1395583f07b24e860ef06cd64736f6c634300080c0033";
    }
  });

  // node_modules/viem/errors/chain.ts
  var ChainDoesNotSupportContract, ChainMismatchError, ChainNotFoundError, ClientChainNotConfiguredError, InvalidChainIdError;
  var init_chain = __esm({
    "node_modules/viem/errors/chain.ts"() {
      init_base();
      ChainDoesNotSupportContract = class extends BaseError2 {
        constructor({
          blockNumber,
          chain,
          contract
        }) {
          super(
            `Chain "${chain.name}" does not support contract "${contract.name}".`,
            {
              metaMessages: [
                "This could be due to any of the following:",
                ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [
                  `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`
                ] : [
                  `- The chain does not have the contract "${contract.name}" configured.`
                ]
              ],
              name: "ChainDoesNotSupportContract"
            }
          );
        }
      };
      ChainMismatchError = class extends BaseError2 {
        constructor({
          chain,
          currentChainId
        }) {
          super(
            `The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} \u2013 ${chain.name}).`,
            {
              metaMessages: [
                `Current Chain ID:  ${currentChainId}`,
                `Expected Chain ID: ${chain.id} \u2013 ${chain.name}`
              ],
              name: "ChainMismatchError"
            }
          );
        }
      };
      ChainNotFoundError = class extends BaseError2 {
        constructor() {
          super(
            [
              "No chain was provided to the request.",
              "Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient."
            ].join("\n"),
            {
              name: "ChainNotFoundError"
            }
          );
        }
      };
      ClientChainNotConfiguredError = class extends BaseError2 {
        constructor() {
          super("No chain was provided to the Client.", {
            name: "ClientChainNotConfiguredError"
          });
        }
      };
      InvalidChainIdError = class extends BaseError2 {
        constructor({ chainId }) {
          super(
            typeof chainId === "number" ? `Chain ID "${chainId}" is invalid.` : "Chain ID is invalid.",
            { name: "InvalidChainIdError" }
          );
        }
      };
    }
  });

  // node_modules/viem/utils/abi/encodeDeployData.ts
  function encodeDeployData(parameters) {
    const { abi: abi2, args, bytecode } = parameters;
    if (!args || args.length === 0) return bytecode;
    const description = abi2.find((x) => "type" in x && x.type === "constructor");
    if (!description) throw new AbiConstructorNotFoundError({ docsPath: docsPath5 });
    if (!("inputs" in description))
      throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
    if (!description.inputs || description.inputs.length === 0)
      throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
    const data = encodeAbiParameters(description.inputs, args);
    return concatHex([bytecode, data]);
  }
  var docsPath5;
  var init_encodeDeployData = __esm({
    "node_modules/viem/utils/abi/encodeDeployData.ts"() {
      init_abi();
      init_concat();
      init_encodeAbiParameters();
      docsPath5 = "/docs/contract/encodeDeployData";
    }
  });

  // node_modules/viem/utils/chain/getChainContractAddress.ts
  function getChainContractAddress({
    blockNumber,
    chain,
    contract: name
  }) {
    const contract = chain?.contracts?.[name];
    if (!contract)
      throw new ChainDoesNotSupportContract({
        chain,
        contract: { name }
      });
    if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber)
      throw new ChainDoesNotSupportContract({
        blockNumber,
        chain,
        contract: {
          name,
          blockCreated: contract.blockCreated
        }
      });
    return contract.address;
  }
  var init_getChainContractAddress = __esm({
    "node_modules/viem/utils/chain/getChainContractAddress.ts"() {
      init_chain();
    }
  });

  // node_modules/viem/utils/errors/getCallError.ts
  function getCallError(err, {
    docsPath: docsPath9,
    ...args
  }) {
    const cause = (() => {
      const cause2 = getNodeError(
        err,
        args
      );
      if (cause2 instanceof UnknownNodeError) return err;
      return cause2;
    })();
    return new CallExecutionError(cause, {
      docsPath: docsPath9,
      ...args
    });
  }
  var init_getCallError = __esm({
    "node_modules/viem/utils/errors/getCallError.ts"() {
      init_contract();
      init_node();
      init_getNodeError();
    }
  });

  // node_modules/viem/utils/promise/withResolvers.ts
  function withResolvers() {
    let resolve = () => void 0;
    let reject = () => void 0;
    const promise = new Promise((resolve_, reject_) => {
      resolve = resolve_;
      reject = reject_;
    });
    return { promise, resolve, reject };
  }
  var init_withResolvers = __esm({
    "node_modules/viem/utils/promise/withResolvers.ts"() {
    }
  });

  // node_modules/viem/utils/promise/createBatchScheduler.ts
  function createBatchScheduler({
    fn,
    id,
    shouldSplitBatch,
    wait: wait2 = 0,
    sort
  }) {
    const exec = async () => {
      const scheduler = getScheduler();
      flush();
      const args = scheduler.map(({ args: args2 }) => args2);
      if (args.length === 0) return;
      fn(args).then((data) => {
        if (sort && Array.isArray(data)) data.sort(sort);
        for (let i = 0; i < scheduler.length; i++) {
          const { resolve } = scheduler[i];
          resolve?.([data[i], data]);
        }
      }).catch((err) => {
        for (let i = 0; i < scheduler.length; i++) {
          const { reject } = scheduler[i];
          reject?.(err);
        }
      });
    };
    const flush = () => schedulerCache.delete(id);
    const getBatchedArgs = () => getScheduler().map(({ args }) => args);
    const getScheduler = () => schedulerCache.get(id) || [];
    const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
    return {
      flush,
      async schedule(args) {
        const { promise, resolve, reject } = withResolvers();
        const split2 = shouldSplitBatch?.([...getBatchedArgs(), args]);
        if (split2) exec();
        const hasActiveScheduler = getScheduler().length > 0;
        if (hasActiveScheduler) {
          setScheduler({ args, resolve, reject });
          return promise;
        }
        setScheduler({ args, resolve, reject });
        setTimeout(exec, wait2);
        return promise;
      }
    };
  }
  var schedulerCache;
  var init_createBatchScheduler = __esm({
    "node_modules/viem/utils/promise/createBatchScheduler.ts"() {
      init_withResolvers();
      schedulerCache = /* @__PURE__ */ new Map();
    }
  });

  // node_modules/viem/errors/ccip.ts
  var OffchainLookupError, OffchainLookupResponseMalformedError, OffchainLookupSenderMismatchError;
  var init_ccip = __esm({
    "node_modules/viem/errors/ccip.ts"() {
      init_stringify();
      init_base();
      init_utils3();
      OffchainLookupError = class extends BaseError2 {
        constructor({
          callbackSelector,
          cause,
          data,
          extraData,
          sender,
          urls
        }) {
          super(
            cause.shortMessage || "An error occurred while fetching for an offchain result.",
            {
              cause,
              metaMessages: [
                ...cause.metaMessages || [],
                cause.metaMessages?.length ? "" : [],
                "Offchain Gateway Call:",
                urls && [
                  "  Gateway URL(s):",
                  ...urls.map((url) => `    ${getUrl(url)}`)
                ],
                `  Sender: ${sender}`,
                `  Data: ${data}`,
                `  Callback selector: ${callbackSelector}`,
                `  Extra data: ${extraData}`
              ].flat(),
              name: "OffchainLookupError"
            }
          );
        }
      };
      OffchainLookupResponseMalformedError = class extends BaseError2 {
        constructor({ result, url }) {
          super(
            "Offchain gateway response is malformed. Response data must be a hex value.",
            {
              metaMessages: [
                `Gateway URL: ${getUrl(url)}`,
                `Response: ${stringify(result)}`
              ],
              name: "OffchainLookupResponseMalformedError"
            }
          );
        }
      };
      OffchainLookupSenderMismatchError = class extends BaseError2 {
        constructor({ sender, to }) {
          super(
            "Reverted sender address does not match target contract address (`to`).",
            {
              metaMessages: [
                `Contract address: ${to}`,
                `OffchainLookup sender address: ${sender}`
              ],
              name: "OffchainLookupSenderMismatchError"
            }
          );
        }
      };
    }
  });

  // node_modules/viem/utils/abi/decodeFunctionData.ts
  function decodeFunctionData(parameters) {
    const { abi: abi2, data } = parameters;
    const signature = slice(data, 0, 4);
    const description = abi2.find(
      (x) => x.type === "function" && signature === toFunctionSelector(formatAbiItem2(x))
    );
    if (!description)
      throw new AbiFunctionSignatureNotFoundError(signature, {
        docsPath: "/docs/contract/decodeFunctionData"
      });
    return {
      functionName: description.name,
      args: "inputs" in description && description.inputs && description.inputs.length > 0 ? decodeAbiParameters(description.inputs, slice(data, 4)) : void 0
    };
  }
  var init_decodeFunctionData = __esm({
    "node_modules/viem/utils/abi/decodeFunctionData.ts"() {
      init_abi();
      init_slice();
      init_toFunctionSelector();
      init_decodeAbiParameters();
      init_formatAbiItem2();
    }
  });

  // node_modules/viem/utils/abi/encodeErrorResult.ts
  function encodeErrorResult(parameters) {
    const { abi: abi2, errorName, args } = parameters;
    let abiItem = abi2[0];
    if (errorName) {
      const item = getAbiItem({ abi: abi2, args, name: errorName });
      if (!item) throw new AbiErrorNotFoundError(errorName, { docsPath: docsPath6 });
      abiItem = item;
    }
    if (abiItem.type !== "error")
      throw new AbiErrorNotFoundError(void 0, { docsPath: docsPath6 });
    const definition = formatAbiItem2(abiItem);
    const signature = toFunctionSelector(definition);
    let data = "0x";
    if (args && args.length > 0) {
      if (!abiItem.inputs)
        throw new AbiErrorInputsNotFoundError(abiItem.name, { docsPath: docsPath6 });
      data = encodeAbiParameters(abiItem.inputs, args);
    }
    return concatHex([signature, data]);
  }
  var docsPath6;
  var init_encodeErrorResult = __esm({
    "node_modules/viem/utils/abi/encodeErrorResult.ts"() {
      init_abi();
      init_concat();
      init_toFunctionSelector();
      init_encodeAbiParameters();
      init_formatAbiItem2();
      init_getAbiItem();
      docsPath6 = "/docs/contract/encodeErrorResult";
    }
  });

  // node_modules/viem/utils/abi/encodeFunctionResult.ts
  function encodeFunctionResult(parameters) {
    const { abi: abi2, functionName, result } = parameters;
    let abiItem = abi2[0];
    if (functionName) {
      const item = getAbiItem({ abi: abi2, name: functionName });
      if (!item) throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath7 });
      abiItem = item;
    }
    if (abiItem.type !== "function")
      throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath7 });
    if (!abiItem.outputs)
      throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath7 });
    const values = (() => {
      if (abiItem.outputs.length === 0) return [];
      if (abiItem.outputs.length === 1) return [result];
      if (Array.isArray(result)) return result;
      throw new InvalidArrayError(result);
    })();
    return encodeAbiParameters(abiItem.outputs, values);
  }
  var docsPath7;
  var init_encodeFunctionResult = __esm({
    "node_modules/viem/utils/abi/encodeFunctionResult.ts"() {
      init_abi();
      init_encodeAbiParameters();
      init_getAbiItem();
      docsPath7 = "/docs/contract/encodeFunctionResult";
    }
  });

  // node_modules/viem/utils/ens/localBatchGatewayRequest.ts
  async function localBatchGatewayRequest(parameters) {
    const { data, ccipRequest: ccipRequest2 } = parameters;
    const {
      args: [queries]
    } = decodeFunctionData({ abi: batchGatewayAbi, data });
    const failures = [];
    const responses = [];
    await Promise.all(
      queries.map(async (query, i) => {
        try {
          responses[i] = query.urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({ data: query.data, ccipRequest: ccipRequest2 }) : await ccipRequest2(query);
          failures[i] = false;
        } catch (err) {
          failures[i] = true;
          responses[i] = encodeError(err);
        }
      })
    );
    return encodeFunctionResult({
      abi: batchGatewayAbi,
      functionName: "query",
      result: [failures, responses]
    });
  }
  function encodeError(error) {
    if (error.name === "HttpRequestError" && error.status)
      return encodeErrorResult({
        abi: batchGatewayAbi,
        errorName: "HttpError",
        args: [error.status, error.shortMessage]
      });
    return encodeErrorResult({
      abi: [solidityError],
      errorName: "Error",
      args: ["shortMessage" in error ? error.shortMessage : error.message]
    });
  }
  var localBatchGatewayUrl;
  var init_localBatchGatewayRequest = __esm({
    "node_modules/viem/utils/ens/localBatchGatewayRequest.ts"() {
      init_abis();
      init_solidity();
      init_decodeFunctionData();
      init_encodeErrorResult();
      init_encodeFunctionResult();
      localBatchGatewayUrl = "x-batch-gateway:true";
    }
  });

  // node_modules/viem/utils/ccip.ts
  var ccip_exports = {};
  __export(ccip_exports, {
    ccipRequest: () => ccipRequest,
    offchainLookup: () => offchainLookup,
    offchainLookupAbiItem: () => offchainLookupAbiItem,
    offchainLookupSignature: () => offchainLookupSignature
  });
  async function offchainLookup(client, {
    blockNumber,
    blockTag,
    data,
    requestOptions,
    to
  }) {
    const { args } = decodeErrorResult({
      data,
      abi: [offchainLookupAbiItem]
    });
    const [sender, urls, callData, callbackSelector, extraData] = args;
    const { ccipRead } = client;
    const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
    try {
      if (!isAddressEqual(to, sender))
        throw new OffchainLookupSenderMismatchError({ sender, to });
      const result = urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({
        data: callData,
        ccipRequest: (parameters) => ccipRequest_({ ...parameters, requestOptions })
      }) : await ccipRequest_({ data: callData, requestOptions, sender, urls });
      const { data: data_ } = await call(client, {
        blockNumber,
        blockTag,
        data: concat([
          callbackSelector,
          encodeAbiParameters(
            [{ type: "bytes" }, { type: "bytes" }],
            [result, extraData]
          )
        ]),
        requestOptions,
        to
      });
      return data_;
    } catch (err) {
      if (requestOptions?.signal?.aborted)
        throw getAbortError(requestOptions.signal);
      if (isAbortError(err)) throw err;
      throw new OffchainLookupError({
        callbackSelector,
        cause: err,
        data,
        extraData,
        sender,
        urls
      });
    }
  }
  async function ccipRequest({
    data,
    requestOptions,
    sender,
    urls
  }) {
    let error = new Error("An unknown error occurred.");
    for (let i = 0; i < urls.length; i++) {
      if (requestOptions?.signal?.aborted)
        throw getAbortError(requestOptions.signal);
      const url = urls[i];
      const method = url.includes("{data}") ? "GET" : "POST";
      const body = method === "POST" ? { data, sender } : void 0;
      const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
      try {
        const response = await fetch(
          url.replace("{sender}", sender.toLowerCase()).replace("{data}", data),
          {
            body: JSON.stringify(body),
            headers,
            method,
            ...requestOptions?.signal ? { signal: requestOptions.signal } : {}
          }
        );
        let result;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
          result = (await response.json()).data;
        } else {
          result = await response.text();
        }
        if (!response.ok) {
          error = new HttpRequestError({
            body,
            details: result?.error ? stringify(result.error) : response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
          continue;
        }
        if (!isHex(result)) {
          error = new OffchainLookupResponseMalformedError({
            result,
            url
          });
          continue;
        }
        return result;
      } catch (err) {
        if (requestOptions?.signal?.aborted)
          throw getAbortError(requestOptions.signal);
        if (isAbortError(err)) throw err;
        error = new HttpRequestError({
          body,
          details: err.message,
          url
        });
      }
    }
    throw error;
  }
  var offchainLookupSignature, offchainLookupAbiItem;
  var init_ccip2 = __esm({
    "node_modules/viem/utils/ccip.ts"() {
      init_call();
      init_ccip();
      init_request();
      init_utils3();
      init_decodeErrorResult();
      init_encodeAbiParameters();
      init_isAddressEqual();
      init_concat();
      init_isHex();
      init_localBatchGatewayRequest();
      init_stringify();
      offchainLookupSignature = "0x556f1830";
      offchainLookupAbiItem = {
        name: "OffchainLookup",
        type: "error",
        inputs: [
          {
            name: "sender",
            type: "address"
          },
          {
            name: "urls",
            type: "string[]"
          },
          {
            name: "callData",
            type: "bytes"
          },
          {
            name: "callbackFunction",
            type: "bytes4"
          },
          {
            name: "extraData",
            type: "bytes"
          }
        ]
      };
    }
  });

  // node_modules/viem/actions/public/call.ts
  async function call(client, args) {
    const {
      account: account_ = client.account,
      authorizationList,
      batch = Boolean(client.batch?.multicall),
      blockHash,
      blockNumber,
      blockTag = client.experimental_blockTag ?? "latest",
      requireCanonical,
      accessList,
      blobs,
      blockOverrides,
      code,
      data: data_,
      factory,
      factoryData,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      requestOptions,
      to,
      value,
      stateOverride,
      ...rest
    } = args;
    const account = account_ ? parseAccount(account_) : void 0;
    if (code && (factory || factoryData))
      throw new BaseError2(
        "Cannot provide both `code` & `factory`/`factoryData` as parameters."
      );
    if (code && to)
      throw new BaseError2("Cannot provide both `code` & `to` as parameters.");
    const deploylessCallViaBytecode = code && data_;
    const deploylessCallViaFactory = factory && factoryData && to && data_;
    const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
    const data = (() => {
      if (deploylessCallViaBytecode)
        return toDeploylessCallViaBytecodeData({
          code,
          data: data_
        });
      if (deploylessCallViaFactory)
        return toDeploylessCallViaFactoryData({
          data: data_,
          factory,
          factoryData,
          to
        });
      return data_;
    })();
    try {
      assertRequest(args);
      const block = formatBlockParameter({
        blockHash,
        blockNumber,
        blockTag,
        requireCanonical
      });
      const rpcBlockOverrides = blockOverrides ? toRpc2(blockOverrides) : void 0;
      const rpcStateOverride = serializeStateOverride(stateOverride);
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format(
        {
          // Pick out extra data that might exist on the chain's transaction request type.
          ...extract(rest, { format: chainFormat }),
          accessList,
          account,
          authorizationList,
          blobs,
          data,
          gas,
          gasPrice,
          maxFeePerBlobGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to: deploylessCall ? void 0 : to,
          value
        },
        "call"
      );
      if (batch && shouldPerformMulticall({ request }) && !rpcBlockOverrides && blockHash === void 0) {
        try {
          const { deployless = false } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
          const multicallAddress = getMulticallAddress(client, {
            blockNumber,
            deployless
          });
          if (!multicallAddress || !hasStateOverrideForAddress(rpcStateOverride, multicallAddress))
            return await scheduleMulticall(client, {
              ...request,
              blockHash,
              blockNumber,
              blockTag,
              multicallAddress,
              requestOptions,
              requireCanonical,
              rpcStateOverride
            });
        } catch (err) {
          if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract))
            throw err;
        }
      }
      const params = (() => {
        const base = [
          request,
          block
        ];
        if (rpcStateOverride && rpcBlockOverrides)
          return [...base, rpcStateOverride, rpcBlockOverrides];
        if (rpcStateOverride) return [...base, rpcStateOverride];
        if (rpcBlockOverrides) return [...base, {}, rpcBlockOverrides];
        return base;
      })();
      const response = await client.request(
        {
          method: "eth_call",
          params
        },
        requestOptions
      );
      if (response === "0x") return { data: void 0 };
      return { data: response };
    } catch (err) {
      if (requestOptions?.signal?.aborted)
        throw getAbortError(requestOptions.signal);
      if (isAbortError(err)) throw err;
      const data2 = getRevertErrorData(err);
      const { offchainLookup: offchainLookup2, offchainLookupSignature: offchainLookupSignature2 } = await Promise.resolve().then(() => (init_ccip2(), ccip_exports));
      if (client.ccipRead !== false && data2?.slice(0, 10) === offchainLookupSignature2 && to)
        return {
          data: await offchainLookup2(client, { data: data2, requestOptions, to })
        };
      if (deploylessCall && data2?.slice(0, 10) === "0x101bb98d")
        throw new CounterfactualDeploymentFailedError({ factory });
      throw getCallError(err, {
        ...args,
        account,
        chain: client.chain
      });
    }
  }
  function shouldPerformMulticall({ request }) {
    const { data, to, ...request_ } = request;
    if (!data) return false;
    if (data.startsWith(aggregate3Signature)) return false;
    if (!to) return false;
    if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
      return false;
    return true;
  }
  function getRequestOptionsId(requestOptions) {
    if (!requestOptions) return "default";
    const id = requestOptionsIds.get(requestOptions);
    if (id !== void 0) return id;
    const nextId = requestOptionsId++;
    requestOptionsIds.set(requestOptions, nextId);
    return nextId;
  }
  async function scheduleMulticall(client, args) {
    const {
      batchSize = 1024,
      deployless = false,
      wait: wait2 = 0
    } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
    const {
      blockHash,
      blockNumber,
      blockTag = client.experimental_blockTag ?? "latest",
      requireCanonical,
      data,
      multicallAddress: multicallAddress_,
      requestOptions,
      rpcStateOverride,
      to
    } = args;
    const multicallAddress = multicallAddress_ !== void 0 ? multicallAddress_ : getMulticallAddress(client, {
      blockNumber,
      deployless
    });
    const block = formatBlockParameter({
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    const blockId = typeof block === "string" ? block : JSON.stringify(block);
    const stateOverrideKey = rpcStateOverride ? `.${JSON.stringify(rpcStateOverride)}` : "";
    const { schedule } = createBatchScheduler({
      id: `${client.uid}.${blockId}.${getRequestOptionsId(requestOptions)}${stateOverrideKey}`,
      wait: wait2,
      shouldSplitBatch(args2) {
        const size5 = args2.reduce((size6, { data: data2 }) => size6 + (data2.length - 2), 0);
        return size5 > batchSize * 2;
      },
      fn: async (requests) => {
        const calls = requests.map((request) => ({
          allowFailure: true,
          callData: request.data,
          target: request.to
        }));
        const calldata = encodeFunctionData({
          abi: multicall3Abi,
          args: [calls],
          functionName: "aggregate3"
        });
        const multicallRequest = {
          ...multicallAddress === null ? {
            data: toDeploylessCallViaBytecodeData({
              code: multicall3Bytecode,
              data: calldata
            })
          } : { to: multicallAddress, data: calldata }
        };
        const data2 = await client.request(
          {
            method: "eth_call",
            params: rpcStateOverride ? [multicallRequest, block, rpcStateOverride] : [multicallRequest, block]
          },
          requestOptions
        );
        return decodeFunctionResult({
          abi: multicall3Abi,
          args: [calls],
          functionName: "aggregate3",
          data: data2 || "0x"
        });
      }
    });
    const [{ returnData, success }] = await schedule({ data, to });
    if (!success) throw new RawContractError({ data: returnData });
    if (returnData === "0x") return { data: void 0 };
    return { data: returnData };
  }
  function getMulticallAddress(client, parameters) {
    const { blockNumber, deployless } = parameters;
    if (deployless) return null;
    if (client.chain)
      return getChainContractAddress({
        blockNumber,
        chain: client.chain,
        contract: "multicall3"
      });
    throw new ClientChainNotConfiguredError();
  }
  function hasStateOverrideForAddress(rpcStateOverride, address) {
    if (!rpcStateOverride) return false;
    return Object.keys(rpcStateOverride).some(
      (stateOverrideAddress) => isAddressEqual(stateOverrideAddress, address)
    );
  }
  function toDeploylessCallViaBytecodeData(parameters) {
    const { code, data } = parameters;
    return encodeDeployData({
      abi: parseAbi(["constructor(bytes, bytes)"]),
      bytecode: deploylessCallViaBytecodeBytecode,
      args: [code, data]
    });
  }
  function toDeploylessCallViaFactoryData(parameters) {
    const { data, factory, factoryData, to } = parameters;
    return encodeDeployData({
      abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
      bytecode: deploylessCallViaFactoryBytecode,
      args: [to, data, factory, factoryData]
    });
  }
  function getRevertErrorData(err) {
    if (!(err instanceof BaseError2)) return void 0;
    const error = err.walk();
    return typeof error?.data === "object" ? error.data?.data : error.data;
  }
  var requestOptionsId, requestOptionsIds;
  var init_call = __esm({
    "node_modules/viem/actions/public/call.ts"() {
      init_exports();
      init_BlockOverrides();
      init_parseAccount();
      init_abis();
      init_contract2();
      init_contracts();
      init_base();
      init_chain();
      init_contract();
      init_utils3();
      init_decodeFunctionResult();
      init_encodeDeployData();
      init_encodeFunctionData();
      init_isAddressEqual();
      init_formatBlockParameter();
      init_getChainContractAddress();
      init_getCallError();
      init_extract();
      init_transactionRequest();
      init_createBatchScheduler();
      init_stateOverride2();
      init_assertRequest();
      requestOptionsId = 0;
      requestOptionsIds = /* @__PURE__ */ new WeakMap();
    }
  });

  // node_modules/isows/_esm/utils.js
  function getNativeWebSocket() {
    if (typeof WebSocket !== "undefined")
      return WebSocket;
    if (typeof global.WebSocket !== "undefined")
      return global.WebSocket;
    if (typeof window.WebSocket !== "undefined")
      return window.WebSocket;
    if (typeof self.WebSocket !== "undefined")
      return self.WebSocket;
    throw new Error("`WebSocket` is not supported in this environment");
  }
  var init_utils5 = __esm({
    "node_modules/isows/_esm/utils.js"() {
    }
  });

  // node_modules/isows/_esm/native.js
  var native_exports = {};
  __export(native_exports, {
    WebSocket: () => WebSocket2
  });
  var WebSocket2;
  var init_native = __esm({
    "node_modules/isows/_esm/native.js"() {
      init_utils5();
      WebSocket2 = getNativeWebSocket();
    }
  });

  // node_modules/viem/index.ts
  var index_exports = {};
  __export(index_exports, {
    AbiConstructorNotFoundError: () => AbiConstructorNotFoundError,
    AbiConstructorParamsNotFoundError: () => AbiConstructorParamsNotFoundError,
    AbiDecodingDataSizeInvalidError: () => AbiDecodingDataSizeInvalidError,
    AbiDecodingDataSizeTooSmallError: () => AbiDecodingDataSizeTooSmallError,
    AbiDecodingZeroDataError: () => AbiDecodingZeroDataError,
    AbiEncodingArrayLengthMismatchError: () => AbiEncodingArrayLengthMismatchError,
    AbiEncodingBytesSizeMismatchError: () => AbiEncodingBytesSizeMismatchError,
    AbiEncodingLengthMismatchError: () => AbiEncodingLengthMismatchError,
    AbiErrorInputsNotFoundError: () => AbiErrorInputsNotFoundError,
    AbiErrorNotFoundError: () => AbiErrorNotFoundError,
    AbiErrorSignatureNotFoundError: () => AbiErrorSignatureNotFoundError,
    AbiEventNotFoundError: () => AbiEventNotFoundError,
    AbiEventSignatureEmptyTopicsError: () => AbiEventSignatureEmptyTopicsError,
    AbiEventSignatureNotFoundError: () => AbiEventSignatureNotFoundError,
    AbiFunctionNotFoundError: () => AbiFunctionNotFoundError,
    AbiFunctionOutputsNotFoundError: () => AbiFunctionOutputsNotFoundError,
    AbiFunctionSignatureNotFoundError: () => AbiFunctionSignatureNotFoundError,
    AccountStateConflictError: () => AccountStateConflictError,
    AtomicReadyWalletRejectedUpgradeError: () => AtomicReadyWalletRejectedUpgradeError,
    AtomicityNotSupportedError: () => AtomicityNotSupportedError,
    BaseError: () => BaseError2,
    BaseFeeScalarError: () => BaseFeeScalarError,
    BlockNotFoundError: () => BlockNotFoundError,
    BundleFailedError: () => BundleFailedError,
    BundleTooLargeError: () => BundleTooLargeError,
    BytesSizeMismatchError: () => BytesSizeMismatchError,
    CallExecutionError: () => CallExecutionError,
    ChainDisconnectedError: () => ChainDisconnectedError,
    ChainDoesNotSupportContract: () => ChainDoesNotSupportContract,
    ChainMismatchError: () => ChainMismatchError,
    ChainNotFoundError: () => ChainNotFoundError,
    CircularReferenceError: () => CircularReferenceError,
    ClientChainNotConfiguredError: () => ClientChainNotConfiguredError,
    ContractFunctionExecutionError: () => ContractFunctionExecutionError,
    ContractFunctionRevertedError: () => ContractFunctionRevertedError,
    ContractFunctionZeroDataError: () => ContractFunctionZeroDataError,
    CounterfactualDeploymentFailedError: () => CounterfactualDeploymentFailedError,
    DecodeLogDataMismatch: () => DecodeLogDataMismatch,
    DecodeLogTopicsMismatch: () => DecodeLogTopicsMismatch,
    DuplicateIdError: () => DuplicateIdError,
    EIP1193ProviderRpcError: () => ProviderRpcError2,
    Eip1559FeesNotSupportedError: () => Eip1559FeesNotSupportedError,
    EnsAvatarInvalidNftUriError: () => EnsAvatarInvalidNftUriError,
    EnsAvatarUnsupportedNamespaceError: () => EnsAvatarUnsupportedNamespaceError,
    EnsAvatarUriResolutionError: () => EnsAvatarUriResolutionError,
    EnsInvalidChainIdError: () => EnsInvalidChainIdError,
    EstimateGasExecutionError: () => EstimateGasExecutionError,
    ExecutionRevertedError: () => ExecutionRevertedError,
    FeeCapTooHighError: () => FeeCapTooHighError,
    FeeCapTooLowError: () => FeeCapTooLowError,
    FeeConflictError: () => FeeConflictError,
    FilterTypeNotSupportedError: () => FilterTypeNotSupportedError,
    HttpRequestError: () => HttpRequestError,
    InsufficientFundsError: () => InsufficientFundsError,
    IntegerOutOfRangeError: () => IntegerOutOfRangeError,
    InternalRpcError: () => InternalRpcError,
    IntrinsicGasTooHighError: () => IntrinsicGasTooHighError,
    IntrinsicGasTooLowError: () => IntrinsicGasTooLowError,
    InvalidAbiDecodingTypeError: () => InvalidAbiDecodingTypeError,
    InvalidAbiEncodingTypeError: () => InvalidAbiEncodingTypeError,
    InvalidAbiItemError: () => InvalidAbiItemError,
    InvalidAbiParameterError: () => InvalidAbiParameterError,
    InvalidAbiParametersError: () => InvalidAbiParametersError,
    InvalidAbiTypeParameterError: () => InvalidAbiTypeParameterError,
    InvalidAddressError: () => InvalidAddressError,
    InvalidArrayError: () => InvalidArrayError,
    InvalidBytesBooleanError: () => InvalidBytesBooleanError,
    InvalidChainIdError: () => InvalidChainIdError,
    InvalidDecimalNumberError: () => InvalidDecimalNumberError,
    InvalidDefinitionTypeError: () => InvalidDefinitionTypeError,
    InvalidDomainError: () => InvalidDomainError,
    InvalidFunctionModifierError: () => InvalidFunctionModifierError,
    InvalidHexBooleanError: () => InvalidHexBooleanError,
    InvalidHexValueError: () => InvalidHexValueError,
    InvalidInputRpcError: () => InvalidInputRpcError,
    InvalidLegacyVError: () => InvalidLegacyVError,
    InvalidModifierError: () => InvalidModifierError,
    InvalidParameterError: () => InvalidParameterError,
    InvalidParamsRpcError: () => InvalidParamsRpcError,
    InvalidParenthesisError: () => InvalidParenthesisError,
    InvalidPrimaryTypeError: () => InvalidPrimaryTypeError,
    InvalidRequestRpcError: () => InvalidRequestRpcError,
    InvalidSerializableTransactionError: () => InvalidSerializableTransactionError,
    InvalidSerializedTransactionError: () => InvalidSerializedTransactionError,
    InvalidSerializedTransactionTypeError: () => InvalidSerializedTransactionTypeError,
    InvalidSignatureError: () => InvalidSignatureError,
    InvalidStorageKeySizeError: () => InvalidStorageKeySizeError,
    InvalidStructSignatureError: () => InvalidStructSignatureError,
    InvalidStructTypeError: () => InvalidStructTypeError,
    InvalidYParityError: () => InvalidYParityError,
    JsonRpcVersionUnsupportedError: () => JsonRpcVersionUnsupportedError,
    LimitExceededRpcError: () => LimitExceededRpcError,
    MaxFeePerGasTooLowError: () => MaxFeePerGasTooLowError,
    MethodNotFoundRpcError: () => MethodNotFoundRpcError,
    MethodNotSupportedRpcError: () => MethodNotSupportedRpcError,
    NonceMaxValueError: () => NonceMaxValueError,
    NonceTooHighError: () => NonceTooHighError,
    NonceTooLowError: () => NonceTooLowError,
    ParseRpcError: () => ParseRpcError,
    ProviderDisconnectedError: () => ProviderDisconnectedError,
    ProviderRpcError: () => ProviderRpcError,
    RawContractError: () => RawContractError,
    ResourceNotFoundRpcError: () => ResourceNotFoundRpcError,
    ResourceUnavailableRpcError: () => ResourceUnavailableRpcError,
    ResponseBodyTooLargeError: () => ResponseBodyTooLargeError,
    RlpDepthLimitExceededError: () => RlpDepthLimitExceededError,
    RlpListBoundaryExceededError: () => RlpListBoundaryExceededError,
    RlpTrailingBytesError: () => RlpTrailingBytesError,
    RpcError: () => RpcError,
    RpcRequestError: () => RpcRequestError,
    SizeExceedsPaddingSizeError: () => SizeExceedsPaddingSizeError,
    SizeOverflowError: () => SizeOverflowError,
    SliceOffsetOutOfBoundsError: () => SliceOffsetOutOfBoundsError,
    SocketClosedError: () => SocketClosedError,
    SolidityProtectedKeywordError: () => SolidityProtectedKeywordError,
    StateAssignmentConflictError: () => StateAssignmentConflictError,
    SwitchChainError: () => SwitchChainError,
    TimeoutError: () => TimeoutError,
    TipAboveFeeCapError: () => TipAboveFeeCapError,
    TransactionExecutionError: () => TransactionExecutionError,
    TransactionNotFoundError: () => TransactionNotFoundError,
    TransactionReceiptNotFoundError: () => TransactionReceiptNotFoundError,
    TransactionRejectedRpcError: () => TransactionRejectedRpcError,
    TransactionTypeNotSupportedError: () => TransactionTypeNotSupportedError,
    UnauthorizedProviderError: () => UnauthorizedProviderError,
    UnknownBundleIdError: () => UnknownBundleIdError,
    UnknownNodeError: () => UnknownNodeError,
    UnknownRpcError: () => UnknownRpcError,
    UnknownSignatureError: () => UnknownSignatureError,
    UnknownTypeError: () => UnknownTypeError,
    UnsupportedChainIdError: () => UnsupportedChainIdError,
    UnsupportedNonOptionalCapabilityError: () => UnsupportedNonOptionalCapabilityError,
    UnsupportedPackedAbiType: () => UnsupportedPackedAbiType,
    UnsupportedProviderMethodError: () => UnsupportedProviderMethodError,
    UrlRequiredError: () => UrlRequiredError,
    UserRejectedRequestError: () => UserRejectedRequestError,
    WaitForCallsStatusTimeoutError: () => WaitForCallsStatusTimeoutError,
    WaitForTransactionReceiptTimeoutError: () => WaitForTransactionReceiptTimeoutError,
    WebSocketRequestError: () => WebSocketRequestError,
    assertCurrentChain: () => assertCurrentChain,
    assertRequest: () => assertRequest,
    assertTransactionEIP1559: () => assertTransactionEIP1559,
    assertTransactionEIP2930: () => assertTransactionEIP2930,
    assertTransactionLegacy: () => assertTransactionLegacy,
    blobsToCommitments: () => blobsToCommitments,
    blobsToProofs: () => blobsToProofs,
    boolToBytes: () => boolToBytes,
    boolToHex: () => boolToHex,
    bytesToBigInt: () => bytesToBigInt,
    bytesToBool: () => bytesToBool,
    bytesToHex: () => bytesToHex,
    bytesToNumber: () => bytesToNumber,
    bytesToRlp: () => bytesToRlp,
    bytesToString: () => bytesToString,
    ccipFetch: () => ccipRequest,
    ccipReadTunnel: () => ccipReadTunnel,
    ccipRequest: () => ccipRequest,
    checksumAddress: () => checksumAddress,
    commitmentToVersionedHash: () => commitmentToVersionedHash,
    commitmentsToVersionedHashes: () => commitmentsToVersionedHashes,
    compactSignatureToHex: () => serializeCompactSignature,
    compactSignatureToSignature: () => compactSignatureToSignature,
    concat: () => concat,
    concatBytes: () => concatBytes2,
    concatHex: () => concatHex,
    createClient: () => createClient,
    createNonceManager: () => createNonceManager,
    createPublicClient: () => createPublicClient,
    createTestClient: () => createTestClient,
    createTransport: () => createTransport,
    createWalletClient: () => createWalletClient,
    custom: () => custom,
    decodeAbiParameters: () => decodeAbiParameters,
    decodeDeployData: () => decodeDeployData,
    decodeErrorResult: () => decodeErrorResult,
    decodeEventLog: () => decodeEventLog,
    decodeFunctionData: () => decodeFunctionData,
    decodeFunctionResult: () => decodeFunctionResult,
    defineBlock: () => defineBlock,
    defineChain: () => defineChain,
    defineKzg: () => defineKzg,
    defineTransaction: () => defineTransaction,
    defineTransactionReceipt: () => defineTransactionReceipt,
    defineTransactionRequest: () => defineTransactionRequest,
    deploylessCallViaBytecodeBytecode: () => deploylessCallViaBytecodeBytecode,
    deploylessCallViaFactoryBytecode: () => deploylessCallViaFactoryBytecode,
    domainSeparator: () => domainSeparator,
    encodeAbiParameters: () => encodeAbiParameters,
    encodeDeployData: () => encodeDeployData,
    encodeErrorResult: () => encodeErrorResult,
    encodeEventTopics: () => encodeEventTopics,
    encodeFunctionData: () => encodeFunctionData,
    encodeFunctionResult: () => encodeFunctionResult,
    encodePacked: () => encodePacked,
    erc1155Abi: () => erc1155Abi,
    erc20Abi: () => erc20Abi,
    erc20Abi_bytes32: () => erc20Abi_bytes32,
    erc4626Abi: () => erc4626Abi,
    erc6492SignatureValidatorAbi: () => erc6492SignatureValidatorAbi,
    erc6492SignatureValidatorByteCode: () => erc6492SignatureValidatorByteCode,
    erc721Abi: () => erc721Abi,
    ethAddress: () => ethAddress,
    etherUnits: () => etherUnits,
    extendSchema: () => extendSchema,
    extractChain: () => extractChain,
    fallback: () => fallback,
    formatBlock: () => formatBlock,
    formatEther: () => formatEther,
    formatGwei: () => formatGwei,
    formatLog: () => formatLog,
    formatTransaction: () => formatTransaction,
    formatTransactionReceipt: () => formatTransactionReceipt,
    formatTransactionRequest: () => formatTransactionRequest,
    formatUnits: () => formatUnits,
    fromBlobs: () => fromBlobs,
    fromBytes: () => fromBytes,
    fromHex: () => fromHex,
    fromRlp: () => fromRlp,
    getAbiItem: () => getAbiItem,
    getAddress: () => getAddress,
    getChainContractAddress: () => getChainContractAddress,
    getContract: () => getContract,
    getContractAddress: () => getContractAddress2,
    getContractError: () => getContractError,
    getCreate2Address: () => getCreate2Address,
    getCreateAddress: () => getCreateAddress,
    getEventSelector: () => toEventSelector,
    getEventSignature: () => toSignature,
    getFunctionSelector: () => toFunctionSelector,
    getFunctionSignature: () => toSignature,
    getSerializedTransactionType: () => getSerializedTransactionType,
    getTransactionType: () => getTransactionType,
    getTypesForEIP712Domain: () => getTypesForEIP712Domain,
    gweiUnits: () => gweiUnits,
    hashDomain: () => hashDomain,
    hashMessage: () => hashMessage,
    hashStruct: () => hashStruct,
    hashTypedData: () => hashTypedData,
    hexToBigInt: () => hexToBigInt,
    hexToBool: () => hexToBool,
    hexToBytes: () => hexToBytes,
    hexToCompactSignature: () => parseCompactSignature,
    hexToNumber: () => hexToNumber,
    hexToRlp: () => hexToRlp,
    hexToSignature: () => parseSignature2,
    hexToString: () => hexToString,
    http: () => http,
    isAddress: () => isAddress,
    isAddressEqual: () => isAddressEqual,
    isBytes: () => isBytes3,
    isErc6492Signature: () => isErc6492Signature,
    isErc8010Signature: () => isErc8010Signature,
    isHash: () => isHash,
    isHex: () => isHex,
    keccak256: () => keccak256,
    labelhash: () => labelhash,
    maxInt104: () => maxInt104,
    maxInt112: () => maxInt112,
    maxInt120: () => maxInt120,
    maxInt128: () => maxInt128,
    maxInt136: () => maxInt136,
    maxInt144: () => maxInt144,
    maxInt152: () => maxInt152,
    maxInt16: () => maxInt16,
    maxInt160: () => maxInt160,
    maxInt168: () => maxInt168,
    maxInt176: () => maxInt176,
    maxInt184: () => maxInt184,
    maxInt192: () => maxInt192,
    maxInt200: () => maxInt200,
    maxInt208: () => maxInt208,
    maxInt216: () => maxInt216,
    maxInt224: () => maxInt224,
    maxInt232: () => maxInt232,
    maxInt24: () => maxInt24,
    maxInt240: () => maxInt240,
    maxInt248: () => maxInt248,
    maxInt256: () => maxInt256,
    maxInt32: () => maxInt32,
    maxInt40: () => maxInt40,
    maxInt48: () => maxInt48,
    maxInt56: () => maxInt56,
    maxInt64: () => maxInt64,
    maxInt72: () => maxInt72,
    maxInt8: () => maxInt8,
    maxInt80: () => maxInt80,
    maxInt88: () => maxInt88,
    maxInt96: () => maxInt96,
    maxUint104: () => maxUint104,
    maxUint112: () => maxUint112,
    maxUint120: () => maxUint120,
    maxUint128: () => maxUint128,
    maxUint136: () => maxUint136,
    maxUint144: () => maxUint144,
    maxUint152: () => maxUint152,
    maxUint16: () => maxUint16,
    maxUint160: () => maxUint160,
    maxUint168: () => maxUint168,
    maxUint176: () => maxUint176,
    maxUint184: () => maxUint184,
    maxUint192: () => maxUint192,
    maxUint200: () => maxUint200,
    maxUint208: () => maxUint208,
    maxUint216: () => maxUint216,
    maxUint224: () => maxUint224,
    maxUint232: () => maxUint232,
    maxUint24: () => maxUint24,
    maxUint240: () => maxUint240,
    maxUint248: () => maxUint248,
    maxUint256: () => maxUint256,
    maxUint32: () => maxUint32,
    maxUint40: () => maxUint40,
    maxUint48: () => maxUint48,
    maxUint56: () => maxUint56,
    maxUint64: () => maxUint64,
    maxUint72: () => maxUint72,
    maxUint8: () => maxUint8,
    maxUint80: () => maxUint80,
    maxUint88: () => maxUint88,
    maxUint96: () => maxUint96,
    minInt104: () => minInt104,
    minInt112: () => minInt112,
    minInt120: () => minInt120,
    minInt128: () => minInt128,
    minInt136: () => minInt136,
    minInt144: () => minInt144,
    minInt152: () => minInt152,
    minInt16: () => minInt16,
    minInt160: () => minInt160,
    minInt168: () => minInt168,
    minInt176: () => minInt176,
    minInt184: () => minInt184,
    minInt192: () => minInt192,
    minInt200: () => minInt200,
    minInt208: () => minInt208,
    minInt216: () => minInt216,
    minInt224: () => minInt224,
    minInt232: () => minInt232,
    minInt24: () => minInt24,
    minInt240: () => minInt240,
    minInt248: () => minInt248,
    minInt256: () => minInt256,
    minInt32: () => minInt32,
    minInt40: () => minInt40,
    minInt48: () => minInt48,
    minInt56: () => minInt56,
    minInt64: () => minInt64,
    minInt72: () => minInt72,
    minInt8: () => minInt8,
    minInt80: () => minInt80,
    minInt88: () => minInt88,
    minInt96: () => minInt96,
    multicall3Abi: () => multicall3Abi,
    namehash: () => namehash,
    nonceManager: () => nonceManager,
    numberToBytes: () => numberToBytes,
    numberToHex: () => numberToHex,
    offchainLookup: () => offchainLookup,
    offchainLookupAbiItem: () => offchainLookupAbiItem,
    offchainLookupSignature: () => offchainLookupSignature,
    pad: () => pad,
    padBytes: () => padBytes,
    padHex: () => padHex,
    parseAbi: () => parseAbi,
    parseAbiItem: () => parseAbiItem,
    parseAbiParameter: () => parseAbiParameter2,
    parseAbiParameters: () => parseAbiParameters,
    parseCompactSignature: () => parseCompactSignature,
    parseErc6492Signature: () => parseErc6492Signature,
    parseErc8010Signature: () => parseErc8010Signature,
    parseEther: () => parseEther,
    parseEventLogs: () => parseEventLogs,
    parseGwei: () => parseGwei,
    parseSignature: () => parseSignature2,
    parseTransaction: () => parseTransaction,
    parseUnits: () => parseUnits,
    prepareEncodeFunctionData: () => prepareEncodeFunctionData,
    presignMessagePrefix: () => presignMessagePrefix,
    publicActions: () => publicActions,
    recoverAddress: () => recoverAddress,
    recoverMessageAddress: () => recoverMessageAddress,
    recoverPublicKey: () => recoverPublicKey,
    recoverTransactionAddress: () => recoverTransactionAddress,
    recoverTypedDataAddress: () => recoverTypedDataAddress,
    ripemd160: () => ripemd1603,
    rpcSchema: () => rpcSchema,
    rpcTransactionType: () => rpcTransactionType,
    serializeAccessList: () => serializeAccessList,
    serializeCompactSignature: () => serializeCompactSignature,
    serializeErc6492Signature: () => serializeErc6492Signature,
    serializeErc8010Signature: () => serializeErc8010Signature,
    serializeSignature: () => serializeSignature,
    serializeTransaction: () => serializeTransaction,
    serializeTypedData: () => serializeTypedData,
    setErrorConfig: () => setErrorConfig,
    setupKzg: () => setupKzg,
    sha256: () => sha2563,
    shouldThrow: () => shouldThrow,
    sidecarsToVersionedHashes: () => sidecarsToVersionedHashes,
    signatureToCompactSignature: () => signatureToCompactSignature,
    signatureToHex: () => serializeSignature,
    size: () => size,
    slice: () => slice,
    sliceBytes: () => sliceBytes,
    sliceHex: () => sliceHex,
    stringToBytes: () => stringToBytes,
    stringToHex: () => stringToHex,
    stringify: () => stringify,
    testActions: () => testActions,
    toBlobSidecars: () => toBlobSidecars,
    toBlobs: () => toBlobs,
    toBytes: () => toBytes,
    toCoinType: () => toCoinType,
    toEventHash: () => toSignatureHash,
    toEventSelector: () => toEventSelector,
    toEventSignature: () => toSignature,
    toFunctionHash: () => toSignatureHash,
    toFunctionSelector: () => toFunctionSelector,
    toFunctionSignature: () => toSignature,
    toHex: () => toHex,
    toPrefixedMessage: () => toPrefixedMessage,
    toRlp: () => toRlp,
    transactionType: () => transactionType,
    trim: () => trim,
    universalSignatureValidatorAbi: () => erc6492SignatureValidatorAbi,
    universalSignatureValidatorByteCode: () => erc6492SignatureValidatorByteCode,
    validateTypedData: () => validateTypedData,
    verifyHash: () => verifyHash,
    verifyMessage: () => verifyMessage,
    verifyTypedData: () => verifyTypedData,
    walletActions: () => walletActions,
    webSocket: () => webSocket,
    weiUnits: () => weiUnits,
    withCache: () => withCache,
    withRetry: () => withRetry,
    withTimeout: () => withTimeout,
    zeroAddress: () => zeroAddress,
    zeroHash: () => zeroHash
  });
  init_exports();

  // node_modules/viem/utils/getAction.ts
  function getAction(client, actionFn, name) {
    const action_implicit = client[actionFn.name];
    if (typeof action_implicit === "function")
      return action_implicit;
    const action_explicit = client[name];
    if (typeof action_explicit === "function")
      return action_explicit;
    return (params) => actionFn(client, params);
  }

  // node_modules/viem/utils/abi/encodeEventTopics.ts
  init_abi();

  // node_modules/viem/errors/log.ts
  init_base();
  var FilterTypeNotSupportedError = class extends BaseError2 {
    constructor(type) {
      super(`Filter type "${type}" is not supported.`, {
        name: "FilterTypeNotSupportedError"
      });
    }
  };

  // node_modules/viem/utils/abi/encodeEventTopics.ts
  init_toBytes();
  init_keccak256();
  init_toEventSelector();
  init_encodeAbiParameters();
  init_formatAbiItem2();
  init_getAbiItem();
  var docsPath = "/docs/contract/encodeEventTopics";
  function encodeEventTopics(parameters) {
    const { abi: abi2, eventName, args } = parameters;
    let abiItem = abi2[0];
    if (eventName) {
      const item = getAbiItem({ abi: abi2, name: eventName });
      if (!item) throw new AbiEventNotFoundError(eventName, { docsPath });
      abiItem = item;
    }
    if (abiItem.type !== "event")
      throw new AbiEventNotFoundError(void 0, { docsPath });
    let topics = [];
    if (args && "inputs" in abiItem) {
      const indexedInputs = abiItem.inputs?.filter(
        (param) => "indexed" in param && param.indexed
      );
      const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
      if (args_.length > 0) {
        topics = indexedInputs?.map((param, i) => {
          if (Array.isArray(args_[i]))
            return args_[i].map(
              (_, j) => encodeArg({ param, value: args_[i][j] })
            );
          return typeof args_[i] !== "undefined" && args_[i] !== null ? encodeArg({ param, value: args_[i] }) : null;
        }) ?? [];
      }
    }
    if (abiItem.anonymous)
      return topics;
    const definition = formatAbiItem2(abiItem);
    const signature = toEventSelector(definition);
    return [signature, ...topics];
  }
  function encodeArg({
    param,
    value
  }) {
    if (param.type === "string" || param.type === "bytes")
      return keccak256(toBytes(value));
    if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
      throw new FilterTypeNotSupportedError(param.type);
    return encodeAbiParameters([param], [value]);
  }

  // node_modules/viem/actions/public/createContractEventFilter.ts
  init_toHex();

  // node_modules/viem/utils/filters/createFilterRequestScope.ts
  function createFilterRequestScope(client, { method }) {
    const requestMap = {};
    if (client.transport.type === "fallback")
      client.transport.onResponse?.(
        ({
          method: method_,
          response: id,
          status,
          transport
        }) => {
          if (status === "success" && method === method_)
            requestMap[id] = transport.request;
        }
      );
    return ((id) => requestMap[id] || client.request);
  }

  // node_modules/viem/actions/public/createContractEventFilter.ts
  async function createContractEventFilter(client, parameters) {
    const { address, abi: abi2, args, eventName, fromBlock, strict, toBlock } = parameters;
    const getRequest = createFilterRequestScope(client, {
      method: "eth_newFilter"
    });
    const topics = eventName ? encodeEventTopics({
      abi: abi2,
      args,
      eventName
    }) : void 0;
    const id = await client.request({
      method: "eth_newFilter",
      params: [
        {
          address,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
          topics
        }
      ]
    });
    return {
      abi: abi2,
      args,
      eventName,
      id,
      request: getRequest(id),
      strict: Boolean(strict),
      type: "event"
    };
  }

  // node_modules/viem/actions/public/estimateContractGas.ts
  init_parseAccount();
  init_encodeFunctionData();

  // node_modules/viem/utils/errors/getContractError.ts
  init_abi();
  init_base();
  init_contract();
  init_request();
  init_rpc();
  var EXECUTION_REVERTED_ERROR_CODE = 3;
  function getContractError(err, {
    abi: abi2,
    address,
    args,
    docsPath: docsPath9,
    functionName,
    sender
  }) {
    const error = err instanceof RawContractError ? err : err instanceof BaseError2 ? err.walk((err2) => "data" in err2) || err.walk() : {};
    const { code, data, details, message, shortMessage } = error;
    const cause = (() => {
      if (err instanceof AbiDecodingZeroDataError)
        return new ContractFunctionZeroDataError({ functionName, cause: err });
      if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage) || code === InvalidInputRpcError.code && details === "execution reverted" && data) {
        return new ContractFunctionRevertedError({
          abi: abi2,
          data: typeof data === "object" ? data.data : data,
          functionName,
          message: error instanceof RpcRequestError ? details : shortMessage ?? message,
          cause: err
        });
      }
      return err;
    })();
    return new ContractFunctionExecutionError(cause, {
      abi: abi2,
      args,
      contractAddress: address,
      docsPath: docsPath9,
      functionName,
      sender
    });
  }

  // node_modules/viem/actions/public/estimateGas.ts
  init_parseAccount();
  init_base();

  // node_modules/viem/accounts/utils/publicKeyToAddress.ts
  init_getAddress();
  init_keccak256();
  function publicKeyToAddress(publicKey) {
    const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
    return checksumAddress(`0x${address}`);
  }

  // node_modules/viem/utils/signature/recoverPublicKey.ts
  init_isHex();
  init_size();
  init_fromHex();
  init_toHex();
  async function recoverPublicKey({
    hash: hash3,
    signature
  }) {
    const hashHex = isHex(hash3) ? hash3 : toHex(hash3);
    const { secp256k1: secp256k12 } = await Promise.resolve().then(() => (init_secp256k1(), secp256k1_exports));
    const signature_ = (() => {
      if (typeof signature === "object" && "r" in signature && "s" in signature) {
        const { r, s, v, yParity } = signature;
        const yParityOrV2 = Number(yParity ?? v);
        const recoveryBit2 = toRecoveryBit(yParityOrV2);
        return new secp256k12.Signature(
          hexToBigInt(r),
          hexToBigInt(s)
        ).addRecoveryBit(recoveryBit2);
      }
      const signatureHex = isHex(signature) ? signature : toHex(signature);
      if (size(signatureHex) !== 65) throw new Error("invalid signature length");
      const yParityOrV = hexToNumber(`0x${signatureHex.slice(130)}`);
      const recoveryBit = toRecoveryBit(yParityOrV);
      return secp256k12.Signature.fromCompact(
        signatureHex.substring(2, 130)
      ).addRecoveryBit(recoveryBit);
    })();
    const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
    return `0x${publicKey}`;
  }
  function toRecoveryBit(yParityOrV) {
    if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;
    if (yParityOrV === 27) return 0;
    if (yParityOrV === 28) return 1;
    throw new Error("Invalid yParityOrV value");
  }

  // node_modules/viem/utils/signature/recoverAddress.ts
  async function recoverAddress({
    hash: hash3,
    signature
  }) {
    return publicKeyToAddress(await recoverPublicKey({ hash: hash3, signature }));
  }

  // node_modules/viem/utils/authorization/hashAuthorization.ts
  init_concat();
  init_toBytes();
  init_toHex();

  // node_modules/viem/utils/encoding/toRlp.ts
  init_base();
  init_cursor2();
  init_toBytes();
  init_toHex();
  function toRlp(bytes, to = "hex") {
    const encodable = getEncodable(bytes);
    const cursor = createCursor(new Uint8Array(encodable.length));
    encodable.encode(cursor);
    if (to === "hex") return bytesToHex(cursor.bytes);
    return cursor.bytes;
  }
  function bytesToRlp(bytes, to = "bytes") {
    return toRlp(bytes, to);
  }
  function hexToRlp(hex, to = "hex") {
    return toRlp(hex, to);
  }
  function getEncodable(bytes) {
    if (Array.isArray(bytes))
      return getEncodableList(bytes.map((x) => getEncodable(x)));
    return getEncodableBytes(bytes);
  }
  function getEncodableList(list) {
    const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
    const sizeOfBodyLength = getSizeOfLength(bodyLength);
    const length = (() => {
      if (bodyLength <= 55) return 1 + bodyLength;
      return 1 + sizeOfBodyLength + bodyLength;
    })();
    return {
      length,
      encode(cursor) {
        if (bodyLength <= 55) {
          cursor.pushByte(192 + bodyLength);
        } else {
          cursor.pushByte(192 + 55 + sizeOfBodyLength);
          if (sizeOfBodyLength === 1) cursor.pushUint8(bodyLength);
          else if (sizeOfBodyLength === 2) cursor.pushUint16(bodyLength);
          else if (sizeOfBodyLength === 3) cursor.pushUint24(bodyLength);
          else cursor.pushUint32(bodyLength);
        }
        for (const { encode: encode5 } of list) {
          encode5(cursor);
        }
      }
    };
  }
  function getEncodableBytes(bytesOrHex) {
    const bytes = typeof bytesOrHex === "string" ? hexToBytes(bytesOrHex) : bytesOrHex;
    const sizeOfBytesLength = getSizeOfLength(bytes.length);
    const length = (() => {
      if (bytes.length === 1 && bytes[0] < 128) return 1;
      if (bytes.length <= 55) return 1 + bytes.length;
      return 1 + sizeOfBytesLength + bytes.length;
    })();
    return {
      length,
      encode(cursor) {
        if (bytes.length === 1 && bytes[0] < 128) {
          cursor.pushBytes(bytes);
        } else if (bytes.length <= 55) {
          cursor.pushByte(128 + bytes.length);
          cursor.pushBytes(bytes);
        } else {
          cursor.pushByte(128 + 55 + sizeOfBytesLength);
          if (sizeOfBytesLength === 1) cursor.pushUint8(bytes.length);
          else if (sizeOfBytesLength === 2) cursor.pushUint16(bytes.length);
          else if (sizeOfBytesLength === 3) cursor.pushUint24(bytes.length);
          else cursor.pushUint32(bytes.length);
          cursor.pushBytes(bytes);
        }
      }
    };
  }
  function getSizeOfLength(length) {
    if (length < 2 ** 8) return 1;
    if (length < 2 ** 16) return 2;
    if (length < 2 ** 24) return 3;
    if (length < 2 ** 32) return 4;
    throw new BaseError2("Length is too large.");
  }

  // node_modules/viem/utils/authorization/hashAuthorization.ts
  init_keccak256();
  function hashAuthorization(parameters) {
    const { chainId, nonce, to } = parameters;
    const address = parameters.contractAddress ?? parameters.address;
    const hash3 = keccak256(
      concatHex([
        "0x05",
        toRlp([
          chainId ? numberToHex(chainId) : "0x",
          address,
          nonce ? numberToHex(nonce) : "0x"
        ])
      ])
    );
    if (to === "bytes") return hexToBytes(hash3);
    return hash3;
  }

  // node_modules/viem/utils/authorization/recoverAuthorizationAddress.ts
  async function recoverAuthorizationAddress(parameters) {
    const { authorization, signature } = parameters;
    return recoverAddress({
      hash: hashAuthorization(authorization),
      signature: signature ?? authorization
    });
  }

  // node_modules/viem/actions/public/estimateGas.ts
  init_toHex();

  // node_modules/viem/errors/estimateGas.ts
  init_formatEther();
  init_formatGwei();
  init_base();
  init_transaction();
  var EstimateGasExecutionError = class extends BaseError2 {
    cause;
    constructor(cause, {
      account,
      docsPath: docsPath9,
      chain,
      data,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value
    }) {
      const prettyArgs = prettyPrint({
        from: account?.address,
        to,
        value: typeof value !== "undefined" && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
        data,
        gas,
        gasPrice: typeof gasPrice !== "undefined" && `${formatGwei(gasPrice)} gwei`,
        maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei(maxFeePerGas)} gwei`,
        maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei(maxPriorityFeePerGas)} gwei`,
        nonce
      });
      super(cause.shortMessage, {
        cause,
        docsPath: docsPath9,
        metaMessages: [
          ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
          "Estimate Gas Arguments:",
          prettyArgs
        ].filter(Boolean),
        name: "EstimateGasExecutionError"
      });
      this.cause = cause;
    }
  };

  // node_modules/viem/utils/errors/getEstimateGasError.ts
  init_node();
  init_getNodeError();
  function getEstimateGasError(err, {
    docsPath: docsPath9,
    ...args
  }) {
    const cause = (() => {
      const cause2 = getNodeError(
        err,
        args
      );
      if (cause2 instanceof UnknownNodeError) return err;
      return cause2;
    })();
    return new EstimateGasExecutionError(cause, {
      docsPath: docsPath9,
      ...args
    });
  }

  // node_modules/viem/actions/public/estimateGas.ts
  init_extract();
  init_transactionRequest();
  init_stateOverride2();
  init_assertRequest();

  // node_modules/viem/actions/wallet/prepareTransactionRequest.ts
  init_parseAccount();

  // node_modules/viem/errors/fee.ts
  init_formatGwei();
  init_base();
  var BaseFeeScalarError = class extends BaseError2 {
    constructor() {
      super("`baseFeeMultiplier` must be greater than 1.", {
        name: "BaseFeeScalarError"
      });
    }
  };
  var Eip1559FeesNotSupportedError = class extends BaseError2 {
    constructor() {
      super("Chain does not support EIP-1559 fees.", {
        name: "Eip1559FeesNotSupportedError"
      });
    }
  };
  var MaxFeePerGasTooLowError = class extends BaseError2 {
    constructor({ maxPriorityFeePerGas }) {
      super(
        `\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(
          maxPriorityFeePerGas
        )} gwei).`,
        { name: "MaxFeePerGasTooLowError" }
      );
    }
  };

  // node_modules/viem/actions/public/estimateMaxPriorityFeePerGas.ts
  init_fromHex();

  // node_modules/viem/errors/block.ts
  init_base();
  var BlockNotFoundError = class extends BaseError2 {
    constructor({
      blockHash,
      blockNumber
    }) {
      let identifier = "Block";
      if (blockHash) identifier = `Block at hash "${blockHash}"`;
      if (blockNumber) identifier = `Block at number "${blockNumber}"`;
      super(`${identifier} could not be found.`, { name: "BlockNotFoundError" });
    }
  };

  // node_modules/viem/actions/public/getBlock.ts
  init_toHex();

  // node_modules/viem/utils/formatters/block.ts
  init_formatter();

  // node_modules/viem/utils/formatters/transaction.ts
  init_fromHex();
  init_formatter();
  var transactionType = {
    "0x0": "legacy",
    "0x1": "eip2930",
    "0x2": "eip1559",
    "0x3": "eip4844",
    "0x4": "eip7702"
  };
  function formatTransaction(transaction, _) {
    const transaction_ = {
      ...transaction,
      blockHash: transaction.blockHash ? transaction.blockHash : null,
      blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
      ...transaction.blockTimestamp != null && {
        blockTimestamp: BigInt(transaction.blockTimestamp)
      },
      chainId: transaction.chainId ? hexToNumber(transaction.chainId) : void 0,
      gas: transaction.gas ? BigInt(transaction.gas) : void 0,
      gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : void 0,
      maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : void 0,
      maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : void 0,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : void 0,
      nonce: transaction.nonce ? hexToNumber(transaction.nonce) : void 0,
      to: transaction.to ? transaction.to : null,
      transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
      type: transaction.type ? transactionType[transaction.type] : void 0,
      typeHex: transaction.type ? transaction.type : void 0,
      value: transaction.value ? BigInt(transaction.value) : void 0,
      v: transaction.v ? BigInt(transaction.v) : void 0
    };
    if (transaction.authorizationList)
      transaction_.authorizationList = formatAuthorizationList2(
        transaction.authorizationList
      );
    transaction_.yParity = (() => {
      if (transaction.yParity) return Number(transaction.yParity);
      if (typeof transaction_.v === "bigint") {
        if (transaction_.v === 0n || transaction_.v === 27n) return 0;
        if (transaction_.v === 1n || transaction_.v === 28n) return 1;
        if (transaction_.v >= 35n) return transaction_.v % 2n === 0n ? 1 : 0;
      }
      return void 0;
    })();
    if (transaction_.type === "legacy") {
      delete transaction_.accessList;
      delete transaction_.maxFeePerBlobGas;
      delete transaction_.maxFeePerGas;
      delete transaction_.maxPriorityFeePerGas;
      delete transaction_.yParity;
    }
    if (transaction_.type === "eip2930") {
      delete transaction_.maxFeePerBlobGas;
      delete transaction_.maxFeePerGas;
      delete transaction_.maxPriorityFeePerGas;
    }
    if (transaction_.type === "eip1559") delete transaction_.maxFeePerBlobGas;
    return transaction_;
  }
  var defineTransaction = /* @__PURE__ */ defineFormatter(
    "transaction",
    formatTransaction
  );
  function formatAuthorizationList2(authorizationList) {
    return authorizationList.map((authorization) => ({
      address: authorization.address,
      chainId: Number(authorization.chainId),
      nonce: Number(authorization.nonce),
      r: authorization.r,
      s: authorization.s,
      yParity: Number(authorization.yParity)
    }));
  }

  // node_modules/viem/utils/formatters/block.ts
  function formatBlock(block, _) {
    const transactions = (block.transactions ?? []).map((transaction) => {
      if (typeof transaction === "string") return transaction;
      return formatTransaction(transaction);
    });
    return {
      ...block,
      baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
      blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : void 0,
      difficulty: block.difficulty ? BigInt(block.difficulty) : void 0,
      excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : void 0,
      gasLimit: block.gasLimit ? BigInt(block.gasLimit) : void 0,
      gasUsed: block.gasUsed ? BigInt(block.gasUsed) : void 0,
      hash: block.hash ? block.hash : null,
      logsBloom: block.logsBloom ? block.logsBloom : null,
      nonce: block.nonce ? block.nonce : null,
      number: block.number ? BigInt(block.number) : null,
      size: block.size ? BigInt(block.size) : void 0,
      timestamp: block.timestamp ? BigInt(block.timestamp) : void 0,
      transactions,
      totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
    };
  }
  var defineBlock = /* @__PURE__ */ defineFormatter("block", formatBlock);

  // node_modules/viem/actions/public/getBlock.ts
  async function getBlock(client, {
    blockHash,
    blockNumber,
    blockTag = client.experimental_blockTag ?? "latest",
    includeTransactions: includeTransactions_
  } = {}) {
    const includeTransactions = includeTransactions_ ?? false;
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    let block = null;
    if (blockHash) {
      block = await client.request(
        {
          method: "eth_getBlockByHash",
          params: [blockHash, includeTransactions]
        },
        { dedupe: true }
      );
    } else {
      block = await client.request(
        {
          method: "eth_getBlockByNumber",
          params: [blockNumberHex || blockTag, includeTransactions]
        },
        { dedupe: Boolean(blockNumberHex) }
      );
    }
    if (!block) throw new BlockNotFoundError({ blockHash, blockNumber });
    const format = client.chain?.formatters?.block?.format || formatBlock;
    return format(block, "getBlock");
  }

  // node_modules/viem/actions/public/getGasPrice.ts
  async function getGasPrice(client) {
    const gasPrice = await client.request({
      method: "eth_gasPrice"
    });
    return BigInt(gasPrice);
  }

  // node_modules/viem/actions/public/estimateMaxPriorityFeePerGas.ts
  async function estimateMaxPriorityFeePerGas(client, args) {
    return internal_estimateMaxPriorityFeePerGas(client, args);
  }
  async function internal_estimateMaxPriorityFeePerGas(client, args) {
    const { block: block_, chain = client.chain, request } = args || {};
    try {
      const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
      if (typeof maxPriorityFeePerGas === "function") {
        const block = block_ || await getAction(client, getBlock, "getBlock")({});
        const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
          block,
          client,
          request
        });
        if (maxPriorityFeePerGas_ === null) throw new Error();
        return maxPriorityFeePerGas_;
      }
      if (typeof maxPriorityFeePerGas !== "undefined") return maxPriorityFeePerGas;
      const maxPriorityFeePerGasHex = await client.request({
        method: "eth_maxPriorityFeePerGas"
      });
      return hexToBigInt(maxPriorityFeePerGasHex);
    } catch {
      const [block, gasPrice] = await Promise.all([
        block_ ? Promise.resolve(block_) : getAction(client, getBlock, "getBlock")({}),
        getAction(client, getGasPrice, "getGasPrice")({})
      ]);
      if (typeof block.baseFeePerGas !== "bigint")
        throw new Eip1559FeesNotSupportedError();
      const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
      if (maxPriorityFeePerGas < 0n) return 0n;
      return maxPriorityFeePerGas;
    }
  }

  // node_modules/viem/actions/public/estimateFeesPerGas.ts
  async function estimateFeesPerGas(client, args) {
    return internal_estimateFeesPerGas(client, args);
  }
  async function internal_estimateFeesPerGas(client, args) {
    const {
      block: block_,
      chain = client.chain,
      request,
      type = "eip1559"
    } = args || {};
    const baseFeeMultiplier = await (async () => {
      if (typeof chain?.fees?.baseFeeMultiplier === "function")
        return chain.fees.baseFeeMultiplier({
          block: block_,
          client,
          request
        });
      return chain?.fees?.baseFeeMultiplier ?? 1.2;
    })();
    if (baseFeeMultiplier < 1) throw new BaseFeeScalarError();
    const decimals = baseFeeMultiplier.toString().split(".")[1]?.length ?? 0;
    const denominator = 10 ** decimals;
    const multiply = (base) => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
    const block = block_ ? block_ : await getAction(client, getBlock, "getBlock")({});
    if (typeof chain?.fees?.estimateFeesPerGas === "function") {
      const fees = await chain.fees.estimateFeesPerGas({
        block: block_,
        client,
        multiply,
        request,
        type
      });
      if (fees !== null) return fees;
    }
    if (type === "eip1559") {
      if (typeof block.baseFeePerGas !== "bigint")
        throw new Eip1559FeesNotSupportedError();
      const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === "bigint" ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(
        client,
        {
          block,
          chain,
          request
        }
      );
      const baseFeePerGas = multiply(block.baseFeePerGas);
      const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
      return {
        maxFeePerGas,
        maxPriorityFeePerGas
      };
    }
    const gasPrice = request?.gasPrice ?? multiply(await getAction(client, getGasPrice, "getGasPrice")({}));
    return {
      gasPrice
    };
  }

  // node_modules/viem/actions/public/getTransactionCount.ts
  init_formatBlockParameter();
  init_fromHex();
  async function getTransactionCount(client, {
    address,
    blockHash,
    blockNumber,
    blockTag = "latest",
    requireCanonical
  }) {
    const block = formatBlockParameter({
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    const count = await client.request(
      {
        method: "eth_getTransactionCount",
        params: [address, block]
      },
      {
        dedupe: typeof blockNumber === "bigint" || blockHash !== void 0
      }
    );
    return hexToNumber(count);
  }

  // node_modules/viem/utils/blob/blobsToCommitments.ts
  init_toBytes();
  init_toHex();
  function blobsToCommitments(parameters) {
    const { kzg } = parameters;
    const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
    const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
    const commitments = [];
    for (const blob of blobs)
      commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
    return to === "bytes" ? commitments : commitments.map(
      (x) => bytesToHex(x)
    );
  }

  // node_modules/viem/utils/blob/blobsToProofs.ts
  init_toBytes();
  init_toHex();
  function blobsToProofs(parameters) {
    const { kzg } = parameters;
    const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
    const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
    const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes(x)) : parameters.commitments;
    const proofs = [];
    for (let i = 0; i < blobs.length; i++) {
      const blob = blobs[i];
      const commitment = commitments[i];
      proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
    }
    return to === "bytes" ? proofs : proofs.map((x) => bytesToHex(x));
  }

  // node_modules/viem/utils/blob/commitmentToVersionedHash.ts
  init_toHex();

  // node_modules/@noble/hashes/esm/sha256.js
  init_sha2();
  var sha2562 = sha256;

  // node_modules/viem/utils/hash/sha256.ts
  init_isHex();
  init_toBytes();
  init_toHex();
  function sha2563(value, to_) {
    const to = to_ || "hex";
    const bytes = sha2562(
      isHex(value, { strict: false }) ? toBytes(value) : value
    );
    if (to === "bytes") return bytes;
    return toHex(bytes);
  }

  // node_modules/viem/utils/blob/commitmentToVersionedHash.ts
  function commitmentToVersionedHash(parameters) {
    const { commitment, version: version4 = 1 } = parameters;
    const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
    const versionedHash = sha2563(commitment, "bytes");
    versionedHash.set([version4], 0);
    return to === "bytes" ? versionedHash : bytesToHex(versionedHash);
  }

  // node_modules/viem/utils/blob/commitmentsToVersionedHashes.ts
  function commitmentsToVersionedHashes(parameters) {
    const { commitments, version: version4 } = parameters;
    const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
    const hashes = [];
    for (const commitment of commitments) {
      hashes.push(
        commitmentToVersionedHash({
          commitment,
          to,
          version: version4
        })
      );
    }
    return hashes;
  }

  // node_modules/viem/constants/blob.ts
  var blobsPerTransaction = 6;
  var bytesPerFieldElement = 32;
  var fieldElementsPerBlob = 4096;
  var bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
  var maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - // terminator byte (0x80).
  1 - // zero byte (0x00) appended to each field element.
  1 * fieldElementsPerBlob * blobsPerTransaction;

  // node_modules/viem/constants/kzg.ts
  var versionedHashVersionKzg = 1;

  // node_modules/viem/errors/blob.ts
  init_base();
  var BlobSizeTooLargeError = class extends BaseError2 {
    constructor({ maxSize, size: size5 }) {
      super("Blob size is too large.", {
        metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size5} bytes`],
        name: "BlobSizeTooLargeError"
      });
    }
  };
  var EmptyBlobError = class extends BaseError2 {
    constructor() {
      super("Blob data must not be empty.", { name: "EmptyBlobError" });
    }
  };
  var InvalidVersionedHashSizeError = class extends BaseError2 {
    constructor({
      hash: hash3,
      size: size5
    }) {
      super(`Versioned hash "${hash3}" size is invalid.`, {
        metaMessages: ["Expected: 32", `Received: ${size5}`],
        name: "InvalidVersionedHashSizeError"
      });
    }
  };
  var InvalidVersionedHashVersionError = class extends BaseError2 {
    constructor({
      hash: hash3,
      version: version4
    }) {
      super(`Versioned hash "${hash3}" version is invalid.`, {
        metaMessages: [
          `Expected: ${versionedHashVersionKzg}`,
          `Received: ${version4}`
        ],
        name: "InvalidVersionedHashVersionError"
      });
    }
  };

  // node_modules/viem/utils/blob/toBlobs.ts
  init_cursor2();
  init_size();
  init_toBytes();
  init_toHex();
  function toBlobs(parameters) {
    const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
    const data = typeof parameters.data === "string" ? hexToBytes(parameters.data) : parameters.data;
    const size_ = size(data);
    if (!size_) throw new EmptyBlobError();
    if (size_ > maxBytesPerTransaction)
      throw new BlobSizeTooLargeError({
        maxSize: maxBytesPerTransaction,
        size: size_
      });
    const blobs = [];
    let active = true;
    let position = 0;
    while (active) {
      const blob = createCursor(new Uint8Array(bytesPerBlob));
      let size5 = 0;
      while (size5 < fieldElementsPerBlob) {
        const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
        blob.pushByte(0);
        blob.pushBytes(bytes);
        if (bytes.length < 31) {
          blob.pushByte(128);
          active = false;
          break;
        }
        size5++;
        position += 31;
      }
      blobs.push(blob);
    }
    return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex(x.bytes));
  }

  // node_modules/viem/utils/blob/toBlobSidecars.ts
  function toBlobSidecars(parameters) {
    const { data, kzg, to } = parameters;
    const blobs = parameters.blobs ?? toBlobs({ data, to });
    const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
    const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
    const sidecars = [];
    for (let i = 0; i < blobs.length; i++)
      sidecars.push({
        blob: blobs[i],
        commitment: commitments[i],
        proof: proofs[i]
      });
    return sidecars;
  }

  // node_modules/viem/actions/wallet/prepareTransactionRequest.ts
  init_lru();
  init_assertRequest();

  // node_modules/viem/utils/transaction/getTransactionType.ts
  init_transaction();
  function getTransactionType(transaction) {
    if (transaction.type)
      return transaction.type;
    if (typeof transaction.authorizationList !== "undefined")
      return "eip7702";
    if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
      return "eip4844";
    if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
      return "eip1559";
    }
    if (typeof transaction.gasPrice !== "undefined") {
      if (typeof transaction.accessList !== "undefined") return "eip2930";
      return "legacy";
    }
    throw new InvalidSerializableTransactionError({ transaction });
  }

  // node_modules/viem/actions/public/fillTransaction.ts
  init_parseAccount();

  // node_modules/viem/utils/errors/getTransactionError.ts
  init_node();
  init_transaction();
  init_getNodeError();
  function getTransactionError(err, { docsPath: docsPath9, ...args }) {
    const cause = (() => {
      const cause2 = getNodeError(
        err,
        args
      );
      if (cause2 instanceof UnknownNodeError) return err;
      return cause2;
    })();
    return new TransactionExecutionError(cause, {
      docsPath: docsPath9,
      ...args
    });
  }

  // node_modules/viem/actions/public/fillTransaction.ts
  init_extract();
  init_transactionRequest();
  init_assertRequest();

  // node_modules/viem/actions/public/getChainId.ts
  init_fromHex();
  async function getChainId(client) {
    const chainIdHex = await client.request(
      {
        method: "eth_chainId"
      },
      { dedupe: true }
    );
    return hexToNumber(chainIdHex);
  }

  // node_modules/viem/actions/public/fillTransaction.ts
  async function fillTransaction(client, parameters) {
    const {
      account = client.account,
      accessList,
      authorizationList,
      chain = client.chain,
      blobVersionedHashes,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce: nonce_,
      nonceManager: nonceManager2,
      to,
      type,
      value,
      ...rest
    } = parameters;
    const nonce = await (async () => {
      if (!account) return nonce_;
      if (!nonceManager2) return nonce_;
      if (typeof nonce_ !== "undefined") return nonce_;
      const account_ = parseAccount(account);
      const chainId = chain ? chain.id : await getAction(client, getChainId, "getChainId")({});
      return await nonceManager2.consume({
        address: account_.address,
        chainId,
        client
      });
    })();
    assertRequest(parameters);
    const chainFormat = chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format(
      {
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
        account: account ? parseAccount(account) : void 0,
        accessList,
        authorizationList,
        blobs,
        blobVersionedHashes,
        data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        type,
        value
      },
      "fillTransaction"
    );
    try {
      const response = await client.request({
        method: "eth_fillTransaction",
        params: [request]
      });
      const format2 = chain?.formatters?.transaction?.format || formatTransaction;
      const transaction = format2(response.tx);
      delete transaction.blockHash;
      delete transaction.blockNumber;
      delete transaction.r;
      delete transaction.s;
      delete transaction.transactionIndex;
      delete transaction.v;
      delete transaction.yParity;
      transaction.data = transaction.input;
      if (transaction.gas) transaction.gas = parameters.gas ?? transaction.gas;
      if (transaction.gasPrice)
        transaction.gasPrice = parameters.gasPrice ?? transaction.gasPrice;
      if (transaction.maxFeePerBlobGas)
        transaction.maxFeePerBlobGas = parameters.maxFeePerBlobGas ?? transaction.maxFeePerBlobGas;
      if (transaction.maxFeePerGas)
        transaction.maxFeePerGas = parameters.maxFeePerGas ?? transaction.maxFeePerGas;
      if (transaction.maxPriorityFeePerGas)
        transaction.maxPriorityFeePerGas = parameters.maxPriorityFeePerGas ?? transaction.maxPriorityFeePerGas;
      if (typeof transaction.nonce !== "undefined")
        transaction.nonce = parameters.nonce ?? transaction.nonce;
      const feeMultiplier = await (async () => {
        if (typeof chain?.fees?.baseFeeMultiplier === "function") {
          const block = await getAction(client, getBlock, "getBlock")({});
          return chain.fees.baseFeeMultiplier({
            block,
            client,
            request: parameters
          });
        }
        return chain?.fees?.baseFeeMultiplier ?? 1.2;
      })();
      if (feeMultiplier < 1) throw new BaseFeeScalarError();
      const decimals = feeMultiplier.toString().split(".")[1]?.length ?? 0;
      const denominator = 10 ** decimals;
      const multiplyFee = (base) => base * BigInt(Math.ceil(feeMultiplier * denominator)) / BigInt(denominator);
      if (!transaction.feePayerSignature) {
        if (transaction.maxFeePerGas && !parameters.maxFeePerGas)
          transaction.maxFeePerGas = multiplyFee(transaction.maxFeePerGas);
        if (transaction.gasPrice && !parameters.gasPrice)
          transaction.gasPrice = multiplyFee(transaction.gasPrice);
      }
      return {
        raw: response.raw,
        transaction: {
          from: request.from,
          ...transaction
        },
        ...response.capabilities ? { capabilities: response.capabilities } : {}
      };
    } catch (err) {
      throw getTransactionError(
        err,
        {
          ...parameters,
          chain: client.chain
        }
      );
    }
  }

  // node_modules/viem/actions/wallet/prepareTransactionRequest.ts
  var defaultParameters = [
    "blobVersionedHashes",
    "chainId",
    "fees",
    "gas",
    "nonce",
    "type"
  ];
  var eip1559NetworkCache = /* @__PURE__ */ new Map();
  var supportsFillTransaction = /* @__PURE__ */ new LruMap(128);
  async function prepareTransactionRequest(client, args) {
    let request = args;
    request.account ??= client.account;
    request.parameters ??= defaultParameters;
    const {
      account: account_,
      chain = client.chain,
      nonceManager: nonceManager2,
      parameters
    } = request;
    const prepareTransactionRequest2 = (() => {
      if (typeof chain?.prepareTransactionRequest === "function")
        return {
          fn: chain.prepareTransactionRequest,
          runAt: ["beforeFillTransaction"]
        };
      if (Array.isArray(chain?.prepareTransactionRequest))
        return {
          fn: chain.prepareTransactionRequest[0],
          runAt: chain.prepareTransactionRequest[1].runAt
        };
      return void 0;
    })();
    let chainId;
    async function getChainId2() {
      if (chainId) return chainId;
      if (typeof request.chainId !== "undefined") return request.chainId;
      if (chain) return chain.id;
      const chainId_ = await getAction(client, getChainId, "getChainId")({});
      chainId = chainId_;
      return chainId;
    }
    const account = account_ ? parseAccount(account_) : account_;
    let nonce = request.nonce;
    if (parameters.includes("nonce") && typeof nonce === "undefined" && account && nonceManager2) {
      const chainId2 = await getChainId2();
      nonce = await nonceManager2.consume({
        address: account.address,
        chainId: chainId2,
        client
      });
    }
    if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("beforeFillTransaction")) {
      request = await prepareTransactionRequest2.fn(
        { ...request, chain },
        {
          client,
          phase: "beforeFillTransaction"
        }
      );
      nonce ??= request.nonce;
    }
    const attemptFill = (() => {
      if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && request.kzg && request.blobs)
        return false;
      if (supportsFillTransaction.get(client.uid) === false) return false;
      const shouldAttempt = ["fees", "gas"].some(
        (parameter) => parameters.includes(parameter)
      );
      if (!shouldAttempt) return false;
      if (parameters.includes("chainId") && typeof request.chainId !== "number")
        return true;
      if (parameters.includes("nonce") && typeof nonce !== "number") return true;
      if (parameters.includes("fees") && typeof request.gasPrice !== "bigint" && (typeof request.maxFeePerGas !== "bigint" || typeof request.maxPriorityFeePerGas !== "bigint"))
        return true;
      if (parameters.includes("gas") && typeof request.gas !== "bigint")
        return true;
      return false;
    })();
    const fillResult = attemptFill ? await getAction(
      client,
      fillTransaction,
      "fillTransaction"
    )({ ...request, nonce }).then((result) => {
      const {
        chainId: chainId2,
        from: from14,
        gas: gas2,
        gasPrice,
        nonce: nonce2,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        type: type2,
        ...rest
      } = result.transaction;
      const feeToken = "feeToken" in rest ? rest.feeToken : void 0;
      const hasFilledFeePayerSignature = "feePayerSignature" in rest && rest.feePayerSignature !== null && typeof rest.feePayerSignature !== "undefined";
      const shouldUseFilledFeeToken = typeof feeToken !== "undefined" && feeToken !== null && (!("feeToken" in request) || hasFilledFeePayerSignature);
      supportsFillTransaction.set(client.uid, true);
      return {
        ...request,
        ...from14 ? { from: from14 } : {},
        ...type2 && !request.type ? { type: type2 } : {},
        ...typeof chainId2 !== "undefined" ? { chainId: chainId2 } : {},
        ...typeof gas2 !== "undefined" ? { gas: gas2 } : {},
        ...typeof gasPrice !== "undefined" ? { gasPrice } : {},
        ...typeof nonce2 !== "undefined" ? { nonce: nonce2 } : {},
        ...typeof maxFeePerBlobGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxFeePerBlobGas } : {},
        ...typeof maxFeePerGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxFeePerGas } : {},
        ...typeof maxPriorityFeePerGas !== "undefined" && request.type !== "legacy" && request.type !== "eip2930" ? { maxPriorityFeePerGas } : {},
        ..."nonceKey" in rest && typeof rest.nonceKey !== "undefined" ? { nonceKey: rest.nonceKey } : {},
        ..."keyAuthorization" in rest && typeof rest.keyAuthorization !== "undefined" && rest.keyAuthorization !== null && !("keyAuthorization" in request) ? { keyAuthorization: rest.keyAuthorization } : {},
        ..."feePayerSignature" in rest && typeof rest.feePayerSignature !== "undefined" && rest.feePayerSignature !== null ? { feePayerSignature: rest.feePayerSignature } : {},
        ...shouldUseFilledFeeToken ? { feeToken } : {},
        ...result.capabilities ? { _capabilities: result.capabilities } : {}
      };
    }).catch((e) => {
      const error = e;
      if (error.name !== "TransactionExecutionError") return request;
      const executionReverted = error.walk?.((e2) => {
        const error2 = e2;
        return error2.name === "ExecutionRevertedError";
      });
      if (executionReverted) throw e;
      const unsupported = error.walk?.((e2) => {
        const error2 = e2;
        return error2.name === "MethodNotFoundRpcError" || error2.name === "MethodNotSupportedRpcError" || error2.message?.includes("eth_fillTransaction is not available");
      });
      if (unsupported) supportsFillTransaction.set(client.uid, false);
      return request;
    }) : request;
    nonce ??= fillResult.nonce;
    request = {
      ...fillResult,
      ...account ? { from: account?.address } : {},
      ...typeof nonce !== "undefined" ? { nonce } : {}
    };
    const { blobs, gas, kzg, type } = request;
    if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("beforeFillParameters")) {
      request = await prepareTransactionRequest2.fn(
        { ...request, chain },
        {
          client,
          phase: "beforeFillParameters"
        }
      );
    }
    let block;
    async function getBlock2() {
      if (block) return block;
      block = await getAction(
        client,
        getBlock,
        "getBlock"
      )({ blockTag: "latest" });
      return block;
    }
    if (parameters.includes("nonce") && typeof nonce === "undefined" && account && !nonceManager2)
      request.nonce = await getAction(
        client,
        getTransactionCount,
        "getTransactionCount"
      )({
        address: account.address,
        blockTag: "pending"
      });
    if ((parameters.includes("blobVersionedHashes") || parameters.includes("sidecars")) && blobs && kzg) {
      const commitments = blobsToCommitments({ blobs, kzg });
      if (parameters.includes("blobVersionedHashes")) {
        const versionedHashes = commitmentsToVersionedHashes({
          commitments,
          to: "hex"
        });
        request.blobVersionedHashes = versionedHashes;
      }
      if (parameters.includes("sidecars")) {
        const proofs = blobsToProofs({ blobs, commitments, kzg });
        const sidecars = toBlobSidecars({
          blobs,
          commitments,
          proofs,
          to: "hex"
        });
        request.sidecars = sidecars;
      }
    }
    if (parameters.includes("chainId")) request.chainId = await getChainId2();
    if ((parameters.includes("fees") || parameters.includes("type")) && typeof type === "undefined") {
      try {
        request.type = getTransactionType(
          request
        );
      } catch {
        let isEip1559Network = eip1559NetworkCache.get(client.uid);
        if (typeof isEip1559Network === "undefined") {
          const block2 = await getBlock2();
          isEip1559Network = typeof block2?.baseFeePerGas === "bigint";
          eip1559NetworkCache.set(client.uid, isEip1559Network);
        }
        request.type = isEip1559Network ? "eip1559" : "legacy";
      }
    }
    if (parameters.includes("fees")) {
      if (request.type !== "legacy" && request.type !== "eip2930") {
        if (typeof request.maxFeePerGas === "undefined" || typeof request.maxPriorityFeePerGas === "undefined") {
          const block2 = await getBlock2();
          const { maxFeePerGas, maxPriorityFeePerGas } = await internal_estimateFeesPerGas(client, {
            block: block2,
            chain,
            request
          });
          if (typeof request.maxPriorityFeePerGas === "undefined" && request.maxFeePerGas && request.maxFeePerGas < maxPriorityFeePerGas)
            throw new MaxFeePerGasTooLowError({
              maxPriorityFeePerGas
            });
          request.maxPriorityFeePerGas = maxPriorityFeePerGas;
          request.maxFeePerGas = maxFeePerGas;
        }
      } else {
        if (typeof request.maxFeePerGas !== "undefined" || typeof request.maxPriorityFeePerGas !== "undefined")
          throw new Eip1559FeesNotSupportedError();
        if (typeof request.gasPrice === "undefined") {
          const block2 = await getBlock2();
          const { gasPrice: gasPrice_ } = await internal_estimateFeesPerGas(
            client,
            {
              block: block2,
              chain,
              request,
              type: "legacy"
            }
          );
          request.gasPrice = gasPrice_;
        }
      }
    }
    if (parameters.includes("gas") && typeof gas === "undefined")
      request.gas = await getAction(
        client,
        estimateGas,
        "estimateGas"
      )({
        ...request,
        account,
        prepare: account?.type === "local" ? [] : ["blobVersionedHashes"]
      });
    if (prepareTransactionRequest2?.fn && prepareTransactionRequest2.runAt?.includes("afterFillParameters"))
      request = await prepareTransactionRequest2.fn(
        { ...request, chain },
        {
          client,
          phase: "afterFillParameters"
        }
      );
    assertRequest(request);
    delete request.parameters;
    return request;
  }

  // node_modules/viem/actions/public/estimateGas.ts
  async function estimateGas(client, args) {
    const { account: account_ = client.account, prepare = true } = args;
    const account = account_ ? parseAccount(account_) : void 0;
    const parameters = (() => {
      if (Array.isArray(prepare)) return prepare;
      if (account?.type !== "local") return ["blobVersionedHashes"];
      return void 0;
    })();
    try {
      const to = await (async () => {
        if (args.to) return args.to;
        if (args.authorizationList && args.authorizationList.length > 0)
          return await recoverAuthorizationAddress({
            authorization: args.authorizationList[0]
          }).catch(() => {
            throw new BaseError2(
              "`to` is required. Could not infer from `authorizationList`"
            );
          });
        return void 0;
      })();
      const {
        accessList,
        authorizationList,
        blobs,
        blobVersionedHashes,
        blockNumber,
        blockTag,
        data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        value,
        stateOverride,
        ...rest
      } = prepare ? await prepareTransactionRequest(client, {
        ...args,
        parameters,
        to
      }) : args;
      if (gas && args.gas !== gas) return gas;
      const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const rpcStateOverride = serializeStateOverride(stateOverride);
      assertRequest(args);
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format(
        {
          // Pick out extra data that might exist on the chain's transaction request type.
          ...extract(rest, { format: chainFormat }),
          account,
          accessList,
          authorizationList,
          blobs,
          blobVersionedHashes,
          data,
          gasPrice,
          maxFeePerBlobGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          to,
          value
        },
        "estimateGas"
      );
      return BigInt(
        await client.request({
          method: "eth_estimateGas",
          params: rpcStateOverride ? [
            request,
            block ?? client.experimental_blockTag ?? "latest",
            rpcStateOverride
          ] : block ? [request, block] : [request]
        })
      );
    } catch (err) {
      throw getEstimateGasError(err, {
        ...args,
        account,
        chain: client.chain
      });
    }
  }

  // node_modules/viem/actions/public/estimateContractGas.ts
  async function estimateContractGas(client, parameters) {
    const {
      abi: abi2,
      address,
      args,
      functionName,
      dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value,
      ...request
    } = parameters;
    const data = encodeFunctionData({
      abi: abi2,
      args,
      functionName
    });
    try {
      const gas = await getAction(
        client,
        estimateGas,
        "estimateGas"
      )({
        data: `${data}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
        to: address,
        ...request
      });
      return gas;
    } catch (error) {
      const account = request.account ? parseAccount(request.account) : void 0;
      throw getContractError(error, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/estimateContractGas",
        functionName,
        sender: account?.address
      });
    }
  }

  // node_modules/viem/actions/public/getContractEvents.ts
  init_getAbiItem();

  // node_modules/viem/utils/abi/parseEventLogs.ts
  init_isAddressEqual();
  init_toBytes();

  // node_modules/viem/utils/formatters/log.ts
  function formatLog(log, {
    args,
    eventName
  } = {}) {
    return {
      ...log,
      blockHash: log.blockHash ? log.blockHash : null,
      blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
      blockTimestamp: log.blockTimestamp ? BigInt(log.blockTimestamp) : log.blockTimestamp === null ? null : void 0,
      logIndex: log.logIndex ? Number(log.logIndex) : null,
      transactionHash: log.transactionHash ? log.transactionHash : null,
      transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
      ...eventName ? { args, eventName } : {}
    };
  }

  // node_modules/viem/utils/abi/parseEventLogs.ts
  init_keccak256();
  init_toEventSelector();

  // node_modules/viem/utils/abi/decodeEventLog.ts
  init_abi();
  init_cursor();
  init_size();
  init_toEventSelector();
  init_decodeAbiParameters();
  init_formatAbiItem2();
  var docsPath3 = "/docs/contract/decodeEventLog";
  function decodeEventLog(parameters) {
    const {
      abi: abi2,
      data,
      strict: strict_,
      topics
    } = parameters;
    const strict = strict_ ?? true;
    const [signature, ...argTopics] = topics;
    if (!signature) throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath3 });
    const abiItem = abi2.find(
      (x) => x.type === "event" && signature === toEventSelector(formatAbiItem2(x))
    );
    if (!(abiItem && "name" in abiItem) || abiItem.type !== "event")
      throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath3 });
    const { name, inputs } = abiItem;
    const isUnnamed = inputs?.some((x) => !("name" in x && x.name));
    const args = isUnnamed ? [] : {};
    const indexedInputs = inputs.map((x, i) => [x, i]).filter(([x]) => "indexed" in x && x.indexed);
    const missingIndexedInputs = [];
    for (let i = 0; i < indexedInputs.length; i++) {
      const [param, argIndex] = indexedInputs[i];
      const topic = argTopics[i];
      if (!topic) {
        if (strict)
          throw new DecodeLogTopicsMismatch({
            abiItem,
            param
          });
        missingIndexedInputs.push([param, argIndex]);
        continue;
      }
      args[isUnnamed ? argIndex : param.name || argIndex] = decodeTopic({
        param,
        value: topic
      });
    }
    const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
    const inputsToDecode = strict ? nonIndexedInputs : [...missingIndexedInputs.map(([param]) => param), ...nonIndexedInputs];
    if (inputsToDecode.length > 0) {
      if (data && data !== "0x") {
        try {
          const decodedData = decodeAbiParameters(
            inputsToDecode,
            data
          );
          if (decodedData) {
            let dataIndex = 0;
            if (!strict) {
              for (const [param, argIndex] of missingIndexedInputs) {
                args[isUnnamed ? argIndex : param.name || argIndex] = decodedData[dataIndex++];
              }
            }
            if (isUnnamed) {
              for (let i = 0; i < inputs.length; i++)
                if (args[i] === void 0 && dataIndex < decodedData.length)
                  args[i] = decodedData[dataIndex++];
            } else
              for (let i = 0; i < nonIndexedInputs.length; i++)
                args[nonIndexedInputs[i].name] = decodedData[dataIndex++];
          }
        } catch (err) {
          if (strict) {
            if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
              throw new DecodeLogDataMismatch({
                abiItem,
                data,
                params: inputsToDecode,
                size: size(data)
              });
            throw err;
          }
        }
      } else if (strict) {
        throw new DecodeLogDataMismatch({
          abiItem,
          data: "0x",
          params: inputsToDecode,
          size: 0
        });
      }
    }
    return {
      eventName: name,
      args: Object.values(args).length > 0 ? args : void 0
    };
  }
  function decodeTopic({ param, value }) {
    if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
      return value;
    const decodedArg = decodeAbiParameters([param], value) || [];
    return decodedArg[0];
  }

  // node_modules/viem/utils/abi/parseEventLogs.ts
  function parseEventLogs(parameters) {
    const { abi: abi2, args, logs, strict = true } = parameters;
    const eventName = (() => {
      if (!parameters.eventName) return void 0;
      if (Array.isArray(parameters.eventName)) return parameters.eventName;
      return [parameters.eventName];
    })();
    const abiTopics = abi2.filter((abiItem) => abiItem.type === "event").map((abiItem) => ({
      abi: abiItem,
      selector: toEventSelector(abiItem)
    }));
    return logs.map((log) => {
      const formattedLog = typeof log.blockNumber === "string" ? formatLog(log) : log;
      const abiItems = abiTopics.filter(
        (abiTopic) => formattedLog.topics[0] === abiTopic.selector
      );
      if (abiItems.length === 0) return null;
      let event;
      let abiItem;
      for (const item of abiItems) {
        try {
          event = decodeEventLog({
            ...formattedLog,
            abi: [item.abi],
            strict: true
          });
          abiItem = item;
          break;
        } catch {
        }
      }
      if (!event && !strict) {
        abiItem = abiItems[0];
        try {
          event = decodeEventLog({
            data: formattedLog.data,
            topics: formattedLog.topics,
            abi: [abiItem.abi],
            strict: false
          });
        } catch {
          const isUnnamed = abiItem.abi.inputs?.some(
            (x) => !("name" in x && x.name)
          );
          return {
            ...formattedLog,
            args: isUnnamed ? [] : {},
            eventName: abiItem.abi.name
          };
        }
      }
      if (!event || !abiItem) return null;
      if (eventName && !eventName.includes(event.eventName)) return null;
      if (!includesArgs({
        args: event.args,
        inputs: abiItem.abi.inputs,
        matchArgs: args
      }))
        return null;
      return { ...event, ...formattedLog };
    }).filter(Boolean);
  }
  function includesArgs(parameters) {
    const { args, inputs, matchArgs } = parameters;
    if (!matchArgs) return true;
    if (!args) return false;
    function isEqual2(input, value, arg) {
      try {
        if (input.type === "address")
          return isAddressEqual(value, arg);
        if (input.type === "string" || input.type === "bytes")
          return keccak256(toBytes(value)) === arg;
        return value === arg;
      } catch {
        return false;
      }
    }
    if (Array.isArray(args) && Array.isArray(matchArgs)) {
      return matchArgs.every((value, index2) => {
        if (value === null || value === void 0) return true;
        const input = inputs[index2];
        if (!input) return false;
        const value_ = Array.isArray(value) ? value : [value];
        return value_.some((value2) => isEqual2(input, value2, args[index2]));
      });
    }
    if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
      return Object.entries(matchArgs).every(([key, value]) => {
        if (value === null || value === void 0) return true;
        const input = inputs.find((input2) => input2.name === key);
        if (!input) return false;
        const value_ = Array.isArray(value) ? value : [value];
        return value_.some(
          (value2) => isEqual2(input, value2, args[key])
        );
      });
    return false;
  }

  // node_modules/viem/actions/public/getLogs.ts
  init_toHex();
  async function getLogs(client, {
    address,
    blockHash,
    fromBlock,
    toBlock,
    event,
    events: events_,
    args,
    strict: strict_
  } = {}) {
    const strict = strict_ ?? false;
    const events = events_ ?? (event ? [event] : void 0);
    let topics = [];
    if (events) {
      const encoded = events.flatMap(
        (event2) => encodeEventTopics({
          abi: [event2],
          eventName: event2.name,
          args: events_ ? void 0 : args
        })
      );
      topics = [encoded];
      if (event) topics = topics[0];
    }
    let logs;
    if (blockHash) {
      logs = await client.request({
        method: "eth_getLogs",
        params: [{ address, topics, blockHash }]
      });
    } else {
      logs = await client.request({
        method: "eth_getLogs",
        params: [
          {
            address,
            topics,
            fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
            toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock
          }
        ]
      });
    }
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!events)
      return formattedLogs;
    return parseEventLogs({
      abi: events,
      args,
      logs: formattedLogs,
      strict
    });
  }

  // node_modules/viem/actions/public/getContractEvents.ts
  async function getContractEvents(client, parameters) {
    const {
      abi: abi2,
      address,
      args,
      blockHash,
      eventName,
      fromBlock,
      toBlock,
      strict
    } = parameters;
    const event = eventName ? getAbiItem({ abi: abi2, name: eventName }) : void 0;
    const events = !event ? abi2.filter((x) => x.type === "event") : void 0;
    return getAction(
      client,
      getLogs,
      "getLogs"
    )({
      address,
      args,
      blockHash,
      event,
      events,
      fromBlock,
      toBlock,
      strict
    });
  }

  // node_modules/viem/actions/public/readContract.ts
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_call();
  async function readContract(client, parameters) {
    const { abi: abi2, address, args, functionName, ...rest } = parameters;
    const calldata = encodeFunctionData({
      abi: abi2,
      args,
      functionName
    });
    try {
      const { data } = await getAction(
        client,
        call,
        "call"
      )({
        ...rest,
        data: calldata,
        to: address
      });
      return decodeFunctionResult({
        abi: abi2,
        args,
        functionName,
        data: data || "0x"
      });
    } catch (error) {
      throw getContractError(error, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/readContract",
        functionName
      });
    }
  }

  // node_modules/viem/actions/public/simulateContract.ts
  init_parseAccount();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_call();
  async function simulateContract(client, parameters) {
    const {
      abi: abi2,
      address,
      args,
      functionName,
      dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value,
      ...callRequest
    } = parameters;
    const account = callRequest.account ? parseAccount(callRequest.account) : client.account;
    const calldata = encodeFunctionData({ abi: abi2, args, functionName });
    try {
      const { data } = await getAction(
        client,
        call,
        "call"
      )({
        batch: false,
        data: `${calldata}${dataSuffix ? dataSuffix.replace("0x", "") : ""}`,
        to: address,
        ...callRequest,
        account
      });
      const result = decodeFunctionResult({
        abi: abi2,
        args,
        functionName,
        data: data || "0x"
      });
      const minimizedAbi = abi2.filter(
        (abiItem) => "name" in abiItem && abiItem.name === parameters.functionName
      );
      return {
        result,
        request: {
          abi: minimizedAbi,
          address,
          args,
          dataSuffix,
          functionName,
          ...callRequest,
          account
        }
      };
    } catch (error) {
      throw getContractError(error, {
        abi: abi2,
        address,
        args,
        docsPath: "/docs/contract/simulateContract",
        functionName,
        sender: account?.address
      });
    }
  }

  // node_modules/viem/actions/public/watchContractEvent.ts
  init_abi();
  init_rpc();

  // node_modules/viem/utils/observe.ts
  var listenersCache = /* @__PURE__ */ new Map();
  var cleanupCache = /* @__PURE__ */ new Map();
  var callbackCount = 0;
  function observe(observerId, callbacks, fn) {
    const callbackId = ++callbackCount;
    const getListeners = () => listenersCache.get(observerId) || [];
    const unsubscribe = () => {
      const listeners2 = getListeners();
      const nextListeners = listeners2.filter((cb) => cb.id !== callbackId);
      if (nextListeners.length === 0) {
        listenersCache.delete(observerId);
        cleanupCache.delete(observerId);
        return;
      }
      listenersCache.set(observerId, nextListeners);
    };
    const unwatch = () => {
      const listeners2 = getListeners();
      if (!listeners2.some((cb) => cb.id === callbackId)) return;
      const cleanup2 = cleanupCache.get(observerId);
      if (listeners2.length === 1 && cleanup2) {
        const p = cleanup2();
        if (p instanceof Promise) p.catch(() => {
        });
      }
      unsubscribe();
    };
    const listeners = getListeners();
    listenersCache.set(observerId, [
      ...listeners,
      { id: callbackId, fns: callbacks }
    ]);
    if (listeners && listeners.length > 0) return unwatch;
    const emit = {};
    for (const key in callbacks) {
      emit[key] = ((...args) => {
        const listeners2 = getListeners();
        if (listeners2.length === 0) return;
        for (const listener of listeners2) listener.fns[key]?.(...args);
      });
    }
    const cleanup = fn(emit);
    if (typeof cleanup === "function") cleanupCache.set(observerId, cleanup);
    return unwatch;
  }

  // node_modules/viem/utils/wait.ts
  init_utils3();
  async function wait(time, { signal } = {}) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(getAbortError(signal));
        return;
      }
      const cleanup = () => signal?.removeEventListener("abort", onAbort);
      const timeout = setTimeout(() => {
        cleanup();
        resolve();
      }, time);
      const onAbort = () => {
        clearTimeout(timeout);
        cleanup();
        reject(getAbortError(signal));
      };
      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }

  // node_modules/viem/utils/poll.ts
  function poll(fn, { emitOnBegin, initialWaitTime, interval }) {
    let active = true;
    const unwatch = () => active = false;
    const watch = async () => {
      let data;
      if (emitOnBegin) data = await fn({ unpoll: unwatch });
      const initialWait = await initialWaitTime?.(data) ?? interval;
      await wait(initialWait);
      const poll2 = async () => {
        if (!active) return;
        await fn({ unpoll: unwatch });
        await wait(interval);
        poll2();
      };
      poll2();
    };
    watch();
    return unwatch;
  }

  // node_modules/viem/actions/public/watchContractEvent.ts
  init_stringify();

  // node_modules/viem/utils/promise/withCache.ts
  var promiseCache = /* @__PURE__ */ new Map();
  var responseCache = /* @__PURE__ */ new Map();
  function getCache(cacheKey2) {
    const buildCache = (cacheKey3, cache) => ({
      clear: () => cache.delete(cacheKey3),
      get: () => cache.get(cacheKey3),
      set: (data) => cache.set(cacheKey3, data)
    });
    const promise = buildCache(cacheKey2, promiseCache);
    const response = buildCache(
      cacheKey2,
      responseCache
    );
    return {
      clear: () => {
        promise.clear();
        response.clear();
      },
      promise,
      response
    };
  }
  async function withCache(fn, { cacheKey: cacheKey2, cacheTime = Number.POSITIVE_INFINITY }) {
    const cache = getCache(cacheKey2);
    const response = cache.response.get();
    if (response && cacheTime > 0) {
      const age = Date.now() - response.created.getTime();
      if (age < cacheTime) return response.data;
    }
    let promise = cache.promise.get();
    if (!promise) {
      promise = fn();
      cache.promise.set(promise);
    }
    try {
      const data = await promise;
      cache.response.set({ created: /* @__PURE__ */ new Date(), data });
      return data;
    } finally {
      cache.promise.clear();
    }
  }

  // node_modules/viem/actions/public/getBlockNumber.ts
  var cacheKey = (id) => `blockNumber.${id}`;
  async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
    const blockNumberHex = await withCache(
      () => client.request({
        method: "eth_blockNumber"
      }),
      { cacheKey: cacheKey(client.uid), cacheTime }
    );
    return BigInt(blockNumberHex);
  }

  // node_modules/viem/actions/public/getFilterChanges.ts
  async function getFilterChanges(_client, {
    filter
  }) {
    const strict = "strict" in filter && filter.strict;
    const logs = await filter.request({
      method: "eth_getFilterChanges",
      params: [filter.id]
    });
    if (typeof logs[0] === "string")
      return logs;
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!("abi" in filter) || !filter.abi)
      return formattedLogs;
    return parseEventLogs({
      abi: filter.abi,
      logs: formattedLogs,
      strict
    });
  }

  // node_modules/viem/actions/public/uninstallFilter.ts
  async function uninstallFilter(_client, { filter }) {
    return filter.request({
      method: "eth_uninstallFilter",
      params: [filter.id]
    });
  }

  // node_modules/viem/actions/public/watchContractEvent.ts
  function watchContractEvent(client, parameters) {
    const {
      abi: abi2,
      address,
      args,
      batch = true,
      eventName,
      fromBlock,
      onError,
      onLogs,
      poll: poll_,
      pollingInterval = client.pollingInterval,
      strict: strict_
    } = parameters;
    const enablePolling = (() => {
      if (typeof poll_ !== "undefined") return poll_;
      if (typeof fromBlock === "bigint") return true;
      if (client.transport.type === "webSocket" || client.transport.type === "ipc")
        return false;
      if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
        return false;
      return true;
    })();
    const pollContractEvent = () => {
      const strict = strict_ ?? false;
      const observerId = stringify([
        "watchContractEvent",
        address,
        args,
        batch,
        client.uid,
        eventName,
        pollingInterval,
        strict,
        fromBlock
      ]);
      return observe(observerId, { onLogs, onError }, (emit) => {
        let previousBlockNumber;
        if (fromBlock !== void 0) previousBlockNumber = fromBlock - 1n;
        let filter;
        let initialized = false;
        const unwatch = poll(
          async () => {
            if (!initialized) {
              try {
                filter = await getAction(
                  client,
                  createContractEventFilter,
                  "createContractEventFilter"
                )({
                  abi: abi2,
                  address,
                  args,
                  eventName,
                  strict,
                  fromBlock
                });
              } catch {
              }
              initialized = true;
              return;
            }
            try {
              let logs;
              if (filter) {
                logs = await getAction(
                  client,
                  getFilterChanges,
                  "getFilterChanges"
                )({ filter });
              } else {
                const blockNumber = await getAction(
                  client,
                  getBlockNumber,
                  "getBlockNumber"
                )({});
                if (previousBlockNumber && previousBlockNumber < blockNumber) {
                  logs = await getAction(
                    client,
                    getContractEvents,
                    "getContractEvents"
                  )({
                    abi: abi2,
                    address,
                    args,
                    eventName,
                    fromBlock: previousBlockNumber + 1n,
                    toBlock: blockNumber,
                    strict
                  });
                } else {
                  logs = [];
                }
                previousBlockNumber = blockNumber;
              }
              if (logs.length === 0) return;
              if (batch) emit.onLogs(logs);
              else for (const log of logs) emit.onLogs([log]);
            } catch (err) {
              if (filter && err instanceof InvalidInputRpcError)
                initialized = false;
              emit.onError?.(err);
            }
          },
          {
            emitOnBegin: true,
            interval: pollingInterval
          }
        );
        return async () => {
          if (filter)
            await getAction(
              client,
              uninstallFilter,
              "uninstallFilter"
            )({ filter });
          unwatch();
        };
      });
    };
    const subscribeContractEvent = () => {
      const strict = strict_ ?? false;
      const observerId = stringify([
        "watchContractEvent",
        address,
        args,
        batch,
        client.uid,
        eventName,
        pollingInterval,
        strict
      ]);
      let active = true;
      let unsubscribe = () => active = false;
      return observe(observerId, { onLogs, onError }, (emit) => {
        ;
        (async () => {
          try {
            const transport = (() => {
              if (client.transport.type === "fallback") {
                const transport2 = client.transport.transports.find(
                  (transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc"
                );
                if (!transport2) return client.transport;
                return transport2.value;
              }
              return client.transport;
            })();
            const topics = eventName ? encodeEventTopics({
              abi: abi2,
              eventName,
              args
            }) : [];
            const { unsubscribe: unsubscribe_ } = await transport.subscribe({
              params: ["logs", { address, topics }],
              onData(data) {
                if (!active) return;
                const log = data.result;
                try {
                  const { eventName: eventName2, args: args2 } = decodeEventLog({
                    abi: abi2,
                    data: log.data,
                    topics: log.topics,
                    strict: strict_
                  });
                  const formatted = formatLog(log, {
                    args: args2,
                    eventName: eventName2
                  });
                  emit.onLogs([formatted]);
                } catch (err) {
                  let eventName2;
                  let isUnnamed;
                  if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                    if (strict_) return;
                    eventName2 = err.abiItem.name;
                    isUnnamed = err.abiItem.inputs?.some(
                      (x) => !("name" in x && x.name)
                    );
                  }
                  const formatted = formatLog(log, {
                    args: isUnnamed ? [] : {},
                    eventName: eventName2
                  });
                  emit.onLogs([formatted]);
                }
              },
              onError(error) {
                emit.onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active) unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return () => unsubscribe();
      });
    };
    return enablePolling ? pollContractEvent() : subscribeContractEvent();
  }

  // node_modules/viem/actions/wallet/writeContract.ts
  init_parseAccount();

  // node_modules/viem/errors/account.ts
  init_base();
  var AccountNotFoundError = class extends BaseError2 {
    constructor({ docsPath: docsPath9 } = {}) {
      super(
        [
          "Could not find an Account to execute with this Action.",
          "Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client."
        ].join("\n"),
        {
          docsPath: docsPath9,
          docsSlug: "account",
          name: "AccountNotFoundError"
        }
      );
    }
  };
  var AccountTypeNotSupportedError = class extends BaseError2 {
    constructor({
      docsPath: docsPath9,
      metaMessages,
      type
    }) {
      super(`Account type "${type}" is not supported.`, {
        docsPath: docsPath9,
        metaMessages,
        name: "AccountTypeNotSupportedError"
      });
    }
  };

  // node_modules/viem/actions/wallet/writeContract.ts
  init_encodeFunctionData();

  // node_modules/viem/actions/wallet/sendTransaction.ts
  init_parseAccount();
  init_base();

  // node_modules/viem/utils/chain/assertCurrentChain.ts
  init_chain();
  function assertCurrentChain({
    chain,
    currentChainId
  }) {
    if (!chain) throw new ChainNotFoundError();
    if (currentChainId !== chain.id)
      throw new ChainMismatchError({ chain, currentChainId });
  }

  // node_modules/viem/actions/wallet/sendTransaction.ts
  init_concat();
  init_extract();
  init_transactionRequest();
  init_lru();
  init_assertRequest();

  // node_modules/viem/actions/wallet/sendRawTransaction.ts
  async function sendRawTransaction(client, { serializedTransaction }) {
    return client.request(
      {
        method: "eth_sendRawTransaction",
        params: [serializedTransaction]
      },
      { retryCount: 0 }
    );
  }

  // node_modules/viem/actions/wallet/sendTransaction.ts
  var supportsWalletNamespace = new LruMap(128);
  async function sendTransaction(client, parameters) {
    const {
      account: account_ = client.account,
      assertChainId = true,
      chain = client.chain,
      accessList,
      authorizationList,
      blobs,
      data,
      dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      type,
      value,
      ...rest
    } = parameters;
    if (typeof account_ === "undefined")
      throw new AccountNotFoundError({
        docsPath: "/docs/actions/wallet/sendTransaction"
      });
    const account = account_ ? parseAccount(account_) : null;
    let nonceManagerParameters;
    try {
      assertRequest(parameters);
      const to = await (async () => {
        if (parameters.to) return parameters.to;
        if (parameters.to === null) return void 0;
        if (authorizationList && authorizationList.length > 0)
          return await recoverAuthorizationAddress({
            authorization: authorizationList[0]
          }).catch(() => {
            throw new BaseError2(
              "`to` is required. Could not infer from `authorizationList`."
            );
          });
        return void 0;
      })();
      if (account?.type === "json-rpc" || account === null) {
        let chainId;
        if (chain !== null) {
          chainId = await getAction(client, getChainId, "getChainId")({});
          if (assertChainId)
            assertCurrentChain({
              currentChainId: chainId,
              chain
            });
        }
        const chainFormat = client.chain?.formatters?.transactionRequest?.format;
        const format = chainFormat || formatTransactionRequest;
        const request = format(
          {
            // Pick out extra data that might exist on the chain's transaction request type.
            ...extract(rest, { format: chainFormat }),
            accessList,
            account,
            authorizationList,
            blobs,
            chainId,
            data: dataSuffix ? concat([data ?? "0x", dataSuffix]) : data,
            gas,
            gasPrice,
            maxFeePerBlobGas,
            maxFeePerGas,
            maxPriorityFeePerGas,
            nonce,
            to,
            type,
            value
          },
          "sendTransaction"
        );
        const isWalletNamespaceSupported = supportsWalletNamespace.get(client.uid);
        const method = isWalletNamespaceSupported ? "wallet_sendTransaction" : "eth_sendTransaction";
        try {
          return await client.request(
            {
              method,
              params: [request]
            },
            { retryCount: 0 }
          );
        } catch (e) {
          if (isWalletNamespaceSupported === false) throw e;
          const error = e;
          if (error.name === "InvalidInputRpcError" || error.name === "InvalidParamsRpcError" || error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError") {
            return await client.request(
              {
                method: "wallet_sendTransaction",
                params: [request]
              },
              { retryCount: 0 }
            ).then((hash3) => {
              supportsWalletNamespace.set(client.uid, true);
              return hash3;
            }).catch((e2) => {
              const walletNamespaceError = e2;
              if (walletNamespaceError.name === "MethodNotFoundRpcError" || walletNamespaceError.name === "MethodNotSupportedRpcError") {
                supportsWalletNamespace.set(client.uid, false);
                throw error;
              }
              throw walletNamespaceError;
            });
          }
          throw error;
        }
      }
      if (account?.type === "local") {
        if (account.nonceManager && typeof nonce === "undefined") {
          const requestChainId = rest.chainId;
          const chainId = await (async () => {
            if (typeof requestChainId === "number") return requestChainId;
            if (chain) return chain.id;
            return getAction(client, getChainId, "getChainId")({});
          })();
          nonceManagerParameters = { address: account.address, chainId };
        }
        const request = await getAction(
          client,
          prepareTransactionRequest,
          "prepareTransactionRequest"
        )({
          account,
          accessList,
          authorizationList,
          blobs,
          chain,
          data: dataSuffix ? concat([data ?? "0x", dataSuffix]) : data,
          gas,
          gasPrice,
          maxFeePerBlobGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          nonceManager: account.nonceManager,
          parameters: [...defaultParameters, "sidecars"],
          type,
          value,
          ...rest,
          to
        });
        const serializer = chain?.serializers?.transaction;
        const serializedTransaction = await account.signTransaction(
          request,
          {
            serializer
          }
        );
        return await getAction(
          client,
          sendRawTransaction,
          "sendRawTransaction"
        )({
          serializedTransaction
        });
      }
      if (account?.type === "smart")
        throw new AccountTypeNotSupportedError({
          metaMessages: [
            "Consider using the `sendUserOperation` Action instead."
          ],
          docsPath: "/docs/actions/bundler/sendUserOperation",
          type: "smart"
        });
      throw new AccountTypeNotSupportedError({
        docsPath: "/docs/actions/wallet/sendTransaction",
        type: account?.type
      });
    } catch (err) {
      if (err instanceof AccountTypeNotSupportedError) throw err;
      if (nonceManagerParameters)
        account?.nonceManager?.reset(nonceManagerParameters);
      throw getTransactionError(err, {
        ...parameters,
        account,
        chain: parameters.chain || void 0
      });
    }
  }

  // node_modules/viem/actions/wallet/writeContract.ts
  async function writeContract(client, parameters) {
    return writeContract.internal(
      client,
      sendTransaction,
      "sendTransaction",
      parameters
    );
  }
  ((writeContract2) => {
    async function internal(client, actionFn, name, parameters) {
      const {
        abi: abi2,
        account: account_ = client.account,
        address,
        args,
        functionName,
        ...request
      } = parameters;
      if (typeof account_ === "undefined")
        throw new AccountNotFoundError({
          docsPath: "/docs/contract/writeContract"
        });
      const account = account_ ? parseAccount(account_) : null;
      const data = encodeFunctionData({
        abi: abi2,
        args,
        functionName
      });
      try {
        return await getAction(
          client,
          actionFn,
          name
        )({
          data,
          to: address,
          account,
          ...request
        });
      } catch (error) {
        throw getContractError(error, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/writeContract",
          functionName,
          sender: account?.address
        });
      }
    }
    writeContract2.internal = internal;
  })(writeContract || (writeContract = {}));

  // node_modules/viem/actions/getContract.ts
  function getContract({
    abi: abi2,
    address,
    client: client_
  }) {
    const client = client_;
    const [publicClient, walletClient] = (() => {
      if (!client) return [void 0, void 0];
      if ("public" in client && "wallet" in client)
        return [client.public, client.wallet];
      if ("public" in client) return [client.public, void 0];
      if ("wallet" in client) return [void 0, client.wallet];
      return [client, client];
    })();
    const hasPublicClient = publicClient !== void 0 && publicClient !== null;
    const hasWalletClient = walletClient !== void 0 && walletClient !== null;
    const contract = {};
    let hasReadFunction = false;
    let hasWriteFunction = false;
    let hasEvent = false;
    for (const item of abi2) {
      if (item.type === "function")
        if (item.stateMutability === "view" || item.stateMutability === "pure")
          hasReadFunction = true;
        else hasWriteFunction = true;
      else if (item.type === "event") hasEvent = true;
      if (hasReadFunction && hasWriteFunction && hasEvent) break;
    }
    if (hasPublicClient) {
      if (hasReadFunction)
        contract.read = new Proxy(
          {},
          {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return getAction(
                  publicClient,
                  readContract,
                  "readContract"
                )({
                  abi: abi2,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          }
        );
      if (hasWriteFunction)
        contract.simulate = new Proxy(
          {},
          {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return getAction(
                  publicClient,
                  simulateContract,
                  "simulateContract"
                )({
                  abi: abi2,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          }
        );
      if (hasEvent) {
        contract.createEventFilter = new Proxy(
          {},
          {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi2.find(
                  (x) => x.type === "event" && x.name === eventName
                );
                const { args, options } = getEventParameters(
                  parameters,
                  abiEvent
                );
                return getAction(
                  publicClient,
                  createContractEventFilter,
                  "createContractEventFilter"
                )({
                  abi: abi2,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          }
        );
        contract.getEvents = new Proxy(
          {},
          {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi2.find(
                  (x) => x.type === "event" && x.name === eventName
                );
                const { args, options } = getEventParameters(
                  parameters,
                  abiEvent
                );
                return getAction(
                  publicClient,
                  getContractEvents,
                  "getContractEvents"
                )({
                  abi: abi2,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          }
        );
        contract.watchEvent = new Proxy(
          {},
          {
            get(_, eventName) {
              return (...parameters) => {
                const abiEvent = abi2.find(
                  (x) => x.type === "event" && x.name === eventName
                );
                const { args, options } = getEventParameters(
                  parameters,
                  abiEvent
                );
                return getAction(
                  publicClient,
                  watchContractEvent,
                  "watchContractEvent"
                )({
                  abi: abi2,
                  address,
                  eventName,
                  args,
                  ...options
                });
              };
            }
          }
        );
      }
    }
    if (hasWalletClient) {
      if (hasWriteFunction)
        contract.write = new Proxy(
          {},
          {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                return getAction(
                  walletClient,
                  writeContract,
                  "writeContract"
                )({
                  abi: abi2,
                  address,
                  functionName,
                  args,
                  ...options
                });
              };
            }
          }
        );
    }
    if (hasPublicClient || hasWalletClient) {
      if (hasWriteFunction)
        contract.estimateGas = new Proxy(
          {},
          {
            get(_, functionName) {
              return (...parameters) => {
                const { args, options } = getFunctionParameters(parameters);
                const client2 = publicClient ?? walletClient;
                return getAction(
                  client2,
                  estimateContractGas,
                  "estimateContractGas"
                )({
                  abi: abi2,
                  address,
                  functionName,
                  args,
                  ...options,
                  account: options.account ?? walletClient.account
                });
              };
            }
          }
        );
    }
    contract.address = address;
    contract.abi = abi2;
    return contract;
  }
  function getFunctionParameters(values) {
    const hasArgs = values.length && Array.isArray(values[0]);
    const args = hasArgs ? values[0] : [];
    const options = (hasArgs ? values[1] : values[0]) ?? {};
    return { args, options };
  }
  function getEventParameters(values, abiEvent) {
    let hasArgs = false;
    if (Array.isArray(values[0])) hasArgs = true;
    else if (values.length === 1) {
      hasArgs = abiEvent.inputs.some((x) => x.indexed);
    } else if (values.length === 2) {
      hasArgs = true;
    }
    const args = hasArgs ? values[0] : void 0;
    const options = (hasArgs ? values[1] : values[0]) ?? {};
    return { args, options };
  }

  // node_modules/viem/actions/wallet/waitForCallsStatus.ts
  init_base();

  // node_modules/viem/errors/calls.ts
  init_base();
  var BundleFailedError = class extends BaseError2 {
    result;
    constructor(result) {
      super(`Call bundle failed with status: ${result.statusCode}`, {
        name: "BundleFailedError"
      });
      this.result = result;
    }
  };

  // node_modules/viem/actions/wallet/waitForCallsStatus.ts
  init_withResolvers();

  // node_modules/viem/utils/promise/withRetry.ts
  init_utils3();
  function withRetry(fn, {
    delay: delay_ = 100,
    retryCount = 2,
    shouldRetry: shouldRetry2 = () => true,
    signal
  } = {}) {
    return new Promise((resolve, reject) => {
      const attemptRetry = async ({ count = 0 } = {}) => {
        if (signal?.aborted) {
          reject(getAbortError(signal));
          return;
        }
        const retry = async ({ error }) => {
          const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
          if (delay) {
            try {
              await wait(delay, { signal });
            } catch (err) {
              reject(err);
              return;
            }
          }
          attemptRetry({ count: count + 1 });
        };
        try {
          const data = await fn();
          resolve(data);
        } catch (err) {
          if (signal?.aborted) {
            reject(getAbortError(signal));
            return;
          }
          if (isAbortError(err)) {
            reject(err);
            return;
          }
          if (count < retryCount && await shouldRetry2({ count, error: err }))
            return retry({ error: err });
          reject(err);
        }
      };
      attemptRetry();
    });
  }

  // node_modules/viem/actions/wallet/waitForCallsStatus.ts
  init_stringify();

  // node_modules/viem/actions/wallet/getCallsStatus.ts
  init_slice();
  init_trim();
  init_fromHex();

  // node_modules/viem/utils/formatters/transactionReceipt.ts
  init_fromHex();
  init_formatter();
  var receiptStatuses = {
    "0x0": "reverted",
    "0x1": "success"
  };
  function formatTransactionReceipt(transactionReceipt, _) {
    const receipt = {
      ...transactionReceipt,
      blockNumber: transactionReceipt.blockNumber ? BigInt(transactionReceipt.blockNumber) : null,
      contractAddress: transactionReceipt.contractAddress ? transactionReceipt.contractAddress : null,
      cumulativeGasUsed: transactionReceipt.cumulativeGasUsed ? BigInt(transactionReceipt.cumulativeGasUsed) : null,
      effectiveGasPrice: transactionReceipt.effectiveGasPrice ? BigInt(transactionReceipt.effectiveGasPrice) : null,
      gasUsed: transactionReceipt.gasUsed ? BigInt(transactionReceipt.gasUsed) : null,
      logs: transactionReceipt.logs ? transactionReceipt.logs.map((log) => formatLog(log)) : null,
      to: transactionReceipt.to ? transactionReceipt.to : null,
      transactionIndex: transactionReceipt.transactionIndex ? hexToNumber(transactionReceipt.transactionIndex) : null,
      status: transactionReceipt.status ? receiptStatuses[transactionReceipt.status] : null,
      type: transactionReceipt.type ? transactionType[transactionReceipt.type] || transactionReceipt.type : null
    };
    if (transactionReceipt.blobGasPrice)
      receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
    if (transactionReceipt.blobGasUsed)
      receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
    return receipt;
  }
  var defineTransactionReceipt = /* @__PURE__ */ defineFormatter(
    "transactionReceipt",
    formatTransactionReceipt
  );

  // node_modules/viem/actions/wallet/sendCalls.ts
  init_parseAccount();
  init_base();
  init_rpc();
  init_encodeFunctionData();
  init_concat();
  init_fromHex();
  init_toHex();
  var fallbackMagicIdentifier = "0x5792579257925792579257925792579257925792579257925792579257925792";
  var fallbackTransactionErrorMagicIdentifier = numberToHex(0, {
    size: 32
  });
  async function sendCalls(client, parameters) {
    const {
      account: account_ = client.account,
      chain = client.chain,
      experimental_fallback,
      experimental_fallbackDelay = 32,
      forceAtomic = false,
      id,
      version: version4 = "2.0.0"
    } = parameters;
    const account = account_ ? parseAccount(account_) : null;
    let capabilities = parameters.capabilities;
    if (client.dataSuffix && !parameters.capabilities?.dataSuffix) {
      if (typeof client.dataSuffix === "string")
        capabilities = {
          ...parameters.capabilities,
          dataSuffix: { value: client.dataSuffix, optional: true }
        };
      else
        capabilities = {
          ...parameters.capabilities,
          dataSuffix: {
            value: client.dataSuffix.value,
            ...client.dataSuffix.required ? {} : { optional: true }
          }
        };
    }
    const calls = parameters.calls.map((call_) => {
      const call2 = call_;
      const data = call2.abi ? encodeFunctionData({
        abi: call2.abi,
        functionName: call2.functionName,
        args: call2.args
      }) : call2.data;
      return {
        data: call2.dataSuffix && data ? concat([data, call2.dataSuffix]) : data,
        to: call2.to,
        value: call2.value ? numberToHex(call2.value) : void 0
      };
    });
    try {
      const response = await client.request(
        {
          method: "wallet_sendCalls",
          params: [
            {
              atomicRequired: forceAtomic,
              calls,
              capabilities,
              chainId: numberToHex(chain.id),
              from: account?.address,
              id,
              version: version4
            }
          ]
        },
        { retryCount: 0 }
      );
      if (typeof response === "string") return { id: response };
      return response;
    } catch (err) {
      const error = err;
      if (experimental_fallback && (error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError" || error.name === "UnknownRpcError" || error.details.toLowerCase().includes("does not exist / is not available") || error.details.toLowerCase().includes("missing or invalid. request()") || error.details.toLowerCase().includes("did not match any variant of untagged enum") || error.details.toLowerCase().includes("account upgraded to unsupported contract") || error.details.toLowerCase().includes("eip-7702 not supported") || error.details.toLowerCase().includes("unsupported wc_ method") || // magic.link
      error.details.toLowerCase().includes("feature toggled misconfigured") || // Trust Wallet
      error.details.toLowerCase().includes(
        "jsonrpcengine: response has no error or result for request"
      ))) {
        if (capabilities) {
          const hasNonOptionalCapability = Object.values(capabilities).some(
            (capability) => !capability.optional
          );
          if (hasNonOptionalCapability) {
            const message = "non-optional `capabilities` are not supported on fallback to `eth_sendTransaction`.";
            throw new UnsupportedNonOptionalCapabilityError(
              new BaseError2(message, {
                details: message
              })
            );
          }
        }
        if (forceAtomic && calls.length > 1) {
          const message = "`forceAtomic` is not supported on fallback to `eth_sendTransaction`.";
          throw new AtomicityNotSupportedError(
            new BaseError2(message, {
              details: message
            })
          );
        }
        const results = [];
        for (const call2 of calls) {
          try {
            const value = await sendTransaction(client, {
              account,
              chain,
              data: call2.data,
              to: call2.to,
              value: call2.value ? hexToBigInt(call2.value) : void 0
            });
            results.push({ status: "fulfilled", value });
          } catch (reason) {
            results.push({ reason, status: "rejected" });
          }
          if (experimental_fallbackDelay > 0)
            await new Promise(
              (resolve) => setTimeout(resolve, experimental_fallbackDelay)
            );
        }
        if (results.every((r) => r.status === "rejected")) throw results[0].reason;
        const hashes = results.map((result) => {
          if (result.status === "fulfilled") return result.value;
          return fallbackTransactionErrorMagicIdentifier;
        });
        return {
          id: concat([
            ...hashes,
            numberToHex(chain.id, { size: 32 }),
            fallbackMagicIdentifier
          ])
        };
      }
      throw getTransactionError(err, {
        ...parameters,
        account,
        chain: parameters.chain
      });
    }
  }

  // node_modules/viem/actions/wallet/getCallsStatus.ts
  async function getCallsStatus(client, parameters) {
    async function getStatus(id) {
      const isTransactions = id.endsWith(fallbackMagicIdentifier.slice(2));
      if (isTransactions) {
        const chainId2 = trim(sliceHex(id, -64, -32));
        const hashes = sliceHex(id, 0, -64).slice(2).match(/.{1,64}/g);
        const receipts2 = await Promise.all(
          hashes.map(
            (hash3) => fallbackTransactionErrorMagicIdentifier.slice(2) !== hash3 ? client.request(
              {
                method: "eth_getTransactionReceipt",
                params: [`0x${hash3}`]
              },
              { dedupe: true }
            ) : void 0
          )
        );
        const status2 = (() => {
          if (receipts2.some((r) => r === null)) return 100;
          if (receipts2.every((r) => r?.status === "0x1")) return 200;
          if (receipts2.every((r) => r?.status === "0x0")) return 500;
          return 600;
        })();
        return {
          atomic: false,
          chainId: hexToNumber(chainId2),
          receipts: receipts2.filter(Boolean),
          status: status2,
          version: "2.0.0"
        };
      }
      return client.request({
        method: "wallet_getCallsStatus",
        params: [id]
      });
    }
    const {
      atomic = false,
      chainId,
      receipts,
      version: version4 = "2.0.0",
      ...response
    } = await getStatus(parameters.id);
    const [status, statusCode] = (() => {
      const statusCode2 = response.status;
      if (statusCode2 >= 100 && statusCode2 < 200)
        return ["pending", statusCode2];
      if (statusCode2 >= 200 && statusCode2 < 300)
        return ["success", statusCode2];
      if (statusCode2 >= 300 && statusCode2 < 700)
        return ["failure", statusCode2];
      if (statusCode2 === "CONFIRMED") return ["success", 200];
      if (statusCode2 === "PENDING") return ["pending", 100];
      return [void 0, statusCode2];
    })();
    return {
      ...response,
      atomic,
      // @ts-expect-error: for backwards compatibility
      chainId: chainId ? hexToNumber(chainId) : void 0,
      receipts: receipts?.map((receipt) => ({
        ...receipt,
        blockNumber: hexToBigInt(receipt.blockNumber),
        gasUsed: hexToBigInt(receipt.gasUsed),
        status: receiptStatuses[receipt.status]
      })) ?? [],
      statusCode,
      status,
      version: version4
    };
  }

  // node_modules/viem/actions/wallet/waitForCallsStatus.ts
  async function waitForCallsStatus(client, parameters) {
    const {
      id,
      pollingInterval = client.pollingInterval,
      status = ({ statusCode }) => statusCode === 200 || statusCode >= 300,
      retryCount = 4,
      retryDelay = ({ count }) => ~~(1 << count) * 200,
      // exponential backoff
      timeout = 6e4,
      throwOnFailure = false
    } = parameters;
    const observerId = stringify(["waitForCallsStatus", client.uid, id]);
    const { promise, resolve, reject } = withResolvers();
    let timer;
    const unobserve = observe(observerId, { resolve, reject }, (emit) => {
      const unpoll = poll(
        async () => {
          const done = (fn) => {
            clearTimeout(timer);
            unpoll();
            fn();
            unobserve();
          };
          try {
            const result = await withRetry(
              async () => {
                const result2 = await getAction(
                  client,
                  getCallsStatus,
                  "getCallsStatus"
                )({ id });
                if (throwOnFailure && result2.status === "failure")
                  throw new BundleFailedError(result2);
                return result2;
              },
              {
                retryCount,
                delay: retryDelay
              }
            );
            if (!status(result)) return;
            done(() => emit.resolve(result));
          } catch (error) {
            done(() => emit.reject(error));
          }
        },
        {
          interval: pollingInterval,
          emitOnBegin: true
        }
      );
      return unpoll;
    });
    timer = timeout ? setTimeout(() => {
      unobserve();
      clearTimeout(timer);
      reject(new WaitForCallsStatusTimeoutError({ id }));
    }, timeout) : void 0;
    return await promise;
  }
  var WaitForCallsStatusTimeoutError = class extends BaseError2 {
    constructor({ id }) {
      super(
        `Timed out while waiting for call bundle with id "${id}" to be confirmed.`,
        { name: "WaitForCallsStatusTimeoutError" }
      );
    }
  };

  // node_modules/viem/clients/createClient.ts
  init_parseAccount();

  // node_modules/viem/utils/uid.ts
  var size4 = 256;
  var index = size4;
  var buffer;
  function uid(length = 11) {
    if (!buffer || index + length > size4 * 2) {
      buffer = "";
      index = 0;
      for (let i = 0; i < size4; i++) {
        buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
      }
    }
    return buffer.substring(index, index++ + length);
  }

  // node_modules/viem/clients/createClient.ts
  function createClient(parameters) {
    const {
      batch,
      chain,
      ccipRead,
      dataSuffix,
      key = "base",
      name = "Base Client",
      tokens,
      type = "base"
    } = parameters;
    const experimental_blockTag = parameters.experimental_blockTag ?? (typeof chain?.experimental_preconfirmationTime === "number" ? "pending" : void 0);
    const blockTime = chain?.blockTime ?? 12e3;
    const defaultPollingInterval = Math.min(
      Math.max(Math.floor(blockTime / 2), 500),
      4e3
    );
    const pollingInterval = parameters.pollingInterval ?? defaultPollingInterval;
    const cacheTime = parameters.cacheTime ?? pollingInterval;
    const account = parameters.account ? parseAccount(parameters.account) : void 0;
    const { config, request, value } = parameters.transport({
      account,
      chain,
      pollingInterval
    });
    const transport = { ...config, ...value };
    const client = {
      account,
      batch,
      cacheTime,
      ccipRead,
      chain,
      dataSuffix,
      key,
      name,
      pollingInterval,
      request,
      tokens,
      transport,
      type,
      uid: uid(),
      ...experimental_blockTag ? { experimental_blockTag } : {}
    };
    function extend(base) {
      return (extendFn) => {
        const extended = extendFn(base);
        for (const key2 in client) delete extended[key2];
        const combined = { ...base, ...extended };
        for (const key2 in extended) {
          const a = base[key2];
          const b = extended[key2];
          if (isPlainObject(a) && isPlainObject(b))
            combined[key2] = { ...a, ...b };
        }
        return Object.assign(combined, { extend: extend(combined) });
      };
    }
    return Object.assign(client, { extend: extend(client) });
  }
  function isPlainObject(value) {
    if (typeof value !== "object" || value === null) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }
  function bindActionDecorators(client, action) {
    const wrapped = (parameters = {}) => action(client, parameters);
    for (const key of [
      "call",
      "calls",
      "callWithPeriod",
      "estimateGas",
      "prepare",
      "simulate"
    ])
      if (Object.hasOwn(action, key)) {
        const helper = action[key];
        wrapped[key] = (args = {}) => {
          if (helper.length === 1) return helper(args);
          return helper(client, args);
        };
      }
    for (const key of ["extractEvent", "extractEvents"])
      if (Object.hasOwn(action, key)) wrapped[key] = action[key];
    return wrapped;
  }
  function rpcSchema() {
    return null;
  }

  // node_modules/viem/actions/ens/getEnsAddress.ts
  init_abis();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_getAddress();
  init_getChainContractAddress();
  init_size();
  init_trim();
  init_toHex();

  // node_modules/viem/utils/ens/errors.ts
  init_base();
  init_contract();
  function isNullUniversalResolverError(err) {
    if (!(err instanceof BaseError2)) return false;
    const cause = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (!(cause instanceof ContractFunctionRevertedError)) return false;
    if (cause.data?.errorName === "HttpError") return true;
    if (cause.data?.errorName === "ResolverError") return true;
    if (cause.data?.errorName === "ResolverNotContract") return true;
    if (cause.data?.errorName === "ResolverNotFound") return true;
    if (cause.data?.errorName === "ReverseAddressMismatch") return true;
    if (cause.data?.errorName === "UnsupportedResolverProfile") return true;
    return false;
  }

  // node_modules/viem/actions/ens/getEnsAddress.ts
  init_localBatchGatewayRequest();

  // node_modules/viem/utils/ens/namehash.ts
  init_concat();
  init_toBytes();
  init_toHex();
  init_keccak256();

  // node_modules/viem/utils/ens/encodedLabelToLabelhash.ts
  init_isHex();
  function encodedLabelToLabelhash(label) {
    if (label.length !== 66) return null;
    if (label.indexOf("[") !== 0) return null;
    if (label.indexOf("]") !== 65) return null;
    const hash3 = `0x${label.slice(1, 65)}`;
    if (!isHex(hash3)) return null;
    return hash3;
  }

  // node_modules/viem/utils/ens/namehash.ts
  function namehash(name) {
    let result = new Uint8Array(32).fill(0);
    if (!name) return bytesToHex(result);
    const labels = name.split(".");
    for (let i = labels.length - 1; i >= 0; i -= 1) {
      const hashFromEncodedLabel = encodedLabelToLabelhash(labels[i]);
      const hashed = hashFromEncodedLabel ? toBytes(hashFromEncodedLabel) : keccak256(stringToBytes(labels[i]), "bytes");
      result = keccak256(concat([result, hashed]), "bytes");
    }
    return bytesToHex(result);
  }

  // node_modules/viem/utils/ens/packetToBytes.ts
  init_toBytes();

  // node_modules/viem/utils/ens/encodeLabelhash.ts
  function encodeLabelhash(hash3) {
    return `[${hash3.slice(2)}]`;
  }

  // node_modules/viem/utils/ens/labelhash.ts
  init_toBytes();
  init_toHex();
  init_keccak256();
  function labelhash(label) {
    const result = new Uint8Array(32).fill(0);
    if (!label) return bytesToHex(result);
    return encodedLabelToLabelhash(label) || keccak256(stringToBytes(label));
  }

  // node_modules/viem/utils/ens/packetToBytes.ts
  function packetToBytes(packet) {
    const value = packet.replace(/^\.|\.$/gm, "");
    if (value.length === 0) return new Uint8Array(1);
    const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);
    let offset = 0;
    const list = value.split(".");
    for (let i = 0; i < list.length; i++) {
      let encoded = stringToBytes(list[i]);
      if (encoded.byteLength > 255)
        encoded = stringToBytes(encodeLabelhash(labelhash(list[i])));
      bytes[offset] = encoded.length;
      bytes.set(encoded, offset + 1);
      offset += encoded.length + 1;
    }
    if (bytes.byteLength !== offset + 1) return bytes.slice(0, offset + 1);
    return bytes;
  }

  // node_modules/viem/actions/ens/getEnsAddress.ts
  async function getEnsAddress(client, parameters) {
    const { blockNumber, blockTag, coinType, name, gatewayUrls, strict } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
      if (parameters.universalResolverAddress)
        return parameters.universalResolverAddress;
      if (!chain)
        throw new Error(
          "client chain not configured. universalResolverAddress is required."
        );
      return getChainContractAddress({
        blockNumber,
        chain,
        contract: "ensUniversalResolver"
      });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld))) return null;
    const args = (() => {
      if (coinType != null) return [namehash(name), BigInt(coinType)];
      return [namehash(name)];
    })();
    try {
      const functionData = encodeFunctionData({
        abi: addressResolverAbi,
        functionName: "addr",
        args
      });
      const readContractParameters = {
        address: universalResolverAddress,
        abi: universalResolverResolveAbi,
        functionName: "resolveWithGateways",
        args: [
          toHex(packetToBytes(name)),
          functionData,
          gatewayUrls ?? [localBatchGatewayUrl]
        ],
        blockNumber,
        blockTag
      };
      const readContractAction = getAction(client, readContract, "readContract");
      const res = await readContractAction(readContractParameters);
      if (res[0] === "0x") return null;
      const address = decodeAddress2({ coinType, data: res[0], args });
      if (address === "0x") return null;
      if (trim(address) === "0x00") return null;
      return address;
    } catch (err) {
      if (strict) throw err;
      if (isNullUniversalResolverError(err)) return null;
      throw err;
    }
  }
  function decodeAddress2({
    coinType,
    data,
    args
  }) {
    try {
      return decodeFunctionResult({
        abi: addressResolverAbi,
        args,
        functionName: "addr",
        data
      });
    } catch (err) {
      if (coinType == null) throw err;
      const address = trim(data);
      if (size(address) === 20) return getAddress(address);
      throw err;
    }
  }

  // node_modules/viem/errors/ens.ts
  init_base();
  var EnsAvatarInvalidMetadataError = class extends BaseError2 {
    constructor({ data }) {
      super(
        "Unable to extract image from metadata. The metadata may be malformed or invalid.",
        {
          metaMessages: [
            "- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.",
            "",
            `Provided data: ${JSON.stringify(data)}`
          ],
          name: "EnsAvatarInvalidMetadataError"
        }
      );
    }
  };
  var EnsAvatarInvalidNftUriError = class extends BaseError2 {
    constructor({ reason }) {
      super(`ENS NFT avatar URI is invalid. ${reason}`, {
        name: "EnsAvatarInvalidNftUriError"
      });
    }
  };
  var EnsAvatarUriResolutionError = class extends BaseError2 {
    constructor({ uri }) {
      super(
        `Unable to resolve ENS avatar URI "${uri}". The URI may be malformed, invalid, or does not respond with a valid image.`,
        { name: "EnsAvatarUriResolutionError" }
      );
    }
  };
  var EnsAvatarUnsupportedNamespaceError = class extends BaseError2 {
    constructor({ namespace }) {
      super(
        `ENS NFT avatar namespace "${namespace}" is not supported. Must be "erc721" or "erc1155".`,
        { name: "EnsAvatarUnsupportedNamespaceError" }
      );
    }
  };
  var EnsInvalidChainIdError = class extends BaseError2 {
    constructor({ chainId }) {
      super(
        `Invalid ENSIP-11 chainId: ${chainId}. Must be between 0 and 0x7fffffff, or 1.`,
        {
          name: "EnsInvalidChainIdError"
        }
      );
    }
  };

  // node_modules/viem/utils/ens/avatar/utils.ts
  var networkRegex = /(?<protocol>https?:\/\/[^/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/;
  var ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/;
  var base64Regex = /^data:([a-zA-Z\-/+]*);base64,([^"].*)/;
  var dataURIRegex = /^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;
  async function isImageUri(uri) {
    try {
      const res = await fetch(uri, { method: "HEAD" });
      if (res.status === 200) {
        const contentType = res.headers.get("content-type");
        return contentType?.startsWith("image/");
      }
      return false;
    } catch (error) {
      if (typeof error === "object" && typeof error.response !== "undefined") {
        return false;
      }
      if (!Object.hasOwn(globalThis, "Image")) return false;
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(true);
        };
        img.onerror = () => {
          resolve(false);
        };
        img.src = uri;
      });
    }
  }
  function getGateway(custom2, defaultGateway) {
    if (!custom2) return defaultGateway;
    if (custom2.endsWith("/")) return custom2.slice(0, -1);
    return custom2;
  }
  function resolveAvatarUri({
    uri,
    gatewayUrls
  }) {
    const isEncoded = base64Regex.test(uri);
    if (isEncoded) return { uri, isOnChain: true, isEncoded };
    const ipfsGateway = getGateway(gatewayUrls?.ipfs, "https://ipfs.io");
    const arweaveGateway = getGateway(gatewayUrls?.arweave, "https://arweave.net");
    const networkRegexMatch = uri.match(networkRegex);
    const {
      protocol,
      subpath,
      target,
      subtarget = ""
    } = networkRegexMatch?.groups || {};
    const isIPNS = protocol === "ipns:/" || subpath === "ipns/";
    const isIPFS = protocol === "ipfs:/" || subpath === "ipfs/" || ipfsHashRegex.test(uri);
    if (uri.startsWith("http") && !isIPNS && !isIPFS) {
      let replacedUri = uri;
      if (gatewayUrls?.arweave)
        replacedUri = uri.replace(/https:\/\/arweave.net/g, gatewayUrls?.arweave);
      return { uri: replacedUri, isOnChain: false, isEncoded: false };
    }
    if ((isIPNS || isIPFS) && target) {
      return {
        uri: `${ipfsGateway}/${isIPNS ? "ipns" : "ipfs"}/${target}${subtarget}`,
        isOnChain: false,
        isEncoded: false
      };
    }
    if (protocol === "ar:/" && target) {
      return {
        uri: `${arweaveGateway}/${target}${subtarget || ""}`,
        isOnChain: false,
        isEncoded: false
      };
    }
    let parsedUri = uri.replace(dataURIRegex, "");
    if (parsedUri.startsWith("<svg")) {
      parsedUri = `data:image/svg+xml;base64,${btoa(parsedUri)}`;
    }
    if (parsedUri.startsWith("data:") || parsedUri.startsWith("{")) {
      return {
        uri: parsedUri,
        isOnChain: true,
        isEncoded: false
      };
    }
    throw new EnsAvatarUriResolutionError({ uri });
  }
  function getJsonImage(data) {
    if (typeof data !== "object" || !("image" in data) && !("image_url" in data) && !("image_data" in data)) {
      throw new EnsAvatarInvalidMetadataError({ data });
    }
    return data.image || data.image_url || data.image_data;
  }
  async function getMetadataAvatarUri({
    gatewayUrls,
    uri
  }) {
    try {
      const res = await fetch(uri).then((res2) => res2.json());
      const image = await parseAvatarUri({
        gatewayUrls,
        uri: getJsonImage(res)
      });
      return image;
    } catch {
      throw new EnsAvatarUriResolutionError({ uri });
    }
  }
  async function parseAvatarUri({
    gatewayUrls,
    uri
  }) {
    const { uri: resolvedURI, isOnChain } = resolveAvatarUri({ uri, gatewayUrls });
    if (isOnChain) return resolvedURI;
    const isImage = await isImageUri(resolvedURI);
    if (isImage) return resolvedURI;
    throw new EnsAvatarUriResolutionError({ uri });
  }
  function parseNftUri(uri_) {
    let uri = uri_;
    if (uri.startsWith("did:nft:")) {
      uri = uri.replace("did:nft:", "").replace(/_/g, "/");
    }
    const [reference, asset_namespace, tokenID] = uri.split("/");
    const [eip_namespace, chainID] = reference.split(":");
    const [erc_namespace, contractAddress] = asset_namespace.split(":");
    if (!eip_namespace || eip_namespace.toLowerCase() !== "eip155")
      throw new EnsAvatarInvalidNftUriError({ reason: "Only EIP-155 supported" });
    if (!chainID)
      throw new EnsAvatarInvalidNftUriError({ reason: "Chain ID not found" });
    if (!contractAddress)
      throw new EnsAvatarInvalidNftUriError({
        reason: "Contract address not found"
      });
    if (!tokenID)
      throw new EnsAvatarInvalidNftUriError({ reason: "Token ID not found" });
    if (!erc_namespace)
      throw new EnsAvatarInvalidNftUriError({ reason: "ERC namespace not found" });
    return {
      chainID: Number.parseInt(chainID, 10),
      namespace: erc_namespace.toLowerCase(),
      contractAddress,
      tokenID
    };
  }
  async function getNftTokenUri(client, { nft }) {
    if (nft.namespace === "erc721") {
      return readContract(client, {
        address: nft.contractAddress,
        abi: [
          {
            name: "tokenURI",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "tokenId", type: "uint256" }],
            outputs: [{ name: "", type: "string" }]
          }
        ],
        functionName: "tokenURI",
        args: [BigInt(nft.tokenID)]
      });
    }
    if (nft.namespace === "erc1155") {
      return readContract(client, {
        address: nft.contractAddress,
        abi: [
          {
            name: "uri",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "_id", type: "uint256" }],
            outputs: [{ name: "", type: "string" }]
          }
        ],
        functionName: "uri",
        args: [BigInt(nft.tokenID)]
      });
    }
    throw new EnsAvatarUnsupportedNamespaceError({ namespace: nft.namespace });
  }

  // node_modules/viem/utils/ens/avatar/parseAvatarRecord.ts
  async function parseAvatarRecord(client, {
    gatewayUrls,
    record
  }) {
    if (/eip155:/i.test(record))
      return parseNftAvatarUri(client, { gatewayUrls, record });
    return parseAvatarUri({ uri: record, gatewayUrls });
  }
  async function parseNftAvatarUri(client, {
    gatewayUrls,
    record
  }) {
    const nft = parseNftUri(record);
    const nftUri = await getNftTokenUri(client, { nft });
    const {
      uri: resolvedNftUri,
      isOnChain,
      isEncoded
    } = resolveAvatarUri({ uri: nftUri, gatewayUrls });
    if (isOnChain && (resolvedNftUri.includes("data:application/json;base64,") || resolvedNftUri.startsWith("{"))) {
      const encodedJson = isEncoded ? (
        // if it is encoded, decode it
        atob(resolvedNftUri.replace("data:application/json;base64,", ""))
      ) : (
        // if it isn't encoded assume it is a JSON string, but it could be anything (it will error if it is)
        resolvedNftUri
      );
      const decoded = JSON.parse(encodedJson);
      return parseAvatarUri({ uri: getJsonImage(decoded), gatewayUrls });
    }
    let uriTokenId = nft.tokenID;
    if (nft.namespace === "erc1155")
      uriTokenId = uriTokenId.replace("0x", "").padStart(64, "0");
    return getMetadataAvatarUri({
      gatewayUrls,
      uri: resolvedNftUri.replace(/(?:0x)?{id}/, uriTokenId)
    });
  }

  // node_modules/viem/actions/ens/getEnsText.ts
  init_abis();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_getChainContractAddress();
  init_toHex();
  init_localBatchGatewayRequest();
  async function getEnsText(client, parameters) {
    const { blockNumber, blockTag, key, name, gatewayUrls, strict } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
      if (parameters.universalResolverAddress)
        return parameters.universalResolverAddress;
      if (!chain)
        throw new Error(
          "client chain not configured. universalResolverAddress is required."
        );
      return getChainContractAddress({
        blockNumber,
        chain,
        contract: "ensUniversalResolver"
      });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld))) return null;
    try {
      const readContractParameters = {
        address: universalResolverAddress,
        abi: universalResolverResolveAbi,
        args: [
          toHex(packetToBytes(name)),
          encodeFunctionData({
            abi: textResolverAbi,
            functionName: "text",
            args: [namehash(name), key]
          }),
          gatewayUrls ?? [localBatchGatewayUrl]
        ],
        functionName: "resolveWithGateways",
        blockNumber,
        blockTag
      };
      const readContractAction = getAction(client, readContract, "readContract");
      const res = await readContractAction(readContractParameters);
      if (res[0] === "0x") return null;
      const record = decodeFunctionResult({
        abi: textResolverAbi,
        functionName: "text",
        data: res[0]
      });
      return record === "" ? null : record;
    } catch (err) {
      if (strict) throw err;
      if (isNullUniversalResolverError(err)) return null;
      throw err;
    }
  }

  // node_modules/viem/actions/ens/getEnsAvatar.ts
  async function getEnsAvatar(client, {
    blockNumber,
    blockTag,
    assetGatewayUrls,
    name,
    gatewayUrls,
    strict,
    universalResolverAddress
  }) {
    const record = await getAction(
      client,
      getEnsText,
      "getEnsText"
    )({
      blockNumber,
      blockTag,
      key: "avatar",
      name,
      universalResolverAddress,
      gatewayUrls,
      strict
    });
    if (!record) return null;
    try {
      return await parseAvatarRecord(client, {
        record,
        gatewayUrls: assetGatewayUrls
      });
    } catch {
      return null;
    }
  }

  // node_modules/viem/actions/ens/getEnsName.ts
  init_abis();
  init_getChainContractAddress();
  init_localBatchGatewayRequest();
  async function getEnsName(client, parameters) {
    const {
      address,
      blockNumber,
      blockTag,
      coinType = 60n,
      gatewayUrls,
      strict
    } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
      if (parameters.universalResolverAddress)
        return parameters.universalResolverAddress;
      if (!chain)
        throw new Error(
          "client chain not configured. universalResolverAddress is required."
        );
      return getChainContractAddress({
        blockNumber,
        chain,
        contract: "ensUniversalResolver"
      });
    })();
    try {
      const readContractParameters = {
        address: universalResolverAddress,
        abi: universalResolverReverseAbi,
        args: [address, coinType, gatewayUrls ?? [localBatchGatewayUrl]],
        functionName: "reverseWithGateways",
        blockNumber,
        blockTag
      };
      const readContractAction = getAction(client, readContract, "readContract");
      const [name] = await readContractAction(readContractParameters);
      return name || null;
    } catch (err) {
      if (strict) throw err;
      if (isNullUniversalResolverError(err)) return null;
      throw err;
    }
  }

  // node_modules/viem/actions/ens/getEnsResolver.ts
  init_getChainContractAddress();
  init_toHex();
  async function getEnsResolver(client, parameters) {
    const { blockNumber, blockTag, name } = parameters;
    const { chain } = client;
    const universalResolverAddress = (() => {
      if (parameters.universalResolverAddress)
        return parameters.universalResolverAddress;
      if (!chain)
        throw new Error(
          "client chain not configured. universalResolverAddress is required."
        );
      return getChainContractAddress({
        blockNumber,
        chain,
        contract: "ensUniversalResolver"
      });
    })();
    const tlds = chain?.ensTlds;
    if (tlds && !tlds.some((tld) => name.endsWith(tld)))
      throw new Error(
        `${name} is not a valid ENS TLD (${tlds?.join(", ")}) for chain "${chain.name}" (id: ${chain.id}).`
      );
    const [resolverAddress] = await getAction(
      client,
      readContract,
      "readContract"
    )({
      address: universalResolverAddress,
      abi: [
        {
          inputs: [{ type: "bytes" }],
          name: "findResolver",
          outputs: [
            { type: "address" },
            { type: "bytes32" },
            { type: "uint256" }
          ],
          stateMutability: "view",
          type: "function"
        }
      ],
      functionName: "findResolver",
      args: [toHex(packetToBytes(name))],
      blockNumber,
      blockTag
    });
    return resolverAddress;
  }

  // node_modules/viem/clients/decorators/public.ts
  init_call();

  // node_modules/viem/actions/public/createAccessList.ts
  init_parseAccount();
  init_base();
  init_toHex();
  init_getCallError();
  init_extract();
  init_transactionRequest();
  init_assertRequest();
  async function createAccessList(client, args) {
    const {
      account: account_ = client.account,
      blockNumber,
      blockTag = "latest",
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      to,
      value,
      ...rest
    } = args;
    const account = account_ ? parseAccount(account_) : void 0;
    try {
      assertRequest(args);
      const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format(
        {
          // Pick out extra data that might exist on the chain's transaction request type.
          ...extract(rest, { format: chainFormat }),
          account,
          blobs,
          data,
          gas,
          gasPrice,
          maxFeePerBlobGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          to,
          value
        },
        "createAccessList"
      );
      const response = await client.request({
        method: "eth_createAccessList",
        params: [request, block]
      });
      if (response.error)
        throw new BaseError2(response.error, { details: response.error });
      return {
        accessList: response.accessList,
        gasUsed: BigInt(response.gasUsed)
      };
    } catch (err) {
      throw getCallError(err, {
        ...args,
        account,
        chain: client.chain
      });
    }
  }

  // node_modules/viem/actions/public/createBlockFilter.ts
  async function createBlockFilter(client) {
    const getRequest = createFilterRequestScope(client, {
      method: "eth_newBlockFilter"
    });
    const id = await client.request({
      method: "eth_newBlockFilter"
    });
    return { id, request: getRequest(id), type: "block" };
  }

  // node_modules/viem/actions/public/createEventFilter.ts
  init_toHex();
  async function createEventFilter(client, {
    address,
    args,
    event,
    events: events_,
    fromBlock,
    strict,
    toBlock
  } = {}) {
    const events = events_ ?? (event ? [event] : void 0);
    const getRequest = createFilterRequestScope(client, {
      method: "eth_newFilter"
    });
    let topics = [];
    if (events) {
      const encoded = events.flatMap(
        (event2) => encodeEventTopics({
          abi: [event2],
          eventName: event2.name,
          args
        })
      );
      topics = [encoded];
      if (event) topics = topics[0];
    }
    const id = await client.request({
      method: "eth_newFilter",
      params: [
        {
          address,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock,
          ...topics.length ? { topics } : {}
        }
      ]
    });
    return {
      abi: events,
      args,
      eventName: event ? event.name : void 0,
      fromBlock,
      id,
      request: getRequest(id),
      strict: Boolean(strict),
      toBlock,
      type: "event"
    };
  }

  // node_modules/viem/actions/public/createPendingTransactionFilter.ts
  async function createPendingTransactionFilter(client) {
    const getRequest = createFilterRequestScope(client, {
      method: "eth_newPendingTransactionFilter"
    });
    const id = await client.request({
      method: "eth_newPendingTransactionFilter"
    });
    return { id, request: getRequest(id), type: "transaction" };
  }

  // node_modules/viem/actions/public/getBalance.ts
  init_abis();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_formatBlockParameter();
  init_call();
  async function getBalance(client, {
    address,
    blockHash,
    blockNumber,
    blockTag = client.experimental_blockTag ?? "latest",
    requireCanonical
  }) {
    const block = formatBlockParameter({
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    if (client.batch?.multicall && client.chain?.contracts?.multicall3) {
      const multicall3Address = client.chain.contracts.multicall3.address;
      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        functionName: "getEthBalance",
        args: [address]
      });
      const { data } = await getAction(
        client,
        call,
        "call"
      )({
        to: multicall3Address,
        data: calldata,
        blockHash,
        blockNumber,
        blockTag,
        requireCanonical
      });
      return decodeFunctionResult({
        abi: multicall3Abi,
        functionName: "getEthBalance",
        args: [address],
        data: data || "0x"
      });
    }
    const balance = await client.request({
      method: "eth_getBalance",
      params: [address, block]
    });
    return BigInt(balance);
  }

  // node_modules/viem/actions/public/getBlobBaseFee.ts
  async function getBlobBaseFee(client) {
    const baseFee = await client.request({
      method: "eth_blobBaseFee"
    });
    return BigInt(baseFee);
  }

  // node_modules/viem/actions/public/getBlockReceipts.ts
  init_toHex();
  async function getBlockReceipts(client, {
    blockHash,
    blockNumber,
    blockTag = client.experimental_blockTag ?? "latest"
  } = {}) {
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    const receipts = await client.request(
      {
        method: "eth_getBlockReceipts",
        params: [blockHash || blockNumberHex || blockTag]
      },
      { dedupe: Boolean(blockHash || blockNumberHex) }
    );
    if (!receipts) throw new BlockNotFoundError({ blockHash, blockNumber });
    const format = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
    return receipts.map(
      (receipt) => format(receipt, "getBlockReceipts")
    );
  }

  // node_modules/viem/actions/public/getBlockTransactionCount.ts
  init_fromHex();
  init_toHex();
  async function getBlockTransactionCount(client, {
    blockHash,
    blockNumber,
    blockTag = "latest"
  } = {}) {
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    let count;
    if (blockHash) {
      count = await client.request(
        {
          method: "eth_getBlockTransactionCountByHash",
          params: [blockHash]
        },
        { dedupe: true }
      );
    } else {
      count = await client.request(
        {
          method: "eth_getBlockTransactionCountByNumber",
          params: [blockNumberHex || blockTag]
        },
        { dedupe: Boolean(blockNumberHex) }
      );
    }
    return hexToNumber(count);
  }

  // node_modules/viem/actions/public/getCode.ts
  init_formatBlockParameter();
  async function getCode(client, {
    address,
    blockHash,
    blockNumber,
    blockTag = "latest",
    requireCanonical
  }) {
    const block = formatBlockParameter({
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    const hex = await client.request(
      {
        method: "eth_getCode",
        params: [address, block]
      },
      {
        dedupe: typeof blockNumber === "bigint" || blockHash !== void 0
      }
    );
    if (hex === "0x") return void 0;
    return hex;
  }

  // node_modules/viem/actions/public/getDelegation.ts
  init_getAddress();
  init_size();
  init_slice();
  async function getDelegation(client, { address, blockNumber, blockTag = "latest" }) {
    const code = await getCode(client, {
      address,
      ...blockNumber !== void 0 ? { blockNumber } : { blockTag }
    });
    if (!code) return void 0;
    if (size(code) !== 23) return void 0;
    if (!code.startsWith("0xef0100")) return void 0;
    return getAddress(slice(code, 3, 23));
  }

  // node_modules/viem/errors/eip712.ts
  init_base();
  var Eip712DomainNotFoundError = class extends BaseError2 {
    constructor({ address }) {
      super(`No EIP-712 domain found on contract "${address}".`, {
        metaMessages: [
          "Ensure that:",
          `- The contract is deployed at the address "${address}".`,
          "- `eip712Domain()` function exists on the contract.",
          "- `eip712Domain()` function matches signature to ERC-5267 specification."
        ],
        name: "Eip712DomainNotFoundError"
      });
    }
  };

  // node_modules/viem/actions/public/getEip712Domain.ts
  async function getEip712Domain(client, parameters) {
    const { address, factory, factoryData } = parameters;
    try {
      const [
        fields,
        name,
        version4,
        chainId,
        verifyingContract,
        salt,
        extensions
      ] = await getAction(
        client,
        readContract,
        "readContract"
      )({
        abi,
        address,
        functionName: "eip712Domain",
        factory,
        factoryData
      });
      return {
        domain: {
          name,
          version: version4,
          chainId: Number(chainId),
          verifyingContract,
          salt
        },
        extensions,
        fields
      };
    } catch (e) {
      const error = e;
      if (error.name === "ContractFunctionExecutionError" && error.cause.name === "ContractFunctionZeroDataError") {
        throw new Eip712DomainNotFoundError({ address });
      }
      throw error;
    }
  }
  var abi = [
    {
      inputs: [],
      name: "eip712Domain",
      outputs: [
        { name: "fields", type: "bytes1" },
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32" },
        { name: "extensions", type: "uint256[]" }
      ],
      stateMutability: "view",
      type: "function"
    }
  ];

  // node_modules/viem/actions/public/getFeeHistory.ts
  init_toHex();

  // node_modules/viem/utils/formatters/feeHistory.ts
  function formatFeeHistory(feeHistory) {
    return {
      baseFeePerGas: feeHistory.baseFeePerGas.map((value) => BigInt(value)),
      gasUsedRatio: feeHistory.gasUsedRatio,
      oldestBlock: BigInt(feeHistory.oldestBlock),
      reward: feeHistory.reward?.map(
        (reward) => reward.map((value) => BigInt(value))
      )
    };
  }

  // node_modules/viem/actions/public/getFeeHistory.ts
  async function getFeeHistory(client, {
    blockCount,
    blockNumber,
    blockTag = "latest",
    rewardPercentiles
  }) {
    const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
    const feeHistory = await client.request(
      {
        method: "eth_feeHistory",
        params: [
          numberToHex(blockCount),
          blockNumberHex || blockTag,
          rewardPercentiles
        ]
      },
      { dedupe: Boolean(blockNumberHex) }
    );
    return formatFeeHistory(feeHistory);
  }

  // node_modules/viem/actions/public/getFilterLogs.ts
  async function getFilterLogs(_client, {
    filter
  }) {
    const strict = filter.strict ?? false;
    const logs = await filter.request({
      method: "eth_getFilterLogs",
      params: [filter.id]
    });
    const formattedLogs = logs.map((log) => formatLog(log));
    if (!filter.abi)
      return formattedLogs;
    return parseEventLogs({
      abi: filter.abi,
      logs: formattedLogs,
      strict
    });
  }

  // node_modules/viem/actions/public/getProof.ts
  init_formatBlockParameter();

  // node_modules/viem/utils/index.ts
  init_parseAccount();
  init_decodeAbiParameters();
  init_decodeErrorResult();
  init_decodeFunctionData();
  init_decodeFunctionResult();
  init_encodeAbiParameters();
  init_encodeDeployData();
  init_encodeErrorResult();
  init_encodeFunctionData();
  init_encodeFunctionResult();

  // node_modules/viem/utils/abi/encodePacked.ts
  init_abi();
  init_address();
  init_isAddress();
  init_concat();
  init_pad();
  init_toHex();
  init_regex2();
  function encodePacked(types, values) {
    if (types.length !== values.length)
      throw new AbiEncodingLengthMismatchError({
        expectedLength: types.length,
        givenLength: values.length
      });
    const data = [];
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const value = values[i];
      data.push(encode(type, value));
    }
    return concatHex(data);
  }
  function encode(type, value, isArray = false) {
    if (type === "address") {
      const address = value;
      if (!isAddress(address)) throw new InvalidAddressError({ address });
      return pad(address.toLowerCase(), {
        size: isArray ? 32 : null
      });
    }
    if (type === "string") return stringToHex(value);
    if (type === "bytes") return value;
    if (type === "bool")
      return pad(boolToHex(value), { size: isArray ? 32 : 1 });
    const intMatch = type.match(integerRegex2);
    if (intMatch) {
      const [_type, baseType, bits = "256"] = intMatch;
      const size5 = Number.parseInt(bits, 10) / 8;
      return numberToHex(value, {
        size: isArray ? 32 : size5,
        signed: baseType === "int"
      });
    }
    const bytesMatch = type.match(bytesRegex2);
    if (bytesMatch) {
      const [_type, size5] = bytesMatch;
      if (Number.parseInt(size5, 10) !== (value.length - 2) / 2)
        throw new BytesSizeMismatchError({
          expectedSize: Number.parseInt(size5, 10),
          givenSize: (value.length - 2) / 2
        });
      return pad(value, { dir: "right", size: isArray ? 32 : null });
    }
    const arrayMatch = type.match(arrayRegex);
    if (arrayMatch && Array.isArray(value)) {
      const [_type, childType] = arrayMatch;
      const data = [];
      for (let i = 0; i < value.length; i++) {
        data.push(encode(childType, value[i], true));
      }
      if (data.length === 0) return "0x";
      return concatHex(data);
    }
    throw new UnsupportedPackedAbiType(type);
  }

  // node_modules/viem/utils/index.ts
  init_formatAbiItem2();
  init_formatAbiItemWithArgs();
  init_getAbiItem();
  init_getAddress();

  // node_modules/viem/utils/address/getContractAddress.ts
  init_concat();

  // node_modules/viem/utils/data/isBytes.ts
  function isBytes3(value) {
    if (!value) return false;
    if (typeof value !== "object") return false;
    if (!("BYTES_PER_ELEMENT" in value)) return false;
    return value.BYTES_PER_ELEMENT === 1 && value.constructor.name === "Uint8Array";
  }

  // node_modules/viem/utils/address/getContractAddress.ts
  init_pad();
  init_slice();
  init_toBytes();
  init_keccak256();
  init_getAddress();
  function getContractAddress2(opts) {
    if (opts.opcode === "CREATE2") return getCreate2Address(opts);
    return getCreateAddress(opts);
  }
  function getCreateAddress(opts) {
    const from14 = toBytes(getAddress(opts.from));
    let nonce = toBytes(opts.nonce);
    if (nonce[0] === 0) nonce = new Uint8Array([]);
    return getAddress(
      `0x${keccak256(toRlp([from14, nonce], "bytes")).slice(26)}`
    );
  }
  function getCreate2Address(opts) {
    const from14 = toBytes(getAddress(opts.from));
    const salt = pad(isBytes3(opts.salt) ? opts.salt : toBytes(opts.salt), {
      size: 32
    });
    const bytecodeHash = (() => {
      if ("bytecodeHash" in opts) {
        if (isBytes3(opts.bytecodeHash)) return opts.bytecodeHash;
        return toBytes(opts.bytecodeHash);
      }
      return keccak256(opts.bytecode, "bytes");
    })();
    return getAddress(
      slice(keccak256(concat([toBytes("0xff"), from14, salt, bytecodeHash])), 12)
    );
  }

  // node_modules/viem/utils/index.ts
  init_isAddress();
  init_isAddressEqual();

  // node_modules/viem/utils/authorization/serializeAuthorizationList.ts
  init_toHex();

  // node_modules/viem/utils/transaction/serializeTransaction.ts
  init_transaction();
  init_concat();
  init_trim();
  init_toHex();

  // node_modules/viem/utils/transaction/assertTransaction.ts
  init_number();
  init_address();
  init_base();
  init_chain();
  init_node();
  init_isAddress();
  init_size();
  init_slice();
  init_fromHex();
  function assertTransactionEIP7702(transaction) {
    const { authorizationList } = transaction;
    if (authorizationList) {
      for (const authorization of authorizationList) {
        const { chainId } = authorization;
        const address = authorization.address;
        if (!isAddress(address)) throw new InvalidAddressError({ address });
        if (chainId < 0) throw new InvalidChainIdError({ chainId });
      }
    }
    assertTransactionEIP1559(transaction);
  }
  function assertTransactionEIP4844(transaction) {
    const { blobVersionedHashes } = transaction;
    if (blobVersionedHashes) {
      if (blobVersionedHashes.length === 0) throw new EmptyBlobError();
      for (const hash3 of blobVersionedHashes) {
        const size_ = size(hash3);
        const version4 = hexToNumber(slice(hash3, 0, 1));
        if (size_ !== 32)
          throw new InvalidVersionedHashSizeError({ hash: hash3, size: size_ });
        if (version4 !== versionedHashVersionKzg)
          throw new InvalidVersionedHashVersionError({
            hash: hash3,
            version: version4
          });
      }
    }
    assertTransactionEIP1559(transaction);
  }
  function assertTransactionEIP1559(transaction) {
    const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
    if (chainId <= 0) throw new InvalidChainIdError({ chainId });
    if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
    if (maxFeePerGas && maxFeePerGas > maxUint256)
      throw new FeeCapTooHighError({ maxFeePerGas });
    if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
      throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
  }
  function assertTransactionEIP2930(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
    if (chainId <= 0) throw new InvalidChainIdError({ chainId });
    if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
    if (maxPriorityFeePerGas || maxFeePerGas)
      throw new BaseError2(
        "`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute."
      );
    if (gasPrice && gasPrice > maxUint256)
      throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
  }
  function assertTransactionLegacy(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
    if (to && !isAddress(to)) throw new InvalidAddressError({ address: to });
    if (typeof chainId !== "undefined" && chainId <= 0)
      throw new InvalidChainIdError({ chainId });
    if (maxPriorityFeePerGas || maxFeePerGas)
      throw new BaseError2(
        "`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute."
      );
    if (gasPrice && gasPrice > maxUint256)
      throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
  }

  // node_modules/viem/utils/transaction/serializeAccessList.ts
  init_address();
  init_transaction();
  init_isAddress();
  function serializeAccessList(accessList) {
    if (!accessList || accessList.length === 0) return [];
    const serializedAccessList = [];
    for (let i = 0; i < accessList.length; i++) {
      const { address, storageKeys } = accessList[i];
      for (let j = 0; j < storageKeys.length; j++) {
        if (storageKeys[j].length - 2 !== 64) {
          throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
        }
      }
      if (!isAddress(address, { strict: false })) {
        throw new InvalidAddressError({ address });
      }
      serializedAccessList.push([address, storageKeys]);
    }
    return serializedAccessList;
  }

  // node_modules/viem/utils/transaction/serializeTransaction.ts
  function serializeTransaction(transaction, signature) {
    const type = getTransactionType(transaction);
    if (type === "eip1559")
      return serializeTransactionEIP1559(
        transaction,
        signature
      );
    if (type === "eip2930")
      return serializeTransactionEIP2930(
        transaction,
        signature
      );
    if (type === "eip4844")
      return serializeTransactionEIP4844(
        transaction,
        signature
      );
    if (type === "eip7702")
      return serializeTransactionEIP7702(
        transaction,
        signature
      );
    return serializeTransactionLegacy(
      transaction,
      signature
    );
  }
  function serializeTransactionEIP7702(transaction, signature) {
    const {
      authorizationList,
      chainId,
      gas,
      nonce,
      to,
      value,
      maxFeePerGas,
      maxPriorityFeePerGas,
      accessList,
      data
    } = transaction;
    assertTransactionEIP7702(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedAuthorizationList = serializeAuthorizationList(authorizationList);
    return concatHex([
      "0x04",
      toRlp([
        numberToHex(chainId),
        nonce ? numberToHex(nonce) : "0x",
        maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
        maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
        gas ? numberToHex(gas) : "0x",
        to ?? "0x",
        value ? numberToHex(value) : "0x",
        data ?? "0x",
        serializedAccessList,
        serializedAuthorizationList,
        ...toYParitySignatureArray(transaction, signature)
      ])
    ]);
  }
  function serializeTransactionEIP4844(transaction, signature) {
    const {
      chainId,
      gas,
      nonce,
      to,
      value,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      accessList,
      data
    } = transaction;
    assertTransactionEIP4844(transaction);
    let blobVersionedHashes = transaction.blobVersionedHashes;
    let sidecars = transaction.sidecars;
    if (transaction.blobs && (typeof blobVersionedHashes === "undefined" || typeof sidecars === "undefined")) {
      const blobs2 = typeof transaction.blobs[0] === "string" ? transaction.blobs : transaction.blobs.map((x) => bytesToHex(x));
      const kzg = transaction.kzg;
      const commitments2 = blobsToCommitments({
        blobs: blobs2,
        kzg
      });
      if (typeof blobVersionedHashes === "undefined")
        blobVersionedHashes = commitmentsToVersionedHashes({
          commitments: commitments2
        });
      if (typeof sidecars === "undefined") {
        const proofs2 = blobsToProofs({ blobs: blobs2, commitments: commitments2, kzg });
        sidecars = toBlobSidecars({ blobs: blobs2, commitments: commitments2, proofs: proofs2 });
      }
    }
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
      numberToHex(chainId),
      nonce ? numberToHex(nonce) : "0x",
      maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
      maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
      gas ? numberToHex(gas) : "0x",
      to ?? "0x",
      value ? numberToHex(value) : "0x",
      data ?? "0x",
      serializedAccessList,
      maxFeePerBlobGas ? numberToHex(maxFeePerBlobGas) : "0x",
      blobVersionedHashes ?? [],
      ...toYParitySignatureArray(transaction, signature)
    ];
    const blobs = [];
    const commitments = [];
    const proofs = [];
    if (sidecars)
      for (let i = 0; i < sidecars.length; i++) {
        const { blob, commitment, proof } = sidecars[i];
        blobs.push(blob);
        commitments.push(commitment);
        proofs.push(proof);
      }
    return concatHex([
      "0x03",
      sidecars ? (
        // If sidecars are enabled, envelope turns into a "wrapper":
        toRlp([serializedTransaction, blobs, commitments, proofs])
      ) : (
        // If sidecars are disabled, standard envelope is used:
        toRlp(serializedTransaction)
      )
    ]);
  }
  function serializeTransactionEIP1559(transaction, signature) {
    const {
      chainId,
      gas,
      nonce,
      to,
      value,
      maxFeePerGas,
      maxPriorityFeePerGas,
      accessList,
      data
    } = transaction;
    assertTransactionEIP1559(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
      numberToHex(chainId),
      nonce ? numberToHex(nonce) : "0x",
      maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
      maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
      gas ? numberToHex(gas) : "0x",
      to ?? "0x",
      value ? numberToHex(value) : "0x",
      data ?? "0x",
      serializedAccessList,
      ...toYParitySignatureArray(transaction, signature)
    ];
    return concatHex([
      "0x02",
      toRlp(serializedTransaction)
    ]);
  }
  function serializeTransactionEIP2930(transaction, signature) {
    const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
    assertTransactionEIP2930(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
      numberToHex(chainId),
      nonce ? numberToHex(nonce) : "0x",
      gasPrice ? numberToHex(gasPrice) : "0x",
      gas ? numberToHex(gas) : "0x",
      to ?? "0x",
      value ? numberToHex(value) : "0x",
      data ?? "0x",
      serializedAccessList,
      ...toYParitySignatureArray(transaction, signature)
    ];
    return concatHex([
      "0x01",
      toRlp(serializedTransaction)
    ]);
  }
  function serializeTransactionLegacy(transaction, signature) {
    const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
    assertTransactionLegacy(transaction);
    let serializedTransaction = [
      nonce ? numberToHex(nonce) : "0x",
      gasPrice ? numberToHex(gasPrice) : "0x",
      gas ? numberToHex(gas) : "0x",
      to ?? "0x",
      value ? numberToHex(value) : "0x",
      data ?? "0x"
    ];
    if (signature) {
      const v = (() => {
        if (signature.v >= 35n) {
          const inferredChainId = (signature.v - 35n) / 2n;
          if (inferredChainId > 0) return signature.v;
          return 27n + (signature.v === 35n ? 0n : 1n);
        }
        if (chainId > 0)
          return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
        const v2 = 27n + (signature.v === 27n ? 0n : 1n);
        if (signature.v !== v2) throw new InvalidLegacyVError({ v: signature.v });
        return v2;
      })();
      const r = trim(signature.r);
      const s = trim(signature.s);
      serializedTransaction = [
        ...serializedTransaction,
        numberToHex(v),
        r === "0x00" ? "0x" : r,
        s === "0x00" ? "0x" : s
      ];
    } else if (chainId > 0) {
      serializedTransaction = [
        ...serializedTransaction,
        numberToHex(chainId),
        "0x",
        "0x"
      ];
    }
    return toRlp(serializedTransaction);
  }
  function toYParitySignatureArray(transaction, signature_) {
    const signature = signature_ ?? transaction;
    const { v, yParity } = signature;
    if (typeof signature.r === "undefined") return [];
    if (typeof signature.s === "undefined") return [];
    if (typeof v === "undefined" && typeof yParity === "undefined") return [];
    const r = trim(signature.r);
    const s = trim(signature.s);
    const yParity_ = (() => {
      if (typeof yParity === "number") return yParity ? numberToHex(1) : "0x";
      if (v === 0n) return "0x";
      if (v === 1n) return numberToHex(1);
      return v === 27n ? "0x" : numberToHex(1);
    })();
    return [yParity_, r === "0x00" ? "0x" : r, s === "0x00" ? "0x" : s];
  }

  // node_modules/viem/utils/authorization/serializeAuthorizationList.ts
  function serializeAuthorizationList(authorizationList) {
    if (!authorizationList || authorizationList.length === 0) return [];
    const serializedAuthorizationList = [];
    for (const authorization of authorizationList) {
      const { chainId, nonce, ...signature } = authorization;
      const contractAddress = authorization.address;
      serializedAuthorizationList.push([
        chainId ? toHex(chainId) : "0x",
        contractAddress,
        nonce ? toHex(nonce) : "0x",
        ...toYParitySignatureArray({}, signature)
      ]);
    }
    return serializedAuthorizationList;
  }

  // node_modules/viem/utils/authorization/verifyAuthorization.ts
  init_getAddress();
  init_isAddressEqual();
  async function verifyAuthorization({
    address,
    authorization,
    signature
  }) {
    return isAddressEqual(
      getAddress(address),
      await recoverAuthorizationAddress({
        authorization,
        signature
      })
    );
  }

  // node_modules/viem/utils/buildRequest.ts
  init_base();
  init_request();
  init_rpc();
  init_utils3();

  // node_modules/viem/utils/promise/withDedupe.ts
  init_lru();
  var promiseCache2 = /* @__PURE__ */ new LruMap(8192);
  function withDedupe(fn, { enabled = true, id }) {
    if (!enabled || !id) return fn();
    if (promiseCache2.get(id)) return promiseCache2.get(id);
    const promise = fn().finally(() => promiseCache2.delete(id));
    promiseCache2.set(id, promise);
    return promise;
  }

  // node_modules/viem/utils/buildRequest.ts
  init_stringify();
  function buildRequest(request, options = {}) {
    return async (args, overrideOptions = {}) => {
      const {
        dedupe = false,
        methods,
        retryDelay = 150,
        retryCount = 3,
        signal,
        uid: uid2
      } = {
        ...options,
        ...overrideOptions
      };
      const { method } = args;
      if (methods?.exclude?.includes(method))
        throw new MethodNotSupportedRpcError(new Error("method not supported"), {
          method
        });
      if (methods?.include && !methods.include.includes(method))
        throw new MethodNotSupportedRpcError(new Error("method not supported"), {
          method
        });
      if (signal?.aborted) throw getAbortError(signal);
      const requestId = dedupe ? hashString(`${uid2}.${stringify(args)}`) : void 0;
      return withDedupe(
        () => withRetry(
          async () => {
            try {
              return await request(args, signal ? { signal } : void 0);
            } catch (err_) {
              if (signal?.aborted) throw getAbortError(signal);
              if (isAbortError(err_)) throw err_;
              const err = err_;
              switch (err.code) {
                // -32700
                case ParseRpcError.code:
                  throw new ParseRpcError(err);
                // -32600
                case InvalidRequestRpcError.code:
                  throw new InvalidRequestRpcError(err);
                // -32601
                case MethodNotFoundRpcError.code:
                  throw new MethodNotFoundRpcError(err, { method: args.method });
                // -32602
                case InvalidParamsRpcError.code:
                  throw new InvalidParamsRpcError(err);
                // -32603
                case InternalRpcError.code:
                  throw new InternalRpcError(err);
                // -32000
                case InvalidInputRpcError.code:
                  throw new InvalidInputRpcError(err);
                // -32001
                case ResourceNotFoundRpcError.code:
                  throw new ResourceNotFoundRpcError(err);
                // -32002
                case ResourceUnavailableRpcError.code:
                  throw new ResourceUnavailableRpcError(err);
                // -32003
                case TransactionRejectedRpcError.code:
                  throw new TransactionRejectedRpcError(err);
                // -32004
                case MethodNotSupportedRpcError.code:
                  throw new MethodNotSupportedRpcError(err, {
                    method: args.method
                  });
                // -32005
                case LimitExceededRpcError.code:
                  throw new LimitExceededRpcError(err);
                // -32006
                case JsonRpcVersionUnsupportedError.code:
                  throw new JsonRpcVersionUnsupportedError(err);
                // 4001
                case UserRejectedRequestError.code:
                  throw new UserRejectedRequestError(err);
                // 4100
                case UnauthorizedProviderError.code:
                  throw new UnauthorizedProviderError(err);
                // 4200
                case UnsupportedProviderMethodError.code:
                  throw new UnsupportedProviderMethodError(err);
                // 4900
                case ProviderDisconnectedError.code:
                  throw new ProviderDisconnectedError(err);
                // 4901
                case ChainDisconnectedError.code:
                  throw new ChainDisconnectedError(err);
                // 4902
                case SwitchChainError.code:
                  throw new SwitchChainError(err);
                // 5700
                case UnsupportedNonOptionalCapabilityError.code:
                  throw new UnsupportedNonOptionalCapabilityError(err);
                // 5710
                case UnsupportedChainIdError.code:
                  throw new UnsupportedChainIdError(err);
                // 5720
                case DuplicateIdError.code:
                  throw new DuplicateIdError(err);
                // 5730
                case UnknownBundleIdError.code:
                  throw new UnknownBundleIdError(err);
                // 5740
                case BundleTooLargeError.code:
                  throw new BundleTooLargeError(err);
                // 5750
                case AtomicReadyWalletRejectedUpgradeError.code:
                  throw new AtomicReadyWalletRejectedUpgradeError(err);
                // 5760
                case AtomicityNotSupportedError.code:
                  throw new AtomicityNotSupportedError(err);
                // CAIP-25: User Rejected Error
                // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
                case 5e3:
                  throw new UserRejectedRequestError(err);
                // WalletConnect: Session Settlement Failed
                // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes
                case WalletConnectSessionSettlementError.code:
                  throw new WalletConnectSessionSettlementError(err);
                default:
                  if (err_ instanceof BaseError2) throw err_;
                  throw new UnknownRpcError(err);
              }
            }
          },
          {
            delay: ({ count, error }) => {
              if (error && error instanceof HttpRequestError) {
                const retryAfter = error?.headers?.get("Retry-After");
                if (retryAfter?.match(/\d/))
                  return Number.parseInt(retryAfter, 10) * 1e3;
              }
              return ~~(1 << count) * retryDelay;
            },
            retryCount,
            signal,
            shouldRetry: ({ error }) => shouldRetry(error)
          }
        ),
        { enabled: dedupe, id: requestId }
      );
    };
  }
  function shouldRetry(error) {
    if (isAbortError(error)) return false;
    if ("code" in error && typeof error.code === "number") {
      if (error.code === -1) return true;
      if (error.code === LimitExceededRpcError.code) return true;
      if (error.code === InternalRpcError.code) return true;
      if (error.code === 429) return true;
      return false;
    }
    if (error instanceof HttpRequestError && error.status) {
      if (error.status === 403) return true;
      if (error.status === 408) return true;
      if (error.status === 413) return true;
      if (error.status === 429) return true;
      if (error.status === 500) return true;
      if (error.status === 502) return true;
      if (error.status === 503) return true;
      if (error.status === 504) return true;
      return false;
    }
    return true;
  }
  function hashString(str, seed = 0) {
    let h1 = 3735928559 ^ seed;
    let h2 = 1103547991 ^ seed;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
    h1 ^= Math.imul(h2 ^ h2 >>> 16, 3266489909);
    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
    h2 ^= Math.imul(h1 ^ h1 >>> 16, 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }

  // node_modules/viem/utils/index.ts
  init_ccip2();

  // node_modules/viem/utils/ccipTunnel.ts
  init_abis();
  init_solidity();
  init_request();
  init_decodeErrorResult();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_ccip2();
  init_localBatchGatewayRequest();
  function ccipReadTunnel({
    batchGateways,
    ccipRequest: ccipRequest2 = ccipRequest
  }) {
    return {
      async request({ data, sender, urls }) {
        if (urls.includes(localBatchGatewayUrl)) {
          return ccipRequest2({
            data,
            sender,
            urls: batchGateways
          });
        } else {
          const [failures, responses] = decodeFunctionResult({
            abi: batchGatewayAbi,
            functionName: "query",
            data: await ccipRequest2({
              data: encodeFunctionData({
                abi: batchGatewayAbi,
                functionName: "query",
                args: [[{ sender, data, urls }]]
              }),
              sender,
              urls: batchGateways
            })
          });
          if (failures[0]) {
            let error;
            try {
              const res = decodeErrorResult({
                abi: [...batchGatewayAbi, solidityError],
                data: responses[0]
              });
              if (res.errorName === "HttpError") {
                error = new HttpRequestError({
                  body: { message: res.args[1] },
                  status: res.args[0],
                  url: urls.join(" | ")
                });
              } else {
                const message = res.args[0];
                if (message) {
                  error = new Error(message);
                }
              }
            } catch {
            }
            throw error ?? new Error("An unknown error occurred.");
          }
          return responses[0];
        }
      }
    };
  }

  // node_modules/viem/utils/chain/defineChain.ts
  function defineChain(chain) {
    const chainInstance = {
      formatters: void 0,
      fees: void 0,
      serializers: void 0,
      ...chain
    };
    function extend(base) {
      return (fnOrExtended) => {
        const properties = typeof fnOrExtended === "function" ? fnOrExtended(base) : fnOrExtended;
        const combined = { ...base, ...properties };
        return Object.assign(combined, { extend: extend(combined) });
      };
    }
    return Object.assign(chainInstance, {
      extend: extend(chainInstance)
    });
  }
  function extendSchema() {
    return {};
  }

  // node_modules/viem/utils/chain/extractChain.ts
  function extractChain({
    chains,
    id
  }) {
    return chains.find((chain) => chain.id === id);
  }

  // node_modules/viem/utils/index.ts
  init_getChainContractAddress();
  init_concat();
  init_isHex();
  init_pad();
  init_size();
  init_slice();
  init_trim();
  init_fromBytes();
  init_fromHex();

  // node_modules/viem/utils/encoding/fromRlp.ts
  init_base();
  init_encoding();
  init_cursor2();
  init_toBytes();
  init_toHex();
  var rlpDepthLimit = 1024;
  function fromRlp(value, to = "hex") {
    const bytes = (() => {
      if (typeof value === "string") {
        if (value.length > 3 && value.length % 2 !== 0)
          throw new InvalidHexValueError(value);
        return hexToBytes(value);
      }
      return value;
    })();
    const cursor = createCursor(bytes, {
      recursiveReadLimit: Number.POSITIVE_INFINITY
    });
    const result = fromRlpCursor(cursor, to);
    if (cursor.position < cursor.bytes.length)
      throw new RlpTrailingBytesError({
        count: cursor.bytes.length - cursor.position
      });
    return result;
  }
  function fromRlpCursor(cursor, to = "hex", recursiveDepth = 0) {
    if (recursiveDepth >= rlpDepthLimit)
      throw new RlpDepthLimitExceededError({ limit: rlpDepthLimit });
    if (cursor.bytes.length === 0)
      return to === "hex" ? bytesToHex(cursor.bytes) : cursor.bytes;
    const prefix = cursor.readByte();
    if (prefix < 128) cursor.decrementPosition(1);
    if (prefix < 192) {
      const length2 = readLength(cursor, prefix, 128);
      const bytes = cursor.readBytes(length2);
      return to === "hex" ? bytesToHex(bytes) : bytes;
    }
    const length = readLength(cursor, prefix, 192);
    return readList(
      cursor,
      length,
      to,
      recursiveDepth + 1
    );
  }
  function readLength(cursor, prefix, offset) {
    if (offset === 128 && prefix < 128) return 1;
    if (prefix <= offset + 55) return prefix - offset;
    if (prefix === offset + 55 + 1) return cursor.readUint8();
    if (prefix === offset + 55 + 2) return cursor.readUint16();
    if (prefix === offset + 55 + 3) return cursor.readUint24();
    if (prefix === offset + 55 + 4) return cursor.readUint32();
    throw new BaseError2("Invalid RLP prefix");
  }
  function readList(cursor, length, to, recursiveDepth) {
    const position = cursor.position;
    const value = [];
    while (cursor.position - position < length)
      value.push(fromRlpCursor(cursor, to, recursiveDepth));
    if (cursor.position - position !== length)
      throw new RlpListBoundaryExceededError({
        consumed: cursor.position - position,
        declared: length
      });
    return value;
  }

  // node_modules/viem/utils/index.ts
  init_toBytes();
  init_toHex();
  init_getCallError();
  init_getNodeError();
  init_extract();
  init_formatter();
  init_transactionRequest();

  // node_modules/viem/utils/hash/isHash.ts
  init_isHex();
  init_size();
  function isHash(hash3) {
    return isHex(hash3) && size(hash3) === 32;
  }

  // node_modules/viem/utils/index.ts
  init_keccak256();

  // node_modules/@noble/hashes/esm/legacy.js
  init_md();
  init_utils2();
  var Rho160 = /* @__PURE__ */ Uint8Array.from([
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8
  ]);
  var Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
  var Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
  var idxLR = /* @__PURE__ */ (() => {
    const L = [Id160];
    const R = [Pi160];
    const res = [L, R];
    for (let i = 0; i < 4; i++)
      for (let j of res)
        j.push(j[i].map((k) => Rho160[k]));
    return res;
  })();
  var idxL = /* @__PURE__ */ (() => idxLR[0])();
  var idxR = /* @__PURE__ */ (() => idxLR[1])();
  var shifts160 = /* @__PURE__ */ [
    [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
    [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
    [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
    [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
    [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
  ].map((i) => Uint8Array.from(i));
  var shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
  var shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
  var Kl160 = /* @__PURE__ */ Uint32Array.from([
    0,
    1518500249,
    1859775393,
    2400959708,
    2840853838
  ]);
  var Kr160 = /* @__PURE__ */ Uint32Array.from([
    1352829926,
    1548603684,
    1836072691,
    2053994217,
    0
  ]);
  function ripemd_f(group, x, y, z) {
    if (group === 0)
      return x ^ y ^ z;
    if (group === 1)
      return x & y | ~x & z;
    if (group === 2)
      return (x | ~y) ^ z;
    if (group === 3)
      return x & z | y & ~z;
    return x ^ (y | ~z);
  }
  var BUF_160 = /* @__PURE__ */ new Uint32Array(16);
  var RIPEMD160 = class extends HashMD {
    constructor() {
      super(64, 20, 8, true);
      this.h0 = 1732584193 | 0;
      this.h1 = 4023233417 | 0;
      this.h2 = 2562383102 | 0;
      this.h3 = 271733878 | 0;
      this.h4 = 3285377520 | 0;
    }
    get() {
      const { h0, h1, h2, h3, h4 } = this;
      return [h0, h1, h2, h3, h4];
    }
    set(h0, h1, h2, h3, h4) {
      this.h0 = h0 | 0;
      this.h1 = h1 | 0;
      this.h2 = h2 | 0;
      this.h3 = h3 | 0;
      this.h4 = h4 | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        BUF_160[i] = view.getUint32(offset, true);
      let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
      for (let group = 0; group < 5; group++) {
        const rGroup = 4 - group;
        const hbl = Kl160[group], hbr = Kr160[group];
        const rl = idxL[group], rr = idxR[group];
        const sl = shiftsL160[group], sr = shiftsR160[group];
        for (let i = 0; i < 16; i++) {
          const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
          al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
        }
        for (let i = 0; i < 16; i++) {
          const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
          ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
        }
      }
      this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
    }
    roundClean() {
      clean(BUF_160);
    }
    destroy() {
      this.destroyed = true;
      clean(this.buffer);
      this.set(0, 0, 0, 0, 0);
    }
  };
  var ripemd160 = /* @__PURE__ */ createHasher(() => new RIPEMD160());

  // node_modules/@noble/hashes/esm/ripemd160.js
  var ripemd1602 = ripemd160;

  // node_modules/viem/utils/hash/ripemd160.ts
  init_isHex();
  init_toBytes();
  init_toHex();
  function ripemd1603(value, to_) {
    const to = to_ || "hex";
    const bytes = ripemd1602(
      isHex(value, { strict: false }) ? toBytes(value) : value
    );
    if (to === "bytes") return bytes;
    return toHex(bytes);
  }

  // node_modules/viem/utils/hash/toEventHash.ts
  init_toSignatureHash();

  // node_modules/viem/utils/index.ts
  init_toEventSelector();

  // node_modules/viem/utils/hash/toEventSignature.ts
  init_toSignature();

  // node_modules/viem/utils/hash/toFunctionHash.ts
  init_toSignatureHash();

  // node_modules/viem/utils/index.ts
  init_toFunctionSelector();

  // node_modules/viem/utils/hash/toFunctionSignature.ts
  init_toSignature();

  // node_modules/viem/utils/nonceManager.ts
  init_lru();
  function createNonceManager(parameters) {
    const { source } = parameters;
    const deltaMap = /* @__PURE__ */ new Map();
    const nonceMap = new LruMap(8192);
    const promiseMap = /* @__PURE__ */ new Map();
    const getKey = ({ address, chainId }) => `${address}.${chainId}`;
    const resetCache = (key) => {
      deltaMap.delete(key);
      promiseMap.delete(key);
    };
    return {
      async consume({ address, chainId, client }) {
        const key = getKey({ address, chainId });
        const promise = this.get({ address, chainId, client });
        this.increment({ address, chainId });
        const nonce = await promise;
        await source.set({ address, chainId }, nonce);
        nonceMap.set(key, nonce);
        return nonce;
      },
      async increment({ address, chainId }) {
        const key = getKey({ address, chainId });
        const delta = deltaMap.get(key) ?? 0;
        deltaMap.set(key, delta + 1);
      },
      async get({ address, chainId, client }) {
        const key = getKey({ address, chainId });
        let promise = promiseMap.get(key);
        if (!promise) {
          promise = (async () => {
            try {
              const nonce = await source.get({ address, chainId, client });
              const previousNonce = nonceMap.get(key) ?? 0;
              if (previousNonce > 0 && nonce <= previousNonce)
                return previousNonce + 1;
              nonceMap.delete(key);
              return nonce;
            } finally {
              resetCache(key);
            }
          })();
          promiseMap.set(key, promise);
        }
        const delta = deltaMap.get(key) ?? 0;
        return delta + await promise;
      },
      reset({ address, chainId }) {
        const key = getKey({ address, chainId });
        nonceMap.delete(key);
        resetCache(key);
      }
    };
  }
  function jsonRpc() {
    return {
      async get(parameters) {
        const { address, client } = parameters;
        return getTransactionCount(client, {
          address,
          blockTag: "pending"
        });
      },
      set() {
      }
    };
  }
  var nonceManager = /* @__PURE__ */ createNonceManager({
    source: jsonRpc()
  });

  // node_modules/viem/utils/index.ts
  init_regex2();

  // node_modules/viem/utils/rpc/http.ts
  init_request();
  init_utils3();

  // node_modules/viem/utils/promise/withTimeout.ts
  init_utils3();
  function withTimeout(fn, {
    errorInstance = new Error("timed out"),
    timeout,
    signal
  }) {
    return new Promise((resolve, reject) => {
      ;
      (async () => {
        let timeoutId;
        const controller = new AbortController();
        try {
          if (timeout > 0) {
            timeoutId = setTimeout(() => {
              if (signal) {
                controller.abort();
              } else {
                reject(errorInstance);
              }
            }, timeout);
          }
          resolve(await fn({ signal: controller?.signal || null }));
        } catch (err) {
          if (controller?.signal.aborted && isAbortError(err)) {
            reject(errorInstance);
            return;
          }
          reject(err);
        } finally {
          clearTimeout(timeoutId);
        }
      })();
    });
  }

  // node_modules/viem/utils/rpc/http.ts
  init_stringify();

  // node_modules/viem/utils/rpc/id.ts
  function createIdStore() {
    return {
      current: 0,
      take() {
        return this.current++;
      },
      reset() {
        this.current = 0;
      }
    };
  }
  var idCache = /* @__PURE__ */ createIdStore();

  // node_modules/viem/utils/rpc/http.ts
  var defaultMaxResponseBodySize = 10485760;
  function getHttpRpcClient(url_, options = {}) {
    const { url, headers: headers_url } = parseUrl(url_);
    return {
      async request(params) {
        const {
          body,
          fetchFn = options.fetchFn ?? fetch,
          maxResponseBodySize = options.maxResponseBodySize ?? defaultMaxResponseBodySize,
          onRequest = options.onRequest,
          onResponse = options.onResponse,
          timeout = options.timeout ?? 1e4
        } = params;
        const fetchOptions = {
          ...options.fetchOptions ?? {},
          ...params.fetchOptions ?? {}
        };
        const { headers, method, signal: signal_ } = fetchOptions;
        try {
          const response = await withTimeout(
            async ({ signal }) => {
              const init = {
                ...fetchOptions,
                body: Array.isArray(body) ? stringify(
                  body.map((body2) => ({
                    jsonrpc: "2.0",
                    id: body2.id ?? idCache.take(),
                    ...body2
                  }))
                ) : stringify({
                  jsonrpc: "2.0",
                  id: body.id ?? idCache.take(),
                  ...body
                }),
                headers: {
                  ...headers_url,
                  "Content-Type": "application/json",
                  ...headers
                },
                method: method || "POST",
                signal: signal_ || (timeout > 0 ? signal : null)
              };
              const request = new Request(url, init);
              const args = await onRequest?.(request, init) ?? { ...init, url };
              const response2 = await fetchFn(args.url ?? url, args);
              return response2;
            },
            {
              errorInstance: new TimeoutError({ body, url }),
              timeout,
              signal: true
            }
          );
          if (onResponse) await onResponse(response);
          let data;
          const responseBody = await readResponseBody(response, {
            maxResponseBodySize
          });
          if (response.headers.get("Content-Type")?.startsWith("application/json"))
            data = JSON.parse(responseBody);
          else {
            data = responseBody;
            try {
              data = JSON.parse(data || "{}");
            } catch (err) {
              if (response.ok) throw err;
              data = { error: data };
            }
          }
          if (!response.ok) {
            if (typeof data.error?.code === "number" && typeof data.error?.message === "string")
              return data;
            throw new HttpRequestError({
              body,
              details: stringify(data.error) || response.statusText,
              headers: response.headers,
              status: response.status,
              url
            });
          }
          return data;
        } catch (err) {
          if (signal_?.aborted) throw getAbortError(signal_);
          if (isAbortError(err)) throw err;
          if (err instanceof HttpRequestError) throw err;
          if (err instanceof ResponseBodyTooLargeError) throw err;
          if (err instanceof TimeoutError) throw err;
          throw new HttpRequestError({
            body,
            cause: err,
            url
          });
        }
      }
    };
  }
  async function readResponseBody(response, { maxResponseBodySize }) {
    if (maxResponseBodySize === false) return response.text();
    const contentLength = response.headers.get("Content-Length");
    if (contentLength) {
      const size6 = Number(contentLength);
      if (size6 > maxResponseBodySize)
        throw new ResponseBodyTooLargeError({
          maxSize: maxResponseBodySize,
          size: size6
        });
    }
    if (!response.body) {
      const body2 = await response.text();
      const size6 = new TextEncoder().encode(body2).length;
      if (size6 > maxResponseBodySize)
        throw new ResponseBodyTooLargeError({
          maxSize: maxResponseBodySize,
          size: size6
        });
      return body2;
    }
    const reader = response.body.getReader();
    const decoder2 = new TextDecoder();
    let body = "";
    let size5 = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size5 += value.byteLength;
        if (size5 > maxResponseBodySize) {
          await reader.cancel();
          throw new ResponseBodyTooLargeError({
            maxSize: maxResponseBodySize,
            size: size5
          });
        }
        body += decoder2.decode(value, { stream: true });
      }
      body += decoder2.decode();
      return body;
    } finally {
      reader.releaseLock();
    }
  }
  function parseUrl(url_) {
    try {
      const url = new URL(url_);
      const result = (() => {
        if (url.username) {
          const credentials = `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`;
          url.username = "";
          url.password = "";
          return {
            url: url.toString(),
            headers: { Authorization: `Basic ${btoa(credentials)}` }
          };
        }
        return;
      })();
      return { url: url.toString(), ...result };
    } catch {
      return { url: url_ };
    }
  }

  // node_modules/viem/utils/rpc/webSocket.ts
  init_request();

  // node_modules/viem/utils/rpc/socket.ts
  init_request();
  init_createBatchScheduler();
  var socketClientCache = /* @__PURE__ */ new Map();
  async function getSocketRpcClient(parameters) {
    const {
      getSocket: getSocket2,
      keepAlive = true,
      key = "socket",
      reconnect = true,
      url
    } = parameters;
    const { interval: keepAliveInterval = 3e4 } = typeof keepAlive === "object" ? keepAlive : {};
    const { attempts = 5, delay = 2e3 } = typeof reconnect === "object" ? reconnect : {};
    const id = JSON.stringify({ keepAlive, key, url, reconnect });
    let socketClient = socketClientCache.get(id);
    if (socketClient) return socketClient;
    let reconnectCount = 0;
    const { schedule } = createBatchScheduler({
      id,
      fn: async () => {
        const requests = /* @__PURE__ */ new Map();
        const subscriptions = /* @__PURE__ */ new Map();
        let error;
        let socket;
        let keepAliveTimer;
        let reconnectTimer;
        let reconnectInProgress = false;
        let intentionallyClosed = false;
        function attemptReconnect() {
          if (reconnect && !intentionallyClosed && reconnectCount < attempts) {
            if (reconnectInProgress) return;
            reconnectInProgress = true;
            reconnectCount++;
            socket?.close();
            reconnectTimer = setTimeout(async () => {
              reconnectTimer = void 0;
              if (intentionallyClosed) {
                reconnectInProgress = false;
                return;
              }
              await setup().catch(console.error);
              reconnectInProgress = false;
            }, delay);
          } else {
            requests.clear();
            subscriptions.clear();
          }
        }
        async function setup() {
          const result = await getSocket2({
            onClose() {
              for (const request of requests.values())
                request.onError?.(new SocketClosedError({ url }));
              for (const subscription of subscriptions.values())
                subscription.onError?.(new SocketClosedError({ url }));
              attemptReconnect();
            },
            onError(error_) {
              error = error_;
              for (const request of requests.values()) request.onError?.(error);
              for (const subscription of subscriptions.values())
                subscription.onError?.(error);
              attemptReconnect();
            },
            onOpen() {
              error = void 0;
              reconnectCount = 0;
            },
            onResponse(data) {
              const isSubscription = data.method === "eth_subscription";
              const id2 = isSubscription ? data.params.subscription : data.id;
              const cache = isSubscription ? subscriptions : requests;
              const callback = cache.get(id2);
              if (callback) callback.onResponse(data);
              if (!isSubscription) cache.delete(id2);
            }
          });
          if (intentionallyClosed) {
            result.close();
            return result;
          }
          socket = result;
          if (keepAlive) {
            if (keepAliveTimer) clearInterval(keepAliveTimer);
            keepAliveTimer = setInterval(() => socket.ping?.(), keepAliveInterval);
          }
          if (reconnect && subscriptions.size > 0) {
            const subscriptionEntries = subscriptions.entries();
            for (const [
              key2,
              { onResponse, body, onError }
            ] of subscriptionEntries) {
              if (!body) continue;
              subscriptions.delete(key2);
              socketClient?.request({ body, onResponse, onError });
            }
          }
          return result;
        }
        await setup();
        error = void 0;
        socketClient = {
          close() {
            intentionallyClosed = true;
            keepAliveTimer && clearInterval(keepAliveTimer);
            if (reconnectTimer) {
              clearTimeout(reconnectTimer);
              reconnectTimer = void 0;
              reconnectInProgress = false;
            }
            socket.close();
            socketClientCache.delete(id);
          },
          get socket() {
            return socket;
          },
          request({ body, onError, onResponse }) {
            if (error && onError) onError(error);
            const id2 = body.id ?? idCache.take();
            const callback = (response) => {
              if (typeof response.id === "number" && id2 !== response.id) return;
              if (body.method === "eth_subscribe" && typeof response.result === "string")
                subscriptions.set(response.result, {
                  onResponse: callback,
                  onError,
                  body
                });
              onResponse(response);
            };
            if (body.method === "eth_unsubscribe")
              subscriptions.delete(body.params?.[0]);
            requests.set(id2, { onResponse: callback, onError });
            try {
              socket.request({
                body: {
                  jsonrpc: "2.0",
                  id: id2,
                  ...body
                }
              });
            } catch (error2) {
              onError?.(error2);
            }
          },
          requestAsync({ body, timeout = 1e4 }) {
            return withTimeout(
              () => new Promise(
                (onResponse, onError) => this.request({
                  body,
                  onError,
                  onResponse
                })
              ),
              {
                errorInstance: new TimeoutError({ body, url }),
                timeout
              }
            );
          },
          requests,
          subscriptions,
          url
        };
        socketClientCache.set(id, socketClient);
        return [socketClient];
      }
    });
    const [_, [socketClient_]] = await schedule();
    return socketClient_;
  }

  // node_modules/viem/utils/rpc/webSocket.ts
  async function getWebSocketRpcClient(url, options = {}) {
    const { keepAlive, reconnect } = options;
    return getSocketRpcClient({
      async getSocket({ onClose, onError, onOpen, onResponse }) {
        const WebSocket3 = await Promise.resolve().then(() => (init_native(), native_exports)).then((module) => module.WebSocket);
        const socket = new WebSocket3(url);
        function onClose_() {
          socket.removeEventListener("close", onClose_);
          socket.removeEventListener("message", onMessage);
          socket.removeEventListener("error", onError);
          socket.removeEventListener("open", onOpen);
          onClose();
        }
        function onMessage({ data }) {
          if (typeof data === "string" && data.trim().length === 0) return;
          try {
            const _data = JSON.parse(data);
            onResponse(_data);
          } catch (error) {
            onError(error);
          }
        }
        socket.addEventListener("close", onClose_);
        socket.addEventListener("message", onMessage);
        socket.addEventListener("error", onError);
        socket.addEventListener("open", onOpen);
        if (socket.readyState === WebSocket3.CONNECTING) {
          await new Promise((resolve, reject) => {
            if (!socket) return;
            socket.onopen = resolve;
            socket.onerror = reject;
          });
        }
        const { close: close_ } = socket;
        return Object.assign(socket, {
          close() {
            close_.bind(socket)();
            onClose_();
          },
          ping() {
            try {
              if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
                throw new WebSocketRequestError({
                  url: socket.url,
                  cause: new SocketClosedError({ url: socket.url })
                });
              const body = {
                jsonrpc: "2.0",
                id: null,
                method: "net_version",
                params: []
              };
              socket.send(JSON.stringify(body));
            } catch (error) {
              onError(error);
            }
          },
          request({ body }) {
            if (socket.readyState === socket.CLOSED || socket.readyState === socket.CLOSING)
              throw new WebSocketRequestError({
                body,
                url: socket.url,
                cause: new SocketClosedError({ url: socket.url })
              });
            return socket.send(JSON.stringify(body));
          }
        });
      },
      keepAlive,
      reconnect,
      url
    });
  }

  // node_modules/viem/utils/rpc/compat.ts
  async function getSocket(url) {
    const client = await getWebSocketRpcClient(url);
    return Object.assign(client.socket, {
      requests: client.requests,
      subscriptions: client.subscriptions
    });
  }

  // node_modules/viem/utils/signature/hashMessage.ts
  init_keccak256();

  // node_modules/viem/constants/strings.ts
  var presignMessagePrefix = "Ethereum Signed Message:\n";

  // node_modules/viem/utils/signature/toPrefixedMessage.ts
  init_concat();
  init_size();
  init_toHex();
  function toPrefixedMessage(message_) {
    const message = (() => {
      if (typeof message_ === "string") return stringToHex(message_);
      if (typeof message_.raw === "string") return message_.raw;
      return bytesToHex(message_.raw);
    })();
    const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
    return concat([prefix, message]);
  }

  // node_modules/viem/utils/signature/hashMessage.ts
  function hashMessage(message, to_) {
    return keccak256(toPrefixedMessage(message), to_);
  }

  // node_modules/viem/utils/signature/hashTypedData.ts
  init_encodeAbiParameters();
  init_concat();
  init_toHex();
  init_keccak256();

  // node_modules/viem/utils/typedData.ts
  init_abi();
  init_address();

  // node_modules/viem/errors/typedData.ts
  init_stringify();
  init_base();
  var InvalidDomainError = class extends BaseError2 {
    constructor({ domain }) {
      super(`Invalid domain "${stringify(domain)}".`, {
        metaMessages: ["Must be a valid EIP-712 domain."]
      });
    }
  };
  var InvalidPrimaryTypeError = class extends BaseError2 {
    constructor({
      primaryType,
      types
    }) {
      super(
        `Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`,
        {
          docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
          metaMessages: ["Check that the primary type is a key in `types`."]
        }
      );
    }
  };
  var InvalidStructTypeError = class extends BaseError2 {
    constructor({ type }) {
      super(`Struct type "${type}" is invalid.`, {
        metaMessages: ["Struct type must not be a Solidity type."],
        name: "InvalidStructTypeError"
      });
    }
  };

  // node_modules/viem/utils/typedData.ts
  init_isAddress();
  init_size();
  init_toHex();
  init_regex2();
  init_stringify();
  function serializeTypedData(parameters) {
    const {
      domain: domain_,
      message: message_,
      primaryType,
      types
    } = parameters;
    const normalizeData = (struct, data_) => {
      const data = { ...data_ };
      for (const param of struct) {
        const { name, type } = param;
        if (type === "address") data[name] = data[name].toLowerCase();
      }
      return data;
    };
    const domain = (() => {
      if (!types.EIP712Domain) return {};
      if (!domain_) return {};
      return normalizeData(types.EIP712Domain, domain_);
    })();
    const message = (() => {
      if (primaryType === "EIP712Domain") return void 0;
      return normalizeData(types[primaryType], message_);
    })();
    return stringify({ domain, message, primaryType, types });
  }
  function validateTypedData(parameters) {
    const { domain, message, primaryType, types } = parameters;
    const validateData = (struct, data) => {
      for (const param of struct) {
        const { name, type } = param;
        const value = data[name];
        const integerMatch = type.match(integerRegex2);
        if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
          const [_type, base, size_] = integerMatch;
          numberToHex(value, {
            signed: base === "int",
            size: Number.parseInt(size_, 10) / 8
          });
        }
        if (type === "address" && typeof value === "string" && !isAddress(value))
          throw new InvalidAddressError({ address: value });
        const bytesMatch = type.match(bytesRegex2);
        if (bytesMatch) {
          const [_type, size_] = bytesMatch;
          if (size_ && size(value) !== Number.parseInt(size_, 10))
            throw new BytesSizeMismatchError({
              expectedSize: Number.parseInt(size_, 10),
              givenSize: size(value)
            });
        }
        const struct2 = types[type];
        if (struct2) {
          validateReference(type);
          validateData(struct2, value);
        }
      }
    };
    if (types.EIP712Domain && domain) {
      if (typeof domain !== "object") throw new InvalidDomainError({ domain });
      validateData(types.EIP712Domain, domain);
    }
    if (primaryType !== "EIP712Domain") {
      if (types[primaryType]) validateData(types[primaryType], message);
      else throw new InvalidPrimaryTypeError({ primaryType, types });
    }
  }
  function getTypesForEIP712Domain({
    domain
  }) {
    return [
      typeof domain?.name === "string" && { name: "name", type: "string" },
      domain?.version && { name: "version", type: "string" },
      (typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
        name: "chainId",
        type: "uint256"
      },
      domain?.verifyingContract && {
        name: "verifyingContract",
        type: "address"
      },
      domain?.salt && { name: "salt", type: "bytes32" }
    ].filter(Boolean);
  }
  function domainSeparator({ domain }) {
    return hashDomain({
      domain,
      types: {
        EIP712Domain: getTypesForEIP712Domain({ domain })
      }
    });
  }
  function validateReference(type) {
    if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
      throw new InvalidStructTypeError({ type });
  }

  // node_modules/viem/utils/signature/hashTypedData.ts
  function hashTypedData(parameters) {
    const {
      domain = {},
      message,
      primaryType
    } = parameters;
    const types = {
      EIP712Domain: getTypesForEIP712Domain({ domain }),
      ...parameters.types
    };
    validateTypedData({
      domain,
      message,
      primaryType,
      types
    });
    const parts = ["0x1901"];
    if (domain)
      parts.push(
        hashDomain({
          domain,
          types
        })
      );
    if (primaryType !== "EIP712Domain")
      parts.push(
        hashStruct({
          data: message,
          primaryType,
          types
        })
      );
    return keccak256(concat(parts));
  }
  function hashDomain({
    domain,
    types
  }) {
    return hashStruct({
      data: domain,
      primaryType: "EIP712Domain",
      types
    });
  }
  function hashStruct({
    data,
    primaryType,
    types
  }) {
    const encoded = encodeData({
      data,
      primaryType,
      types
    });
    return keccak256(encoded);
  }
  function encodeData({
    data,
    primaryType,
    types
  }) {
    const encodedTypes = [{ type: "bytes32" }];
    const encodedValues = [hashType({ primaryType, types })];
    for (const field of types[primaryType]) {
      const [type, value] = encodeField({
        types,
        name: field.name,
        type: field.type,
        value: data[field.name]
      });
      encodedTypes.push(type);
      encodedValues.push(value);
    }
    return encodeAbiParameters(encodedTypes, encodedValues);
  }
  function hashType({
    primaryType,
    types
  }) {
    const encodedHashType = toHex(encodeType({ primaryType, types }));
    return keccak256(encodedHashType);
  }
  function encodeType({
    primaryType,
    types
  }) {
    let result = "";
    const unsortedDeps = findTypeDependencies({ primaryType, types });
    unsortedDeps.delete(primaryType);
    const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
    for (const type of deps) {
      result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
    }
    return result;
  }
  function findTypeDependencies({
    primaryType: primaryType_,
    types
  }, results = /* @__PURE__ */ new Set()) {
    const match = primaryType_.match(/^\w*/u);
    const primaryType = match?.[0];
    if (results.has(primaryType) || types[primaryType] === void 0) {
      return results;
    }
    results.add(primaryType);
    for (const field of types[primaryType]) {
      findTypeDependencies({ primaryType: field.type, types }, results);
    }
    return results;
  }
  function encodeField({
    types,
    name,
    type,
    value
  }) {
    if (types[type] !== void 0) {
      return [
        { type: "bytes32" },
        keccak256(encodeData({ data: value, primaryType: type, types }))
      ];
    }
    if (type === "bytes") return [{ type: "bytes32" }, keccak256(value)];
    if (type === "string") return [{ type: "bytes32" }, keccak256(toHex(value))];
    if (type.lastIndexOf("]") === type.length - 1) {
      const parsedType = type.slice(0, type.lastIndexOf("["));
      const typeValuePairs = value.map(
        (item) => encodeField({
          name,
          type: parsedType,
          types,
          value: item
        })
      );
      return [
        { type: "bytes32" },
        keccak256(
          encodeAbiParameters(
            typeValuePairs.map(([t]) => t),
            typeValuePairs.map(([, v]) => v)
          )
        )
      ];
    }
    return [{ type }, value];
  }

  // node_modules/viem/constants/bytes.ts
  var erc6492MagicBytes = "0x6492649264926492649264926492649264926492649264926492649264926492";
  var zeroHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

  // node_modules/viem/utils/signature/isErc6492Signature.ts
  init_slice();
  function isErc6492Signature(signature) {
    return sliceHex(signature, -32) === erc6492MagicBytes;
  }

  // node_modules/ox/_esm/erc8010/SignatureErc8010.js
  var SignatureErc8010_exports = {};
  __export(SignatureErc8010_exports, {
    InvalidWrappedSignatureError: () => InvalidWrappedSignatureError,
    assert: () => assert6,
    from: () => from9,
    magicBytes: () => magicBytes,
    suffixParameters: () => suffixParameters,
    unwrap: () => unwrap,
    validate: () => validate4,
    wrap: () => wrap
  });

  // node_modules/ox/_esm/core/AbiParameters.js
  init_exports();

  // node_modules/ox/_esm/core/Address.js
  init_Bytes();

  // node_modules/ox/_esm/core/internal/lru.js
  var LruMap2 = class extends Map {
    constructor(size5) {
      super();
      Object.defineProperty(this, "maxSize", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0
      });
      this.maxSize = size5;
    }
    get(key) {
      const value = super.get(key);
      if (super.has(key) && value !== void 0) {
        this.delete(key);
        super.set(key, value);
      }
      return value;
    }
    set(key, value) {
      super.set(key, value);
      if (this.maxSize && this.size > this.maxSize) {
        const firstKey = this.keys().next().value;
        if (firstKey)
          this.delete(firstKey);
      }
      return this;
    }
  };

  // node_modules/ox/_esm/core/Caches.js
  var caches = {
    checksum: /* @__PURE__ */ new LruMap2(8192)
  };
  var checksum = caches.checksum;

  // node_modules/ox/_esm/core/Address.js
  init_Errors();

  // node_modules/ox/_esm/core/Hash.js
  init_sha3();
  init_Bytes();
  init_Hex();
  function keccak2562(value, options = {}) {
    const { as = typeof value === "string" ? "Hex" : "Bytes" } = options;
    const bytes = keccak_256(from(value));
    if (as === "Bytes")
      return bytes;
    return fromBytes2(bytes);
  }

  // node_modules/ox/_esm/core/PublicKey.js
  init_Bytes();
  init_Errors();
  init_Hex();
  init_Json();
  function assert3(publicKey, options = {}) {
    const { compressed } = options;
    const { prefix, x, y } = publicKey;
    if (compressed === false || typeof x === "bigint" && typeof y === "bigint") {
      if (prefix !== 4)
        throw new InvalidPrefixError({
          prefix,
          cause: new InvalidUncompressedPrefixError()
        });
      return;
    }
    if (compressed === true || typeof x === "bigint" && typeof y === "undefined") {
      if (prefix !== 3 && prefix !== 2)
        throw new InvalidPrefixError({
          prefix,
          cause: new InvalidCompressedPrefixError()
        });
      return;
    }
    throw new InvalidError({ publicKey });
  }
  function from3(value) {
    const publicKey = (() => {
      if (validate2(value))
        return fromHex3(value);
      if (validate(value))
        return fromBytes3(value);
      const { prefix, x, y } = value;
      if (typeof x === "bigint" && typeof y === "bigint")
        return { prefix: prefix ?? 4, x, y };
      return { prefix, x };
    })();
    assert3(publicKey);
    return publicKey;
  }
  function fromBytes3(publicKey) {
    return fromHex3(fromBytes2(publicKey));
  }
  function fromHex3(publicKey) {
    if (publicKey.length !== 132 && publicKey.length !== 130 && publicKey.length !== 68)
      throw new InvalidSerializedSizeError({ publicKey });
    if (publicKey.length === 130) {
      const x2 = BigInt(slice3(publicKey, 0, 32));
      const y = BigInt(slice3(publicKey, 32, 64));
      return {
        prefix: 4,
        x: x2,
        y
      };
    }
    if (publicKey.length === 132) {
      const prefix2 = Number(slice3(publicKey, 0, 1));
      const x2 = BigInt(slice3(publicKey, 1, 33));
      const y = BigInt(slice3(publicKey, 33, 65));
      return {
        prefix: prefix2,
        x: x2,
        y
      };
    }
    const prefix = Number(slice3(publicKey, 0, 1));
    const x = BigInt(slice3(publicKey, 1, 33));
    return {
      prefix,
      x
    };
  }
  function toHex2(publicKey, options = {}) {
    assert3(publicKey);
    const { prefix, x, y } = publicKey;
    const { includePrefix = true } = options;
    const publicKey_ = concat2(
      includePrefix ? fromNumber(prefix, { size: 1 }) : "0x",
      fromNumber(x, { size: 32 }),
      // If the public key is not compressed, add the y coordinate.
      typeof y === "bigint" ? fromNumber(y, { size: 32 }) : "0x"
    );
    return publicKey_;
  }
  var InvalidError = class extends BaseError3 {
    constructor({ publicKey }) {
      super(`Value \`${stringify2(publicKey)}\` is not a valid public key.`, {
        metaMessages: [
          "Public key must contain:",
          "- an `x` and `prefix` value (compressed)",
          "- an `x`, `y`, and `prefix` value (uncompressed)"
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidError"
      });
    }
  };
  var InvalidPrefixError = class extends BaseError3 {
    constructor({ prefix, cause }) {
      super(`Prefix "${prefix}" is invalid.`, {
        cause
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidPrefixError"
      });
    }
  };
  var InvalidCompressedPrefixError = class extends BaseError3 {
    constructor() {
      super("Prefix must be 2 or 3 for compressed public keys.");
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidCompressedPrefixError"
      });
    }
  };
  var InvalidUncompressedPrefixError = class extends BaseError3 {
    constructor() {
      super("Prefix must be 4 for uncompressed public keys.");
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidUncompressedPrefixError"
      });
    }
  };
  var InvalidSerializedSizeError = class extends BaseError3 {
    constructor({ publicKey }) {
      super(`Value \`${publicKey}\` is an invalid public key size.`, {
        metaMessages: [
          "Expected: 33 bytes (compressed + prefix), 64 bytes (uncompressed) or 65 bytes (uncompressed + prefix).",
          `Received ${size3(from2(publicKey))} bytes.`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "PublicKey.InvalidSerializedSizeError"
      });
    }
  };

  // node_modules/ox/_esm/core/Address.js
  var addressRegex2 = /^0x[a-fA-F0-9]{40}$/;
  function assert4(value, options = {}) {
    const { strict = true } = options;
    if (!addressRegex2.test(value))
      throw new InvalidAddressError2({
        address: value,
        cause: new InvalidInputError()
      });
    if (strict) {
      if (value.toLowerCase() === value)
        return;
      if (checksum2(value) !== value)
        throw new InvalidAddressError2({
          address: value,
          cause: new InvalidChecksumError()
        });
    }
  }
  function checksum2(address) {
    if (checksum.has(address))
      return checksum.get(address);
    assert4(address, { strict: false });
    const hexAddress = address.substring(2).toLowerCase();
    const hash3 = keccak2562(fromString(hexAddress), { as: "Bytes" });
    const characters = hexAddress.split("");
    for (let i = 0; i < 40; i += 2) {
      if (hash3[i >> 1] >> 4 >= 8 && characters[i]) {
        characters[i] = characters[i].toUpperCase();
      }
      if ((hash3[i >> 1] & 15) >= 8 && characters[i + 1]) {
        characters[i + 1] = characters[i + 1].toUpperCase();
      }
    }
    const result = `0x${characters.join("")}`;
    checksum.set(address, result);
    return result;
  }
  function from4(address, options = {}) {
    const { checksum: checksumVal = false } = options;
    assert4(address);
    if (checksumVal)
      return checksum2(address);
    return address;
  }
  function fromPublicKey(publicKey, options = {}) {
    const address = keccak2562(`0x${toHex2(publicKey).slice(4)}`).substring(26);
    return from4(`0x${address}`, options);
  }
  function validate3(address, options = {}) {
    const { strict = true } = options ?? {};
    try {
      assert4(address, { strict });
      return true;
    } catch {
      return false;
    }
  }
  var InvalidAddressError2 = class extends BaseError3 {
    constructor({ address, cause }) {
      super(`Address "${address}" is invalid.`, {
        cause
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Address.InvalidAddressError"
      });
    }
  };
  var InvalidInputError = class extends BaseError3 {
    constructor() {
      super("Address is not a 20 byte (40 hexadecimal character) value.");
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Address.InvalidInputError"
      });
    }
  };
  var InvalidChecksumError = class extends BaseError3 {
    constructor() {
      super("Address does not match its checksum counterpart.");
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Address.InvalidChecksumError"
      });
    }
  };

  // node_modules/ox/_esm/core/AbiParameters.js
  init_Bytes();
  init_Errors();
  init_Hex();

  // node_modules/ox/_esm/core/internal/abiParameters.js
  init_Bytes();
  init_Errors();
  init_Hex();

  // node_modules/ox/_esm/core/Solidity.js
  var arrayRegex2 = /^(.*)\[([0-9]*)\]$/;
  var bytesRegex3 = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
  var integerRegex3 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  var maxInt82 = 2n ** (8n - 1n) - 1n;
  var maxInt162 = 2n ** (16n - 1n) - 1n;
  var maxInt242 = 2n ** (24n - 1n) - 1n;
  var maxInt322 = 2n ** (32n - 1n) - 1n;
  var maxInt402 = 2n ** (40n - 1n) - 1n;
  var maxInt482 = 2n ** (48n - 1n) - 1n;
  var maxInt562 = 2n ** (56n - 1n) - 1n;
  var maxInt642 = 2n ** (64n - 1n) - 1n;
  var maxInt722 = 2n ** (72n - 1n) - 1n;
  var maxInt802 = 2n ** (80n - 1n) - 1n;
  var maxInt882 = 2n ** (88n - 1n) - 1n;
  var maxInt962 = 2n ** (96n - 1n) - 1n;
  var maxInt1042 = 2n ** (104n - 1n) - 1n;
  var maxInt1122 = 2n ** (112n - 1n) - 1n;
  var maxInt1202 = 2n ** (120n - 1n) - 1n;
  var maxInt1282 = 2n ** (128n - 1n) - 1n;
  var maxInt1362 = 2n ** (136n - 1n) - 1n;
  var maxInt1442 = 2n ** (144n - 1n) - 1n;
  var maxInt1522 = 2n ** (152n - 1n) - 1n;
  var maxInt1602 = 2n ** (160n - 1n) - 1n;
  var maxInt1682 = 2n ** (168n - 1n) - 1n;
  var maxInt1762 = 2n ** (176n - 1n) - 1n;
  var maxInt1842 = 2n ** (184n - 1n) - 1n;
  var maxInt1922 = 2n ** (192n - 1n) - 1n;
  var maxInt2002 = 2n ** (200n - 1n) - 1n;
  var maxInt2082 = 2n ** (208n - 1n) - 1n;
  var maxInt2162 = 2n ** (216n - 1n) - 1n;
  var maxInt2242 = 2n ** (224n - 1n) - 1n;
  var maxInt2322 = 2n ** (232n - 1n) - 1n;
  var maxInt2402 = 2n ** (240n - 1n) - 1n;
  var maxInt2482 = 2n ** (248n - 1n) - 1n;
  var maxInt2562 = 2n ** (256n - 1n) - 1n;
  var minInt82 = -(2n ** (8n - 1n));
  var minInt162 = -(2n ** (16n - 1n));
  var minInt242 = -(2n ** (24n - 1n));
  var minInt322 = -(2n ** (32n - 1n));
  var minInt402 = -(2n ** (40n - 1n));
  var minInt482 = -(2n ** (48n - 1n));
  var minInt562 = -(2n ** (56n - 1n));
  var minInt642 = -(2n ** (64n - 1n));
  var minInt722 = -(2n ** (72n - 1n));
  var minInt802 = -(2n ** (80n - 1n));
  var minInt882 = -(2n ** (88n - 1n));
  var minInt962 = -(2n ** (96n - 1n));
  var minInt1042 = -(2n ** (104n - 1n));
  var minInt1122 = -(2n ** (112n - 1n));
  var minInt1202 = -(2n ** (120n - 1n));
  var minInt1282 = -(2n ** (128n - 1n));
  var minInt1362 = -(2n ** (136n - 1n));
  var minInt1442 = -(2n ** (144n - 1n));
  var minInt1522 = -(2n ** (152n - 1n));
  var minInt1602 = -(2n ** (160n - 1n));
  var minInt1682 = -(2n ** (168n - 1n));
  var minInt1762 = -(2n ** (176n - 1n));
  var minInt1842 = -(2n ** (184n - 1n));
  var minInt1922 = -(2n ** (192n - 1n));
  var minInt2002 = -(2n ** (200n - 1n));
  var minInt2082 = -(2n ** (208n - 1n));
  var minInt2162 = -(2n ** (216n - 1n));
  var minInt2242 = -(2n ** (224n - 1n));
  var minInt2322 = -(2n ** (232n - 1n));
  var minInt2402 = -(2n ** (240n - 1n));
  var minInt2482 = -(2n ** (248n - 1n));
  var minInt2562 = -(2n ** (256n - 1n));
  var maxUint82 = 2n ** 8n - 1n;
  var maxUint162 = 2n ** 16n - 1n;
  var maxUint242 = 2n ** 24n - 1n;
  var maxUint322 = 2n ** 32n - 1n;
  var maxUint402 = 2n ** 40n - 1n;
  var maxUint482 = 2n ** 48n - 1n;
  var maxUint562 = 2n ** 56n - 1n;
  var maxUint642 = 2n ** 64n - 1n;
  var maxUint722 = 2n ** 72n - 1n;
  var maxUint802 = 2n ** 80n - 1n;
  var maxUint882 = 2n ** 88n - 1n;
  var maxUint962 = 2n ** 96n - 1n;
  var maxUint1042 = 2n ** 104n - 1n;
  var maxUint1122 = 2n ** 112n - 1n;
  var maxUint1202 = 2n ** 120n - 1n;
  var maxUint1282 = 2n ** 128n - 1n;
  var maxUint1362 = 2n ** 136n - 1n;
  var maxUint1442 = 2n ** 144n - 1n;
  var maxUint1522 = 2n ** 152n - 1n;
  var maxUint1602 = 2n ** 160n - 1n;
  var maxUint1682 = 2n ** 168n - 1n;
  var maxUint1762 = 2n ** 176n - 1n;
  var maxUint1842 = 2n ** 184n - 1n;
  var maxUint1922 = 2n ** 192n - 1n;
  var maxUint2002 = 2n ** 200n - 1n;
  var maxUint2082 = 2n ** 208n - 1n;
  var maxUint2162 = 2n ** 216n - 1n;
  var maxUint2242 = 2n ** 224n - 1n;
  var maxUint2322 = 2n ** 232n - 1n;
  var maxUint2402 = 2n ** 240n - 1n;
  var maxUint2482 = 2n ** 248n - 1n;
  var maxUint2562 = 2n ** 256n - 1n;

  // node_modules/ox/_esm/core/internal/abiParameters.js
  function decodeParameter2(cursor, param, options) {
    const { checksumAddress: checksumAddress2, staticPosition } = options;
    const arrayComponents = getArrayComponents2(param.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return decodeArray2(cursor, { ...param, type }, { checksumAddress: checksumAddress2, length, staticPosition });
    }
    if (param.type === "tuple")
      return decodeTuple2(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition
      });
    if (param.type === "address")
      return decodeAddress3(cursor, { checksum: checksumAddress2 });
    if (param.type === "bool")
      return decodeBool2(cursor);
    if (param.type.startsWith("bytes"))
      return decodeBytes2(cursor, param, { staticPosition });
    if (param.type.startsWith("uint") || param.type.startsWith("int"))
      return decodeNumber2(cursor, param);
    if (param.type === "string")
      return decodeString2(cursor, { staticPosition });
    throw new InvalidTypeError(param.type);
  }
  var sizeOfLength2 = 32;
  var sizeOfOffset2 = 32;
  function decodeAddress3(cursor, options = {}) {
    const { checksum: checksum3 = false } = options;
    const value = cursor.readBytes(32);
    const wrap3 = (address) => checksum3 ? checksum2(address) : address;
    return [wrap3(fromBytes2(slice2(value, -20))), 32];
  }
  function decodeArray2(cursor, param, options) {
    const { checksumAddress: checksumAddress2, length, staticPosition } = options;
    if (!length) {
      const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
      const start = staticPosition + offset;
      const startOfData = start + sizeOfLength2;
      cursor.setPosition(start);
      const length2 = toNumber2(cursor.readBytes(sizeOfLength2));
      const dynamicChild = hasDynamicChild2(param);
      let consumed2 = 0;
      const value2 = [];
      for (let i = 0; i < length2; ++i) {
        cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
        const [data, consumed_] = decodeParameter2(cursor, param, {
          checksumAddress: checksumAddress2,
          staticPosition: startOfData
        });
        consumed2 += consumed_;
        value2.push(data);
      }
      cursor.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    if (hasDynamicChild2(param)) {
      const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
      const start = staticPosition + offset;
      const value2 = [];
      for (let i = 0; i < length; ++i) {
        cursor.setPosition(start + i * 32);
        const [data] = decodeParameter2(cursor, param, {
          checksumAddress: checksumAddress2,
          staticPosition: start
        });
        value2.push(data);
      }
      cursor.setPosition(staticPosition + 32);
      return [value2, 32];
    }
    let consumed = 0;
    const value = [];
    for (let i = 0; i < length; ++i) {
      const [data, consumed_] = decodeParameter2(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition: staticPosition + consumed
      });
      consumed += consumed_;
      value.push(data);
    }
    return [value, consumed];
  }
  function decodeBool2(cursor) {
    return [toBoolean(cursor.readBytes(32), { size: 32 }), 32];
  }
  function decodeBytes2(cursor, param, { staticPosition }) {
    const [_, size5] = param.type.split("bytes");
    if (!size5) {
      const offset = toNumber2(cursor.readBytes(32));
      cursor.setPosition(staticPosition + offset);
      const length = toNumber2(cursor.readBytes(32));
      if (length === 0) {
        cursor.setPosition(staticPosition + 32);
        return ["0x", 32];
      }
      const data = cursor.readBytes(length);
      cursor.setPosition(staticPosition + 32);
      return [fromBytes2(data), 32];
    }
    const value = fromBytes2(cursor.readBytes(Number.parseInt(size5, 10), 32));
    return [value, 32];
  }
  function decodeNumber2(cursor, param) {
    const signed = param.type.startsWith("int");
    const size5 = Number.parseInt(param.type.split("int")[1] || "256", 10);
    const value = cursor.readBytes(32);
    return [
      size5 > 48 ? toBigInt2(value, { signed }) : toNumber2(value, { signed }),
      32
    ];
  }
  function decodeTuple2(cursor, param, options) {
    const { checksumAddress: checksumAddress2, staticPosition } = options;
    const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
    const value = hasUnnamedChild ? [] : {};
    let consumed = 0;
    if (hasDynamicChild2(param)) {
      const offset = toNumber2(cursor.readBytes(sizeOfOffset2));
      const start = staticPosition + offset;
      for (let i = 0; i < param.components.length; ++i) {
        const component = param.components[i];
        cursor.setPosition(start + consumed);
        const [data, consumed_] = decodeParameter2(cursor, component, {
          checksumAddress: checksumAddress2,
          staticPosition: start
        });
        consumed += consumed_;
        value[hasUnnamedChild ? i : component?.name] = data;
      }
      cursor.setPosition(staticPosition + 32);
      return [value, 32];
    }
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      const [data, consumed_] = decodeParameter2(cursor, component, {
        checksumAddress: checksumAddress2,
        staticPosition
      });
      value[hasUnnamedChild ? i : component?.name] = data;
      consumed += consumed_;
    }
    return [value, consumed];
  }
  function decodeString2(cursor, { staticPosition }) {
    const offset = toNumber2(cursor.readBytes(32));
    const start = staticPosition + offset;
    cursor.setPosition(start);
    const length = toNumber2(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["", 32];
    }
    const data = cursor.readBytes(length, 32);
    const value = toString(trimLeft(data));
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  function prepareParameters({ checksumAddress: checksumAddress2, parameters, values }) {
    const preparedParameters = [];
    for (let i = 0; i < parameters.length; i++) {
      preparedParameters.push(prepareParameter({
        checksumAddress: checksumAddress2,
        parameter: parameters[i],
        value: values[i]
      }));
    }
    return preparedParameters;
  }
  function prepareParameter({ checksumAddress: checksumAddress2 = false, parameter: parameter_, value }) {
    const parameter = parameter_;
    const arrayComponents = getArrayComponents2(parameter.type);
    if (arrayComponents) {
      const [length, type] = arrayComponents;
      return encodeArray2(value, {
        checksumAddress: checksumAddress2,
        length,
        parameter: {
          ...parameter,
          type
        }
      });
    }
    if (parameter.type === "tuple") {
      return encodeTuple2(value, {
        checksumAddress: checksumAddress2,
        parameter
      });
    }
    if (parameter.type === "address") {
      return encodeAddress2(value, {
        checksum: checksumAddress2
      });
    }
    if (parameter.type === "bool") {
      return encodeBoolean(value);
    }
    if (parameter.type.startsWith("uint") || parameter.type.startsWith("int")) {
      const signed = parameter.type.startsWith("int");
      const [, , size5 = "256"] = integerRegex3.exec(parameter.type) ?? [];
      return encodeNumber2(value, {
        signed,
        size: Number(size5)
      });
    }
    if (parameter.type.startsWith("bytes")) {
      return encodeBytes2(value, { type: parameter.type });
    }
    if (parameter.type === "string") {
      return encodeString2(value);
    }
    throw new InvalidTypeError(parameter.type);
  }
  function encode2(preparedParameters) {
    let staticSize = 0;
    for (let i = 0; i < preparedParameters.length; i++) {
      const { dynamic, encoded } = preparedParameters[i];
      if (dynamic)
        staticSize += 32;
      else
        staticSize += size3(encoded);
    }
    const staticParameters = [];
    const dynamicParameters = [];
    let dynamicSize = 0;
    for (let i = 0; i < preparedParameters.length; i++) {
      const { dynamic, encoded } = preparedParameters[i];
      if (dynamic) {
        staticParameters.push(fromNumber(staticSize + dynamicSize, { size: 32 }));
        dynamicParameters.push(encoded);
        dynamicSize += size3(encoded);
      } else {
        staticParameters.push(encoded);
      }
    }
    return concat2(...staticParameters, ...dynamicParameters);
  }
  function encodeAddress2(value, options) {
    const { checksum: checksum3 = false } = options;
    assert4(value, { strict: checksum3 });
    return {
      dynamic: false,
      encoded: padLeft(value.toLowerCase())
    };
  }
  function encodeArray2(value, options) {
    const { checksumAddress: checksumAddress2, length, parameter } = options;
    const dynamic = length === null;
    if (!Array.isArray(value))
      throw new InvalidArrayError2(value);
    if (!dynamic && value.length !== length)
      throw new ArrayLengthMismatchError({
        expectedLength: length,
        givenLength: value.length,
        type: `${parameter.type}[${length}]`
      });
    let dynamicChild = false;
    const preparedParameters = [];
    for (let i = 0; i < value.length; i++) {
      const preparedParam = prepareParameter({
        checksumAddress: checksumAddress2,
        parameter,
        value: value[i]
      });
      if (preparedParam.dynamic)
        dynamicChild = true;
      preparedParameters.push(preparedParam);
    }
    if (dynamic || dynamicChild) {
      const data = encode2(preparedParameters);
      if (dynamic) {
        const length2 = fromNumber(preparedParameters.length, { size: 32 });
        return {
          dynamic: true,
          encoded: preparedParameters.length > 0 ? concat2(length2, data) : length2
        };
      }
      if (dynamicChild)
        return { dynamic: true, encoded: data };
    }
    return {
      dynamic: false,
      encoded: concat2(...preparedParameters.map(({ encoded }) => encoded))
    };
  }
  function encodeBytes2(value, { type }) {
    const [, parametersize] = type.split("bytes");
    const bytesSize = size3(value);
    if (!parametersize) {
      let value_ = value;
      if (bytesSize % 32 !== 0)
        value_ = padRight(value_, Math.ceil((value.length - 2) / 2 / 32) * 32);
      return {
        dynamic: true,
        encoded: concat2(padLeft(fromNumber(bytesSize, { size: 32 })), value_)
      };
    }
    if (bytesSize !== Number.parseInt(parametersize, 10))
      throw new BytesSizeMismatchError2({
        expectedSize: Number.parseInt(parametersize, 10),
        value
      });
    return { dynamic: false, encoded: padRight(value) };
  }
  function encodeBoolean(value) {
    if (typeof value !== "boolean")
      throw new BaseError3(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
    return { dynamic: false, encoded: padLeft(fromBoolean(value)) };
  }
  function encodeNumber2(value, { signed, size: size5 }) {
    if (typeof size5 === "number") {
      const max = 2n ** (BigInt(size5) - (signed ? 1n : 0n)) - 1n;
      const min = signed ? -max - 1n : 0n;
      if (value > max || value < min)
        throw new IntegerOutOfRangeError2({
          max: max.toString(),
          min: min.toString(),
          signed,
          size: size5 / 8,
          value: value.toString()
        });
    }
    return {
      dynamic: false,
      encoded: fromNumber(value, {
        size: 32,
        signed
      })
    };
  }
  function encodeString2(value) {
    const hexValue = fromString2(value);
    const partsLength = Math.ceil(size3(hexValue) / 32);
    const parts = [];
    for (let i = 0; i < partsLength; i++) {
      parts.push(padRight(slice3(hexValue, i * 32, (i + 1) * 32)));
    }
    return {
      dynamic: true,
      encoded: concat2(padRight(fromNumber(size3(hexValue), { size: 32 })), ...parts)
    };
  }
  function encodeTuple2(value, options) {
    const { checksumAddress: checksumAddress2, parameter } = options;
    let dynamic = false;
    const preparedParameters = [];
    for (let i = 0; i < parameter.components.length; i++) {
      const param_ = parameter.components[i];
      const index2 = Array.isArray(value) ? i : param_.name;
      const preparedParam = prepareParameter({
        checksumAddress: checksumAddress2,
        parameter: param_,
        value: value[index2]
      });
      preparedParameters.push(preparedParam);
      if (preparedParam.dynamic)
        dynamic = true;
    }
    return {
      dynamic,
      encoded: dynamic ? encode2(preparedParameters) : concat2(...preparedParameters.map(({ encoded }) => encoded))
    };
  }
  function getArrayComponents2(type) {
    const matches = type.match(/^(.*)\[(\d+)?\]$/);
    return matches ? (
      // Return `null` if the array is dynamic.
      [matches[2] ? Number(matches[2]) : null, matches[1]]
    ) : void 0;
  }
  function hasDynamicChild2(param) {
    const { type } = param;
    if (type === "string")
      return true;
    if (type === "bytes")
      return true;
    if (type.endsWith("[]"))
      return true;
    if (type === "tuple")
      return param.components?.some(hasDynamicChild2);
    const arrayComponents = getArrayComponents2(param.type);
    if (arrayComponents && hasDynamicChild2({
      ...param,
      type: arrayComponents[1]
    }))
      return true;
    return false;
  }

  // node_modules/ox/_esm/core/internal/cursor.js
  init_Errors();
  var staticCursor2 = {
    bytes: new Uint8Array(),
    dataView: new DataView(new ArrayBuffer(0)),
    position: 0,
    positionReadCount: /* @__PURE__ */ new Map(),
    recursiveReadCount: 0,
    recursiveReadLimit: Number.POSITIVE_INFINITY,
    assertReadLimit() {
      if (this.recursiveReadCount >= this.recursiveReadLimit)
        throw new RecursiveReadLimitExceededError2({
          count: this.recursiveReadCount + 1,
          limit: this.recursiveReadLimit
        });
    },
    assertPosition(position) {
      if (position < 0 || position > this.bytes.length - 1)
        throw new PositionOutOfBoundsError2({
          length: this.bytes.length,
          position
        });
    },
    decrementPosition(offset) {
      if (offset < 0)
        throw new NegativeOffsetError2({ offset });
      const position = this.position - offset;
      this.assertPosition(position);
      this.position = position;
    },
    getReadCount(position) {
      return this.positionReadCount.get(position || this.position) || 0;
    },
    incrementPosition(offset) {
      if (offset < 0)
        throw new NegativeOffsetError2({ offset });
      const position = this.position + offset;
      this.assertPosition(position);
      this.position = position;
    },
    inspectByte(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position);
      return this.bytes[position];
    },
    inspectBytes(length, position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + length - 1);
      return this.bytes.subarray(position, position + length);
    },
    inspectUint8(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position);
      return this.bytes[position];
    },
    inspectUint16(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 1);
      return this.dataView.getUint16(position);
    },
    inspectUint24(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 2);
      return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
    },
    inspectUint32(position_) {
      const position = position_ ?? this.position;
      this.assertPosition(position + 3);
      return this.dataView.getUint32(position);
    },
    pushByte(byte) {
      this.assertPosition(this.position);
      this.bytes[this.position] = byte;
      this.position++;
    },
    pushBytes(bytes) {
      this.assertPosition(this.position + bytes.length - 1);
      this.bytes.set(bytes, this.position);
      this.position += bytes.length;
    },
    pushUint8(value) {
      this.assertPosition(this.position);
      this.bytes[this.position] = value;
      this.position++;
    },
    pushUint16(value) {
      this.assertPosition(this.position + 1);
      this.dataView.setUint16(this.position, value);
      this.position += 2;
    },
    pushUint24(value) {
      this.assertPosition(this.position + 2);
      this.dataView.setUint16(this.position, value >> 8);
      this.dataView.setUint8(this.position + 2, value & ~4294967040);
      this.position += 3;
    },
    pushUint32(value) {
      this.assertPosition(this.position + 3);
      this.dataView.setUint32(this.position, value);
      this.position += 4;
    },
    readByte() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectByte();
      this.position++;
      return value;
    },
    readBytes(length, size5) {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectBytes(length);
      this.position += size5 ?? length;
      return value;
    },
    readUint8() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint8();
      this.position += 1;
      return value;
    },
    readUint16() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint16();
      this.position += 2;
      return value;
    },
    readUint24() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint24();
      this.position += 3;
      return value;
    },
    readUint32() {
      this.assertReadLimit();
      this._touch();
      const value = this.inspectUint32();
      this.position += 4;
      return value;
    },
    get remaining() {
      return this.bytes.length - this.position;
    },
    setPosition(position) {
      const oldPosition = this.position;
      this.assertPosition(position);
      this.position = position;
      return () => this.position = oldPosition;
    },
    _touch() {
      if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
        return;
      const count = this.getReadCount();
      this.positionReadCount.set(this.position, count + 1);
      if (count > 0)
        this.recursiveReadCount++;
    }
  };
  function create(bytes, { recursiveReadLimit = 8192 } = {}) {
    const cursor = Object.create(staticCursor2);
    cursor.bytes = bytes;
    cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    cursor.positionReadCount = /* @__PURE__ */ new Map();
    cursor.recursiveReadLimit = recursiveReadLimit;
    return cursor;
  }
  var NegativeOffsetError2 = class extends BaseError3 {
    constructor({ offset }) {
      super(`Offset \`${offset}\` cannot be negative.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Cursor.NegativeOffsetError"
      });
    }
  };
  var PositionOutOfBoundsError2 = class extends BaseError3 {
    constructor({ length, position }) {
      super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Cursor.PositionOutOfBoundsError"
      });
    }
  };
  var RecursiveReadLimitExceededError2 = class extends BaseError3 {
    constructor({ count, limit }) {
      super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Cursor.RecursiveReadLimitExceededError"
      });
    }
  };

  // node_modules/ox/_esm/core/AbiParameters.js
  function decode(parameters, data, options = {}) {
    const { as = "Array", checksumAddress: checksumAddress2 = false } = options;
    const bytes = typeof data === "string" ? fromHex2(data) : data;
    const cursor = create(bytes);
    if (size2(bytes) === 0 && parameters.length > 0)
      throw new ZeroDataError();
    if (size2(bytes) && size2(bytes) < 32)
      throw new DataSizeTooSmallError({
        data: typeof data === "string" ? data : fromBytes2(data),
        parameters,
        size: size2(bytes)
      });
    let consumed = 0;
    const values = as === "Array" ? [] : {};
    for (let i = 0; i < parameters.length; ++i) {
      const param = parameters[i];
      cursor.setPosition(consumed);
      const [data2, consumed_] = decodeParameter2(cursor, param, {
        checksumAddress: checksumAddress2,
        staticPosition: 0
      });
      consumed += consumed_;
      if (as === "Array")
        values.push(data2);
      else
        values[param.name ?? i] = data2;
    }
    return values;
  }
  function encode3(parameters, values, options) {
    const { checksumAddress: checksumAddress2 = false } = options ?? {};
    if (parameters.length !== values.length)
      throw new LengthMismatchError({
        expectedLength: parameters.length,
        givenLength: values.length
      });
    const preparedParameters = prepareParameters({
      checksumAddress: checksumAddress2,
      parameters,
      values
    });
    const data = encode2(preparedParameters);
    if (data.length === 0)
      return "0x";
    return data;
  }
  function encodePacked2(types, values) {
    if (types.length !== values.length)
      throw new LengthMismatchError({
        expectedLength: types.length,
        givenLength: values.length
      });
    const data = [];
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      const value = values[i];
      data.push(encodePacked2.encode(type, value));
    }
    return concat2(...data);
  }
  (function(encodePacked3) {
    function encode5(type, value, isArray = false) {
      if (type === "address") {
        const address = value;
        assert4(address);
        return padLeft(address.toLowerCase(), isArray ? 32 : 0);
      }
      if (type === "string")
        return fromString2(value);
      if (type === "bytes")
        return value;
      if (type === "bool")
        return padLeft(fromBoolean(value), isArray ? 32 : 1);
      const intMatch = type.match(integerRegex3);
      if (intMatch) {
        const [_type, baseType, bits = "256"] = intMatch;
        const size5 = Number.parseInt(bits, 10) / 8;
        return fromNumber(value, {
          size: isArray ? 32 : size5,
          signed: baseType === "int"
        });
      }
      const bytesMatch = type.match(bytesRegex3);
      if (bytesMatch) {
        const [_type, size5] = bytesMatch;
        if (Number.parseInt(size5, 10) !== (value.length - 2) / 2)
          throw new BytesSizeMismatchError2({
            expectedSize: Number.parseInt(size5, 10),
            value
          });
        return padRight(value, isArray ? 32 : 0);
      }
      const arrayMatch = type.match(arrayRegex2);
      if (arrayMatch && Array.isArray(value)) {
        const [_type, childType] = arrayMatch;
        const data = [];
        for (let i = 0; i < value.length; i++) {
          data.push(encode5(childType, value[i], true));
        }
        if (data.length === 0)
          return "0x";
        return concat2(...data);
      }
      throw new InvalidTypeError(type);
    }
    encodePacked3.encode = encode5;
  })(encodePacked2 || (encodePacked2 = {}));
  function from5(parameters) {
    if (Array.isArray(parameters) && typeof parameters[0] === "string")
      return parseAbiParameters(parameters);
    if (typeof parameters === "string")
      return parseAbiParameters(parameters);
    return parameters;
  }
  var DataSizeTooSmallError = class extends BaseError3 {
    constructor({ data, parameters, size: size5 }) {
      super(`Data size of ${size5} bytes is too small for given parameters.`, {
        metaMessages: [
          `Params: (${formatAbiParameters(parameters)})`,
          `Data:   ${data} (${size5} bytes)`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.DataSizeTooSmallError"
      });
    }
  };
  var ZeroDataError = class extends BaseError3 {
    constructor() {
      super('Cannot decode zero data ("0x") with ABI parameters.');
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.ZeroDataError"
      });
    }
  };
  var ArrayLengthMismatchError = class extends BaseError3 {
    constructor({ expectedLength, givenLength, type }) {
      super(`Array length mismatch for type \`${type}\`. Expected: \`${expectedLength}\`. Given: \`${givenLength}\`.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.ArrayLengthMismatchError"
      });
    }
  };
  var BytesSizeMismatchError2 = class extends BaseError3 {
    constructor({ expectedSize, value }) {
      super(`Size of bytes "${value}" (bytes${size3(value)}) does not match expected size (bytes${expectedSize}).`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.BytesSizeMismatchError"
      });
    }
  };
  var LengthMismatchError = class extends BaseError3 {
    constructor({ expectedLength, givenLength }) {
      super([
        "ABI encoding parameters/values length mismatch.",
        `Expected length (parameters): ${expectedLength}`,
        `Given length (values): ${givenLength}`
      ].join("\n"));
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.LengthMismatchError"
      });
    }
  };
  var InvalidArrayError2 = class extends BaseError3 {
    constructor(value) {
      super(`Value \`${value}\` is not a valid array.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.InvalidArrayError"
      });
    }
  };
  var InvalidTypeError = class extends BaseError3 {
    constructor(type) {
      super(`Type \`${type}\` is not a valid ABI Type.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiParameters.InvalidTypeError"
      });
    }
  };

  // node_modules/ox/_esm/core/Authorization.js
  init_Hex();

  // node_modules/ox/_esm/core/Rlp.js
  init_Bytes();
  init_Errors();
  init_Hex();
  function from6(value, options) {
    const { as } = options;
    const encodable = getEncodable2(value);
    const cursor = create(new Uint8Array(encodable.length));
    encodable.encode(cursor);
    if (as === "Hex")
      return fromBytes2(cursor.bytes);
    return cursor.bytes;
  }
  function fromHex4(hex, options = {}) {
    const { as = "Hex" } = options;
    return from6(hex, { as });
  }
  function getEncodable2(bytes) {
    if (Array.isArray(bytes))
      return getEncodableList2(bytes.map((x) => getEncodable2(x)));
    return getEncodableBytes2(bytes);
  }
  function getEncodableList2(list) {
    const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
    const sizeOfBodyLength = getSizeOfLength2(bodyLength);
    const length = (() => {
      if (bodyLength <= 55)
        return 1 + bodyLength;
      return 1 + sizeOfBodyLength + bodyLength;
    })();
    return {
      length,
      encode(cursor) {
        if (bodyLength <= 55) {
          cursor.pushByte(192 + bodyLength);
        } else {
          cursor.pushByte(192 + 55 + sizeOfBodyLength);
          if (sizeOfBodyLength === 1)
            cursor.pushUint8(bodyLength);
          else if (sizeOfBodyLength === 2)
            cursor.pushUint16(bodyLength);
          else if (sizeOfBodyLength === 3)
            cursor.pushUint24(bodyLength);
          else
            cursor.pushUint32(bodyLength);
        }
        for (const { encode: encode5 } of list) {
          encode5(cursor);
        }
      }
    };
  }
  function getEncodableBytes2(bytesOrHex) {
    const bytes = typeof bytesOrHex === "string" ? fromHex2(bytesOrHex) : bytesOrHex;
    const sizeOfBytesLength = getSizeOfLength2(bytes.length);
    const length = (() => {
      if (bytes.length === 1 && bytes[0] < 128)
        return 1;
      if (bytes.length <= 55)
        return 1 + bytes.length;
      return 1 + sizeOfBytesLength + bytes.length;
    })();
    return {
      length,
      encode(cursor) {
        if (bytes.length === 1 && bytes[0] < 128) {
          cursor.pushBytes(bytes);
        } else if (bytes.length <= 55) {
          cursor.pushByte(128 + bytes.length);
          cursor.pushBytes(bytes);
        } else {
          cursor.pushByte(128 + 55 + sizeOfBytesLength);
          if (sizeOfBytesLength === 1)
            cursor.pushUint8(bytes.length);
          else if (sizeOfBytesLength === 2)
            cursor.pushUint16(bytes.length);
          else if (sizeOfBytesLength === 3)
            cursor.pushUint24(bytes.length);
          else
            cursor.pushUint32(bytes.length);
          cursor.pushBytes(bytes);
        }
      }
    };
  }
  function getSizeOfLength2(length) {
    if (length <= 255)
      return 1;
    if (length <= 65535)
      return 2;
    if (length <= 16777215)
      return 3;
    if (length <= 4294967295)
      return 4;
    throw new BaseError3("Length is too large.");
  }

  // node_modules/ox/_esm/core/Signature.js
  init_Errors();
  init_Hex();
  init_Json();
  function assert5(signature, options = {}) {
    const { recovered } = options;
    if (typeof signature.r === "undefined")
      throw new MissingPropertiesError({ signature });
    if (typeof signature.s === "undefined")
      throw new MissingPropertiesError({ signature });
    if (recovered && typeof signature.yParity === "undefined")
      throw new MissingPropertiesError({ signature });
    if (signature.r < 0n || signature.r > maxUint2562)
      throw new InvalidRError({ value: signature.r });
    if (signature.s < 0n || signature.s > maxUint2562)
      throw new InvalidSError({ value: signature.s });
    if (typeof signature.yParity === "number" && signature.yParity !== 0 && signature.yParity !== 1)
      throw new InvalidYParityError2({ value: signature.yParity });
  }
  function fromBytes4(signature) {
    return fromHex5(fromBytes2(signature));
  }
  function fromHex5(signature) {
    if (signature.length !== 130 && signature.length !== 132)
      throw new InvalidSerializedSizeError2({ signature });
    const r = BigInt(slice3(signature, 0, 32));
    const s = BigInt(slice3(signature, 32, 64));
    const yParity = (() => {
      const yParity2 = Number(`0x${signature.slice(130)}`);
      if (Number.isNaN(yParity2))
        return void 0;
      try {
        return vToYParity(yParity2);
      } catch {
        throw new InvalidYParityError2({ value: yParity2 });
      }
    })();
    if (typeof yParity === "undefined")
      return {
        r,
        s
      };
    return {
      r,
      s,
      yParity
    };
  }
  function extract2(value) {
    if (typeof value.r === "undefined")
      return void 0;
    if (typeof value.s === "undefined")
      return void 0;
    return from7(value);
  }
  function from7(signature) {
    const signature_ = (() => {
      if (typeof signature === "string")
        return fromHex5(signature);
      if (signature instanceof Uint8Array)
        return fromBytes4(signature);
      if (typeof signature.r === "string")
        return fromRpc2(signature);
      if (signature.v)
        return fromLegacy(signature);
      return {
        r: signature.r,
        s: signature.s,
        ...typeof signature.yParity !== "undefined" ? { yParity: signature.yParity } : {}
      };
    })();
    assert5(signature_);
    return signature_;
  }
  function fromLegacy(signature) {
    return {
      r: signature.r,
      s: signature.s,
      yParity: vToYParity(signature.v)
    };
  }
  function fromRpc2(signature) {
    const yParity = (() => {
      const v = signature.v ? Number(signature.v) : void 0;
      let yParity2 = signature.yParity ? Number(signature.yParity) : void 0;
      if (typeof v === "number" && typeof yParity2 !== "number")
        yParity2 = vToYParity(v);
      if (typeof yParity2 !== "number")
        throw new InvalidYParityError2({ value: signature.yParity });
      return yParity2;
    })();
    return {
      r: BigInt(signature.r),
      s: BigInt(signature.s),
      yParity
    };
  }
  function toTuple(signature) {
    const { r, s, yParity } = signature;
    return [
      yParity ? "0x01" : "0x",
      r === 0n ? "0x" : trimLeft2(fromNumber(r)),
      s === 0n ? "0x" : trimLeft2(fromNumber(s))
    ];
  }
  function vToYParity(v) {
    if (v === 0 || v === 27)
      return 0;
    if (v === 1 || v === 28)
      return 1;
    if (v >= 35)
      return v % 2 === 0 ? 1 : 0;
    throw new InvalidVError({ value: v });
  }
  var InvalidSerializedSizeError2 = class extends BaseError3 {
    constructor({ signature }) {
      super(`Value \`${signature}\` is an invalid signature size.`, {
        metaMessages: [
          "Expected: 64 bytes or 65 bytes.",
          `Received ${size3(from2(signature))} bytes.`
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidSerializedSizeError"
      });
    }
  };
  var MissingPropertiesError = class extends BaseError3 {
    constructor({ signature }) {
      super(`Signature \`${stringify2(signature)}\` is missing either an \`r\`, \`s\`, or \`yParity\` property.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.MissingPropertiesError"
      });
    }
  };
  var InvalidRError = class extends BaseError3 {
    constructor({ value }) {
      super(`Value \`${value}\` is an invalid r value. r must be a positive integer less than 2^256.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidRError"
      });
    }
  };
  var InvalidSError = class extends BaseError3 {
    constructor({ value }) {
      super(`Value \`${value}\` is an invalid s value. s must be a positive integer less than 2^256.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidSError"
      });
    }
  };
  var InvalidYParityError2 = class extends BaseError3 {
    constructor({ value }) {
      super(`Value \`${value}\` is an invalid y-parity value. Y-parity must be 0 or 1.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidYParityError"
      });
    }
  };
  var InvalidVError = class extends BaseError3 {
    constructor({ value }) {
      super(`Value \`${value}\` is an invalid v value. v must be 27, 28 or >=35.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "Signature.InvalidVError"
      });
    }
  };

  // node_modules/ox/_esm/core/Authorization.js
  function from8(authorization, options = {}) {
    if (typeof authorization.chainId === "string")
      return fromRpc3(authorization);
    return { ...authorization, ...options.signature };
  }
  function fromRpc3(authorization) {
    const { address, chainId, nonce } = authorization;
    const signature = extract2(authorization);
    return {
      address,
      chainId: Number(chainId),
      nonce: BigInt(nonce),
      ...signature
    };
  }
  function getSignPayload(authorization) {
    return hash2(authorization, { presign: true });
  }
  function hash2(authorization, options = {}) {
    const { presign } = options;
    return keccak2562(concat2("0x05", fromHex4(toTuple2(presign ? {
      address: authorization.address,
      chainId: authorization.chainId,
      nonce: authorization.nonce
    } : authorization))));
  }
  function toTuple2(authorization) {
    const { address, chainId, nonce } = authorization;
    const signature = extract2(authorization);
    return [
      chainId ? fromNumber(chainId) : "0x",
      address,
      nonce ? fromNumber(nonce) : "0x",
      ...signature ? toTuple(signature) : []
    ];
  }

  // node_modules/ox/_esm/erc8010/SignatureErc8010.js
  init_Errors();
  init_Hex();

  // node_modules/ox/_esm/core/Secp256k1.js
  init_secp256k1();
  init_Hex();
  function recoverAddress2(options) {
    return fromPublicKey(recoverPublicKey2(options));
  }
  function recoverPublicKey2(options) {
    const { payload, signature } = options;
    const { r, s, yParity } = signature;
    const signature_ = new secp256k1.Signature(BigInt(r), BigInt(s)).addRecoveryBit(yParity);
    const point = signature_.recoverPublicKey(from2(payload).substring(2));
    return from3(point);
  }

  // node_modules/ox/_esm/erc8010/SignatureErc8010.js
  var magicBytes = "0x8010801080108010801080108010801080108010801080108010801080108010";
  var suffixParameters = from5("(uint256 chainId, address delegation, uint256 nonce, uint8 yParity, uint256 r, uint256 s), address to, bytes data");
  function assert6(value) {
    if (typeof value === "string") {
      if (slice3(value, -32) !== magicBytes)
        throw new InvalidWrappedSignatureError(value);
    } else
      assert5(value.authorization);
  }
  function from9(value) {
    if (typeof value === "string")
      return unwrap(value);
    return value;
  }
  function unwrap(wrapped) {
    assert6(wrapped);
    const suffixLength = toNumber(slice3(wrapped, -64, -32));
    const suffix = slice3(wrapped, -suffixLength - 64, -64);
    const signature = slice3(wrapped, 0, -suffixLength - 64);
    const [auth, to, data] = decode(suffixParameters, suffix);
    const authorization = from8({
      address: auth.delegation,
      chainId: Number(auth.chainId),
      nonce: auth.nonce,
      yParity: auth.yParity,
      r: auth.r,
      s: auth.s
    });
    return {
      authorization,
      signature,
      ...data && data !== "0x" ? { data, to } : {}
    };
  }
  function wrap(value) {
    const { data, signature } = value;
    assert6(value);
    const self2 = recoverAddress2({
      payload: getSignPayload(value.authorization),
      signature: from7(value.authorization)
    });
    const suffix = encode3(suffixParameters, [
      {
        ...value.authorization,
        delegation: value.authorization.address,
        chainId: BigInt(value.authorization.chainId)
      },
      value.to ?? self2,
      data ?? "0x"
    ]);
    const suffixLength = fromNumber(size3(suffix), { size: 32 });
    return concat2(signature, suffix, suffixLength, magicBytes);
  }
  function validate4(value) {
    try {
      assert6(value);
      return true;
    } catch {
      return false;
    }
  }
  var InvalidWrappedSignatureError = class extends BaseError3 {
    constructor(wrapped) {
      super(`Value \`${wrapped}\` is an invalid ERC-8010 wrapped signature.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "SignatureErc8010.InvalidWrappedSignatureError"
      });
    }
  };

  // node_modules/viem/utils/signature/isErc8010Signature.ts
  function isErc8010Signature(signature) {
    return SignatureErc8010_exports.validate(signature);
  }

  // node_modules/viem/utils/signature/parseErc6492Signature.ts
  init_decodeAbiParameters();
  function parseErc6492Signature(signature) {
    if (!isErc6492Signature(signature)) return { signature };
    const [address, data, signature_] = decodeAbiParameters(
      [{ type: "address" }, { type: "bytes" }, { type: "bytes" }],
      signature
    );
    return { address, data, signature: signature_ };
  }

  // node_modules/viem/utils/signature/parseErc8010Signature.ts
  init_toHex();
  function parseErc8010Signature(signature) {
    if (!isErc8010Signature(signature)) return { signature };
    const {
      authorization: authorization_ox,
      to,
      ...rest
    } = SignatureErc8010_exports.unwrap(signature);
    return {
      authorization: {
        address: authorization_ox.address,
        chainId: authorization_ox.chainId,
        nonce: Number(authorization_ox.nonce),
        r: numberToHex(authorization_ox.r, { size: 32 }),
        s: numberToHex(authorization_ox.s, { size: 32 }),
        yParity: authorization_ox.yParity
      },
      ...to ? { address: to } : {},
      ...rest
    };
  }

  // node_modules/viem/utils/signature/recoverMessageAddress.ts
  async function recoverMessageAddress({
    message,
    signature
  }) {
    return recoverAddress({ hash: hashMessage(message), signature });
  }

  // node_modules/viem/utils/signature/recoverTypedDataAddress.ts
  async function recoverTypedDataAddress(parameters) {
    const { domain, message, primaryType, signature, types } = parameters;
    return recoverAddress({
      hash: hashTypedData({
        domain,
        message,
        primaryType,
        types
      }),
      signature
    });
  }

  // node_modules/viem/utils/signature/serializeErc6492Signature.ts
  init_encodeAbiParameters();
  init_concat();
  init_toBytes();
  function serializeErc6492Signature(parameters) {
    const { address, data, signature, to = "hex" } = parameters;
    const signature_ = concatHex([
      encodeAbiParameters(
        [{ type: "address" }, { type: "bytes" }, { type: "bytes" }],
        [address, data, signature]
      ),
      erc6492MagicBytes
    ]);
    if (to === "hex") return signature_;
    return hexToBytes(signature_);
  }

  // node_modules/viem/utils/signature/serializeErc8010Signature.ts
  init_toBytes();
  function serializeErc8010Signature(parameters) {
    const { address, data, signature, to = "hex" } = parameters;
    const signature_ = SignatureErc8010_exports.wrap({
      authorization: {
        address: parameters.authorization.address,
        chainId: parameters.authorization.chainId,
        nonce: BigInt(parameters.authorization.nonce),
        r: BigInt(parameters.authorization.r),
        s: BigInt(parameters.authorization.s),
        yParity: parameters.authorization.yParity
      },
      data,
      signature,
      to: address
    });
    if (to === "hex") return signature_;
    return hexToBytes(signature_);
  }

  // node_modules/viem/utils/signature/verifyHash.ts
  init_getAddress();
  init_isAddressEqual();
  async function verifyHash({
    address,
    hash: hash3,
    signature
  }) {
    return isAddressEqual(
      getAddress(address),
      await recoverAddress({ hash: hash3, signature })
    );
  }

  // node_modules/viem/utils/signature/verifyMessage.ts
  init_getAddress();
  init_isAddressEqual();
  async function verifyMessage({
    address,
    message,
    signature
  }) {
    return isAddressEqual(
      getAddress(address),
      await recoverMessageAddress({ message, signature })
    );
  }

  // node_modules/viem/utils/signature/verifyTypedData.ts
  init_getAddress();
  init_isAddressEqual();
  async function verifyTypedData(parameters) {
    const { address, domain, message, primaryType, signature, types } = parameters;
    return isAddressEqual(
      getAddress(address),
      await recoverTypedDataAddress({
        domain,
        message,
        primaryType,
        signature,
        types
      })
    );
  }

  // node_modules/viem/utils/index.ts
  init_stringify();
  init_assertRequest();

  // node_modules/viem/utils/transaction/getSerializedTransactionType.ts
  init_transaction();
  init_slice();
  init_fromHex();
  function getSerializedTransactionType(serializedTransaction) {
    const serializedType = sliceHex(serializedTransaction, 0, 1);
    if (serializedType === "0x04")
      return "eip7702";
    if (serializedType === "0x03")
      return "eip4844";
    if (serializedType === "0x02")
      return "eip1559";
    if (serializedType === "0x01")
      return "eip2930";
    if (serializedType !== "0x" && hexToNumber(serializedType) >= 192)
      return "legacy";
    throw new InvalidSerializedTransactionTypeError({ serializedType });
  }

  // node_modules/viem/utils/transaction/parseTransaction.ts
  init_address();
  init_transaction();
  init_isAddress();
  init_isHex();
  init_pad();
  init_trim();
  init_fromHex();
  function parseTransaction(serializedTransaction) {
    const type = getSerializedTransactionType(serializedTransaction);
    if (type === "eip1559")
      return parseTransactionEIP1559(
        serializedTransaction
      );
    if (type === "eip2930")
      return parseTransactionEIP2930(
        serializedTransaction
      );
    if (type === "eip4844")
      return parseTransactionEIP4844(
        serializedTransaction
      );
    if (type === "eip7702")
      return parseTransactionEIP7702(
        serializedTransaction
      );
    return parseTransactionLegacy(
      serializedTransaction
    );
  }
  function parseTransactionEIP7702(serializedTransaction) {
    const transactionArray = toTransactionArray(serializedTransaction);
    const [
      chainId,
      nonce,
      maxPriorityFeePerGas,
      maxFeePerGas,
      gas,
      to,
      value,
      data,
      accessList,
      authorizationList,
      v,
      r,
      s
    ] = transactionArray;
    if (transactionArray.length !== 10 && transactionArray.length !== 13)
      throw new InvalidSerializedTransactionError({
        attributes: {
          chainId,
          nonce,
          maxPriorityFeePerGas,
          maxFeePerGas,
          gas,
          to,
          value,
          data,
          accessList,
          authorizationList,
          ...transactionArray.length > 9 ? {
            v,
            r,
            s
          } : {}
        },
        serializedTransaction,
        type: "eip7702"
      });
    const transaction = {
      chainId: hexToNumber(chainId),
      type: "eip7702"
    };
    if (isHex(to) && to !== "0x") transaction.to = to;
    if (isHex(gas) && gas !== "0x") transaction.gas = hexToBigInt(gas);
    if (isHex(data) && data !== "0x") transaction.data = data;
    if (isHex(nonce)) transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
    if (isHex(value) && value !== "0x") transaction.value = hexToBigInt(value);
    if (isHex(maxFeePerGas) && maxFeePerGas !== "0x")
      transaction.maxFeePerGas = hexToBigInt(maxFeePerGas);
    if (isHex(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
      transaction.maxPriorityFeePerGas = hexToBigInt(maxPriorityFeePerGas);
    if (accessList.length !== 0 && accessList !== "0x")
      transaction.accessList = parseAccessList(accessList);
    if (authorizationList.length !== 0 && authorizationList !== "0x")
      transaction.authorizationList = parseAuthorizationList(
        authorizationList
      );
    assertTransactionEIP7702(transaction);
    const signature = transactionArray.length === 13 ? parseEIP155Signature(transactionArray) : void 0;
    return { ...signature, ...transaction };
  }
  function parseTransactionEIP4844(serializedTransaction) {
    const transactionOrWrapperArray = toTransactionArray(serializedTransaction);
    const hasNetworkWrapper = transactionOrWrapperArray.length === 4;
    const transactionArray = hasNetworkWrapper ? transactionOrWrapperArray[0] : transactionOrWrapperArray;
    const wrapperArray = hasNetworkWrapper ? transactionOrWrapperArray.slice(1) : [];
    const [
      chainId,
      nonce,
      maxPriorityFeePerGas,
      maxFeePerGas,
      gas,
      to,
      value,
      data,
      accessList,
      maxFeePerBlobGas,
      blobVersionedHashes,
      v,
      r,
      s
    ] = transactionArray;
    const [blobs, commitments, proofs] = wrapperArray;
    if (!(transactionArray.length === 11 || transactionArray.length === 14))
      throw new InvalidSerializedTransactionError({
        attributes: {
          chainId,
          nonce,
          maxPriorityFeePerGas,
          maxFeePerGas,
          gas,
          to,
          value,
          data,
          accessList,
          ...transactionArray.length > 9 ? {
            v,
            r,
            s
          } : {}
        },
        serializedTransaction,
        type: "eip4844"
      });
    const transaction = {
      blobVersionedHashes,
      chainId: hexToNumber(chainId),
      to,
      type: "eip4844"
    };
    if (isHex(gas) && gas !== "0x") transaction.gas = hexToBigInt(gas);
    if (isHex(data) && data !== "0x") transaction.data = data;
    if (isHex(nonce)) transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
    if (isHex(value) && value !== "0x") transaction.value = hexToBigInt(value);
    if (isHex(maxFeePerBlobGas) && maxFeePerBlobGas !== "0x")
      transaction.maxFeePerBlobGas = hexToBigInt(maxFeePerBlobGas);
    if (isHex(maxFeePerGas) && maxFeePerGas !== "0x")
      transaction.maxFeePerGas = hexToBigInt(maxFeePerGas);
    if (isHex(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
      transaction.maxPriorityFeePerGas = hexToBigInt(maxPriorityFeePerGas);
    if (accessList.length !== 0 && accessList !== "0x")
      transaction.accessList = parseAccessList(accessList);
    if (blobs && commitments && proofs)
      transaction.sidecars = toBlobSidecars({
        blobs,
        commitments,
        proofs
      });
    assertTransactionEIP4844(transaction);
    const signature = transactionArray.length === 14 ? parseEIP155Signature(transactionArray) : void 0;
    return { ...signature, ...transaction };
  }
  function parseTransactionEIP1559(serializedTransaction) {
    const transactionArray = toTransactionArray(serializedTransaction);
    const [
      chainId,
      nonce,
      maxPriorityFeePerGas,
      maxFeePerGas,
      gas,
      to,
      value,
      data,
      accessList,
      v,
      r,
      s
    ] = transactionArray;
    if (!(transactionArray.length === 9 || transactionArray.length === 12))
      throw new InvalidSerializedTransactionError({
        attributes: {
          chainId,
          nonce,
          maxPriorityFeePerGas,
          maxFeePerGas,
          gas,
          to,
          value,
          data,
          accessList,
          ...transactionArray.length > 9 ? {
            v,
            r,
            s
          } : {}
        },
        serializedTransaction,
        type: "eip1559"
      });
    const transaction = {
      chainId: hexToNumber(chainId),
      type: "eip1559"
    };
    if (isHex(to) && to !== "0x") transaction.to = to;
    if (isHex(gas) && gas !== "0x") transaction.gas = hexToBigInt(gas);
    if (isHex(data) && data !== "0x") transaction.data = data;
    if (isHex(nonce)) transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
    if (isHex(value) && value !== "0x") transaction.value = hexToBigInt(value);
    if (isHex(maxFeePerGas) && maxFeePerGas !== "0x")
      transaction.maxFeePerGas = hexToBigInt(maxFeePerGas);
    if (isHex(maxPriorityFeePerGas) && maxPriorityFeePerGas !== "0x")
      transaction.maxPriorityFeePerGas = hexToBigInt(maxPriorityFeePerGas);
    if (accessList.length !== 0 && accessList !== "0x")
      transaction.accessList = parseAccessList(accessList);
    assertTransactionEIP1559(transaction);
    const signature = transactionArray.length === 12 ? parseEIP155Signature(transactionArray) : void 0;
    return { ...signature, ...transaction };
  }
  function parseTransactionEIP2930(serializedTransaction) {
    const transactionArray = toTransactionArray(serializedTransaction);
    const [chainId, nonce, gasPrice, gas, to, value, data, accessList, v, r, s] = transactionArray;
    if (!(transactionArray.length === 8 || transactionArray.length === 11))
      throw new InvalidSerializedTransactionError({
        attributes: {
          chainId,
          nonce,
          gasPrice,
          gas,
          to,
          value,
          data,
          accessList,
          ...transactionArray.length > 8 ? {
            v,
            r,
            s
          } : {}
        },
        serializedTransaction,
        type: "eip2930"
      });
    const transaction = {
      chainId: hexToNumber(chainId),
      type: "eip2930"
    };
    if (isHex(to) && to !== "0x") transaction.to = to;
    if (isHex(gas) && gas !== "0x") transaction.gas = hexToBigInt(gas);
    if (isHex(data) && data !== "0x") transaction.data = data;
    if (isHex(nonce)) transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
    if (isHex(value) && value !== "0x") transaction.value = hexToBigInt(value);
    if (isHex(gasPrice) && gasPrice !== "0x")
      transaction.gasPrice = hexToBigInt(gasPrice);
    if (accessList.length !== 0 && accessList !== "0x")
      transaction.accessList = parseAccessList(accessList);
    assertTransactionEIP2930(transaction);
    const signature = transactionArray.length === 11 ? parseEIP155Signature(transactionArray) : void 0;
    return { ...signature, ...transaction };
  }
  function parseTransactionLegacy(serializedTransaction) {
    const transactionArray = fromRlp(serializedTransaction, "hex");
    const [nonce, gasPrice, gas, to, value, data, chainIdOrV_, r, s] = transactionArray;
    if (!(transactionArray.length === 6 || transactionArray.length === 9))
      throw new InvalidSerializedTransactionError({
        attributes: {
          nonce,
          gasPrice,
          gas,
          to,
          value,
          data,
          ...transactionArray.length > 6 ? {
            v: chainIdOrV_,
            r,
            s
          } : {}
        },
        serializedTransaction,
        type: "legacy"
      });
    const transaction = {
      type: "legacy"
    };
    if (isHex(to) && to !== "0x") transaction.to = to;
    if (isHex(gas) && gas !== "0x") transaction.gas = hexToBigInt(gas);
    if (isHex(data) && data !== "0x") transaction.data = data;
    if (isHex(nonce)) transaction.nonce = nonce === "0x" ? 0 : hexToNumber(nonce);
    if (isHex(value) && value !== "0x") transaction.value = hexToBigInt(value);
    if (isHex(gasPrice) && gasPrice !== "0x")
      transaction.gasPrice = hexToBigInt(gasPrice);
    assertTransactionLegacy(transaction);
    if (transactionArray.length === 6) return transaction;
    const chainIdOrV = isHex(chainIdOrV_) && chainIdOrV_ !== "0x" ? hexToBigInt(chainIdOrV_) : 0n;
    if (s === "0x" && r === "0x") {
      if (chainIdOrV > 0) transaction.chainId = Number(chainIdOrV);
      return transaction;
    }
    const v = chainIdOrV;
    const chainId = Number((v - 35n) / 2n);
    if (chainId > 0) transaction.chainId = chainId;
    else if (v !== 27n && v !== 28n) throw new InvalidLegacyVError({ v });
    transaction.v = v;
    transaction.s = s;
    transaction.r = r;
    transaction.yParity = v % 2n === 0n ? 1 : 0;
    return transaction;
  }
  function toTransactionArray(serializedTransaction) {
    return fromRlp(`0x${serializedTransaction.slice(4)}`, "hex");
  }
  function parseAccessList(accessList_) {
    const accessList = [];
    for (let i = 0; i < accessList_.length; i++) {
      const [address, storageKeys] = accessList_[i];
      if (!isAddress(address, { strict: false }))
        throw new InvalidAddressError({ address });
      accessList.push({
        address,
        storageKeys: storageKeys.map((key) => isHash(key) ? key : trim(key))
      });
    }
    return accessList;
  }
  function parseAuthorizationList(serializedAuthorizationList) {
    const authorizationList = [];
    for (let i = 0; i < serializedAuthorizationList.length; i++) {
      const [chainId, address, nonce, yParity, r, s] = serializedAuthorizationList[i];
      authorizationList.push({
        address,
        chainId: chainId === "0x" ? 0 : hexToNumber(chainId),
        nonce: nonce === "0x" ? 0 : hexToNumber(nonce),
        ...parseEIP155Signature([yParity, r, s])
      });
    }
    return authorizationList;
  }
  function parseEIP155Signature(transactionArray) {
    const signature = transactionArray.slice(-3);
    const yParity = signature[0] === "0x" ? 0n : hexToBigInt(signature[0]);
    if (yParity !== 0n && yParity !== 1n)
      throw new InvalidYParityError({ yParity });
    const v = yParity === 0n ? 27n : 28n;
    return {
      r: padHex(signature[1], { size: 32 }),
      s: padHex(signature[2], { size: 32 }),
      v,
      yParity: v === 27n ? 0 : 1
    };
  }

  // node_modules/viem/utils/index.ts
  init_formatEther();
  init_formatGwei();
  init_formatUnits();

  // node_modules/viem/utils/unit/parseEther.ts
  init_unit();

  // node_modules/viem/errors/unit.ts
  init_base();
  var InvalidDecimalNumberError = class extends BaseError2 {
    constructor({ value }) {
      super(`Number \`${value}\` is not a valid decimal number.`, {
        name: "InvalidDecimalNumberError"
      });
    }
  };

  // node_modules/viem/utils/unit/parseUnits.ts
  function parseUnits(value, decimals) {
    if (!/^(-?)([0-9]*)\.?([0-9]*)$/.test(value))
      throw new InvalidDecimalNumberError({ value });
    let [integer, fraction = "0"] = value.split(".");
    const negative = integer.startsWith("-");
    if (negative) integer = integer.slice(1);
    fraction = fraction.replace(/(0+)$/, "");
    if (decimals === 0) {
      if (Math.round(Number(`.${fraction}`)) === 1)
        integer = `${BigInt(integer) + 1n}`;
      fraction = "";
    } else if (fraction.length > decimals) {
      const [left, unit, right] = [
        fraction.slice(0, decimals - 1),
        fraction.slice(decimals - 1, decimals),
        fraction.slice(decimals)
      ];
      const rounded = Math.round(Number(`${unit}.${right}`));
      if (rounded > 9)
        fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, "0");
      else fraction = `${left}${rounded}`;
      if (fraction.length > decimals) {
        fraction = fraction.slice(1);
        integer = `${BigInt(integer) + 1n}`;
      }
      fraction = fraction.slice(0, decimals);
    } else {
      fraction = fraction.padEnd(decimals, "0");
    }
    return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
  }

  // node_modules/viem/utils/unit/parseEther.ts
  function parseEther(ether, unit = "wei") {
    return parseUnits(ether, etherUnits[unit]);
  }

  // node_modules/viem/utils/unit/parseGwei.ts
  init_unit();
  function parseGwei(ether, unit = "wei") {
    return parseUnits(ether, gweiUnits[unit]);
  }

  // node_modules/viem/utils/formatters/proof.ts
  function formatStorageProof(storageProof) {
    return storageProof.map((proof) => ({
      ...proof,
      value: BigInt(proof.value)
    }));
  }
  function formatProof(proof) {
    return {
      ...proof,
      balance: proof.balance ? BigInt(proof.balance) : void 0,
      nonce: proof.nonce ? hexToNumber(proof.nonce) : void 0,
      storageProof: proof.storageProof ? formatStorageProof(proof.storageProof) : void 0
    };
  }

  // node_modules/viem/actions/public/getProof.ts
  async function getProof(client, {
    address,
    blockHash,
    blockNumber,
    blockTag = "latest",
    requireCanonical,
    storageKeys
  }) {
    const block = formatBlockParameter({
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    const proof = await client.request({
      method: "eth_getProof",
      params: [address, storageKeys, block]
    });
    return formatProof(proof);
  }

  // node_modules/viem/actions/public/getRawTransaction.ts
  init_transaction();
  async function getRawTransaction(client, { hash: hash3 }) {
    const rawTransaction = await client.request(
      {
        method: "eth_getRawTransactionByHash",
        params: [hash3]
      },
      { dedupe: true }
    );
    if (!rawTransaction) throw new TransactionNotFoundError({ hash: hash3 });
    return rawTransaction;
  }

  // node_modules/viem/actions/public/getStorageAt.ts
  init_formatBlockParameter();
  async function getStorageAt(client, {
    address,
    blockHash,
    blockNumber,
    blockTag = "latest",
    requireCanonical,
    slot
  }) {
    const block = formatBlockParameter({
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    const data = await client.request({
      method: "eth_getStorageAt",
      params: [address, slot, block]
    });
    return data;
  }

  // node_modules/viem/actions/public/getTransaction.ts
  init_transaction();
  init_toHex();
  async function getTransaction(client, {
    blockHash,
    blockNumber,
    blockTag: blockTag_,
    hash: hash3,
    index: index2,
    sender,
    nonce
  }) {
    const blockTag = blockTag_ || "latest";
    const blockNumberHex = blockNumber !== void 0 ? numberToHex(blockNumber) : void 0;
    let transaction = null;
    if (hash3) {
      transaction = await client.request(
        {
          method: "eth_getTransactionByHash",
          params: [hash3]
        },
        { dedupe: true }
      );
    } else if (blockHash) {
      transaction = await client.request(
        {
          method: "eth_getTransactionByBlockHashAndIndex",
          params: [blockHash, numberToHex(index2)]
        },
        { dedupe: true }
      );
    } else if ((blockNumberHex || blockTag) && typeof index2 === "number") {
      transaction = await client.request(
        {
          method: "eth_getTransactionByBlockNumberAndIndex",
          params: [blockNumberHex || blockTag, numberToHex(index2)]
        },
        { dedupe: Boolean(blockNumberHex) }
      );
    } else if (sender && typeof nonce === "number") {
      transaction = await client.request(
        {
          method: "eth_getTransactionBySenderAndNonce",
          params: [sender, numberToHex(nonce)]
        },
        { dedupe: true }
      );
    }
    if (!transaction)
      throw new TransactionNotFoundError({
        blockHash,
        blockNumber,
        blockTag,
        hash: hash3,
        index: index2
      });
    const format = client.chain?.formatters?.transaction?.format || formatTransaction;
    return format(transaction, "getTransaction");
  }

  // node_modules/viem/actions/public/getTransactionConfirmations.ts
  async function getTransactionConfirmations(client, { hash: hash3, transactionReceipt }) {
    const [blockNumber, transaction] = await Promise.all([
      getAction(client, getBlockNumber, "getBlockNumber")({}),
      hash3 ? getAction(client, getTransaction, "getTransaction")({ hash: hash3 }) : void 0
    ]);
    const transactionBlockNumber = transactionReceipt?.blockNumber || transaction?.blockNumber;
    if (!transactionBlockNumber) return 0n;
    return blockNumber - transactionBlockNumber + 1n;
  }

  // node_modules/viem/actions/public/getTransactionReceipt.ts
  init_transaction();
  async function getTransactionReceipt(client, { hash: hash3 }) {
    const receipt = await client.request(
      {
        method: "eth_getTransactionReceipt",
        params: [hash3]
      },
      { dedupe: true }
    );
    if (!receipt) throw new TransactionReceiptNotFoundError({ hash: hash3 });
    const format = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
    return format(
      receipt,
      "getTransactionReceipt"
    );
  }

  // node_modules/viem/actions/public/multicall.ts
  init_abis();
  init_contracts();
  init_abi();
  init_base();
  init_contract();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_getChainContractAddress();
  async function multicall(client, parameters) {
    const {
      account,
      authorizationList,
      allowFailure = true,
      blockHash,
      blockNumber,
      blockOverrides,
      blockTag,
      requireCanonical,
      stateOverride
    } = parameters;
    const contracts = parameters.contracts;
    const {
      batchSize = parameters.batchSize ?? 1024,
      deployless = parameters.deployless ?? false
    } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
    const multicallAddress = (() => {
      if (parameters.multicallAddress) return parameters.multicallAddress;
      if (deployless) return null;
      if (client.chain) {
        return getChainContractAddress({
          blockNumber,
          chain: client.chain,
          contract: "multicall3"
        });
      }
      throw new Error(
        "client chain not configured. multicallAddress is required."
      );
    })();
    const chunkedCalls = [[]];
    let currentChunk = 0;
    let currentChunkSize = 0;
    for (let i = 0; i < contracts.length; i++) {
      const { abi: abi2, address, args, functionName } = contracts[i];
      try {
        const callData = encodeFunctionData({ abi: abi2, args, functionName });
        currentChunkSize += (callData.length - 2) / 2;
        if (
          // Check if batching is enabled.
          batchSize > 0 && // Check if the current size of the batch exceeds the size limit.
          currentChunkSize > batchSize && // Check if the current chunk is not already empty.
          chunkedCalls[currentChunk].length > 0
        ) {
          currentChunk++;
          currentChunkSize = (callData.length - 2) / 2;
          chunkedCalls[currentChunk] = [];
        }
        chunkedCalls[currentChunk] = [
          ...chunkedCalls[currentChunk],
          {
            allowFailure: true,
            callData,
            target: address
          }
        ];
      } catch (err) {
        const error = getContractError(err, {
          abi: abi2,
          address,
          args,
          docsPath: "/docs/contract/multicall",
          functionName,
          sender: account
        });
        if (!allowFailure) throw error;
        chunkedCalls[currentChunk] = [
          ...chunkedCalls[currentChunk],
          {
            allowFailure: true,
            callData: "0x",
            target: address
          }
        ];
      }
    }
    const aggregate3Results = await Promise.allSettled(
      chunkedCalls.map(
        (calls) => getAction(
          client,
          readContract,
          "readContract"
        )({
          ...multicallAddress === null ? { code: multicall3Bytecode } : { address: multicallAddress },
          abi: multicall3Abi,
          account,
          args: [calls],
          authorizationList,
          blockHash,
          blockNumber,
          blockOverrides,
          blockTag,
          functionName: "aggregate3",
          requireCanonical,
          stateOverride
        })
      )
    );
    const results = [];
    for (let i = 0; i < aggregate3Results.length; i++) {
      const result = aggregate3Results[i];
      if (result.status === "rejected") {
        if (!allowFailure) throw result.reason;
        for (let j = 0; j < chunkedCalls[i].length; j++) {
          results.push({
            status: "failure",
            error: result.reason,
            result: void 0
          });
        }
        continue;
      }
      const aggregate3Result = result.value;
      for (let j = 0; j < aggregate3Result.length; j++) {
        const { returnData, success } = aggregate3Result[j];
        const { callData } = chunkedCalls[i][j];
        const { abi: abi2, address, functionName, args } = contracts[results.length];
        try {
          if (callData === "0x") throw new AbiDecodingZeroDataError();
          if (!success) throw new RawContractError({ data: returnData });
          const result2 = decodeFunctionResult({
            abi: abi2,
            args,
            data: returnData,
            functionName
          });
          results.push(allowFailure ? { result: result2, status: "success" } : result2);
        } catch (err) {
          const error = getContractError(err, {
            abi: abi2,
            address,
            args,
            docsPath: "/docs/contract/multicall",
            functionName
          });
          if (!allowFailure) throw error;
          results.push({ error, result: void 0, status: "failure" });
        }
      }
    }
    if (results.length !== contracts.length)
      throw new BaseError2("multicall results mismatch");
    return results;
  }

  // node_modules/viem/actions/public/simulateBlocks.ts
  init_BlockOverrides();
  init_parseAccount();
  init_abi();
  init_contract();
  init_node();
  init_decodeFunctionResult();
  init_encodeFunctionData();
  init_concat();
  init_toHex();
  init_getNodeError();
  init_transactionRequest();
  init_stateOverride2();
  init_assertRequest();
  async function simulateBlocks(client, parameters) {
    const {
      blockNumber,
      blockTag = client.experimental_blockTag ?? "latest",
      blocks,
      returnFullTransactions,
      traceTransfers,
      validation
    } = parameters;
    try {
      const blockStateCalls = [];
      for (const block2 of blocks) {
        const blockOverrides = block2.blockOverrides ? toRpc2(block2.blockOverrides) : void 0;
        const calls = block2.calls.map((call_) => {
          const call2 = call_;
          const account = call2.account ? parseAccount(call2.account) : void 0;
          const data = call2.abi ? encodeFunctionData(call2) : call2.data;
          const request = {
            ...call2,
            account,
            data: call2.dataSuffix ? concat([data || "0x", call2.dataSuffix]) : data,
            from: call2.from ?? account?.address
          };
          assertRequest(request);
          return formatTransactionRequest(request);
        });
        const stateOverrides = block2.stateOverrides ? serializeStateOverride(block2.stateOverrides) : void 0;
        blockStateCalls.push({
          blockOverrides,
          calls,
          stateOverrides
        });
      }
      const blockNumberHex = typeof blockNumber === "bigint" ? numberToHex(blockNumber) : void 0;
      const block = blockNumberHex || blockTag;
      const result = await client.request({
        method: "eth_simulateV1",
        params: [
          { blockStateCalls, returnFullTransactions, traceTransfers, validation },
          block
        ]
      });
      return result.map((block2, i) => ({
        ...formatBlock(block2),
        calls: block2.calls.map((call2, j) => {
          const { abi: abi2, args, functionName, to } = blocks[i].calls[j];
          const data = call2.error?.data ?? call2.returnData;
          const gasUsed = BigInt(call2.gasUsed);
          const logs = call2.logs?.map((log) => formatLog(log));
          const status = call2.status === "0x1" ? "success" : "failure";
          const result2 = abi2 && status === "success" && data !== "0x" ? decodeFunctionResult({
            abi: abi2,
            data,
            functionName
          }) : null;
          const error = (() => {
            if (status === "success") return void 0;
            let error2;
            if (data === "0x") error2 = new AbiDecodingZeroDataError();
            else if (data) error2 = new RawContractError({ data });
            if (!error2) return void 0;
            return getContractError(error2, {
              abi: abi2 ?? [],
              address: to ?? "0x",
              args,
              functionName: functionName ?? "<unknown>"
            });
          })();
          return {
            data,
            gasUsed,
            logs,
            status,
            ...status === "success" ? {
              result: result2
            } : {
              error
            }
          };
        })
      }));
    } catch (e) {
      const cause = e;
      const error = getNodeError(cause, {});
      if (error instanceof UnknownNodeError) throw cause;
      throw error;
    }
  }

  // node_modules/ox/_esm/core/AbiItem.js
  init_exports();
  init_Errors();
  init_Hex();

  // node_modules/ox/_esm/core/internal/abiItem.js
  init_Errors();
  function normalizeSignature2(signature) {
    let active = true;
    let current = "";
    let level = 0;
    let result = "";
    let valid = false;
    for (let i = 0; i < signature.length; i++) {
      const char = signature[i];
      if (["(", ")", ","].includes(char))
        active = true;
      if (char === "(")
        level++;
      if (char === ")")
        level--;
      if (!active)
        continue;
      if (level === 0) {
        if (char === " " && ["event", "function", "error", ""].includes(result))
          result = "";
        else {
          result += char;
          if (char === ")") {
            valid = true;
            break;
          }
        }
        continue;
      }
      if (char === " ") {
        if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
          current = "";
          active = false;
        }
        continue;
      }
      result += char;
      current += char;
    }
    if (!valid)
      throw new BaseError3("Unable to normalize signature.");
    return result;
  }
  function isArgOfType2(arg, abiParameter) {
    const argType = typeof arg;
    const abiParameterType = abiParameter.type;
    switch (abiParameterType) {
      case "address":
        return validate3(arg, { strict: false });
      case "bool":
        return argType === "boolean";
      case "function":
        return argType === "string";
      case "string":
        return argType === "string";
      default: {
        if (abiParameterType === "tuple" && "components" in abiParameter)
          return Object.values(abiParameter.components).every((component, index2) => {
            return isArgOfType2(Object.values(arg)[index2], component);
          });
        if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
          return argType === "number" || argType === "bigint";
        if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
          return argType === "string" || arg instanceof Uint8Array;
        if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
          return Array.isArray(arg) && arg.every((x) => isArgOfType2(x, {
            ...abiParameter,
            // Pop off `[]` or `[M]` from end of type
            type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
          }));
        }
        return false;
      }
    }
  }
  function getAmbiguousTypes2(sourceParameters, targetParameters, args) {
    for (const parameterIndex in sourceParameters) {
      const sourceParameter = sourceParameters[parameterIndex];
      const targetParameter = targetParameters[parameterIndex];
      if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
        return getAmbiguousTypes2(sourceParameter.components, targetParameter.components, args[parameterIndex]);
      const types = [sourceParameter.type, targetParameter.type];
      const ambiguous = (() => {
        if (types.includes("address") && types.includes("bytes20"))
          return true;
        if (types.includes("address") && types.includes("string"))
          return validate3(args[parameterIndex], {
            strict: false
          });
        if (types.includes("address") && types.includes("bytes"))
          return validate3(args[parameterIndex], {
            strict: false
          });
        return false;
      })();
      if (ambiguous)
        return types;
    }
    return;
  }

  // node_modules/ox/_esm/core/AbiItem.js
  function from10(abiItem, options = {}) {
    const { prepare = true } = options;
    const item = (() => {
      if (Array.isArray(abiItem))
        return parseAbiItem(abiItem);
      if (typeof abiItem === "string")
        return parseAbiItem(abiItem);
      return abiItem;
    })();
    return {
      ...item,
      ...prepare ? { hash: getSignatureHash(item) } : {}
    };
  }
  function fromAbi(abi2, name, options) {
    const { args = [], prepare = true } = options ?? {};
    const isSelector = validate2(name, { strict: false });
    const abiItems = abi2.filter((abiItem2) => {
      if (isSelector) {
        if (abiItem2.type === "function" || abiItem2.type === "error")
          return getSelector(abiItem2) === slice3(name, 0, 4);
        if (abiItem2.type === "event")
          return getSignatureHash(abiItem2) === name;
        return false;
      }
      return "name" in abiItem2 && abiItem2.name === name;
    });
    if (abiItems.length === 0)
      throw new NotFoundError({ name });
    if (abiItems.length === 1)
      return {
        ...abiItems[0],
        ...prepare ? { hash: getSignatureHash(abiItems[0]) } : {}
      };
    let matchedAbiItem;
    for (const abiItem2 of abiItems) {
      if (!("inputs" in abiItem2))
        continue;
      if (!args || args.length === 0) {
        if (!abiItem2.inputs || abiItem2.inputs.length === 0)
          return {
            ...abiItem2,
            ...prepare ? { hash: getSignatureHash(abiItem2) } : {}
          };
        continue;
      }
      if (!abiItem2.inputs)
        continue;
      if (abiItem2.inputs.length === 0)
        continue;
      if (abiItem2.inputs.length !== args.length)
        continue;
      const matched = args.every((arg, index2) => {
        const abiParameter = "inputs" in abiItem2 && abiItem2.inputs[index2];
        if (!abiParameter)
          return false;
        return isArgOfType2(arg, abiParameter);
      });
      if (matched) {
        if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
          const ambiguousTypes = getAmbiguousTypes2(abiItem2.inputs, matchedAbiItem.inputs, args);
          if (ambiguousTypes)
            throw new AmbiguityError({
              abiItem: abiItem2,
              type: ambiguousTypes[0]
            }, {
              abiItem: matchedAbiItem,
              type: ambiguousTypes[1]
            });
        }
        matchedAbiItem = abiItem2;
      }
    }
    const abiItem = (() => {
      if (matchedAbiItem)
        return matchedAbiItem;
      const [abiItem2, ...overloads] = abiItems;
      return { ...abiItem2, overloads };
    })();
    if (!abiItem)
      throw new NotFoundError({ name });
    return {
      ...abiItem,
      ...prepare ? { hash: getSignatureHash(abiItem) } : {}
    };
  }
  function getSelector(...parameters) {
    const abiItem = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, name] = parameters;
        return fromAbi(abi2, name);
      }
      return parameters[0];
    })();
    return slice3(getSignatureHash(abiItem), 0, 4);
  }
  function getSignature(...parameters) {
    const abiItem = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, name] = parameters;
        return fromAbi(abi2, name);
      }
      return parameters[0];
    })();
    const signature = (() => {
      if (typeof abiItem === "string")
        return abiItem;
      return formatAbiItem(abiItem);
    })();
    return normalizeSignature2(signature);
  }
  function getSignatureHash(...parameters) {
    const abiItem = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, name] = parameters;
        return fromAbi(abi2, name);
      }
      return parameters[0];
    })();
    if (typeof abiItem !== "string" && "hash" in abiItem && abiItem.hash)
      return abiItem.hash;
    return keccak2562(fromString2(getSignature(abiItem)));
  }
  var AmbiguityError = class extends BaseError3 {
    constructor(x, y) {
      super("Found ambiguous types in overloaded ABI Items.", {
        metaMessages: [
          // TODO: abitype to add support for signature-formatted ABI items.
          `\`${x.type}\` in \`${normalizeSignature2(formatAbiItem(x.abiItem))}\`, and`,
          `\`${y.type}\` in \`${normalizeSignature2(formatAbiItem(y.abiItem))}\``,
          "",
          "These types encode differently and cannot be distinguished at runtime.",
          "Remove one of the ambiguous items in the ABI."
        ]
      });
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiItem.AmbiguityError"
      });
    }
  };
  var NotFoundError = class extends BaseError3 {
    constructor({ name, data, type = "item" }) {
      const selector = (() => {
        if (name)
          return ` with name "${name}"`;
        if (data)
          return ` with data "${data}"`;
        return "";
      })();
      super(`ABI ${type}${selector} not found.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "AbiItem.NotFoundError"
      });
    }
  };

  // node_modules/ox/_esm/core/AbiConstructor.js
  init_Hex();
  function encode4(...parameters) {
    const [abiConstructor, options] = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, options2] = parameters;
        return [fromAbi2(abi2), options2];
      }
      return parameters;
    })();
    const { bytecode, args } = options;
    return concat2(bytecode, abiConstructor.inputs?.length && args?.length ? encode3(abiConstructor.inputs, args) : "0x");
  }
  function from11(abiConstructor) {
    return from10(abiConstructor);
  }
  function fromAbi2(abi2) {
    const item = abi2.find((item2) => item2.type === "constructor");
    if (!item)
      throw new NotFoundError({ name: "constructor" });
    return item;
  }

  // node_modules/ox/_esm/core/AbiFunction.js
  init_Hex();
  function encodeData2(...parameters) {
    const [abiFunction, args = []] = (() => {
      if (Array.isArray(parameters[0])) {
        const [abi2, name, args3] = parameters;
        return [fromAbi3(abi2, name, { args: args3 }), args3];
      }
      const [abiFunction2, args2] = parameters;
      return [abiFunction2, args2];
    })();
    const { overloads } = abiFunction;
    const item = overloads ? fromAbi3([abiFunction, ...overloads], abiFunction.name, {
      args
    }) : abiFunction;
    const selector = getSelector2(item);
    const data = args.length > 0 ? encode3(item.inputs, args) : void 0;
    return data ? concat2(selector, data) : selector;
  }
  function from12(abiFunction, options = {}) {
    return from10(abiFunction, options);
  }
  function fromAbi3(abi2, name, options) {
    const item = fromAbi(abi2, name, options);
    if (item.type !== "function")
      throw new NotFoundError({ name, type: "function" });
    return item;
  }
  function getSelector2(abiItem) {
    return getSelector(abiItem);
  }

  // node_modules/viem/actions/public/simulateCalls.ts
  init_parseAccount();

  // node_modules/viem/constants/address.ts
  var ethAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
  var zeroAddress = "0x0000000000000000000000000000000000000000";

  // node_modules/viem/actions/public/simulateCalls.ts
  init_contracts();
  init_base();
  init_encodeFunctionData();
  var getBalanceCode = "0x6080604052348015600e575f80fd5b5061016d8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063f8b2cb4f1461002d575b5f80fd5b610047600480360381019061004291906100db565b61005d565b604051610054919061011e565b60405180910390f35b5f8173ffffffffffffffffffffffffffffffffffffffff16319050919050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100aa82610081565b9050919050565b6100ba816100a0565b81146100c4575f80fd5b50565b5f813590506100d5816100b1565b92915050565b5f602082840312156100f0576100ef61007d565b5b5f6100fd848285016100c7565b91505092915050565b5f819050919050565b61011881610106565b82525050565b5f6020820190506101315f83018461010f565b9291505056fea26469706673582212203b9fe929fe995c7cf9887f0bdba8a36dd78e8b73f149b17d2d9ad7cd09d2dc6264736f6c634300081a0033";
  async function simulateCalls(client, parameters) {
    const {
      blockNumber,
      blockTag,
      calls,
      stateOverrides,
      traceAssetChanges,
      traceTransfers,
      validation
    } = parameters;
    const account = parameters.account ? parseAccount(parameters.account) : void 0;
    if (traceAssetChanges && !account)
      throw new BaseError2(
        "`account` is required when `traceAssetChanges` is true"
      );
    const getBalanceData = account ? encode4(from11("constructor(bytes, bytes)"), {
      bytecode: deploylessCallViaBytecodeBytecode,
      args: [
        getBalanceCode,
        encodeData2(
          from12("function getBalance(address)"),
          [account.address]
        )
      ]
    }) : void 0;
    const assetAddresses = traceAssetChanges ? await Promise.all(
      parameters.calls.map(async (call2) => {
        if (!call2.data && !call2.abi) return;
        const { accessList } = await createAccessList(client, {
          account: account.address,
          ...call2,
          data: call2.abi ? encodeFunctionData(call2) : call2.data
        });
        return accessList.map(
          ({ address, storageKeys }) => storageKeys.length > 0 ? address : null
        );
      })
    ).then((x) => x.flat().filter(Boolean)) : [];
    const blocks = await simulateBlocks(client, {
      blockNumber,
      blockTag,
      blocks: [
        ...traceAssetChanges ? [
          // ETH pre balances
          {
            calls: [{ data: getBalanceData }],
            stateOverrides
          },
          // Asset pre balances
          {
            calls: assetAddresses.map((address, i) => ({
              abi: [
                from12(
                  "function balanceOf(address) returns (uint256)"
                )
              ],
              functionName: "balanceOf",
              args: [account.address],
              to: address,
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          }
        ] : [],
        {
          calls: [...calls, { to: zeroAddress }].map((call2) => ({
            ...call2,
            from: account?.address
          })),
          stateOverrides
        },
        ...traceAssetChanges ? [
          // ETH post balances
          {
            calls: [{ data: getBalanceData }]
          },
          // Asset post balances
          {
            calls: assetAddresses.map((address, i) => ({
              abi: [
                from12(
                  "function balanceOf(address) returns (uint256)"
                )
              ],
              functionName: "balanceOf",
              args: [account.address],
              to: address,
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          },
          // Decimals
          {
            calls: assetAddresses.map((address, i) => ({
              to: address,
              abi: [
                from12("function decimals() returns (uint256)")
              ],
              functionName: "decimals",
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          },
          // Token URI
          {
            calls: assetAddresses.map((address, i) => ({
              to: address,
              abi: [
                from12(
                  "function tokenURI(uint256) returns (string)"
                )
              ],
              functionName: "tokenURI",
              args: [0n],
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          },
          // Symbols
          {
            calls: assetAddresses.map((address, i) => ({
              to: address,
              abi: [from12("function symbol() returns (string)")],
              functionName: "symbol",
              from: zeroAddress,
              nonce: i
            })),
            stateOverrides: [
              {
                address: zeroAddress,
                nonce: 0
              }
            ]
          }
        ] : []
      ],
      traceTransfers,
      validation
    });
    const block_results = traceAssetChanges ? blocks[2] : blocks[0];
    const [
      block_ethPre,
      block_assetsPre,
      ,
      block_ethPost,
      block_assetsPost,
      block_decimals,
      block_tokenURI,
      block_symbols
    ] = traceAssetChanges ? blocks : [];
    const { calls: block_calls, ...block } = block_results;
    const results = block_calls.slice(0, -1) ?? [];
    const ethPre = block_ethPre?.calls ?? [];
    const assetsPre = block_assetsPre?.calls ?? [];
    const balancesPre = [...ethPre, ...assetsPre].map(
      (call2) => call2.status === "success" ? hexToBigInt(call2.data) : null
    );
    const ethPost = block_ethPost?.calls ?? [];
    const assetsPost = block_assetsPost?.calls ?? [];
    const balancesPost = [...ethPost, ...assetsPost].map(
      (call2) => call2.status === "success" ? hexToBigInt(call2.data) : null
    );
    const decimals = (block_decimals?.calls ?? []).map(
      (x) => x.status === "success" ? x.result : null
    );
    const symbols = (block_symbols?.calls ?? []).map(
      (x) => x.status === "success" ? x.result : null
    );
    const tokenURI = (block_tokenURI?.calls ?? []).map(
      (x) => x.status === "success" ? x.result : null
    );
    const changes = [];
    for (const [i, balancePost] of balancesPost.entries()) {
      const balancePre = balancesPre[i];
      if (typeof balancePost !== "bigint") continue;
      if (typeof balancePre !== "bigint") continue;
      const decimals_ = decimals[i - 1];
      const symbol_ = symbols[i - 1];
      const tokenURI_ = tokenURI[i - 1];
      const token = (() => {
        if (i === 0)
          return {
            address: ethAddress,
            decimals: 18,
            symbol: "ETH"
          };
        return {
          address: assetAddresses[i - 1],
          decimals: tokenURI_ || decimals_ ? Number(decimals_ ?? 1) : void 0,
          symbol: symbol_ ?? void 0
        };
      })();
      if (changes.some((change) => change.token.address === token.address))
        continue;
      changes.push({
        token,
        value: {
          pre: balancePre,
          post: balancePost,
          diff: balancePost - balancePre
        }
      });
    }
    return {
      assetChanges: changes,
      block,
      results
    };
  }

  // node_modules/ox/_esm/erc6492/SignatureErc6492.js
  var SignatureErc6492_exports = {};
  __export(SignatureErc6492_exports, {
    InvalidWrappedSignatureError: () => InvalidWrappedSignatureError2,
    assert: () => assert7,
    from: () => from13,
    magicBytes: () => magicBytes2,
    universalSignatureValidatorAbi: () => universalSignatureValidatorAbi,
    universalSignatureValidatorBytecode: () => universalSignatureValidatorBytecode,
    unwrap: () => unwrap2,
    validate: () => validate5,
    wrap: () => wrap2
  });
  init_Errors();
  init_Hex();
  var magicBytes2 = "0x6492649264926492649264926492649264926492649264926492649264926492";
  var universalSignatureValidatorBytecode = "0x608060405234801561001057600080fd5b5060405161069438038061069483398101604081905261002f9161051e565b600061003c848484610048565b9050806000526001601ff35b60007f64926492649264926492649264926492649264926492649264926492649264926100748361040c565b036101e7576000606080848060200190518101906100929190610577565b60405192955090935091506000906001600160a01b038516906100b69085906105dd565b6000604051808303816000865af19150503d80600081146100f3576040519150601f19603f3d011682016040523d82523d6000602084013e6100f8565b606091505b50509050876001600160a01b03163b60000361016057806101605760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90610190908b9087906004016105f9565b602060405180830381865afa1580156101ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d19190610633565b6001600160e01b03191614945050505050610405565b6001600160a01b0384163b1561027a57604051630b135d3f60e11b808252906001600160a01b03861690631626ba7e9061022790879087906004016105f9565b602060405180830381865afa158015610244573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102689190610633565b6001600160e01b031916149050610405565b81516041146102df5760405162461bcd60e51b815260206004820152603a602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e6774680000000000006064820152608401610157565b6102e7610425565b5060208201516040808401518451859392600091859190811061030c5761030c61065d565b016020015160f81c9050601b811480159061032b57508060ff16601c14155b1561038c5760405162461bcd60e51b815260206004820152603b602482015260008051602061067483398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c756500000000006064820152608401610157565b60408051600081526020810180835289905260ff83169181019190915260608101849052608081018390526001600160a01b0389169060019060a0016020604051602081039080840390855afa1580156103ea573d6000803e3d6000fd5b505050602060405103516001600160a01b0316149450505050505b9392505050565b600060208251101561041d57600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b038116811461045857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561048c578181015183820152602001610474565b50506000910152565b600082601f8301126104a657600080fd5b81516001600160401b038111156104bf576104bf61045b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156104ed576104ed61045b565b60405281815283820160200185101561050557600080fd5b610516826020830160208701610471565b949350505050565b60008060006060848603121561053357600080fd5b835161053e81610443565b6020850151604086015191945092506001600160401b0381111561056157600080fd5b61056d86828701610495565b9150509250925092565b60008060006060848603121561058c57600080fd5b835161059781610443565b60208501519093506001600160401b038111156105b357600080fd5b6105bf86828701610495565b604086015190935090506001600160401b0381111561056157600080fd5b600082516105ef818460208701610471565b9190910192915050565b828152604060208201526000825180604084015261061e816060850160208701610471565b601f01601f1916919091016060019392505050565b60006020828403121561064557600080fd5b81516001600160e01b03198116811461040557600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";
  var universalSignatureValidatorAbi = [
    {
      inputs: [
        {
          name: "_signer",
          type: "address"
        },
        {
          name: "_hash",
          type: "bytes32"
        },
        {
          name: "_signature",
          type: "bytes"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      inputs: [
        {
          name: "_signer",
          type: "address"
        },
        {
          name: "_hash",
          type: "bytes32"
        },
        {
          name: "_signature",
          type: "bytes"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function",
      name: "isValidSig"
    }
  ];
  function assert7(wrapped) {
    if (slice3(wrapped, -32) !== magicBytes2)
      throw new InvalidWrappedSignatureError2(wrapped);
  }
  function from13(wrapped) {
    if (typeof wrapped === "string")
      return unwrap2(wrapped);
    return wrapped;
  }
  function unwrap2(wrapped) {
    assert7(wrapped);
    const [to, data, signature] = decode(from5("address, bytes, bytes"), wrapped);
    return { data, signature, to };
  }
  function wrap2(value) {
    const { data, signature, to } = value;
    return concat2(encode3(from5("address, bytes, bytes"), [
      to,
      data,
      signature
    ]), magicBytes2);
  }
  function validate5(wrapped) {
    try {
      assert7(wrapped);
      return true;
    } catch {
      return false;
    }
  }
  var InvalidWrappedSignatureError2 = class extends BaseError3 {
    constructor(wrapped) {
      super(`Value \`${wrapped}\` is an invalid ERC-6492 wrapped signature.`);
      Object.defineProperty(this, "name", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "SignatureErc6492.InvalidWrappedSignatureError"
      });
    }
  };

  // node_modules/viem/actions/public/verifyHash.ts
  init_abis();
  init_contracts();
  init_contract();
  init_encodeDeployData();
  init_encodeFunctionData();
  init_getAddress();
  init_isAddressEqual();
  init_concat();
  init_isHex();
  init_fromHex();
  init_toHex();

  // node_modules/viem/utils/signature/serializeSignature.ts
  init_secp256k1();
  init_fromHex();
  init_toBytes();
  function serializeSignature({
    r,
    s,
    to = "hex",
    v,
    yParity
  }) {
    const yParity_ = (() => {
      if (yParity === 0 || yParity === 1) return yParity;
      if (v && (v === 27n || v === 28n || v >= 35n)) return v % 2n === 0n ? 1 : 0;
      throw new Error("Invalid `v` or `yParity` value");
    })();
    const signature = `0x${new secp256k1.Signature(
      hexToBigInt(r),
      hexToBigInt(s)
    ).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
    if (to === "hex") return signature;
    return hexToBytes(signature);
  }

  // node_modules/viem/actions/public/verifyHash.ts
  init_call();
  async function verifyHash2(client, parameters) {
    const {
      address,
      chain = client.chain,
      hash: hash3,
      erc6492VerifierAddress: verifierAddress = parameters.universalSignatureVerifierAddress ?? chain?.contracts?.erc6492Verifier?.address,
      multicallAddress = parameters.multicallAddress ?? chain?.contracts?.multicall3?.address,
      mode = "auto"
    } = parameters;
    if (chain?.verifyHash) return await chain.verifyHash(client, parameters);
    const signature = (() => {
      const signature2 = parameters.signature;
      if (isHex(signature2)) return signature2;
      if (typeof signature2 === "object" && "r" in signature2 && "s" in signature2)
        return serializeSignature(signature2);
      return bytesToHex(signature2);
    })();
    try {
      if (mode === "eoa") {
        try {
          const verified = isAddressEqual(
            getAddress(address),
            await recoverAddress({ hash: hash3, signature })
          );
          if (verified) return true;
        } catch {
        }
      }
      if (SignatureErc8010_exports.validate(signature))
        return await verifyErc8010(client, {
          ...parameters,
          multicallAddress,
          signature
        });
      return await verifyErc6492(client, {
        ...parameters,
        verifierAddress,
        signature
      });
    } catch (error) {
      if (mode !== "eoa") {
        try {
          const verified = isAddressEqual(
            getAddress(address),
            await recoverAddress({ hash: hash3, signature })
          );
          if (verified) return true;
        } catch {
        }
      }
      if (error instanceof VerificationError) {
        return false;
      }
      throw error;
    }
  }
  async function verifyErc8010(client, parameters) {
    const { address, blockNumber, blockTag, hash: hash3, multicallAddress } = parameters;
    const {
      authorization: authorization_ox,
      data: initData,
      signature,
      to
    } = SignatureErc8010_exports.unwrap(parameters.signature);
    const code = await getCode(client, {
      address,
      blockNumber,
      blockTag
    });
    if (code === concatHex(["0xef0100", authorization_ox.address]))
      return await verifyErc1271(client, {
        address,
        blockNumber,
        blockTag,
        hash: hash3,
        signature
      });
    const authorization = {
      address: authorization_ox.address,
      chainId: Number(authorization_ox.chainId),
      nonce: Number(authorization_ox.nonce),
      r: numberToHex(authorization_ox.r, { size: 32 }),
      s: numberToHex(authorization_ox.s, { size: 32 }),
      yParity: authorization_ox.yParity
    };
    const valid = await verifyAuthorization({
      address,
      authorization
    });
    if (!valid) throw new VerificationError();
    const results = await getAction(
      client,
      readContract,
      "readContract"
    )({
      ...multicallAddress ? { address: multicallAddress } : { code: multicall3Bytecode },
      authorizationList: [authorization],
      abi: multicall3Abi,
      blockNumber,
      blockTag: "pending",
      functionName: "aggregate3",
      args: [
        [
          ...initData ? [
            {
              allowFailure: true,
              target: to ?? address,
              callData: initData
            }
          ] : [],
          {
            allowFailure: true,
            target: address,
            callData: encodeFunctionData({
              abi: erc1271Abi,
              functionName: "isValidSignature",
              args: [hash3, signature]
            })
          }
        ]
      ]
    });
    const data = results[results.length - 1]?.returnData;
    if (data?.startsWith("0x1626ba7e")) return true;
    throw new VerificationError();
  }
  async function verifyErc6492(client, parameters) {
    const {
      address,
      factory,
      factoryData,
      hash: hash3,
      signature,
      verifierAddress,
      ...rest
    } = parameters;
    const wrappedSignature = await (async () => {
      if (!factory && !factoryData) return signature;
      if (SignatureErc6492_exports.validate(signature)) return signature;
      return SignatureErc6492_exports.wrap({
        data: factoryData,
        signature,
        to: factory
      });
    })();
    const args = verifierAddress ? {
      to: verifierAddress,
      data: encodeFunctionData({
        abi: erc6492SignatureValidatorAbi,
        functionName: "isValidSig",
        args: [address, hash3, wrappedSignature]
      }),
      ...rest
    } : {
      data: encodeDeployData({
        abi: erc6492SignatureValidatorAbi,
        args: [address, hash3, wrappedSignature],
        bytecode: erc6492SignatureValidatorByteCode
      }),
      ...rest
    };
    const { data } = await getAction(
      client,
      call,
      "call"
    )(args).catch((error) => {
      if (error instanceof CallExecutionError) throw new VerificationError();
      throw error;
    });
    if (hexToBool(data ?? "0x0")) return true;
    throw new VerificationError();
  }
  async function verifyErc1271(client, parameters) {
    const { address, blockNumber, blockTag, hash: hash3, signature } = parameters;
    const result = await getAction(
      client,
      readContract,
      "readContract"
    )({
      address,
      abi: erc1271Abi,
      args: [hash3, signature],
      blockNumber,
      blockTag,
      functionName: "isValidSignature"
    }).catch((error) => {
      if (error instanceof ContractFunctionExecutionError)
        throw new VerificationError();
      throw error;
    });
    if (result.startsWith("0x1626ba7e")) return true;
    throw new VerificationError();
  }
  var VerificationError = class extends Error {
  };

  // node_modules/viem/actions/public/verifyMessage.ts
  async function verifyMessage2(client, {
    address,
    message,
    factory,
    factoryData,
    signature,
    ...callRequest
  }) {
    const hash3 = hashMessage(message);
    return getAction(
      client,
      verifyHash2,
      "verifyHash"
    )({
      address,
      factory,
      factoryData,
      hash: hash3,
      signature,
      ...callRequest
    });
  }

  // node_modules/viem/actions/public/verifyTypedData.ts
  async function verifyTypedData2(client, parameters) {
    const {
      address,
      factory,
      factoryData,
      signature,
      message,
      primaryType,
      types,
      domain,
      ...callRequest
    } = parameters;
    const hash3 = hashTypedData({ message, primaryType, types, domain });
    return getAction(
      client,
      verifyHash2,
      "verifyHash"
    )({
      address,
      factory,
      factoryData,
      hash: hash3,
      signature,
      ...callRequest
    });
  }

  // node_modules/viem/actions/public/waitForTransactionReceipt.ts
  init_transaction();
  init_withResolvers();
  init_stringify();

  // node_modules/viem/actions/public/watchBlockNumber.ts
  init_fromHex();
  init_stringify();
  function watchBlockNumber(client, {
    emitOnBegin = false,
    emitMissed = false,
    onBlockNumber,
    onError,
    poll: poll_,
    pollingInterval = client.pollingInterval
  }) {
    const enablePolling = (() => {
      if (typeof poll_ !== "undefined") return poll_;
      if (client.transport.type === "webSocket" || client.transport.type === "ipc")
        return false;
      if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
        return false;
      return true;
    })();
    let prevBlockNumber;
    const pollBlockNumber = () => {
      const observerId = stringify([
        "watchBlockNumber",
        client.uid,
        emitOnBegin,
        emitMissed,
        pollingInterval
      ]);
      return observe(
        observerId,
        { onBlockNumber, onError },
        (emit) => poll(
          async () => {
            try {
              const blockNumber = await getAction(
                client,
                getBlockNumber,
                "getBlockNumber"
              )({ cacheTime: 0 });
              if (prevBlockNumber !== void 0) {
                if (blockNumber === prevBlockNumber) return;
                if (blockNumber - prevBlockNumber > 1 && emitMissed) {
                  for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
                    emit.onBlockNumber(i, prevBlockNumber);
                    prevBlockNumber = i;
                  }
                }
              }
              if (prevBlockNumber === void 0 || blockNumber > prevBlockNumber) {
                emit.onBlockNumber(blockNumber, prevBlockNumber);
                prevBlockNumber = blockNumber;
              }
            } catch (err) {
              emit.onError?.(err);
            }
          },
          {
            emitOnBegin,
            interval: pollingInterval
          }
        )
      );
    };
    const subscribeBlockNumber = () => {
      const observerId = stringify([
        "watchBlockNumber",
        client.uid,
        emitOnBegin,
        emitMissed
      ]);
      return observe(observerId, { onBlockNumber, onError }, (emit) => {
        let active = true;
        let unsubscribe = () => active = false;
        (async () => {
          try {
            const transport = (() => {
              if (client.transport.type === "fallback") {
                const transport2 = client.transport.transports.find(
                  (transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc"
                );
                if (!transport2) return client.transport;
                return transport2.value;
              }
              return client.transport;
            })();
            const { unsubscribe: unsubscribe_ } = await transport.subscribe({
              params: ["newHeads"],
              onData(data) {
                if (!active) return;
                const blockNumber = hexToBigInt(data.result?.number);
                emit.onBlockNumber(blockNumber, prevBlockNumber);
                prevBlockNumber = blockNumber;
              },
              onError(error) {
                emit.onError?.(error);
              }
            });
            unsubscribe = unsubscribe_;
            if (!active) unsubscribe();
          } catch (err) {
            onError?.(err);
          }
        })();
        return () => unsubscribe();
      });
    };
    return enablePolling ? pollBlockNumber() : subscribeBlockNumber();
  }

  // node_modules/viem/actions/public/waitForTransactionReceipt.ts
  async function waitForTransactionReceipt(client, parameters) {
    const {
      checkReplacement = true,
      confirmations = 1,
      hash: hash3,
      onReplaced,
      retryCount = 6,
      retryDelay = ({ count }) => ~~(1 << count) * 200,
      // exponential backoff
      timeout = 18e4
    } = parameters;
    const observerId = stringify(["waitForTransactionReceipt", client.uid, hash3]);
    const pollingInterval = (() => {
      if (parameters.pollingInterval) return parameters.pollingInterval;
      if (client.chain?.experimental_preconfirmationTime)
        return client.chain.experimental_preconfirmationTime;
      return client.pollingInterval;
    })();
    let transaction;
    let replacedTransaction;
    let receipt;
    let retrying = false;
    let _unobserve;
    let _unwatch;
    const { promise, resolve, reject } = withResolvers();
    const timer = timeout ? setTimeout(() => {
      _unwatch?.();
      _unobserve?.();
      reject(new WaitForTransactionReceiptTimeoutError({ hash: hash3 }));
    }, timeout) : void 0;
    _unobserve = observe(
      observerId,
      { onReplaced, resolve, reject },
      async (emit) => {
        receipt = await getAction(
          client,
          getTransactionReceipt,
          "getTransactionReceipt"
        )({ hash: hash3 }).catch(() => void 0);
        if (receipt && confirmations <= 1) {
          clearTimeout(timer);
          emit.resolve(receipt);
          _unobserve?.();
          return;
        }
        _unwatch = getAction(
          client,
          watchBlockNumber,
          "watchBlockNumber"
        )({
          emitMissed: true,
          emitOnBegin: true,
          poll: true,
          pollingInterval,
          async onBlockNumber(blockNumber_) {
            const done = (fn) => {
              clearTimeout(timer);
              _unwatch?.();
              fn();
              _unobserve?.();
            };
            let blockNumber = blockNumber_;
            if (retrying) return;
            try {
              if (receipt) {
                if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                  return;
                done(() => emit.resolve(receipt));
                return;
              }
              if (checkReplacement && !transaction) {
                retrying = true;
                await withRetry(
                  async () => {
                    transaction = await getAction(
                      client,
                      getTransaction,
                      "getTransaction"
                    )({ hash: hash3 });
                    if (transaction.blockNumber)
                      blockNumber = transaction.blockNumber;
                  },
                  {
                    delay: retryDelay,
                    retryCount
                  }
                );
                retrying = false;
              }
              receipt = await getAction(
                client,
                getTransactionReceipt,
                "getTransactionReceipt"
              )({ hash: hash3 });
              if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                return;
              done(() => emit.resolve(receipt));
            } catch (err) {
              if (err instanceof TransactionNotFoundError || err instanceof TransactionReceiptNotFoundError) {
                if (!transaction) {
                  retrying = false;
                  return;
                }
                try {
                  replacedTransaction = transaction;
                  retrying = true;
                  const block = await withRetry(
                    () => getAction(
                      client,
                      getBlock,
                      "getBlock"
                    )({
                      blockNumber,
                      includeTransactions: true
                    }),
                    {
                      delay: retryDelay,
                      retryCount,
                      shouldRetry: ({ error }) => error instanceof BlockNotFoundError
                    }
                  );
                  retrying = false;
                  const replacementTransaction = block.transactions.find(
                    ({ from: from14, nonce }) => from14 === replacedTransaction.from && nonce === replacedTransaction.nonce
                  );
                  if (!replacementTransaction) return;
                  receipt = await getAction(
                    client,
                    getTransactionReceipt,
                    "getTransactionReceipt"
                  )({
                    hash: replacementTransaction.hash
                  });
                  if (confirmations > 1 && (!receipt.blockNumber || blockNumber - receipt.blockNumber + 1n < confirmations))
                    return;
                  let reason = "replaced";
                  if (replacementTransaction.to === replacedTransaction.to && replacementTransaction.value === replacedTransaction.value && replacementTransaction.input === replacedTransaction.input) {
                    reason = "repriced";
                  } else if (replacementTransaction.from === replacementTransaction.to && replacementTransaction.value === 0n) {
                    reason = "cancelled";
                  }
                  done(() => {
                    emit.onReplaced?.({
                      reason,
                      replacedTransaction,
                      transaction: replacementTransaction,
                      transactionReceipt: receipt
                    });
                    emit.resolve(receipt);
                  });
                } catch (err_) {
                  done(() => emit.reject(err_));
                }
              } else {
                done(() => emit.reject(err));
              }
            }
          }
        });
      }
    );
    return promise;
  }

  // node_modules/viem/actions/public/watchBlocks.ts
  init_stringify();
  function watchBlocks(client, {
    blockTag = client.experimental_blockTag ?? "latest",
    emitMissed = false,
    emitOnBegin = false,
    onBlock,
    onError,
    includeTransactions: includeTransactions_,
    poll: poll_,
    pollingInterval = client.pollingInterval
  }) {
    const enablePolling = (() => {
      if (typeof poll_ !== "undefined") return poll_;
      if (client.transport.type === "webSocket" || client.transport.type === "ipc")
        return false;
      if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
        return false;
      return true;
    })();
    const includeTransactions = includeTransactions_ ?? false;
    let prevBlock;
    const pollBlocks = () => {
      const observerId = stringify([
        "watchBlocks",
        client.uid,
        blockTag,
        emitMissed,
        emitOnBegin,
        includeTransactions,
        pollingInterval
      ]);
      return observe(
        observerId,
        { onBlock, onError },
        (emit) => poll(
          async () => {
            try {
              const block = await getAction(
                client,
                getBlock,
                "getBlock"
              )({
                blockTag,
                includeTransactions
              });
              if (block.number !== null && prevBlock?.number != null) {
                if (block.number === prevBlock.number) return;
                if (block.number - prevBlock.number > 1 && emitMissed) {
                  for (let i = prevBlock?.number + 1n; i < block.number; i++) {
                    const block2 = await getAction(
                      client,
                      getBlock,
                      "getBlock"
                    )({
                      blockNumber: i,
                      includeTransactions
                    });
                    emit.onBlock(block2, prevBlock);
                    prevBlock = block2;
                  }
                }
              }
              if (
                // If no previous block exists, emit.
                prevBlock?.number == null || // If the block tag is "pending" with no block number, emit.
                blockTag === "pending" && block?.number == null || // If the next block number is greater than the previous block number, emit.
                // We don't want to emit blocks in the past.
                block.number !== null && block.number > prevBlock.number
              ) {
                emit.onBlock(block, prevBlock);
                prevBlock = block;
              }
            } catch (err) {
              emit.onError?.(err);
            }
          },
          {
            emitOnBegin,
            interval: pollingInterval
          }
        )
      );
    };
    const subscribeBlocks = () => {
      let active = true;
      let emitFetched = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          if (emitOnBegin) {
            getAction(
              client,
              getBlock,
              "getBlock"
            )({
              blockTag,
              includeTransactions
            }).then((block) => {
              if (!active) return;
              if (!emitFetched) return;
              onBlock(block, void 0);
              emitFetched = false;
            }).catch(onError);
          }
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find(
                (transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc"
              );
              if (!transport2) return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["newHeads"],
            async onData(data) {
              if (!active) return;
              const block = await getAction(
                client,
                getBlock,
                "getBlock"
              )({
                blockNumber: data.result?.number,
                includeTransactions
              }).catch(() => {
              });
              if (!active) return;
              onBlock(block, prevBlock);
              emitFetched = false;
              prevBlock = block;
            },
            onError(error) {
              onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active) unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    };
    return enablePolling ? pollBlocks() : subscribeBlocks();
  }

  // node_modules/viem/actions/public/watchEvent.ts
  init_abi();
  init_rpc();
  init_stringify();
  function watchEvent(client, {
    address,
    args,
    batch = true,
    event,
    events,
    fromBlock,
    onError,
    onLogs,
    poll: poll_,
    pollingInterval = client.pollingInterval,
    strict: strict_
  }) {
    const enablePolling = (() => {
      if (typeof poll_ !== "undefined") return poll_;
      if (typeof fromBlock === "bigint") return true;
      if (client.transport.type === "webSocket" || client.transport.type === "ipc")
        return false;
      if (client.transport.type === "fallback" && (client.transport.transports[0].config.type === "webSocket" || client.transport.transports[0].config.type === "ipc"))
        return false;
      return true;
    })();
    const strict = strict_ ?? false;
    const pollEvent = () => {
      const observerId = stringify([
        "watchEvent",
        address,
        args,
        batch,
        client.uid,
        event,
        pollingInterval,
        fromBlock
      ]);
      return observe(observerId, { onLogs, onError }, (emit) => {
        let previousBlockNumber;
        if (fromBlock !== void 0) previousBlockNumber = fromBlock - 1n;
        let filter;
        let initialized = false;
        const unwatch = poll(
          async () => {
            if (!initialized) {
              try {
                filter = await getAction(
                  client,
                  createEventFilter,
                  "createEventFilter"
                )({
                  address,
                  args,
                  event,
                  events,
                  strict,
                  fromBlock
                });
              } catch {
              }
              initialized = true;
              return;
            }
            try {
              let logs;
              if (filter) {
                logs = await getAction(
                  client,
                  getFilterChanges,
                  "getFilterChanges"
                )({ filter });
              } else {
                const blockNumber = await getAction(
                  client,
                  getBlockNumber,
                  "getBlockNumber"
                )({});
                if (previousBlockNumber && previousBlockNumber !== blockNumber) {
                  logs = await getAction(
                    client,
                    getLogs,
                    "getLogs"
                  )({
                    address,
                    args,
                    event,
                    events,
                    fromBlock: previousBlockNumber + 1n,
                    toBlock: blockNumber
                  });
                } else {
                  logs = [];
                }
                previousBlockNumber = blockNumber;
              }
              if (logs.length === 0) return;
              if (batch) emit.onLogs(logs);
              else for (const log of logs) emit.onLogs([log]);
            } catch (err) {
              if (filter && err instanceof InvalidInputRpcError)
                initialized = false;
              emit.onError?.(err);
            }
          },
          {
            emitOnBegin: true,
            interval: pollingInterval
          }
        );
        return async () => {
          if (filter)
            await getAction(
              client,
              uninstallFilter,
              "uninstallFilter"
            )({ filter });
          unwatch();
        };
      });
    };
    const subscribeEvent = () => {
      let active = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          const transport = (() => {
            if (client.transport.type === "fallback") {
              const transport2 = client.transport.transports.find(
                (transport3) => transport3.config.type === "webSocket" || transport3.config.type === "ipc"
              );
              if (!transport2) return client.transport;
              return transport2.value;
            }
            return client.transport;
          })();
          const events_ = events ?? (event ? [event] : void 0);
          let topics = [];
          if (events_) {
            const encoded = events_.flatMap(
              (event2) => encodeEventTopics({
                abi: [event2],
                eventName: event2.name,
                args
              })
            );
            topics = [encoded];
            if (event) topics = topics[0];
          }
          const { unsubscribe: unsubscribe_ } = await transport.subscribe({
            params: ["logs", { address, topics }],
            onData(data) {
              if (!active) return;
              const log = data.result;
              try {
                const { eventName, args: args2 } = decodeEventLog({
                  abi: events_ ?? [],
                  data: log.data,
                  topics: log.topics,
                  strict
                });
                const formatted = formatLog(log, { args: args2, eventName });
                onLogs([formatted]);
              } catch (err) {
                let eventName;
                let isUnnamed;
                if (err instanceof DecodeLogDataMismatch || err instanceof DecodeLogTopicsMismatch) {
                  if (strict_) return;
                  eventName = err.abiItem.name;
                  isUnnamed = err.abiItem.inputs?.some(
                    (x) => !("name" in x && x.name)
                  );
                }
                const formatted = formatLog(log, {
                  args: isUnnamed ? [] : {},
                  eventName
                });
                onLogs([formatted]);
              }
            },
            onError(error) {
              onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active) unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    };
    return enablePolling ? pollEvent() : subscribeEvent();
  }

  // node_modules/viem/actions/public/watchPendingTransactions.ts
  init_stringify();
  function watchPendingTransactions(client, {
    batch = true,
    onError,
    onTransactions,
    poll: poll_,
    pollingInterval = client.pollingInterval
  }) {
    const enablePolling = typeof poll_ !== "undefined" ? poll_ : client.transport.type !== "webSocket" && client.transport.type !== "ipc";
    const pollPendingTransactions = () => {
      const observerId = stringify([
        "watchPendingTransactions",
        client.uid,
        batch,
        pollingInterval
      ]);
      return observe(observerId, { onTransactions, onError }, (emit) => {
        let filter;
        const unwatch = poll(
          async () => {
            try {
              if (!filter) {
                try {
                  filter = await getAction(
                    client,
                    createPendingTransactionFilter,
                    "createPendingTransactionFilter"
                  )({});
                  return;
                } catch (err) {
                  unwatch();
                  throw err;
                }
              }
              const hashes = await getAction(
                client,
                getFilterChanges,
                "getFilterChanges"
              )({ filter });
              if (hashes.length === 0) return;
              if (batch) emit.onTransactions(hashes);
              else for (const hash3 of hashes) emit.onTransactions([hash3]);
            } catch (err) {
              emit.onError?.(err);
            }
          },
          {
            emitOnBegin: true,
            interval: pollingInterval
          }
        );
        return async () => {
          if (filter)
            await getAction(
              client,
              uninstallFilter,
              "uninstallFilter"
            )({ filter });
          unwatch();
        };
      });
    };
    const subscribePendingTransactions = () => {
      let active = true;
      let unsubscribe = () => active = false;
      (async () => {
        try {
          const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
            params: ["newPendingTransactions"],
            onData(data) {
              if (!active) return;
              const transaction = data.result;
              onTransactions([transaction]);
            },
            onError(error) {
              onError?.(error);
            }
          });
          unsubscribe = unsubscribe_;
          if (!active) unsubscribe();
        } catch (err) {
          onError?.(err);
        }
      })();
      return () => unsubscribe();
    };
    return enablePolling ? pollPendingTransactions() : subscribePendingTransactions();
  }

  // node_modules/viem/utils/siwe/parseSiweMessage.ts
  function parseSiweMessage(message) {
    const { scheme, statement, ...prefix } = message.match(prefixRegex)?.groups ?? {};
    const { chainId, expirationTime, issuedAt, notBefore, requestId, ...suffix } = message.match(suffixRegex)?.groups ?? {};
    const resources = message.split("Resources:")[1]?.split("\n- ").slice(1);
    return {
      ...prefix,
      ...suffix,
      ...chainId ? { chainId: Number(chainId) } : {},
      ...expirationTime ? { expirationTime: new Date(expirationTime) } : {},
      ...issuedAt ? { issuedAt: new Date(issuedAt) } : {},
      ...notBefore ? { notBefore: new Date(notBefore) } : {},
      ...requestId ? { requestId } : {},
      ...resources ? { resources } : {},
      ...scheme ? { scheme } : {},
      ...statement ? { statement } : {}
    };
  }
  var prefixRegex = /^(?:(?<scheme>[a-zA-Z][a-zA-Z0-9+-.]*):\/\/)?(?<domain>[a-zA-Z0-9+-.]*(?::[0-9]{1,5})?) (?:wants you to sign in with your Ethereum account:\n)(?<address>0x[a-fA-F0-9]{40})\n\n(?:(?<statement>.*)\n\n)?/;
  var suffixRegex = /(?:URI: (?<uri>.+))\n(?:Version: (?<version>.+))\n(?:Chain ID: (?<chainId>\d+))\n(?:Nonce: (?<nonce>[a-zA-Z0-9]+))\n(?:Issued At: (?<issuedAt>.+))(?:\nExpiration Time: (?<expirationTime>.+))?(?:\nNot Before: (?<notBefore>.+))?(?:\nRequest ID: (?<requestId>.+))?/;

  // node_modules/viem/utils/siwe/validateSiweMessage.ts
  init_isAddress();
  init_isAddressEqual();
  function validateSiweMessage(parameters) {
    const {
      address,
      domain,
      message,
      nonce,
      scheme,
      time = /* @__PURE__ */ new Date()
    } = parameters;
    if (domain && message.domain !== domain) return false;
    if (nonce && message.nonce !== nonce) return false;
    if (scheme && message.scheme !== scheme) return false;
    if (message.expirationTime && time >= message.expirationTime) return false;
    if (message.notBefore && time < message.notBefore) return false;
    try {
      if (!message.address) return false;
      if (!isAddress(message.address, { strict: false })) return false;
      if (address && !isAddressEqual(message.address, address)) return false;
    } catch {
      return false;
    }
    return true;
  }

  // node_modules/viem/actions/siwe/verifySiweMessage.ts
  async function verifySiweMessage(client, parameters) {
    const {
      address,
      domain,
      message,
      nonce,
      scheme,
      signature,
      time = /* @__PURE__ */ new Date(),
      ...callRequest
    } = parameters;
    const parsed = parseSiweMessage(message);
    if (!parsed.address) return false;
    const isValid = validateSiweMessage({
      address,
      domain,
      message: parsed,
      nonce,
      scheme,
      time
    });
    if (!isValid) return false;
    const hash3 = hashMessage(message);
    return verifyHash2(client, {
      address: parsed.address,
      hash: hash3,
      signature,
      ...callRequest
    });
  }

  // node_modules/viem/actions/token/approve.ts
  init_abis();

  // node_modules/viem/actions/token/internal.ts
  init_abis();
  init_isAddress();
  init_isAddressEqual();
  init_formatUnits();
  function toAmount(amount, decimals) {
    return { amount, decimals, formatted: formatUnits(amount, decimals) };
  }
  function toBaseUnits(amount, decimals) {
    if (typeof amount === "bigint") return amount;
    const resolved = amount.decimals ?? decimals;
    return parseUnits(amount.formatted, requireTokenDecimals(resolved));
  }
  function requireTokenDecimals(decimals) {
    if (decimals === void 0)
      throw new Error(
        "Token decimals are required. Pass `amount.decimals` or select a declared token."
      );
    return decimals;
  }
  function resolveAmountDecimals(amount, decimals) {
    if (typeof amount === "bigint") return decimals;
    return amount.decimals ?? decimals;
  }
  function resolveToken(client, parameters) {
    const { decimals, token } = parameters;
    const declared = findDeclaredToken(client, token);
    if (declared)
      return {
        address: declared.address,
        decimals: decimals ?? declared.decimals
      };
    if (isAddress(token, { strict: false }))
      return {
        address: token,
        decimals: decimals ?? inferDecimals(client, token)
      };
    throw new Error(
      `Token "${token}" is not a declared ERC-20 token on the client's \`tokens\` array (with an address for the client's chain), and is not a valid address.`
    );
  }
  function findDeclaredToken(client, token) {
    const tokens = client.tokens;
    const chainId = client.chain?.id;
    if (!tokens || chainId === void 0) return void 0;
    const bySymbol = findTokenBySymbol(tokens, token);
    if (bySymbol) return resolveTokenForChain(bySymbol, chainId);
    if (isAddress(token, { strict: false }))
      for (const token_ of tokens) {
        const resolved = resolveTokenForChain(token_, chainId);
        if (resolved && isAddressEqual(resolved.address, token)) return resolved;
      }
    return void 0;
  }
  function resolveTokenForChain(token, chainId) {
    const address = token.addresses[chainId];
    if (!address) return void 0;
    return {
      address,
      currency: token.currency,
      decimals: token.decimals,
      name: token.name,
      popular: token.popular,
      symbol: token.symbol
    };
  }
  function findTokenBySymbol(tokens, symbol) {
    const lowerSymbol = symbol.toLowerCase();
    for (const token of tokens) {
      if (token.symbol?.toLowerCase() === lowerSymbol) return token;
    }
    return void 0;
  }
  function inferDecimals(client, address) {
    const tokens = client.tokens;
    const chainId = client.chain?.id;
    if (tokens && chainId !== void 0)
      for (const token of tokens) {
        const resolved = resolveTokenForChain(token, chainId);
        if (resolved && isAddressEqual(resolved.address, address))
          return resolved.decimals;
      }
    return void 0;
  }
  async function resolveTokenWithDecimals(client, parameters) {
    const { address, decimals } = resolveToken(client, parameters);
    if (decimals !== void 0) return { address, decimals };
    return {
      address,
      decimals: await readContract(client, {
        abi: erc20Abi,
        address,
        functionName: "decimals"
      })
    };
  }
  function pickWriteParameters(parameters) {
    const { account, chain, gas, maxFeePerGas, maxPriorityFeePerGas, nonce } = parameters;
    return { account, chain, gas, maxFeePerGas, maxPriorityFeePerGas, nonce };
  }
  function defineCall(call2) {
    return {
      ...call2,
      data: encodeFunctionData(call2),
      to: call2.address
    };
  }

  // node_modules/viem/actions/token/approve.ts
  async function approve(client, parameters) {
    return approve.inner(writeContract, client, parameters);
  }
  ((approve2) => {
    async function inner(action, client, parameters) {
      return await action(client, {
        ...parameters,
        ...approve2.call(client, parameters)
      });
    }
    approve2.inner = inner;
    function call2(client, parameters) {
      return defineCall(getCall(client, parameters));
    }
    approve2.call = call2;
    async function estimateGas2(client, parameters) {
      return estimateContractGas(client, {
        ...pickWriteParameters(parameters),
        ...approve2.call(client, parameters)
      });
    }
    approve2.estimateGas = estimateGas2;
    async function simulate(client, parameters) {
      return simulateContract(client, {
        ...pickWriteParameters(parameters),
        ...approve2.call(client, parameters)
      });
    }
    approve2.simulate = simulate;
    function extractEvent(logs) {
      const [log] = parseEventLogs({
        abi: erc20Abi,
        logs,
        eventName: "Approval",
        strict: true
      });
      if (!log) throw new Error("`Approval` event not found.");
      return log;
    }
    approve2.extractEvent = extractEvent;
  })(approve || (approve = {}));
  function getCall(client, parameters) {
    const { amount, spender, token } = parameters;
    const { address, decimals } = resolveToken(client, { token });
    return {
      abi: erc20Abi,
      address,
      args: [spender, toBaseUnits(amount, decimals)],
      functionName: "approve"
    };
  }

  // node_modules/viem/actions/token/approveSync.ts
  init_formatUnits();

  // node_modules/viem/actions/wallet/sendTransactionSync.ts
  init_parseAccount();
  init_base();
  init_transaction();
  init_concat();
  init_extract();
  init_transactionRequest();
  init_lru();
  init_assertRequest();

  // node_modules/viem/actions/wallet/sendRawTransactionSync.ts
  init_transaction();
  async function sendRawTransactionSync(client, {
    serializedTransaction,
    throwOnReceiptRevert,
    timeout
  }) {
    const receipt = await client.request(
      {
        method: "eth_sendRawTransactionSync",
        params: timeout ? [serializedTransaction, timeout] : [serializedTransaction]
      },
      { retryCount: 0 }
    );
    const format = client.chain?.formatters?.transactionReceipt?.format || formatTransactionReceipt;
    const formatted = format(receipt);
    if (formatted.status === "reverted" && throwOnReceiptRevert)
      throw new TransactionReceiptRevertedError({ receipt: formatted });
    return formatted;
  }

  // node_modules/viem/actions/wallet/sendTransactionSync.ts
  var supportsWalletNamespace2 = new LruMap(128);
  async function sendTransactionSync(client, parameters) {
    const {
      account: account_ = client.account,
      assertChainId = true,
      chain = client.chain,
      accessList,
      authorizationList,
      blobs,
      data,
      dataSuffix = typeof client.dataSuffix === "string" ? client.dataSuffix : client.dataSuffix?.value,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      pollingInterval,
      throwOnReceiptRevert,
      type,
      value,
      ...rest
    } = parameters;
    const timeout = parameters.timeout ?? Math.max((chain?.blockTime ?? 0) * 3, 5e3);
    if (typeof account_ === "undefined")
      throw new AccountNotFoundError({
        docsPath: "/docs/actions/wallet/sendTransactionSync"
      });
    const account = account_ ? parseAccount(account_) : null;
    let nonceManagerParameters;
    try {
      assertRequest(parameters);
      const to = await (async () => {
        if (parameters.to) return parameters.to;
        if (parameters.to === null) return void 0;
        if (authorizationList && authorizationList.length > 0)
          return await recoverAuthorizationAddress({
            authorization: authorizationList[0]
          }).catch(() => {
            throw new BaseError2(
              "`to` is required. Could not infer from `authorizationList`."
            );
          });
        return void 0;
      })();
      if (account?.type === "json-rpc" || account === null) {
        let chainId;
        if (chain !== null) {
          chainId = await getAction(client, getChainId, "getChainId")({});
          if (assertChainId)
            assertCurrentChain({
              currentChainId: chainId,
              chain
            });
        }
        const chainFormat = client.chain?.formatters?.transactionRequest?.format;
        const format = chainFormat || formatTransactionRequest;
        const request = format(
          {
            // Pick out extra data that might exist on the chain's transaction request type.
            ...extract(rest, { format: chainFormat }),
            accessList,
            account,
            authorizationList,
            blobs,
            chainId,
            data: dataSuffix ? concat([data ?? "0x", dataSuffix]) : data,
            gas,
            gasPrice,
            maxFeePerBlobGas,
            maxFeePerGas,
            maxPriorityFeePerGas,
            nonce,
            to,
            type,
            value
          },
          "sendTransaction"
        );
        const isWalletNamespaceSupported = supportsWalletNamespace2.get(client.uid);
        const method = isWalletNamespaceSupported ? "wallet_sendTransaction" : "eth_sendTransaction";
        const hash3 = await (async () => {
          try {
            return await client.request(
              {
                method,
                params: [request]
              },
              { retryCount: 0 }
            );
          } catch (e) {
            if (isWalletNamespaceSupported === false) throw e;
            const error = e;
            if (error.name === "InvalidInputRpcError" || error.name === "InvalidParamsRpcError" || error.name === "MethodNotFoundRpcError" || error.name === "MethodNotSupportedRpcError") {
              return await client.request(
                {
                  method: "wallet_sendTransaction",
                  params: [request]
                },
                { retryCount: 0 }
              ).then((hash4) => {
                supportsWalletNamespace2.set(client.uid, true);
                return hash4;
              }).catch((e2) => {
                const walletNamespaceError = e2;
                if (walletNamespaceError.name === "MethodNotFoundRpcError" || walletNamespaceError.name === "MethodNotSupportedRpcError") {
                  supportsWalletNamespace2.set(client.uid, false);
                  throw error;
                }
                throw walletNamespaceError;
              });
            }
            throw error;
          }
        })();
        const receipt = await getAction(
          client,
          waitForTransactionReceipt,
          "waitForTransactionReceipt"
        )({
          checkReplacement: false,
          hash: hash3,
          pollingInterval,
          timeout
        });
        if (throwOnReceiptRevert && receipt.status === "reverted")
          throw new TransactionReceiptRevertedError({ receipt });
        return receipt;
      }
      if (account?.type === "local") {
        if (account.nonceManager && typeof nonce === "undefined") {
          const requestChainId = rest.chainId;
          const chainId = await (async () => {
            if (typeof requestChainId === "number") return requestChainId;
            if (chain) return chain.id;
            return getAction(client, getChainId, "getChainId")({});
          })();
          nonceManagerParameters = { address: account.address, chainId };
        }
        const request = await getAction(
          client,
          prepareTransactionRequest,
          "prepareTransactionRequest"
        )({
          account,
          accessList,
          authorizationList,
          blobs,
          chain,
          data: dataSuffix ? concat([data ?? "0x", dataSuffix]) : data,
          gas,
          gasPrice,
          maxFeePerBlobGas,
          maxFeePerGas,
          maxPriorityFeePerGas,
          nonce,
          nonceManager: account.nonceManager,
          parameters: [...defaultParameters, "sidecars"],
          type,
          value,
          ...rest,
          to
        });
        const serializer = chain?.serializers?.transaction;
        const serializedTransaction = await account.signTransaction(
          request,
          {
            serializer
          }
        );
        return await getAction(
          client,
          sendRawTransactionSync,
          "sendRawTransactionSync"
        )({
          serializedTransaction,
          throwOnReceiptRevert,
          timeout: parameters.timeout
        });
      }
      if (account?.type === "smart")
        throw new AccountTypeNotSupportedError({
          metaMessages: [
            "Consider using the `sendUserOperation` Action instead."
          ],
          docsPath: "/docs/actions/bundler/sendUserOperation",
          type: "smart"
        });
      throw new AccountTypeNotSupportedError({
        docsPath: "/docs/actions/wallet/sendTransactionSync",
        type: account?.type
      });
    } catch (err) {
      if (err instanceof AccountTypeNotSupportedError) throw err;
      if (nonceManagerParameters && !(err instanceof TransactionReceiptRevertedError))
        account?.nonceManager?.reset(nonceManagerParameters);
      throw getTransactionError(err, {
        ...parameters,
        account,
        chain: parameters.chain || void 0
      });
    }
  }

  // node_modules/viem/actions/wallet/writeContractSync.ts
  async function writeContractSync(client, parameters) {
    return writeContract.internal(
      client,
      sendTransactionSync,
      "sendTransactionSync",
      parameters
    );
  }

  // node_modules/viem/actions/token/approveSync.ts
  async function approveSync(client, parameters) {
    const { amount, token, throwOnReceiptRevert = true } = parameters;
    const { decimals } = resolveToken(client, { token });
    const resolved = resolveAmountDecimals(amount, decimals);
    const receipt = await approve.inner(writeContractSync, client, {
      ...parameters,
      throwOnReceiptRevert
    });
    const { args } = approve.extractEvent(receipt.logs);
    return {
      ...args,
      ...resolved === void 0 ? {} : { decimals: resolved, formatted: formatUnits(args.value, resolved) },
      receipt
    };
  }

  // node_modules/viem/actions/token/getAllowance.ts
  init_abis();
  async function getAllowance(client, parameters) {
    const { account, decimals, spender, token, ...rest } = parameters;
    const [amount, { decimals: resolved }] = await Promise.all([
      readContract(client, {
        ...rest,
        ...getAllowance.call(client, { account, spender, token })
      }),
      resolveTokenWithDecimals(client, {
        decimals,
        token
      })
    ]);
    return toAmount(amount, resolved);
  }
  ((getAllowance2) => {
    function call2(client, args) {
      return defineCall({
        address: resolveToken(client, args).address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [args.account, args.spender]
      });
    }
    getAllowance2.call = call2;
  })(getAllowance || (getAllowance = {}));

  // node_modules/viem/actions/token/getBalance.ts
  init_parseAccount();
  init_abis();
  async function getBalance2(client, parameters) {
    const {
      account: account_ = client.account,
      decimals,
      token,
      ...rest
    } = parameters;
    if (!account_) throw new AccountNotFoundError();
    const account = parseAccount(account_).address;
    const [amount, { decimals: resolved }] = await Promise.all([
      readContract(client, {
        ...rest,
        ...getBalance2.call(client, { account, token })
      }),
      resolveTokenWithDecimals(client, {
        decimals,
        token
      })
    ]);
    return toAmount(amount, resolved);
  }
  ((getBalance3) => {
    function call2(client, args) {
      const account_ = args.account ?? client.account;
      if (!account_) throw new AccountNotFoundError();
      const account = parseAccount(account_).address;
      return defineCall({
        address: resolveToken(client, args).address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [account]
      });
    }
    getBalance3.call = call2;
  })(getBalance2 || (getBalance2 = {}));

  // node_modules/viem/actions/token/getMetadata.ts
  init_abis();
  async function getMetadata(client, parameters) {
    const { token, ...rest } = parameters;
    const { address } = resolveToken(client, { token });
    const declared = findDeclaredToken(client, token);
    const [decimals_, name, symbol] = await Promise.all([
      declared?.decimals ?? readContract(client, {
        ...rest,
        abi: erc20Abi,
        address,
        functionName: "decimals"
      }),
      declared?.name ?? readContract(client, {
        ...rest,
        abi: erc20Abi,
        address,
        functionName: "name"
      }),
      declared?.symbol ?? readContract(client, {
        ...rest,
        abi: erc20Abi,
        address,
        functionName: "symbol"
      })
    ]);
    return {
      decimals: decimals_,
      name,
      symbol
    };
  }

  // node_modules/viem/actions/token/getTotalSupply.ts
  init_abis();
  async function getTotalSupply(client, parameters) {
    const { decimals, token, ...rest } = parameters;
    const [amount, { decimals: resolved }] = await Promise.all([
      readContract(client, {
        ...rest,
        ...getTotalSupply.call(client, { token })
      }),
      resolveTokenWithDecimals(client, {
        decimals,
        token
      })
    ]);
    return toAmount(amount, resolved);
  }
  ((getTotalSupply2) => {
    function call2(client, args) {
      return defineCall({
        address: resolveToken(client, args).address,
        abi: erc20Abi,
        args: [],
        functionName: "totalSupply"
      });
    }
    getTotalSupply2.call = call2;
  })(getTotalSupply || (getTotalSupply = {}));

  // node_modules/viem/actions/token/transfer.ts
  init_abis();
  async function transfer(client, parameters) {
    return transfer.inner(writeContract, client, parameters);
  }
  ((transfer2) => {
    async function inner(action, client, parameters) {
      return await action(client, {
        ...parameters,
        ...transfer2.call(client, parameters)
      });
    }
    transfer2.inner = inner;
    function call2(client, parameters) {
      return defineCall(getCall2(client, parameters));
    }
    transfer2.call = call2;
    async function estimateGas2(client, parameters) {
      return estimateContractGas(client, {
        ...pickWriteParameters(parameters),
        ...transfer2.call(client, parameters)
      });
    }
    transfer2.estimateGas = estimateGas2;
    async function simulate(client, parameters) {
      return simulateContract(client, {
        ...pickWriteParameters(parameters),
        ...transfer2.call(client, parameters)
      });
    }
    transfer2.simulate = simulate;
    function extractEvent(logs) {
      const [log] = parseEventLogs({
        abi: erc20Abi,
        logs,
        eventName: "Transfer",
        strict: true
      });
      if (!log) throw new Error("`Transfer` event not found.");
      return log;
    }
    transfer2.extractEvent = extractEvent;
  })(transfer || (transfer = {}));
  function getCall2(client, parameters) {
    const { amount, from: from14, to, token } = parameters;
    const { address, decimals } = resolveToken(client, { token });
    const value = toBaseUnits(amount, decimals);
    if (from14)
      return {
        abi: erc20Abi,
        address,
        args: [from14, to, value],
        functionName: "transferFrom"
      };
    return {
      abi: erc20Abi,
      address,
      args: [to, value],
      functionName: "transfer"
    };
  }

  // node_modules/viem/actions/token/transferSync.ts
  init_formatUnits();
  async function transferSync(client, parameters) {
    const { amount, token, throwOnReceiptRevert = true } = parameters;
    const { decimals } = resolveToken(client, { token });
    const resolved = resolveAmountDecimals(amount, decimals);
    const receipt = await transfer.inner(writeContractSync, client, {
      ...parameters,
      throwOnReceiptRevert
    });
    const { args } = transfer.extractEvent(receipt.logs);
    return {
      ...args,
      ...resolved === void 0 ? {} : { decimals: resolved, formatted: formatUnits(args.value, resolved) },
      receipt
    };
  }

  // node_modules/viem/clients/decorators/public.ts
  function publicActions(client) {
    return {
      call: (args) => call(client, args),
      createAccessList: (args) => createAccessList(client, args),
      createBlockFilter: () => createBlockFilter(client),
      createContractEventFilter: (args) => createContractEventFilter(client, args),
      createEventFilter: (args) => createEventFilter(client, args),
      createPendingTransactionFilter: () => createPendingTransactionFilter(client),
      estimateContractGas: (args) => estimateContractGas(client, args),
      estimateGas: (args) => estimateGas(client, args),
      getBalance: (args) => getBalance(client, args),
      getBlobBaseFee: () => getBlobBaseFee(client),
      getBlock: (args) => getBlock(client, args),
      getBlockNumber: (args) => getBlockNumber(client, args),
      getBlockReceipts: (args) => getBlockReceipts(client, args),
      getBlockTransactionCount: (args) => getBlockTransactionCount(client, args),
      getBytecode: (args) => getCode(client, args),
      getChainId: () => getChainId(client),
      getCode: (args) => getCode(client, args),
      getContractEvents: (args) => getContractEvents(client, args),
      getDelegation: (args) => getDelegation(client, args),
      getEip712Domain: (args) => getEip712Domain(client, args),
      getEnsAddress: (args) => getEnsAddress(client, args),
      getEnsAvatar: (args) => getEnsAvatar(client, args),
      getEnsName: (args) => getEnsName(client, args),
      getEnsResolver: (args) => getEnsResolver(client, args),
      getEnsText: (args) => getEnsText(client, args),
      getFeeHistory: (args) => getFeeHistory(client, args),
      estimateFeesPerGas: (args) => estimateFeesPerGas(client, args),
      getFilterChanges: (args) => getFilterChanges(client, args),
      getFilterLogs: (args) => getFilterLogs(client, args),
      getGasPrice: () => getGasPrice(client),
      getLogs: (args) => getLogs(client, args),
      getProof: (args) => getProof(client, args),
      estimateMaxPriorityFeePerGas: (args) => estimateMaxPriorityFeePerGas(client, args),
      fillTransaction: (args) => fillTransaction(client, args),
      getRawTransaction: (args) => getRawTransaction(client, args),
      getStorageAt: (args) => getStorageAt(client, args),
      getTransaction: (args) => getTransaction(client, args),
      getTransactionConfirmations: (args) => getTransactionConfirmations(client, args),
      getTransactionCount: (args) => getTransactionCount(client, args),
      getTransactionReceipt: (args) => getTransactionReceipt(client, args),
      multicall: (args) => multicall(client, args),
      prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
      readContract: (args) => readContract(client, args),
      sendRawTransaction: (args) => sendRawTransaction(client, args),
      sendRawTransactionSync: (args) => sendRawTransactionSync(client, args),
      simulate: (args) => simulateBlocks(client, args),
      simulateBlocks: (args) => simulateBlocks(client, args),
      simulateCalls: (args) => simulateCalls(client, args),
      simulateContract: (args) => simulateContract(client, args),
      verifyHash: (args) => verifyHash2(client, args),
      verifyMessage: (args) => verifyMessage2(client, args),
      verifySiweMessage: (args) => verifySiweMessage(client, args),
      verifyTypedData: (args) => verifyTypedData2(client, args),
      uninstallFilter: (args) => uninstallFilter(client, args),
      waitForTransactionReceipt: (args) => waitForTransactionReceipt(client, args),
      watchBlocks: (args) => watchBlocks(client, args),
      watchBlockNumber: (args) => watchBlockNumber(client, args),
      watchContractEvent: (args) => watchContractEvent(client, args),
      watchEvent: (args) => watchEvent(client, args),
      watchPendingTransactions: (args) => watchPendingTransactions(client, args),
      token: bindPublicToken(client)
    };
  }
  function bindPublicToken(client) {
    return {
      getAllowance: bindActionDecorators(client, getAllowance),
      getBalance: bindActionDecorators(client, getBalance2),
      getMetadata: bindActionDecorators(client, getMetadata),
      getTotalSupply: bindActionDecorators(client, getTotalSupply)
    };
  }

  // node_modules/viem/clients/createPublicClient.ts
  function createPublicClient(parameters) {
    const { key = "public", name = "Public Client" } = parameters;
    const client = createClient({
      ...parameters,
      key,
      name,
      type: "publicClient"
    });
    return client.extend(publicActions);
  }

  // node_modules/viem/actions/test/dropTransaction.ts
  async function dropTransaction(client, { hash: hash3 }) {
    await client.request({
      method: `${client.mode}_dropTransaction`,
      params: [hash3]
    });
  }

  // node_modules/viem/actions/test/dumpState.ts
  async function dumpState(client) {
    return client.request({
      method: `${client.mode}_dumpState`
    });
  }

  // node_modules/viem/actions/test/getAutomine.ts
  async function getAutomine(client) {
    if (client.mode === "ganache")
      return await client.request({
        method: "eth_mining"
      });
    return await client.request({
      method: `${client.mode}_getAutomine`
    });
  }

  // node_modules/viem/actions/test/getTxpoolContent.ts
  async function getTxpoolContent(client) {
    return await client.request({
      method: "txpool_content"
    });
  }

  // node_modules/viem/actions/test/getTxpoolStatus.ts
  init_fromHex();
  async function getTxpoolStatus(client) {
    const { pending, queued } = await client.request({
      method: "txpool_status"
    });
    return {
      pending: hexToNumber(pending),
      queued: hexToNumber(queued)
    };
  }

  // node_modules/viem/actions/test/impersonateAccount.ts
  async function impersonateAccount(client, { address }) {
    await client.request({
      method: `${client.mode}_impersonateAccount`,
      params: [address]
    });
  }

  // node_modules/viem/actions/test/increaseTime.ts
  init_toHex();
  async function increaseTime(client, { seconds }) {
    return await client.request({
      method: "evm_increaseTime",
      params: [numberToHex(seconds)]
    });
  }

  // node_modules/viem/actions/test/inspectTxpool.ts
  async function inspectTxpool(client) {
    return await client.request({
      method: "txpool_inspect"
    });
  }

  // node_modules/viem/actions/test/loadState.ts
  async function loadState(client, { state }) {
    await client.request({
      method: `${client.mode}_loadState`,
      params: [state]
    });
  }

  // node_modules/viem/actions/test/mine.ts
  init_toHex();
  async function mine(client, { blocks, interval }) {
    if (client.mode === "ganache")
      await client.request({
        method: "evm_mine",
        params: [{ blocks: numberToHex(blocks) }]
      });
    else
      await client.request({
        method: `${client.mode}_mine`,
        params: [numberToHex(blocks), numberToHex(interval || 0)]
      });
  }

  // node_modules/viem/actions/test/removeBlockTimestampInterval.ts
  async function removeBlockTimestampInterval(client) {
    await client.request({
      method: `${client.mode}_removeBlockTimestampInterval`
    });
  }

  // node_modules/viem/actions/test/reset.ts
  async function reset(client, { blockNumber, jsonRpcUrl } = {}) {
    await client.request({
      method: `${client.mode}_reset`,
      params: [{ forking: { blockNumber: Number(blockNumber), jsonRpcUrl } }]
    });
  }

  // node_modules/viem/actions/test/revert.ts
  async function revert(client, { id }) {
    await client.request({
      method: "evm_revert",
      params: [id]
    });
  }

  // node_modules/viem/actions/test/sendUnsignedTransaction.ts
  init_extract();
  init_transactionRequest();
  async function sendUnsignedTransaction(client, args) {
    const {
      accessList,
      data,
      from: from14,
      gas,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
      ...rest
    } = args;
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format(
      {
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, { format: chainFormat }),
        accessList,
        data,
        from: from14,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value
      },
      "sendUnsignedTransaction"
    );
    const hash3 = await client.request({
      method: "eth_sendUnsignedTransaction",
      params: [request]
    });
    return hash3;
  }

  // node_modules/viem/actions/test/setAutomine.ts
  async function setAutomine(client, enabled) {
    if (client.mode === "ganache") {
      if (enabled) await client.request({ method: "miner_start" });
      else await client.request({ method: "miner_stop" });
    } else
      await client.request({
        method: "evm_setAutomine",
        params: [enabled]
      });
  }

  // node_modules/viem/actions/test/setBalance.ts
  init_toHex();
  async function setBalance(client, { address, value }) {
    if (client.mode === "ganache")
      await client.request({
        method: "evm_setAccountBalance",
        params: [address, numberToHex(value)]
      });
    else
      await client.request({
        method: `${client.mode}_setBalance`,
        params: [address, numberToHex(value)]
      });
  }

  // node_modules/viem/actions/test/setBlockGasLimit.ts
  init_toHex();
  async function setBlockGasLimit(client, { gasLimit }) {
    await client.request({
      method: "evm_setBlockGasLimit",
      params: [numberToHex(gasLimit)]
    });
  }

  // node_modules/viem/actions/test/setBlockTimestampInterval.ts
  async function setBlockTimestampInterval(client, { interval }) {
    const interval_ = (() => {
      if (client.mode === "hardhat") return interval * 1e3;
      return interval;
    })();
    await client.request({
      method: `${client.mode}_setBlockTimestampInterval`,
      params: [interval_]
    });
  }

  // node_modules/viem/actions/test/setCode.ts
  async function setCode(client, { address, bytecode }) {
    if (client.mode === "ganache")
      await client.request({
        method: "evm_setAccountCode",
        params: [address, bytecode]
      });
    else
      await client.request({
        method: `${client.mode}_setCode`,
        params: [address, bytecode]
      });
  }

  // node_modules/viem/actions/test/setCoinbase.ts
  async function setCoinbase(client, { address }) {
    await client.request({
      method: `${client.mode}_setCoinbase`,
      params: [address]
    });
  }

  // node_modules/viem/actions/test/setIntervalMining.ts
  async function setIntervalMining(client, { interval }) {
    const interval_ = (() => {
      if (client.mode === "hardhat") return interval * 1e3;
      return interval;
    })();
    await client.request({
      method: "evm_setIntervalMining",
      params: [interval_]
    });
  }

  // node_modules/viem/actions/test/setLoggingEnabled.ts
  async function setLoggingEnabled(client, enabled) {
    await client.request({
      method: `${client.mode}_setLoggingEnabled`,
      params: [enabled]
    });
  }

  // node_modules/viem/actions/test/setMinGasPrice.ts
  init_toHex();
  async function setMinGasPrice(client, { gasPrice }) {
    await client.request({
      method: `${client.mode}_setMinGasPrice`,
      params: [numberToHex(gasPrice)]
    });
  }

  // node_modules/viem/actions/test/setNextBlockBaseFeePerGas.ts
  init_toHex();
  async function setNextBlockBaseFeePerGas(client, { baseFeePerGas }) {
    await client.request({
      method: `${client.mode}_setNextBlockBaseFeePerGas`,
      params: [numberToHex(baseFeePerGas)]
    });
  }

  // node_modules/viem/actions/test/setNextBlockTimestamp.ts
  init_toHex();
  async function setNextBlockTimestamp(client, { timestamp }) {
    await client.request({
      method: "evm_setNextBlockTimestamp",
      params: [numberToHex(timestamp)]
    });
  }

  // node_modules/viem/actions/test/setNonce.ts
  init_toHex();
  async function setNonce(client, { address, nonce }) {
    await client.request({
      method: `${client.mode}_setNonce`,
      params: [address, numberToHex(nonce)]
    });
  }

  // node_modules/viem/actions/test/setRpcUrl.ts
  async function setRpcUrl(client, jsonRpcUrl) {
    await client.request({
      method: `${client.mode}_setRpcUrl`,
      params: [jsonRpcUrl]
    });
  }

  // node_modules/viem/actions/test/setStorageAt.ts
  init_toHex();
  async function setStorageAt(client, { address, index: index2, value }) {
    await client.request({
      method: `${client.mode}_setStorageAt`,
      params: [
        address,
        typeof index2 === "number" ? numberToHex(index2) : index2,
        value
      ]
    });
  }

  // node_modules/viem/actions/test/snapshot.ts
  async function snapshot(client) {
    return await client.request({
      method: "evm_snapshot"
    });
  }

  // node_modules/viem/actions/test/stopImpersonatingAccount.ts
  async function stopImpersonatingAccount(client, { address }) {
    await client.request({
      method: `${client.mode}_stopImpersonatingAccount`,
      params: [address]
    });
  }

  // node_modules/viem/clients/decorators/test.ts
  function testActions({
    mode
  }) {
    return (client_) => {
      const client = client_.extend(() => ({
        mode
      }));
      return {
        dropTransaction: (args) => dropTransaction(client, args),
        dumpState: () => dumpState(client),
        getAutomine: () => getAutomine(client),
        getTxpoolContent: () => getTxpoolContent(client),
        getTxpoolStatus: () => getTxpoolStatus(client),
        impersonateAccount: (args) => impersonateAccount(client, args),
        increaseTime: (args) => increaseTime(client, args),
        inspectTxpool: () => inspectTxpool(client),
        loadState: (args) => loadState(client, args),
        mine: (args) => mine(client, args),
        removeBlockTimestampInterval: () => removeBlockTimestampInterval(client),
        reset: (args) => reset(client, args),
        revert: (args) => revert(client, args),
        sendUnsignedTransaction: (args) => sendUnsignedTransaction(client, args),
        setAutomine: (args) => setAutomine(client, args),
        setBalance: (args) => setBalance(client, args),
        setBlockGasLimit: (args) => setBlockGasLimit(client, args),
        setBlockTimestampInterval: (args) => setBlockTimestampInterval(client, args),
        setCode: (args) => setCode(client, args),
        setCoinbase: (args) => setCoinbase(client, args),
        setIntervalMining: (args) => setIntervalMining(client, args),
        setLoggingEnabled: (args) => setLoggingEnabled(client, args),
        setMinGasPrice: (args) => setMinGasPrice(client, args),
        setNextBlockBaseFeePerGas: (args) => setNextBlockBaseFeePerGas(client, args),
        setNextBlockTimestamp: (args) => setNextBlockTimestamp(client, args),
        setNonce: (args) => setNonce(client, args),
        setRpcUrl: (args) => setRpcUrl(client, args),
        setStorageAt: (args) => setStorageAt(client, args),
        snapshot: () => snapshot(client),
        stopImpersonatingAccount: (args) => stopImpersonatingAccount(client, args)
      };
    };
  }

  // node_modules/viem/clients/createTestClient.ts
  function createTestClient(parameters) {
    const { key = "test", name = "Test Client", mode } = parameters;
    const client = createClient({
      ...parameters,
      key,
      name,
      type: "testClient"
    });
    return client.extend((config) => ({
      mode,
      ...testActions({ mode })(config)
    }));
  }

  // node_modules/viem/actions/wallet/addChain.ts
  init_toHex();
  async function addChain(client, { chain }) {
    const { id, name, nativeCurrency, rpcUrls, blockExplorers } = chain;
    await client.request(
      {
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: numberToHex(id),
            chainName: name,
            nativeCurrency,
            rpcUrls: rpcUrls.default.http,
            blockExplorerUrls: blockExplorers ? Object.values(blockExplorers).map(({ url }) => url) : void 0
          }
        ]
      },
      { dedupe: true, retryCount: 0 }
    );
  }

  // node_modules/viem/actions/wallet/deployContract.ts
  init_encodeDeployData();
  function deployContract(walletClient, parameters) {
    const { abi: abi2, args, bytecode, ...request } = parameters;
    const calldata = encodeDeployData({ abi: abi2, args, bytecode });
    return sendTransaction(walletClient, {
      ...request,
      ...request.authorizationList ? { to: null } : {},
      data: calldata
    });
  }

  // node_modules/viem/actions/wallet/getAddresses.ts
  init_getAddress();
  async function getAddresses(client) {
    if (client.account?.type === "local") return [client.account.address];
    const addresses = await client.request(
      { method: "eth_accounts" },
      { dedupe: true }
    );
    return addresses.map((address) => checksumAddress(address));
  }

  // node_modules/viem/actions/wallet/getCapabilities.ts
  init_parseAccount();
  init_toHex();
  async function getCapabilities(client, parameters = {}) {
    const { account = client.account, chainId } = parameters;
    const account_ = account ? parseAccount(account) : void 0;
    const params = chainId ? [account_?.address, [numberToHex(chainId)]] : [account_?.address];
    const capabilities_raw = await client.request({
      method: "wallet_getCapabilities",
      params
    });
    const capabilities = {};
    for (const [chainId2, capabilities_] of Object.entries(capabilities_raw)) {
      capabilities[Number(chainId2)] = {};
      for (let [key, value] of Object.entries(capabilities_)) {
        if (key === "addSubAccount") key = "unstable_addSubAccount";
        capabilities[Number(chainId2)][key] = value;
      }
    }
    return typeof chainId === "number" ? capabilities[chainId] : capabilities;
  }

  // node_modules/viem/actions/wallet/getPermissions.ts
  async function getPermissions(client) {
    const permissions = await client.request(
      { method: "wallet_getPermissions" },
      { dedupe: true }
    );
    return permissions;
  }

  // node_modules/viem/actions/wallet/prepareAuthorization.ts
  init_parseAccount();
  init_isAddressEqual();
  async function prepareAuthorization(client, parameters) {
    const { account: account_ = client.account, chainId, nonce } = parameters;
    if (!account_)
      throw new AccountNotFoundError({
        docsPath: "/docs/eip7702/prepareAuthorization"
      });
    const account = parseAccount(account_);
    const executor = (() => {
      if (!parameters.executor) return void 0;
      if (parameters.executor === "self") return parameters.executor;
      return parseAccount(parameters.executor);
    })();
    const authorization = {
      address: parameters.contractAddress ?? parameters.address,
      chainId,
      nonce
    };
    if (typeof authorization.chainId === "undefined")
      authorization.chainId = client.chain?.id ?? await getAction(client, getChainId, "getChainId")({});
    if (typeof authorization.nonce === "undefined") {
      authorization.nonce = await getAction(
        client,
        getTransactionCount,
        "getTransactionCount"
      )({
        address: account.address,
        blockTag: "pending"
      });
      if (executor === "self" || executor?.address && isAddressEqual(executor.address, account.address))
        authorization.nonce += 1;
    }
    return authorization;
  }

  // node_modules/viem/actions/wallet/requestAddresses.ts
  init_getAddress();
  async function requestAddresses(client) {
    const addresses = await client.request(
      { method: "eth_requestAccounts" },
      { dedupe: true, retryCount: 0 }
    );
    return addresses.map((address) => getAddress(address));
  }

  // node_modules/viem/actions/wallet/requestPermissions.ts
  async function requestPermissions(client, permissions) {
    return client.request(
      {
        method: "wallet_requestPermissions",
        params: [permissions]
      },
      { retryCount: 0 }
    );
  }

  // node_modules/viem/actions/wallet/sendCallsSync.ts
  async function sendCallsSync(client, parameters) {
    const { chain = client.chain } = parameters;
    const timeout = parameters.timeout ?? Math.max((chain?.blockTime ?? 0) * 3, 5e3);
    const result = await getAction(client, sendCalls, "sendCalls")(parameters);
    const status = await getAction(
      client,
      waitForCallsStatus,
      "waitForCallsStatus"
    )({
      ...parameters,
      id: result.id,
      timeout
    });
    return status;
  }

  // node_modules/viem/actions/wallet/showCallsStatus.ts
  async function showCallsStatus(client, parameters) {
    const { id } = parameters;
    await client.request({
      method: "wallet_showCallsStatus",
      params: [id]
    });
    return;
  }

  // node_modules/viem/actions/wallet/signAuthorization.ts
  init_parseAccount();
  async function signAuthorization(client, parameters) {
    const { account: account_ = client.account } = parameters;
    if (!account_)
      throw new AccountNotFoundError({
        docsPath: "/docs/eip7702/signAuthorization"
      });
    const account = parseAccount(account_);
    if (!account.signAuthorization)
      throw new AccountTypeNotSupportedError({
        docsPath: "/docs/eip7702/signAuthorization",
        metaMessages: [
          "The `signAuthorization` Action does not support JSON-RPC Accounts."
        ],
        type: account.type
      });
    const authorization = await prepareAuthorization(client, parameters);
    return account.signAuthorization(authorization);
  }

  // node_modules/viem/actions/wallet/signMessage.ts
  init_parseAccount();
  init_toHex();
  async function signMessage(client, {
    account: account_ = client.account,
    message
  }) {
    if (!account_)
      throw new AccountNotFoundError({
        docsPath: "/docs/actions/wallet/signMessage"
      });
    const account = parseAccount(account_);
    if (account.signMessage) return account.signMessage({ message });
    const message_ = (() => {
      if (typeof message === "string") return stringToHex(message);
      if (message.raw instanceof Uint8Array) return toHex(message.raw);
      return message.raw;
    })();
    return client.request(
      {
        method: "personal_sign",
        params: [message_, account.address]
      },
      { retryCount: 0 }
    );
  }

  // node_modules/viem/actions/wallet/signTransaction.ts
  init_parseAccount();
  init_toHex();
  init_transactionRequest();
  init_assertRequest();
  async function signTransaction(client, parameters) {
    const {
      account: account_ = client.account,
      chain = client.chain,
      ...transaction
    } = parameters;
    if (!account_)
      throw new AccountNotFoundError({
        docsPath: "/docs/actions/wallet/signTransaction"
      });
    const account = parseAccount(account_);
    assertRequest({
      account,
      ...parameters
    });
    const chainId = await getAction(client, getChainId, "getChainId")({});
    if (chain !== null)
      assertCurrentChain({
        currentChainId: chainId,
        chain
      });
    const formatters = chain?.formatters || client.chain?.formatters;
    const format = formatters?.transactionRequest?.format || formatTransactionRequest;
    if (account.signTransaction)
      return account.signTransaction(
        {
          ...transaction,
          account,
          chainId
        },
        { serializer: client.chain?.serializers?.transaction }
      );
    return await client.request(
      {
        method: "eth_signTransaction",
        params: [
          {
            ...format(
              {
                ...transaction,
                account
              },
              "signTransaction"
            ),
            chainId: numberToHex(chainId),
            from: account.address
          }
        ]
      },
      { retryCount: 0 }
    );
  }

  // node_modules/viem/actions/wallet/signTypedData.ts
  init_parseAccount();
  async function signTypedData(client, parameters) {
    const {
      account: account_ = client.account,
      domain,
      message,
      primaryType
    } = parameters;
    if (!account_)
      throw new AccountNotFoundError({
        docsPath: "/docs/actions/wallet/signTypedData"
      });
    const account = parseAccount(account_);
    const types = {
      EIP712Domain: getTypesForEIP712Domain({ domain }),
      ...parameters.types
    };
    validateTypedData({ domain, message, primaryType, types });
    if (account.signTypedData)
      return account.signTypedData({ domain, message, primaryType, types });
    const typedData = serializeTypedData({ domain, message, primaryType, types });
    return client.request(
      {
        method: "eth_signTypedData_v4",
        params: [account.address, typedData]
      },
      { retryCount: 0 }
    );
  }

  // node_modules/viem/actions/wallet/switchChain.ts
  init_toHex();
  async function switchChain(client, { id }) {
    await client.request(
      {
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: numberToHex(id)
          }
        ]
      },
      { retryCount: 0 }
    );
  }

  // node_modules/viem/actions/wallet/watchAsset.ts
  async function watchAsset(client, params) {
    const added = await client.request(
      {
        method: "wallet_watchAsset",
        params
      },
      { retryCount: 0 }
    );
    return added;
  }

  // node_modules/viem/clients/decorators/wallet.ts
  function walletActions(client) {
    return {
      addChain: (args) => addChain(client, args),
      deployContract: (args) => deployContract(client, args),
      fillTransaction: (args) => fillTransaction(client, args),
      getAddresses: () => getAddresses(client),
      getCallsStatus: (args) => getCallsStatus(client, args),
      getCapabilities: (args) => getCapabilities(client, args),
      getChainId: () => getChainId(client),
      getPermissions: () => getPermissions(client),
      prepareAuthorization: (args) => prepareAuthorization(client, args),
      prepareTransactionRequest: (args) => prepareTransactionRequest(client, args),
      requestAddresses: () => requestAddresses(client),
      requestPermissions: (args) => requestPermissions(client, args),
      sendCalls: (args) => sendCalls(client, args),
      sendCallsSync: (args) => sendCallsSync(client, args),
      sendRawTransaction: (args) => sendRawTransaction(client, args),
      sendRawTransactionSync: (args) => sendRawTransactionSync(client, args),
      sendTransaction: (args) => sendTransaction(client, args),
      sendTransactionSync: (args) => sendTransactionSync(client, args),
      showCallsStatus: (args) => showCallsStatus(client, args),
      signAuthorization: (args) => signAuthorization(client, args),
      signMessage: (args) => signMessage(client, args),
      signTransaction: (args) => signTransaction(client, args),
      signTypedData: (args) => signTypedData(client, args),
      switchChain: (args) => switchChain(client, args),
      waitForCallsStatus: (args) => waitForCallsStatus(client, args),
      watchAsset: (args) => watchAsset(client, args),
      writeContract: (args) => writeContract(client, args),
      writeContractSync: (args) => writeContractSync(client, args),
      token: {
        approve: bindActionDecorators(client, approve),
        approveSync: bindActionDecorators(client, approveSync),
        transfer: bindActionDecorators(client, transfer),
        transferSync: bindActionDecorators(client, transferSync)
      }
    };
  }

  // node_modules/viem/clients/createWalletClient.ts
  function createWalletClient(parameters) {
    const { key = "wallet", name = "Wallet Client", transport } = parameters;
    const client = createClient({
      ...parameters,
      key,
      name,
      transport,
      type: "walletClient"
    });
    return client.extend(walletActions);
  }

  // node_modules/viem/clients/transports/createTransport.ts
  function createTransport({
    key,
    methods,
    name,
    request,
    retryCount = 3,
    retryDelay = 150,
    timeout,
    type
  }, value) {
    const uid2 = uid();
    return {
      config: {
        key,
        methods,
        name,
        request,
        retryCount,
        retryDelay,
        timeout,
        type
      },
      request: buildRequest(request, { methods, retryCount, retryDelay, uid: uid2 }),
      value
    };
  }

  // node_modules/viem/clients/transports/custom.ts
  function custom(provider, config = {}) {
    const {
      key = "custom",
      methods,
      name = "Custom Provider",
      retryDelay
    } = config;
    return ({ retryCount: defaultRetryCount }) => createTransport({
      key,
      methods,
      name,
      request: provider.request.bind(provider),
      retryCount: config.retryCount ?? defaultRetryCount,
      retryDelay,
      type: "custom"
    });
  }

  // node_modules/viem/clients/transports/fallback.ts
  init_node();
  init_rpc();
  function fallback(transports_, config = {}) {
    const {
      key = "fallback",
      name = "Fallback",
      rank = false,
      shouldThrow: shouldThrow_ = shouldThrow,
      retryCount,
      retryDelay
    } = config;
    return (({ chain, pollingInterval = 4e3, timeout, ...rest }) => {
      let transports = transports_;
      let onResponse = () => {
      };
      const transport = createTransport(
        {
          key,
          name,
          async request({ method, params }) {
            let includes;
            const fetch2 = async (i = 0) => {
              const transport2 = transports[i]({
                ...rest,
                chain,
                retryCount: 0,
                timeout
              });
              try {
                const response = await transport2.request({
                  method,
                  params
                });
                onResponse({
                  method,
                  params,
                  response,
                  transport: transport2,
                  status: "success"
                });
                return response;
              } catch (err) {
                onResponse({
                  error: err,
                  method,
                  params,
                  transport: transport2,
                  status: "error"
                });
                if (shouldThrow_(err)) throw err;
                if (i === transports.length - 1) throw err;
                includes ??= transports.slice(i + 1).some((transport3) => {
                  const { include, exclude } = transport3({ chain }).config.methods || {};
                  if (include) return include.includes(method);
                  if (exclude) return !exclude.includes(method);
                  return true;
                });
                if (!includes) throw err;
                return fetch2(i + 1);
              }
            };
            return fetch2();
          },
          retryCount,
          retryDelay,
          type: "fallback"
        },
        {
          onResponse: (fn) => onResponse = fn,
          transports: transports.map((fn) => fn({ chain, retryCount: 0 }))
        }
      );
      if (rank) {
        const rankOptions = typeof rank === "object" ? rank : {};
        rankTransports({
          chain,
          interval: rankOptions.interval ?? pollingInterval,
          onTransports: (transports_2) => transports = transports_2,
          ping: rankOptions.ping,
          sampleCount: rankOptions.sampleCount,
          timeout: rankOptions.timeout,
          transports,
          weights: rankOptions.weights
        });
      }
      return transport;
    });
  }
  function shouldThrow(error) {
    if ("code" in error && typeof error.code === "number") {
      if (error.code === TransactionRejectedRpcError.code || error.code === UserRejectedRequestError.code || error.code === WalletConnectSessionSettlementError.code || ExecutionRevertedError.nodeMessage.test(error.message) || error.code === 5e3)
        return true;
    }
    return false;
  }
  function rankTransports({
    chain,
    interval = 4e3,
    onTransports,
    ping,
    sampleCount = 10,
    timeout = 1e3,
    transports,
    weights = {}
  }) {
    const { stability: stabilityWeight = 0.7, latency: latencyWeight = 0.3 } = weights;
    const samples = [];
    const rankTransports_ = async () => {
      const sample = await Promise.all(
        transports.map(async (transport) => {
          const transport_ = transport({ chain, retryCount: 0, timeout });
          const start = Date.now();
          let end;
          let success;
          try {
            await (ping ? ping({ transport: transport_ }) : transport_.request({ method: "net_listening" }));
            success = 1;
          } catch {
            success = 0;
          } finally {
            end = Date.now();
          }
          const latency = end - start;
          return { latency, success };
        })
      );
      samples.push(sample);
      if (samples.length > sampleCount) samples.shift();
      const maxLatency = Math.max(
        ...samples.map(
          (sample2) => Math.max(...sample2.map(({ latency }) => latency))
        )
      );
      const scores = transports.map((_, i) => {
        const latencies = samples.map((sample2) => sample2[i].latency);
        const meanLatency = latencies.reduce((acc, latency) => acc + latency, 0) / latencies.length;
        const latencyScore = 1 - meanLatency / maxLatency;
        const successes = samples.map((sample2) => sample2[i].success);
        const stabilityScore = successes.reduce((acc, success) => acc + success, 0) / successes.length;
        if (stabilityScore === 0) return [0, i];
        return [
          latencyWeight * latencyScore + stabilityWeight * stabilityScore,
          i
        ];
      }).sort((a, b) => b[0] - a[0]);
      onTransports(scores.map(([, i]) => transports[i]));
      await wait(interval);
      rankTransports_();
    };
    rankTransports_();
  }

  // node_modules/viem/clients/transports/http.ts
  init_request();

  // node_modules/viem/errors/transport.ts
  init_base();
  var UrlRequiredError = class extends BaseError2 {
    constructor() {
      super(
        "No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.",
        {
          docsPath: "/docs/clients/intro",
          name: "UrlRequiredError"
        }
      );
    }
  };

  // node_modules/viem/clients/transports/http.ts
  init_createBatchScheduler();
  var signalId = 0;
  var signalIds = /* @__PURE__ */ new WeakMap();
  function getSignalId(signal) {
    if (!signal) return "default";
    const id = signalIds.get(signal);
    if (id !== void 0) return id;
    const nextId = signalId++;
    signalIds.set(signal, nextId);
    return nextId;
  }
  function http(url, config = {}) {
    const {
      batch,
      fetchFn,
      fetchOptions,
      key = "http",
      maxResponseBodySize,
      methods,
      name = "HTTP JSON-RPC",
      onFetchRequest,
      onFetchResponse,
      retryDelay,
      raw
    } = config;
    return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
      const { batchSize = 1e3, wait: wait2 = 0 } = typeof batch === "object" ? batch : {};
      const retryCount = config.retryCount ?? retryCount_;
      const timeout = timeout_ ?? config.timeout ?? 1e4;
      const url_ = url || chain?.rpcUrls.default.http[0];
      if (!url_) throw new UrlRequiredError();
      const rpcClient = getHttpRpcClient(url_, {
        fetchFn,
        fetchOptions,
        maxResponseBodySize,
        onRequest: onFetchRequest,
        onResponse: onFetchResponse,
        timeout
      });
      return createTransport(
        {
          key,
          methods,
          name,
          async request({ method, params }, options) {
            const body = { method, params };
            const fetchOptions2 = options?.signal ? { signal: options.signal } : void 0;
            const { schedule } = createBatchScheduler({
              id: `${url_}.${getSignalId(options?.signal)}`,
              wait: wait2,
              shouldSplitBatch(requests) {
                return requests.length > batchSize;
              },
              fn: (body2) => rpcClient.request({
                body: body2,
                fetchOptions: fetchOptions2
              }),
              sort: (a, b) => a.id - b.id
            });
            const fn = async (body2) => batch ? schedule(body2) : [
              await rpcClient.request({
                body: body2,
                fetchOptions: fetchOptions2
              })
            ];
            const [{ error, result }] = await fn(body);
            if (raw) return { error, result };
            if (error)
              throw new RpcRequestError({
                body,
                error,
                url: url_
              });
            return result;
          },
          retryCount,
          retryDelay,
          timeout,
          type: "http"
        },
        {
          fetchOptions,
          url: url_
        }
      );
    };
  }

  // node_modules/viem/clients/transports/webSocket.ts
  init_request();
  function webSocket(url, config = {}) {
    const {
      keepAlive,
      key = "webSocket",
      methods,
      name = "WebSocket JSON-RPC",
      reconnect,
      retryDelay
    } = config;
    return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
      const retryCount = config.retryCount ?? retryCount_;
      const timeout = timeout_ ?? config.timeout ?? 1e4;
      const url_ = url || chain?.rpcUrls.default.webSocket?.[0];
      const wsRpcClientOpts = { keepAlive, reconnect };
      if (!url_) throw new UrlRequiredError();
      return createTransport(
        {
          key,
          methods,
          name,
          async request({ method, params }) {
            const body = { method, params };
            const rpcClient = await getWebSocketRpcClient(url_, wsRpcClientOpts);
            const { error, result } = await rpcClient.requestAsync({
              body,
              timeout
            });
            if (error)
              throw new RpcRequestError({
                body,
                error,
                url: url_
              });
            return result;
          },
          retryCount,
          retryDelay,
          timeout,
          type: "webSocket"
        },
        {
          getSocket() {
            return getSocket(url_);
          },
          getRpcClient() {
            return getWebSocketRpcClient(url_, wsRpcClientOpts);
          },
          async subscribe({ params, onData, onError }) {
            const rpcClient = await getWebSocketRpcClient(url_, wsRpcClientOpts);
            const { result: subscriptionId } = await new Promise(
              (resolve, reject) => rpcClient.request({
                body: {
                  method: "eth_subscribe",
                  params
                },
                onError(error) {
                  reject(error);
                  onError?.(error);
                  return;
                },
                onResponse(response) {
                  if (response.error) {
                    reject(response.error);
                    onError?.(response.error);
                    return;
                  }
                  if (typeof response.id === "number") {
                    resolve(response);
                    return;
                  }
                  if (response.method !== "eth_subscription") return;
                  onData(response.params);
                }
              })
            );
            return {
              subscriptionId,
              async unsubscribe() {
                return new Promise(
                  (resolve) => rpcClient.request({
                    body: {
                      method: "eth_unsubscribe",
                      params: [subscriptionId]
                    },
                    onResponse: resolve
                  })
                );
              }
            };
          }
        }
      );
    };
  }

  // node_modules/viem/index.ts
  init_abis();
  init_contracts();
  init_number();
  init_unit();
  init_abi();
  init_address();
  init_base();
  init_chain();
  init_contract();
  init_data();
  init_encoding();
  init_node();
  init_request();
  init_rpc();
  init_stateOverride();
  init_transaction();

  // node_modules/viem/types/eip1193.ts
  var ProviderRpcError2 = class extends Error {
    code;
    details;
    constructor(code, message) {
      super(message);
      this.code = code;
      this.details = message;
    }
  };

  // node_modules/viem/index.ts
  init_decodeAbiParameters();

  // node_modules/viem/utils/abi/decodeDeployData.ts
  init_abi();
  init_decodeAbiParameters();
  var docsPath8 = "/docs/contract/decodeDeployData";
  function decodeDeployData(parameters) {
    const { abi: abi2, bytecode, data } = parameters;
    if (data === bytecode) return { bytecode };
    const description = abi2.find((x) => "type" in x && x.type === "constructor");
    if (!description) throw new AbiConstructorNotFoundError({ docsPath: docsPath8 });
    if (!("inputs" in description))
      throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath8 });
    if (!description.inputs || description.inputs.length === 0)
      throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath8 });
    const args = decodeAbiParameters(
      description.inputs,
      `0x${data.replace(bytecode, "")}`
    );
    return { args, bytecode };
  }

  // node_modules/viem/index.ts
  init_decodeErrorResult();
  init_decodeFunctionData();
  init_decodeFunctionResult();
  init_encodeAbiParameters();
  init_encodeDeployData();
  init_encodeErrorResult();
  init_encodeFunctionData();
  init_encodeFunctionResult();
  init_getAbiItem();
  init_prepareEncodeFunctionData();
  init_getAddress();
  init_isAddress();
  init_isAddressEqual();

  // node_modules/viem/utils/blob/fromBlobs.ts
  init_cursor2();
  init_toBytes();
  init_toHex();
  function fromBlobs(parameters) {
    const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
    const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes(x)) : parameters.blobs;
    const length = blobs.reduce((length2, blob) => length2 + blob.length, 0);
    const data = createCursor(new Uint8Array(length));
    let active = true;
    for (const blob of blobs) {
      const cursor = createCursor(blob);
      while (active && cursor.position < blob.length) {
        cursor.incrementPosition(1);
        let consume = 31;
        if (blob.length - cursor.position < 31)
          consume = blob.length - cursor.position;
        for (const _ in Array.from({ length: consume })) {
          const byte = cursor.readByte();
          const isTerminator = byte === 128 && !cursor.inspectBytes(cursor.remaining).includes(128);
          if (isTerminator) {
            active = false;
            break;
          }
          data.pushByte(byte);
        }
      }
    }
    const trimmedData = data.bytes.slice(0, data.position);
    return to === "hex" ? bytesToHex(trimmedData) : trimmedData;
  }

  // node_modules/viem/utils/blob/sidecarsToVersionedHashes.ts
  function sidecarsToVersionedHashes(parameters) {
    const { sidecars, version: version4 } = parameters;
    const to = parameters.to ?? (typeof sidecars[0].blob === "string" ? "hex" : "bytes");
    const hashes = [];
    for (const { commitment } of sidecars) {
      hashes.push(
        commitmentToVersionedHash({
          commitment,
          to,
          version: version4
        })
      );
    }
    return hashes;
  }

  // node_modules/viem/index.ts
  init_ccip2();
  init_getChainContractAddress();
  init_concat();
  init_isHex();
  init_pad();
  init_size();
  init_slice();
  init_trim();
  init_fromBytes();
  init_fromHex();
  init_toBytes();
  init_toHex();

  // node_modules/viem/utils/ens/toCoinType.ts
  var SLIP44_MSB = 2147483648;
  function toCoinType(chainId) {
    if (chainId === 1) return 60n;
    if (chainId >= SLIP44_MSB || chainId < 0)
      throw new EnsInvalidChainIdError({ chainId });
    return BigInt((2147483648 | chainId) >>> 0);
  }

  // node_modules/viem/index.ts
  init_transactionRequest();
  init_keccak256();
  init_toEventSelector();
  init_toFunctionSelector();

  // node_modules/viem/utils/kzg/defineKzg.ts
  function defineKzg({
    blobToKzgCommitment,
    computeBlobKzgProof
  }) {
    return {
      blobToKzgCommitment,
      computeBlobKzgProof
    };
  }

  // node_modules/viem/utils/kzg/setupKzg.ts
  function setupKzg(parameters, path) {
    try {
      parameters.loadTrustedSetup(path);
    } catch (e) {
      const error = e;
      if (!error.message.includes("trusted setup is already loaded")) throw error;
    }
    return defineKzg(parameters);
  }

  // node_modules/viem/utils/signature/compactSignatureToSignature.ts
  init_toBytes();
  init_toHex();
  function compactSignatureToSignature({
    r,
    yParityAndS
  }) {
    const yParityAndS_bytes = hexToBytes(yParityAndS);
    const yParity = yParityAndS_bytes[0] & 128 ? 1 : 0;
    const s = yParityAndS_bytes;
    if (yParity === 1) s[0] &= 127;
    return { r, s: bytesToHex(s), yParity };
  }

  // node_modules/viem/utils/signature/parseCompactSignature.ts
  init_secp256k1();
  init_toHex();
  function parseCompactSignature(signatureHex) {
    const { r, s } = secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
    return {
      r: numberToHex(r, { size: 32 }),
      yParityAndS: numberToHex(s, { size: 32 })
    };
  }

  // node_modules/viem/utils/signature/parseSignature.ts
  init_secp256k1();
  init_toHex();
  function parseSignature2(signatureHex) {
    const { r, s } = secp256k1.Signature.fromCompact(signatureHex.slice(2, 130));
    const yParityOrV = Number(`0x${signatureHex.slice(130)}`);
    const [v, yParity] = (() => {
      if (yParityOrV === 0 || yParityOrV === 1) return [void 0, yParityOrV];
      if (yParityOrV === 27) return [BigInt(yParityOrV), 0];
      if (yParityOrV === 28) return [BigInt(yParityOrV), 1];
      throw new Error("Invalid yParityOrV value");
    })();
    if (typeof v !== "undefined")
      return {
        r: numberToHex(r, { size: 32 }),
        s: numberToHex(s, { size: 32 }),
        v,
        yParity
      };
    return {
      r: numberToHex(r, { size: 32 }),
      s: numberToHex(s, { size: 32 }),
      yParity
    };
  }

  // node_modules/viem/utils/signature/recoverTransactionAddress.ts
  init_keccak256();
  async function recoverTransactionAddress(parameters) {
    const { serializedTransaction, signature: signature_ } = parameters;
    const transaction = parseTransaction(serializedTransaction);
    const signature = signature_ ?? {
      r: transaction.r,
      s: transaction.s,
      v: transaction.v,
      yParity: transaction.yParity
    };
    const serialized = serializeTransaction({
      ...transaction,
      r: void 0,
      s: void 0,
      v: void 0,
      yParity: void 0,
      sidecars: void 0
    });
    return await recoverAddress({
      hash: keccak256(serialized),
      signature
    });
  }

  // node_modules/viem/utils/signature/serializeCompactSignature.ts
  init_secp256k1();
  init_fromHex();
  function serializeCompactSignature({
    r,
    yParityAndS
  }) {
    return `0x${new secp256k1.Signature(
      hexToBigInt(r),
      hexToBigInt(yParityAndS)
    ).toCompactHex()}`;
  }

  // node_modules/viem/utils/signature/signatureToCompactSignature.ts
  init_toBytes();
  init_toHex();
  function signatureToCompactSignature(signature) {
    const { r, s, v, yParity } = signature;
    const yParity_ = Number(yParity ?? v - 27n);
    let yParityAndS = s;
    if (yParity_ === 1) {
      const bytes = hexToBytes(s);
      bytes[0] |= 128;
      yParityAndS = bytesToHex(bytes);
    }
    return { r, yParityAndS };
  }

  // node_modules/viem/index.ts
  init_stringify();
  init_assertRequest();
  init_formatEther();
  init_formatGwei();
  init_formatUnits();
  return __toCommonJS(index_exports);
})();
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/weierstrass.js:
@noble/curves/esm/_shortw_utils.js:
@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
