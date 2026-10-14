#!/usr/bin/env bash
# Rebuild the resume: build_resume.js -> .docx -> .pdf, then confirm it is still one page.
set -euo pipefail
cd "$(dirname "$0")"

node -e "require('docx')" 2>/dev/null || npm install --no-save docx >/dev/null
node build_resume.js Tony_Tshandu_Resume.docx
soffice --headless --convert-to pdf Tony_Tshandu_Resume.docx >/dev/null 2>&1

pages=$(pdfinfo Tony_Tshandu_Resume.pdf | awk '/^Pages:/ {print $2}')
dashes=$(unzip -p Tony_Tshandu_Resume.docx word/document.xml | { grep -o $'—\|–' || true; } | wc -l)
echo "pages=$pages dashes=$dashes"
[ "$pages" = "1" ] || { echo "FAIL: resume is $pages pages, must be 1"; exit 1; }
[ "$dashes" = "0" ] || { echo "FAIL: found $dashes em/en dashes"; exit 1; }
echo "OK"
