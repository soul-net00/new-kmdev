import { Schema, model, models } from "mongoose";

const ClientSchema = new Schema(
  {
    clientName: { type: String, required: true },
    companyName: { type: String, default: "" },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    notes: { type: String, default: "" },
    archived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ClientSchema.index({ clientName: "text", companyName: "text", email: "text" });

let Client: any;

if (models.Client) {
  Client = models.Client;
} else {
  Client = model("Client", ClientSchema);
}

export { Client };
