import { Document, model, Schema } from "mongoose";

export interface FilterInt extends Document {
    Guild: string,
    Log: string,
    Words: string[]
}

export const Filter = new Schema({
    Guild: String,
    Log: String,
    Words: [String]
});

export default model<FilterInt>("Filter", Filter);