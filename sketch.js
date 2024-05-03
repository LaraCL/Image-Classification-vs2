let classifier;
let img;
let resultDiv;
let classifyButton;
let correctButton;
let incorrectButton;
function setup() {
  createCanvas(400, 400);
  // Drag-and-Drop Bereich konfigurieren
  let dropZone = select('#drop_zone');
  dropZone.dragOver(highlight);
  dropZone.dragLeave(unhighlight);
  dropZone.drop(gotFile);
   // Ergebnisanzeige erstellen
   resultDiv = select('#result');

   // Buttons für Klassifizierung
   // Buttons für die Klassifizierung
   classifyButton = select('#classifyButton');
   classifyButton.mousePressed(() => { classifyImage(null); }); // Null bedeutet automatische Klassifizierung
   
   classifyButton.mousePressed(classifyImage);

   correctButton = select('#correctButton');
   correctButton.mousePressed(() => { classifyImage(true); });

   incorrectButton = select('#incorrectButton');
   incorrectButton.mousePressed(() => { classifyImage(false); });

   // Image Classifier mit MobileNet initialisieren
   classifier = ml5.imageClassifier('MobileNet', () => {
    console.log('Image Classifier geladen.');
  });
}
function gotFile(file) {
  if (file.type === 'image') {
     // Das Bild als p5.Element-Objekt erstellen
     img = createImg(file.data, 'Uploaded Image', '', () => {
       img.hide(); // Bild vorübergehend ausblenden

       // Größe des Thumbnails festlegen
       let thumbnailSize = 200;

       // Berechne die Position des Thumbnails in der Mitte des drop_zone
       let dropX = dropZone.position().x;
       let dropY = dropZone.position().y;
       let x = dropX + (dropZone.width - thumbnailSize) / 2;
       let y = dropY + (dropZone.height - thumbnailSize) / 2;

       // Bild anzeigen und positionieren
       img.size(thumbnailSize, thumbnailSize);
       img.position(x, y);

       // Klassifizierung des Bildes aufrufen, wenn automatische Klassifizierung nicht aktiviert ist
       if (classifyButton.elt.disabled) {
         classifier.classify(img.elt, gotResult);
       }
     });
   } else {
     console.log('Es wurde keine Bilddatei hochgeladen.');
   }
 }

 function classifyImage(isCorrect) {
 function classifyImage() {
   if (img) {
     if (isCorrect !== null) {
       // Bild manuell klassifizieren (korrekt oder falsch)
       saveClassification(isCorrect);
     } else {
       // Automatische Klassifizierung auslösen
       classifier.classify(img.elt, gotResult);
     }
     classifier.classify(img.elt, gotResult);
   } else {
     console.log('Es wurde noch kein Bild hochgeladen.');
   }
}
function gotResult(error, results) {
  if (error) {
     console.error(error);
   } else {
     // Ergebnis anzeigen
     resultDiv.html(`<strong>Label:</strong> ${results[0].label}<br><strong>Confidence:</strong> ${nf(results[0].confidence, 0, 2)}`);
     // resultDiv.html('');

     // Thumbnail im #thumbnail-Bereich anzeigen
     // Thumbnail-Anzeige
     let thumbnailElement = select('#thumbnail');
     thumbnailElement.html(''); // Vorhandenes Inhalt löschen
     img.show(); // Bild sichtbar machen
     img.size(200, 200); // Größe festlegen
     img.parent('thumbnail'); // Bild in #thumbnail-Bereich einfügen
   }
 }

 function saveClassification(isCorrect) {
   // Speichern der Klassifizierung (richtig oder falsch)
   let data = {
     label: resultDiv.elt.textContent.split(':')[1].trim(),
     confidence: parseFloat(resultDiv.elt.textContent.split(':')[3].trim()),
     thumbnailUrl: img.elt.src,
     isCorrect: isCorrect
   };

   let classificationsKey = isCorrect ? 'correctClassifications' : 'incorrectClassifications';
   let classifications = JSON.parse(localStorage.getItem(classificationsKey)) || [];
   classifications.push(data);
   localStorage.setItem(classificationsKey, JSON.stringify(classifications));

   // Aktualisiere die Tabellen mit den letzten Klassifizierungen
   loadLastClassifications();
 }

 // Funktion zum Laden der letzten Klassifizierungen in die Tabellen
 function loadLastClassifications() {
   let correctClassifications = JSON.parse(localStorage.getItem('correctClassifications')) || [];
   let incorrectClassifications = JSON.parse(localStorage.getItem('incorrectClassifications')) || [];

   fillTable('correctBody', correctClassifications);
   fillTable('incorrectBody', incorrectClassifications);
 }

 // Hilfsfunktion zum Füllen einer Tabelle mit Klassifizierungsdaten
 function fillTable(tableId, data) {
   let tableBody = document.getElementById(tableId);
   tableBody.innerHTML = ''; // Tabelle leeren

   data.slice(-3).forEach(item => {
     let row = tableBody.insertRow();
     let thumbnailCell = row.insertCell(0);
     let labelCell = row.insertCell(1);
     let confidenceCell = row.insertCell(2);

     thumbnailCell.innerHTML = `<img src="${item.thumbnailUrl}" width="100">`;
     labelCell.textContent = item.label;
     confidenceCell.textContent = nf(item.confidence, 0, 2);
   });
     // Ergebnis in Tabellenform anzeigen
     let resultTable = createTable();
     let row = resultTable.addRow();
     row.addCell(`<img src="${img.elt.src}" width="100">`);
     row.addCell(results[0].label);
     row.addCell(nf(results[0].confidence, 0, 2));

     resultDiv.child(resultTable);

     // Buttons für korrekte und inkorrekte Klassifizierung anzeigen
     correctButton.style('display', 'inline');
     incorrectButton.style('display', 'inline');
   }
 }

 // Drag-and-Drop-Stilfunktionen
 function highlight() {
   select('#drop_zone').style('background-color', '#eee');
 }
function unhighlight() {
  select('#drop_zone').style('background-color', '');
}
// Verhindern des Standardverhaltens beim Drag-and-Drop
window.ondragover = function (e) {
  e.preventDefault();
  return false;
};
window.ondrop = function (e) {
   e.preventDefault();
   return false;
 };

 // Laden der letzten Klassifizierungen beim Laden der Seite
 window.onload = loadLastClassifications;
