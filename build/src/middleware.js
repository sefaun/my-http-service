"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
function middleware(...[]) {
    const slice = Array.prototype.slice;
    const stacks = slice.call(arguments);
    const that = this;
    if (!stacks.length) {
        throw new Error("There is no any argument functions.");
    }
    for (let i = 0; i < stacks.length; i++) {
        if (typeof stacks[i] !== "function") {
            throw new Error(`Arguments ${i + 1} is not a Function. All arguments have to be a Function.`);
        }
    }
    return function () {
        return __awaiter(this, arguments, void 0, function* () {
            var arg = 0;
            var next_old_parameters = [];
            const params = slice.call(arguments);
            if (!params.length) {
                throw new Error("There is no any arguments.");
            }
            function next() {
                return __awaiter(this, arguments, void 0, function* () {
                    const next_args = slice.call(arguments);
                    if (next_args.length) {
                        next_old_parameters.push(...next_args, ...next_old_parameters);
                    }
                    arg++;
                    yield stacks[arg].apply(that, [...next_old_parameters, ...params, next]);
                });
            }
            yield stacks[arg].apply(that, [...params, next]);
        });
    };
}
exports.middleware = middleware;
//# sourceMappingURL=middleware.js.map