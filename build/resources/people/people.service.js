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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var people_model_1 = __importDefault(require("@/resources/people/people.model"));
var PeopleService = /** @class */ (function () {
    function PeopleService() {
        this.people = people_model_1.default;
    }
    /** Get Location Continent API*/
    PeopleService.prototype.getLocationContinent = function (exact_continent) {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        pipeline = void 0;
                        console.log(exact_continent);
                        if (exact_continent) {
                            pipeline = [
                                {
                                    $match: {
                                        location_continent: exact_continent
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,
                                        location_continent: { $sum: 1 }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        location_continent: exact_continent,
                                        total: "$location_continent"
                                    }
                                }
                            ];
                        }
                        else {
                            pipeline = [
                                {
                                    $match: {
                                        $and: [
                                            {
                                                $or: [
                                                    { "location_continent": "north america" },
                                                    { "location_continent": "south america" }
                                                ]
                                            }
                                        ]
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$location_continent",
                                        total: { $sum: 1 }
                                    }
                                },
                                {
                                    $sort: { total: -1 }
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        location_continent: "$_id",
                                        total_counts: "$total"
                                    }
                                }
                            ];
                            /** Aggregate Pipeline for getting all of the users total group by location_continent **/
                            // pipeline = [
                            //     { 
                            //         $match: { 
                            //             "location_continent": { $ne: null } 
                            //         } 
                            //     },
                            //     { 
                            //         $group:{ 
                            //             _id: "$location_continent", total: { $sum: 1 } 
                            //         } 
                            //     },
                            //     { 
                            //         $sort : { total: -1 } 
                            //     },
                            //     { 
                            //         $project: { 
                            //             _id: 0, location_continent: "$_id", 
                            //             total: "$total" 
                            //         } 
                            //     }
                            // ];
                        }
                        return [4 /*yield*/, this.people.aggregate(pipeline)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        throw new Error('Unable to get data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** Search User  */
    PeopleService.prototype.searchByUserService = function (linkedin_url) {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pipeline = [
                            {
                                $match: {
                                    linkedin_url: linkedin_url
                                }
                            }
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.people.aggregate(pipeline)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _a.sent();
                        console.log(error_2);
                        throw new Error('Unable to get data');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /** Search User by Countries  */
    PeopleService.prototype.searchUserByCountryService = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var pipeline, aggregate, aggregatePaginate, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        pipeline = void 0;
                        if (args.search != undefined) {
                            pipeline = [
                                {
                                    $match: {
                                        $and: [
                                            {
                                                $or: [
                                                    { "location_continent": "north america" },
                                                    { "location_continent": "south america" },
                                                ]
                                            }
                                        ],
                                        countries: {
                                            $in: [args.search]
                                        }
                                    },
                                },
                                {
                                    $project: { _id: 0, full_name: 1, linkedin_url: 1, emails: 1, countries: 1, location_continent: 1, }
                                },
                                {
                                    $sort: { total: -1 }
                                }
                            ];
                        }
                        else {
                            pipeline = [
                                {
                                    $match: {
                                        $and: [
                                            {
                                                $or: [
                                                    { "location_continent": "north america" },
                                                    { "location_continent": "south america" }
                                                ]
                                            }
                                        ]
                                    },
                                },
                                {
                                    $unwind: "$countries"
                                },
                                {
                                    $group: {
                                        _id: {
                                            countries: "$countries",
                                            location_continent: "$location_continent"
                                        },
                                        total: { $sum: 1 }
                                    }
                                },
                                {
                                    $project: { _id: 0, country: "$_id.countries", location_continent: "$_id.location_continent", total: 1 }
                                },
                                {
                                    $sort: { total: -1 }
                                }
                            ];
                        }
                        aggregate = this.people.aggregate(pipeline);
                        return [4 /*yield*/, this.people.aggregatePaginate(aggregate, args.options)];
                    case 1:
                        aggregatePaginate = _a.sent();
                        // console.log(aggregatePaginate);
                        return [2 /*return*/, aggregatePaginate];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        throw new Error('Unable to get data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PeopleService;
}());
exports.default = PeopleService;
