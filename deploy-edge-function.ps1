# Deploy Edge Function to Supabase
# This script creates the send-otp-email function in your Supabase project

Write-Host "🚀 Deploying Edge Function to Supabase..." -ForegroundColor Cyan

# Read the function code
$functionCode = Get-Content -Path "supabase\functions\send-otp-email\index.ts" -Raw

# Your Supabase project details
$projectRef = "jkxnrbjasajvphewvamq"
$apiUrl = "https://api.supabase.com/v1/projects/$projectRef/functions"

# You need your Supabase Personal Access Token
Write-Host "⚠️  You need a Supabase Personal Access Token" -ForegroundColor Yellow
Write-Host "Get it from: https://app.supabase.com/account/tokens" -ForegroundColor Yellow
$accessToken = Read-Host "Enter your Supabase Personal Access Token"

# Create function payload
$payload = @{
    slug = "send-otp-email"
    name = "send-otp-email"
    body = $functionCode
    verify_jwt = $false
} | ConvertTo-Json -Depth 10

# Deploy
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    
    Write-Host "📤 Uploading function..." -ForegroundColor Cyan
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Headers $headers -Body $payload
    
    Write-Host "✅ Function deployed successfully!" -ForegroundColor Green
    Write-Host "Function ID: $($response.id)" -ForegroundColor Green
    
    Write-Host "`n🔑 Now setting the RESEND_API_KEY secret..." -ForegroundColor Cyan
    
    # Set the secret
    $secretUrl = "https://api.supabase.com/v1/projects/$projectRef/secrets"
    $secretPayload = @(
        @{
            name = "RESEND_API_KEY"
            value = "re_E5eJqVc4_Am7srce5DLaHmphW3ezkrhC1"
        }
    ) | ConvertTo-Json -Depth 10
    
    $secretResponse = Invoke-RestMethod -Uri $secretUrl -Method POST -Headers $headers -Body $secretPayload
    
    Write-Host "✅ Secret set successfully!" -ForegroundColor Green
    Write-Host "`n🎉 All done! Your Edge Function is deployed and ready to use!" -ForegroundColor Green
    Write-Host "Try voting on a poll now to test it!" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Full error: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

