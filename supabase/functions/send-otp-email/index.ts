import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
  email: string
  code: string
  pollTitle: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Log the request for debugging
    console.log('Request received:', {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    })

    // Read and parse the request body
    const contentType = req.headers.get('content-type') || ''
    console.log('Content-Type:', contentType)

    // Parse request body - try direct json() first
    let requestBody: EmailRequest
    try {
      requestBody = await req.json() as EmailRequest
      console.log('Parsed body via req.json():', requestBody)
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    const { email, code, pollTitle } = requestBody

    console.log('Extracted values:', { email, code, pollTitle })

    // Validate inputs
    if (!email || !code || !pollTitle) {
      console.error('Missing fields:', { email: !!email, code: !!code, pollTitle: !!pollTitle })
      throw new Error('Missing required fields: email, code, or pollTitle')
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      throw new Error('Invalid code format. Must be 6 digits.')
    }

    console.log('Validation passed, sending email via Resend...')
    console.log('Using API Key:', RESEND_API_KEY ? 'SET ✓' : 'NOT SET ✗')

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'UniVote <onboarding@resend.dev>',
        to: [email],
        subject: 'Verify Your Vote - Code Inside',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                          <h1 style="margin: 0; font-size: 32px; color: #667eea; font-weight: bold;">🗳️ UniVote</h1>
                        </div>
                        <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #333; text-align: center;">Verify Your Vote</h2>
                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #666; line-height: 1.6;">Hello,</p>
                        <p style="margin: 0 0 30px 0; font-size: 16px; color: #666; line-height: 1.6;">You're voting on: <strong style="color: #333;">${pollTitle}</strong></p>
                        <p style="margin: 0 0 20px 0; font-size: 16px; color: #666; line-height: 1.6; text-align: center;">Enter this verification code to confirm your vote:</p>
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; font-size: 42px; font-weight: bold; letter-spacing: 12px; margin: 30px 0; border-radius: 12px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">${code}</div>
                        <p style="margin: 0 0 30px 0; font-size: 14px; color: #999; text-align: center;">⏱️ This code expires in <strong>5 minutes</strong></p>
                        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                          <p style="margin: 0; font-size: 14px; color: #856404;"><strong>⚠️ Security Note:</strong> Never share this code with anyone. UniVote staff will never ask for your verification code.</p>
                        </div>
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                          <p style="margin: 0; font-size: 12px; color: #999; text-align: center;">If you didn't request this code, please ignore this email.</p>
                          <p style="margin: 10px 0 0 0; font-size: 12px; color: #999; text-align: center;">Powered by <a href="https://resend.com" style="color: #667eea; text-decoration: none;">Resend</a></p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    })

    const resendData = await resendResponse.json()
    console.log('Resend response status:', resendResponse.status)
    console.log('Resend response data:', resendData)

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData)
      throw new Error(resendData.message || 'Failed to send email')
    }

    console.log('✅ Email sent successfully:', resendData)

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('❌ Error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})

