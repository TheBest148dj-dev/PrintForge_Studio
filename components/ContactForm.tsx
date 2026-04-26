"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          fileType: formData.get("fileType"),
          quantity: formData.get("quantity"),
          deadline: formData.get("deadline"),
          finish: formData.get("finish"),
          subject: formData.get("subject"),
          message: formData.get("message")
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Opslaan mislukt");
      }

      form.reset();
      setStatus("success");
      setMessage("Je bericht is verzonden en staat nu in de admin inbox.");
    } catch {
      setStatus("error");
      setMessage("Er liep iets mis bij het verzenden van je bericht.");
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-grid two">
        <label className="field">
          <span>Naam</span>
          <input name="name" required placeholder="Jouw naam" />
        </label>
        <label className="field">
          <span>E-mail</span>
          <input name="email" type="email" required placeholder="naam@bedrijf.be" />
        </label>
      </div>
      <div className="form-grid two">
        <label className="field">
          <span>Bedrijf</span>
          <input name="company" placeholder="Optioneel" />
        </label>
        <label className="field">
          <span>Onderwerp</span>
          <input name="subject" required placeholder="Nieuwe offerte" />
        </label>
      </div>
      <div className="form-grid two">
        <label className="field">
          <span>Bestandstype</span>
          <select name="fileType" defaultValue="">
            <option value="" disabled>
              Kies bestandstype
            </option>
            <option value="STL">STL</option>
            <option value="STEP">STEP</option>
            <option value="OBJ">OBJ</option>
            <option value="3MF">3MF</option>
            <option value="Ander">Ander</option>
          </select>
        </label>
        <label className="field">
          <span>Aantal</span>
          <select name="quantity" defaultValue="">
            <option value="" disabled>
              Kies aantal
            </option>
            <option value="1 stuk">1 stuk</option>
            <option value="2-5 stuks">2-5 stuks</option>
            <option value="6-10 stuks">6-10 stuks</option>
            <option value="11-25 stuks">11-25 stuks</option>
            <option value="25+ stuks">25+ stuks</option>
          </select>
        </label>
      </div>
      <div className="form-grid two">
        <label className="field">
          <span>Deadline</span>
          <select name="deadline" defaultValue="">
            <option value="" disabled>
              Kies deadline
            </option>
            <option value="Zo snel mogelijk">Zo snel mogelijk</option>
            <option value="Binnen 2 werkdagen">Binnen 2 werkdagen</option>
            <option value="Binnen 5 werkdagen">Binnen 5 werkdagen</option>
            <option value="Binnen 2 weken">Binnen 2 weken</option>
            <option value="Geen harde deadline">Geen harde deadline</option>
          </select>
        </label>
        <label className="field">
          <span>Gewenste afwerking</span>
          <select name="finish" defaultValue="">
            <option value="" disabled>
              Kies afwerking
            </option>
            <option value="Standaard print">Standaard print</option>
            <option value="Mat">Mat</option>
            <option value="Geschuurd">Geschuurd</option>
            <option value="Branded kleur">Branded kleur</option>
            <option value="Premium afwerking">Premium afwerking</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Bericht</span>
        <textarea name="message" required placeholder="Vertel wat je wil laten maken..." />
      </label>
      <div className="button-row">
        <button className="button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Versturen..." : "Bericht verzenden"}
        </button>
      </div>
      {message ? (
        <p
          style={{
            margin: 0,
            color: status === "error" ? "#a72c17" : "#145c47"
          }}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
