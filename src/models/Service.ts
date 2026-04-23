import { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    priceFrom: { type: Number, required: true },
    image: String,
    active: { type: Boolean, default: true },
    includes: [{ type: String }]
  },
  { timestamps: true }
);

let Service: any;

if (models.Service) {
  Service = models.Service;
} else {
  Service = model("Service", ServiceSchema);
}

export { Service };