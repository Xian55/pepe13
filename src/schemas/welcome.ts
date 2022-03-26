import { Document, model, Schema } from "mongoose";

export interface WelcomeInt extends Document {
    Guild: string,
    Member: string,
    Link: string,
}

export const Welcome = new Schema({
    Guild: String,
    Member: String,
    Link: String,
});

export default model<WelcomeInt>("Welcome", Welcome);