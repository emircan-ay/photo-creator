import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'VisionAI <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to VisionAI Studio! 🎨',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #6366f1;">Welcome to VisionAI! 🚀</h2>
          <p>Hi there,</p>
          <p>Your account has been successfully created. You're now ready to transform your product photos into studio-quality assets.</p>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">What's next?</p>
            <ul style="margin-top: 10px; padding-left: 20px;">
              <li>Upload your first product shot</li>
              <li>Apply AI studio lighting</li>
              <li>Export HD results</li>
            </ul>
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Go to Dashboard
          </a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            VisionAI Studio - The Future of E-commerce Photography
          </p>
        </div>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error };
    }
}
