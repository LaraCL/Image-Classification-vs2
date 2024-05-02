let classifier;
let img;
let resultDiv;
let classifyButton;

function setup() {
  createCanvas(400, 400);

  // Drag-and-Drop Bereich konfigurieren
  let dropZone = select('#drop_zone');
  dropZone.dragOver(highlight);
  dropZone.dragLeave(unhighlight);
  dropZone.drop(gotFile);

  // Ergebnisanzeige erstellen
  resultDiv = select('#result');

  // Button zum manuellen Starten der Klassifizierung
  classifyButton = select('#classifyButton');
  classifyButton.mousePressed(classifyImage);

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

      // Klassifizierung des Bildes aufrufen
      classifier.classify(img.elt, gotResult);
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
    resultDiv.html(`<strong>Label:</strong> ${results[0].label}<br><strong>Confidence:</strong> ${nf(results[0].confidence, 0, 2)}`);

    // Thumbnail im #thumbnail-Bereich anzeigen
    if (img) {
      let thumbnailElement = select('#thumbnail');
      thumbnailElement.html(''); // Vorhandenes Inhalt löschen
      img.show(); // Bild sichtbar machen
      img.size(200, 200); // Größe festlegen
      img.parent('thumbnail'); // Bild in #thumbnail-Bereich einfügen

      // Speichern der Klassifizierung
      let isCorrect = confirm('Ist die Klassifizierung korrekt?');
      saveClassification(isCorrect, results[0].label, results[0].confidence);
    }
  }
}
