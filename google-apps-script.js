// ============================================================
// Google Apps Script — RSVP backend for Shanmukha & Bhanu wedding
// ============================================================
// SETUP:
// 1. Create a new Google Sheet, name the first sheet "RSVPs"
// 2. Add headers in row 1: Timestamp | Name | Response | Guests | Kids | Events | Message
// 3. Extensions → Apps Script → paste this file
// 4. Deploy → New deployment → Web app → Execute as: Me → Who: Anyone
// 5. Copy the URL into rsvp.html GOOGLE_SCRIPT_URL
//
// IMPORTANT: After editing this script, you must:
//   Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.setName('RSVPs');
      sheet.appendRow(['Timestamp', 'Name', 'Response', 'Guests', 'Kids', 'Events', 'Message']);
    }

    var raw = e.parameter.data || e.postData.contents;
    var data = JSON.parse(raw);

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
      data.guestName || '',
      data.response || '',
      data.guestCount || '',
      data.kidsCount || '',
      (data.events || []).join(', '),
      data.note || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('RSVP endpoint is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}
