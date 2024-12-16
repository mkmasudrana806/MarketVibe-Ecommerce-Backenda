import { TReview } from "./review.interface";

// allowed fields to update user
export const allowedFieldsToUpdate: (keyof TReview)[] = ["rating", "comment"];
