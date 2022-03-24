import { Document, model, Schema } from "mongoose";

export interface FilterInt extends Document {
    Guild: string,
    Channel: string,
    Handler: string,
    Words: string[]
}

export const Filter = new Schema({
    Guild: String,
    Channel: String,
    Handler: String,
    Words: [String]
});

export default model<FilterInt>("Filter", Filter);