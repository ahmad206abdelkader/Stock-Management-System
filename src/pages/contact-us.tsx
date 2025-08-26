import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Contactus() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus(data.ok ? "ok" : "error");
      if (data.ok) setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="mt-8">
        <div className="ml-9 mt-9 font-bold text-[20px]">
          <h1>Contact Us</h1>
        </div>
        <div className="ml-10 mt-5">
          <form onSubmit={submit}>
            <h2>
              Got a question? Contact us today and our team will get back to you
              quickly.
            </h2>

            <Textarea
              className="mt-3 border-3 border-gray-400"
              placeholder="Type your message here."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <div className="flex gap-1 mt-3">
              <Input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <Button className="mt-2" disabled={status == "sending"}>
              send
            </Button>
            {status == "ok" && (
              <p className="text-emerald-600">Message sent ✅</p>
            )}
            {status == "error" && (
              <p className="text-red-600">Failed to send ❌</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
