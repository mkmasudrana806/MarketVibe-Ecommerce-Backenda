import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  /**
   * @param modelQuery Model. like User, Student, Faculty
   * @param query req.query object
   */
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /**
   *  ------------------- search -------------------
   * @param searchableFields in which fields want to search. ex: ["name", "email", "address"] and so on
   * @returns return partial matching results
   */
  search(searchableFields: string[]) {
    let searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }
    return this;
  }

  /**
   * ------------------- filter -------------------
   * @returns exact matching. ex: email=mkmasudrana806@gmail.com.  except: ['searchTerm', 'sort', 'limit', 'age', 'fields'] these query fields
   */
  filter() {
    const queryObj = { ...this.query }; // copied query object
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  /**
   * ------------------- sorting -------------------
   * @returns sort based on any fields. ex: sort=email ascending order. sort=-email descending order
   */
  sort() {
    let sortFields =
      (this?.query?.sort as string)?.split(",").join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortFields as string);
    return this;
  }

  /**
   * ------------------- pagination -------------------
   * @returns return paginated results. by defautl limit 10 and page 1. ex: limit=20&page=3
   */
  paginate() {
    let page = Number(this?.query?.page) || 1;
    let limit = Number(this?.query?.limit) || 10;
    let skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  /**
   * ------------------- fields limiting -------------------
   * @returns limit the fields. ex: fields=name,email,address return these fields only
   */
  fieldsLimiting() {
    let fields =
      (this?.query?.fields as string)?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  /**
   * -------------------  count documents -------------------------
   * @returns it return total documents, page, limit and totalPage
   */
  async countTotal() {
    const totalQueryries = this.modelQuery.getFilter(); // it gives previous filtered documents
    const total = await this.modelQuery.model.countDocuments(totalQueryries);
    let page = Number(this?.query?.page) || 1;
    let limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPage,
    };
  }
}

export default QueryBuilder;
