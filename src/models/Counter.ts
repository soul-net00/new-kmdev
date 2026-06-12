import { Schema, model, models } from "mongoose";

/**
 * Atomic sequence counter used to generate unique, gap-free reference
 * numbers (e.g. one sequence per year: key = "doc-2026").
 */
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

let Counter: any;

if (models.Counter) {
  Counter = models.Counter;
} else {
  Counter = model("Counter", CounterSchema);
}

export { Counter };
