$token = "eyJhbGciOiJIUzI1NiJ9.eyJjbGluaWNJZCI6Mywicm9sZSI6Ik93bmVyIiwidXNlcklkIjoxMCwic3ViIjoic3FsaXRlIiwiaWF0IjoxNzUyNTczOTQzLCJleHAiOjE3NTI2NjAzNDN9.yJnG2Um2pN8E8rAHbZkSfrbSuoVaZExEq_fBYk0aG44"
$url = "https://localhost:8443/api/v1/patients"

For ($i = 1; $i -le 50; $i++) {
    $body = @{
        fullName = "Patient $i"
        phone = "010000000$i"
        dateOfBirth = "1990-01-01"
        medicalHistory = "Diabetes"
        age = 30
        address = "Clinic Street $i"
        notes = "Test entry $i"
    } | ConvertTo-Json -Depth 3

    Start-Job {
        param($url, $body, $token)
        Invoke-RestMethod -Uri $url -Method POST -Headers @{Authorization = "Bearer $token"} -Body $body -ContentType "application/json" -SkipCertificateCheck
    } -ArgumentList $url, $body, $token
}

# Wait for all jobs to finish
Get-Job | Wait-Job
"✅ Done sending 50 patient creation requests."

