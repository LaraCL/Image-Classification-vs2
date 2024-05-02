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
    // Das Bild als p5.Image-Objekt laden und anzeigen
    img = createImg(file.data, 'Uploaded Image', '', () => {
      img.size(200, 200);
      img.position(20, 200);

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
  }
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
