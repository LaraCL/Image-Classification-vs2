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
  classifier = ml5.imageClassifier('MobileNet', () => {
    console.log('Image Classifier geladen.');
  });
}

function gotFile(file) {
  if (file.type === 'image') {
    // Das Bild als p5.Element-Objekt erstellen
    img = createImg(file.data, 'Uploaded Image', '', () => {
      img.hide(); // Bild vorübergehend ausblenden
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

    // Thumbnail-Anzeige
    let thumbnailElement = select('#thumbnail');
    thumbnailElement.html(''); // Vorhandenes Inhalt löschen
    img.show(); // Bild sichtbar machen
    img.size(200, 200); // Größe festlegen
    img.parent('thumbnail'); // Bild in #thumbnail-Bereich einfügen

    // Ergebnis in Tabellenform anzeigen
    let resultTable = createTable();
    resultTable.addColumn('string');
    resultTable.addColumn('string');
    resultTable.addColumn('number');

    let row = resultTable.addRow();
    row.setString(0, `<img src="${img.elt.src}" width="100">`);
    row.setString(1, results[0].label);
    row.setNum(2, results[0].confidence);

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
