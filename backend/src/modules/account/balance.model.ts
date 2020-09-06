import mongoose, { Schema } from "mongoose";

const BalanceSchema: Schema = new Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'Account' },
    currentBalance: { type: Number, default: 0 },
    updatedOn: { type: Date }
});


export default mongoose.model('Balance', BalanceSchema, 'Balance');