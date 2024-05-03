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

  // Buttons für die Klassifizierung
  classifyButton = select('#classifyButton');
  classifyButton.mousePressed(classifyImage);

  correctButton = select('#correctButton');
  correctButton.mousePressed(() => { saveClassification(true); });

  incorrectButton = select('#incorrectButton');
  incorrectButton.mousePressed(() => { saveClassification(false); });

  // Image Classifier mit MobileNet initialisieren
  classifier = ml5.imageClassifier('MobileNet', modelLoaded);
}

function modelLoaded() {
  console.log('Image Classifier geladen.');
}

function gotFile(file) {
  if (file.type === 'image') {
    // Das Bild als p5.Element-Objekt erstellen und im Drag-and-Drop-Feld anzeigen
    img = createImg(file.data, 'Uploaded Image', '', () => {
      img.hide(); // Bild vorübergehend ausblenden
      img.size(200, 200); // Größe festlegen
      img.parent('drop_zone'); // Bild in #drop_zone-Bereich einfügen
    });
  } else {
    console.log('Es wurde keine Bilddatei hochgeladen.');
  }
}

function classifyImage() {
  if (img) {
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
    resultDiv.html(''); // Vorheriges Ergebnis löschen

    // Ergebnis in Tabellenform anzeigen
    let resultTable = createTable();
    resultTable.addColumn('string');
    resultTable.addColumn('string');
    resultTable.addColumn('number');

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

function saveClassification(isCorrect) {
  // Hier könnten Sie den Klassifizierungsstatus speichern
  console.log('Klassifizierung:', isCorrect ? 'Richtig' : 'Falsch');
}

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
