# PowerShell script to transform workbook data
Write-Host "🔄 Starting PowerShell transform..."

try {
    $workbookPath = "c:/Users/pizza/Downloads/Meridian_Mastery_FULL_WORKBOOK_FINAL_REVIEW.json"
    $outputPath = "./src/data/flashcards.json"
    
    Write-Host "📖 Reading workbook data..."
    $workbookContent = Get-Content $workbookPath -Raw
    $workbookData = $workbookContent | ConvertFrom-Json
    
    Write-Host "📊 Found $($workbookData.'All Points (Master)'.Count) points"
    
    $flashcards = @()
    $counter = 1
    
    foreach ($point in $workbookData.'All Points (Master)') {
        $meridianName = $point.'Meridian Name'
        
        # Determine meridian and element
        $meridian = ""
        $element = ""
        
        if ($meridianName -like "*Lung*") { $meridian = "Lung"; $element = "metal" }
        elseif ($meridianName -like "*Large Intestine*") { $meridian = "Large Intestine"; $element = "metal" }
        elseif ($meridianName -like "*Stomach*") { $meridian = "Stomach"; $element = "earth" }
        elseif ($meridianName -like "*Spleen*") { $meridian = "Spleen"; $element = "earth" }
        elseif ($meridianName -like "*Heart*" -and $meridianName -notlike "*Small*") { $meridian = "Heart"; $element = "fire" }
        elseif ($meridianName -like "*Small Intestine*") { $meridian = "Small Intestine"; $element = "fire" }
        elseif ($meridianName -like "*Bladder*") { $meridian = "Bladder"; $element = "water" }
        elseif ($meridianName -like "*Kidney*") { $meridian = "Kidney"; $element = "water" }
        elseif ($meridianName -like "*Pericardium*") { $meridian = "Pericardium"; $element = "fire" }
        elseif ($meridianName -like "*Triple*") { $meridian = "Triple Heater"; $element = "fire" }
        elseif ($meridianName -like "*Gallbladder*") { $meridian = "Gallbladder"; $element = "wood" }
        elseif ($meridianName -like "*Liver*") { $meridian = "Liver"; $element = "wood" }
        elseif ($meridianName -like "*Governing*") { $meridian = "Governing Vessel"; $element = "extraordinary" }
        elseif ($meridianName -like "*Conception*") { $meridian = "Conception Vessel"; $element = "extraordinary" }
        else { $meridian = $meridianName; $element = "other" }
        
        $flashcard = @{
            id = $counter
            number = $point.'Point Number'
            nameHangul = $point.'Korean Name (Hangul)'
            nameRomanized = $point.'Romanized Korean'
            nameEnglish = $point.'English Translation (Verified)'
            meridian = $meridian
            element = $element
            location = $point.'Anatomical Location'
            healingFunction = $point.'Healing Function'
            martialApplication = $point.'Martial Application'
            insight = "Traditional pressure point from $meridian meridian with both healing and martial applications"
            tcmActions = @($point.'Healing Function'.Split(',')[0].Trim())
            indications = @()
        }
        
        $flashcards += $flashcard
        $counter++
        
        if ($counter % 50 -eq 0) {
            Write-Host "✅ Processed $counter points..."
        }
    }
    
    $output = @{
        flashcards = $flashcards
    }
    
    Write-Host "💾 Writing $($flashcards.Count) flashcards to file..."
    $output | ConvertTo-Json -Depth 10 | Out-File $outputPath -Encoding UTF8
    
    Write-Host "🎉 Successfully transformed $($flashcards.Count) points!"
    Write-Host "📁 Saved to: $outputPath"
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
