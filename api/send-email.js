// api/send-email.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, subject, services, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: "Meno a email sú povinné!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || "Nová rezervácia z NZMOV",
      text: `
Meno: ${name}
Email: ${email}
Telefón: ${phone || "nevyplnené"}
Téma: ${subject || "nevyplnená"}
Služby: ${Array.isArray(services) ? services.join(", ") : services || "nevyplnené"}

Správa:
${message}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Chyba pri odosielaní mailu:", error);
    return res.status(500).json({ success: false, error: "Nepodarilo sa odoslať e-mail" });
  }
}
