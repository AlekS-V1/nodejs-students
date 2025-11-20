import nodemailer from 'nodemailer';

async function main() {
  const to = process.argv[2] || 'recipient@example.com';

  // Create a test account (Ethereal) — no real SMTP credentials required
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"NodeJS Students" <no-reply@example.com>',
    to,
    subject: 'Test SMTP message from nodejs-students',
    text: 'This is a test email sent using Ethereal (nodemailer).',
    html: '<p>This is a test email sent using <strong>Ethereal</strong> (nodemailer).</p>',
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

main().catch((err) => {
  console.error('Failed to send test email:', err);
  process.exit(1);
});
