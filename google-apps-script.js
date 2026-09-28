// ============================================================
// Google Apps Script — RSVP backend for Shanmukha & Bhanu wedding
// ============================================================
// SETUP (5 minutes):
// 1. Create a new Google Sheet
// 2. Name the first sheet "RSVPs"
// 3. Add headers in row 1: Timestamp | Name | Response | Guests | Kids | Events | Message
// 4. Go to Extensions → Apps Script
// 5. Delete any existing code, paste this entire file
// 6. Click Deploy → New deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Click Deploy, authorize when prompted
// 8. Copy the Web app URL (looks like https://script.google.com/macros/s/XXXXX/exec)
// 9. Paste that URL into rsvp.html where it says GOOGLE_SCRIPT_URL
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVPs');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.setName('RSVPs');
      sheet.appendRow(['Timestamp', 'Name', 'Response', 'Guests', 'Kids', 'Events', 'Message']);
    }

    var data = JSON.parse(e.postData.contents);

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
