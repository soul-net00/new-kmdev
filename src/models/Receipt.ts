import { Schema, model, models } from "mongoose";

const ReceiptSchema = new Schema(
  {
    orderId: String,
    receiptNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    serviceName: { type: String, required: true },
    amount: { type: Number, required: true },
    pdfUrl: String,
    html: String,
    issuedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

let Receipt: any;

if (models.Receipt) {
  Receipt = models.Receipt;
} else {
  Receipt = model("Receipt", ReceiptSchema);
}

export { Receipt };