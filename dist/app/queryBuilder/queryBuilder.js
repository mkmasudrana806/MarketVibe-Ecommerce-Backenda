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
class QueryBuilder {
    /**
     * @param modelQuery Model. like User, Student, Faculty
     * @param query req.query object
     */
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    /**
     *  ------------------- search -------------------
     * @param searchableFields in which fields want to search. ex: ["name", "email", "address"] and so on
     * @returns return partial matching results
     */
    search(searchableFields) {
        var _a;
        let searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            });
        }
        return this;
    }
    /**
     * ------------------- filter -------------------
     * @returns exact matching. ex: email=mkmasudrana806@gmail.com.  except: ['searchTerm', 'sort', 'limit', 'age', 'fields'] these query fields
     */
    filter() {
        const queryObj = Object.assign({}, this.query); // copied query object
        const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    /**
     * ------------------- sorting -------------------
     * @returns sort based on any fields. ex: sort=email ascending order. sort=-email descending order
     */
    sort() {
        var _a, _b;
        let sortFields = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(",").join(" ")) || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sortFields);
        return this;
    }
    /**
     * ------------------- pagination -------------------
     * @returns return paginated results. by defautl limit 10 and page 1. ex: limit=20&page=3
     */
    paginate() {
        var _a, _b;
        let page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        let limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        let skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    /**
     * ------------------- fields limiting -------------------
     * @returns limit the fields. ex: fields=name,email,address return these fields only
     */
    fieldsLimiting() {
        var _a, _b;
        let fields = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(",").join(" ")) || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    /**
     * -------------------  count documents -------------------------
     * @returns it return total documents, page, limit and totalPage
     */
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueryries = this.modelQuery.getFilter(); // it gives previous filtered documents
            const total = yield this.modelQuery.model.countDocuments(totalQueryries);
            let page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            let limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                total,
                page,
                limit,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
