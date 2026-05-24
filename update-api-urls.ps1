# PowerShell script to update all API URLs in frontend

$files = @(
    "frontend/src/components/ChatbotWidget.jsx",
    "frontend/src/components/ParkingDiscountOffer.jsx",
    "frontend/src/components/QuickBookModal.jsx",
    "frontend/src/pages/AdminDashboard.jsx",
    "frontend/src/pages/AdminLogin.jsx",
    "frontend/src/pages/BookingPage.jsx",
    "frontend/src/pages/CinemasPage.jsx",
    "frontend/src/pages/FoodBeveragePage.jsx",
    "frontend/src/pages/ForgotPasswordPage.jsx",
    "frontend/src/pages/PaymentPage.jsx",
    "frontend/src/pages/SeatSelection.jsx",
    "frontend/src/pages/SignupPage.jsx",
    "frontend/src/pages/ProfilePage.jsx",
    "frontend/src/pages/MyBookingsPage.jsx",
    "frontend/src/pages/LoyaltyPage.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Updating $file..."
        
        # Read file content
        $content = Get-Content $file -Raw
        
        # Add import if not present
        if ($content -notmatch "import.*API_URL.*from.*config") {
            # Find the last import statement
            $lines = $content -split "`n"
            $lastImportIndex = -1
            for ($i = 0; $i -lt $lines.Length; $i++) {
                if ($lines[$i] -match "^import ") {
                    $lastImportIndex = $i
                }
            }
            
            if ($lastImportIndex -ge 0) {
                $lines = $lines[0..$lastImportIndex] + "import { API_URL } from '../config';" + $lines[($lastImportIndex + 1)..($lines.Length - 1)]
                $content = $lines -join "`n"
            }
        }
        
        # Replace all localhost:5000 with ${API_URL}
        $content = $content -replace "'http://localhost:5000", "'`${API_URL}"
        $content = $content -replace '"http://localhost:5000', '"`${API_URL}'
        $content = $content -replace '`http://localhost:5000', '`${API_URL}'
        
        # Write back to file
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "Updated $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "All files updated successfully!"
