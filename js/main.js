document.addEventListener("DOMContentLoaded", initApp);
function initApp() {

/**********************************************************************************/
/*                                  BG Gradient                                   */
/**********************************************************************************/

setInterval(() => {
    let deg = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--GRADIENT-DEG"));
    deg = (deg+1) % 360;
    document.documentElement.style.setProperty("--GRADIENT-DEG", deg + "deg");
}, 70);


/**********************************************************************************/
/*                                     Themes                                     */
/**********************************************************************************/

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
    if(localStorage.getItem("theme") === "light") toLightTheme();
    else toDarkTheme();
}
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    toDarkTheme();
} 
else {
    toLightTheme();
}


/**********************************************************************************/
/*                                  Image Input                                   */
/**********************************************************************************/

const imageTypes = ["image/png", "image/jpg", "image/jpeg", "image/svg"];
let uploadBtn = document.querySelector(".upload-btn");
let inputFile = document.getElementById('getFile');

uploadBtn.addEventListener("click", () => {
    inputFile.click();
});

inputFile.addEventListener("change", () => {
    checkFile(inputFile.files[0]);
});

async function checkFile(image) {
    if(imageTypes.indexOf(image.type) === -1) showError();
    else await predictImage(image);
}

function showError() {
    let errorMsg = document.querySelector(".error-message");
    errorMsg.style.setProperty("visibility", "visible");
    errorMsg.style.setProperty("animation", "none");
    setTimeout(() => errorMsg.style.setProperty("animation", "fade 1.5s 4s forwards"), 0);
}


/**********************************************************************************/
/*                                  Camera Input                                  */
/**********************************************************************************/

let webcam;
let webcamContainer = document.getElementById("webcam-container");
let cameraBtn = document.querySelector(".camera-btn");

cameraBtn.addEventListener("click", async () => {
    const flip = true;
    const width = 200;
    const height = 200;
    webcam = new tmImage.Webcam(width, height, flip);
    await webcam.setup();
    await webcam.play();
    webcamContainer.appendChild(webcam.canvas);
    window.requestAnimationFrame(loop);
});

async function loop() {
    webcam.update();
    // await predictCamera();
    window.requestAnimationFrame(loop);
}


/**********************************************************************************/
/*                                Teachable Machine                               */
/**********************************************************************************/

const URL = "./my_model/";
let model, labelContainer, maxPredictions;
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

let isIos = false; 
if (window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('iPad') > -1) isIos = true;

async function predictImage(image) {
    let prediction = await model.predict(image);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].textContent = classPrediction;
    }
}

async function predictCamera() {
    let prediction;
    if (isIos) prediction = await model.predict(webcam.webcam);
    else prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].textContent = classPrediction;
    }
}

async function initPrediction() {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

function initialUI() {
    const content = `
        <span><h2>Upload Image</h2></span>
        <p class="error-message">Image type not supported</p>
        <div class="upload-btn-container">
            <button class="upload-btn">Upload Image</button>
            <input id="getFile" name="getFile" type="file" accept=".jpg, .jpeg, .png, .svg">
            <div class="divider">
                <p><span>or</span></p>
            </div>
        </div>
        <div class="camera-btn-container">
            <button class="camera-btn" type="button">Use Camera</button>
        </div>`;

}

function resultUI() {

}

function webcamUI() {

}
}