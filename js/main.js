document.addEventListener("DOMContentLoaded", initApp);
function initApp() {

//Background Gradient
setInterval(() => {
    let deg = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--GRADIENT-DEG"));
    deg = (deg+1) % 360;
    document.documentElement.style.setProperty("--GRADIENT-DEG", deg + "deg");
}, 70);

//Theme Toggle
let themeBtn = document.querySelector(".theme");
themeBtn.addEventListener("click", () => {
    if(themeBtn.classList.contains("light")) toDarkTheme();
    else toLightTheme();
});

function toLightTheme() {
    themeBtn.classList.add("light");
    themeBtn.classList.remove("dark");
    document.documentElement.classList.add("theme-light");
    document.documentElement.classList.remove("theme-dark");
    localStorage.setItem("theme", "light");
}

function toDarkTheme() {
    themeBtn.classList.remove("light");
    themeBtn.classList.add("dark");
    document.documentElement.classList.remove("theme-light");
    document.documentElement.classList.add("theme-dark");
    localStorage.setItem("theme", "dark");
}

//Default Theme
if(localStorage.getItem("theme")) {
    let currTheme = localStorage.getItem("theme");
    if(currTheme === "light") toLightTheme();
    else toDarkTheme();
}
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toDarkTheme();
} 
else {
    toLightTheme();
}

}

/* Populate the all fruits list with 

model.getTotalClasses()
*/


/* For use input

model.predict(
  image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
  flipped = false
)

model.predictTopK(
  image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
  maxPredictions = 10,
  flipped = false
)

*/


/* FOR WEBCAM
new tmImage.Webcam(
    width = 400,
    height = 400,
    flip = false,
)

*/





/* // More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
} */