import mongoose, { Schema, models } from "mongoose";

const GeneratedReceiptSchema = new Schema(
  {
    localId: { type: Number, required: true, unique: true },
    receiptNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: String,
    date: { type: String, required: true },
    items: { type: Schema.Types.Mixed, required: true },
    subtotal: Number,
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    notes: String,
    technician: String,
    paymentStatus: { type: String, enum: ["unpaid", "partial", "paid"], default: "unpaid" }
  },
  { timestamps: true }
);

let GeneratedReceipt: any;
if (models.GeneratedReceipt) {
  GeneratedReceipt = models.GeneratedReceipt;
} else {
  GeneratedReceipt = mongoose.model("GeneratedReceipt", GeneratedReceiptSchema);
}

export { GeneratedReceipt };
