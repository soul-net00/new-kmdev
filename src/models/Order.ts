import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    serviceId: String,
    serviceName: { type: String, required: true },
    notes: String,
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

let Order: any;

if (models.Order) {
  Order = models.Order;
} else {
  Order = model("Order", OrderSchema);
}

export { Order };