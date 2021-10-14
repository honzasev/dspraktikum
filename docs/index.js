let net;

function preprocessImage(image) {
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([160, 160])
		.toFloat();
	return tensor.div(255)
			.expandDims();
}

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await tf.loadLayersModel('https://raw.githubusercontent.com/honzasev/dspraktikum/main/docs/export_model/model.json');
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('img');
  const result = await net.predict(preprocessImage(imgEl));
  const p_with = result.dataSync()[0];
  console.log('Prediction done');

  // For the assignment, change this
  // YOUR CODE STARTS HERE
  var pred = document.getElementById('pred');
  if (p_with < 0.5) {
      prob = ((1-p_with)*100).toFixed(2);
      pred.innerHTML = "<b>Without glasses</b> (probability=".concat(prob, "%)");
  } else {
    prob = (p_with*100).toFixed(2);
    pred.innerHTML = "<b>With glasses</b> (probability=".concat(prob, "%)");
  }
  /// YOUR CODE ENDS HERE

  return(p_with);
}

app();

// HTML5 image file reader 
if (window.FileReader) {
  function handleFileSelect(evt) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
          document.getElementById('image').innerHTML = ['<img id="img" crossorigin src="', e.target.result,'" title="', theFile.name, '" width="227"/>'].join('');
        };
      })(f);

      reader.readAsDataURL(f);
   
      app();
  }
} else {
  alert('This browser does not support FileReader');
}

// listener for a new image
document.getElementById('files').addEventListener('change', handleFileSelect, false);

