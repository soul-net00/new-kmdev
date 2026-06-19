"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

const defaults = [
  { value: "10+", label: "Projects Delivered" },
  { value: "99%", label: "Client Satisfaction" },
  { value: "24h", label: "Response Time" },
  { value: "3+", label: "Years Experience" },
];

function Counter({ value, delay }: { value: string; delay: number }) {
  const num = parseInt(value);
  const suffix = value.replace(/\d+/, "");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) {
      const timeout = setTimeout(() => animate(mv, num, { duration: 1.5 }), delay);
      return () => clearTimeout(timeout);
    }
  }, [inView, mv, num, delay]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
      <motion.span>{display}</motion.span>
    </span>
  );
}

export function Stats({ stats = defaults }: { stats?: Array<{ value: string; label: string }> }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className="rounded-3xl border border-black/[0.05] bg-white p-8 shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:border-white/[0.06] dark:bg-slate-900 dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] md:p-12">
        <h2 className="text-2xl font-bold text-center mb-10 text-text-primary">Results that speak</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="rounded-2xl bg-gray-50 p-6 text-center dark:bg-white/5"
            >
              <Counter value={s.value} delay={i * 150} />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
