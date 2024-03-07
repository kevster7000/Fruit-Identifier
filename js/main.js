document.addEventListener("DOMContentLoaded", initApp);
async function initApp() {

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
let uploadContainer = document.querySelector(".upload-container");
let cameraBtn = document.querySelector(".camera-btn");

cameraBtn.addEventListener("click", initCamera);

async function initCamera() {
    await webcamUI();
    const webcamContainer = uploadContainer.querySelector("#webcam");

    const flip = true;
    const width = webcamContainer.offsetWidth;
    const height = webcamContainer.offsetHeight;
    webcam = new tmImage.Webcam(width, height, flip);
    await webcam.setup();
    await webcam.play();
    
    uploadContainer.querySelector("#webcam").appendChild(webcam.canvas);
    window.requestAnimationFrame(loop);
}

async function loop() {
    webcam.update();
    await predictCamera();
    setTimeout(() => {
        window.requestAnimationFrame(loop);
    }, 120);
}


/**********************************************************************************/
/*                                Teachable Machine                               */
/**********************************************************************************/

const URL = "https://teachablemachine.withgoogle.com/models/buZqURmyD/";
const maxPredictions = 10;
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";
let model;

async function predictImage(image) {
    await resultUI(image);
    await initModel();

    let inputImg = document.querySelector(".result-container img");
    let prediction = await model.predictTopK(inputImg, maxPredictions);

    let labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {
        let name = prediction[i].className;
        if(name === "Pommelo") name = "Pomelo";

        const percent = (prediction[i].probability * 100);
        labelContainer.innerHTML += `<li style="--FRUIT-PERCENT: ${percent.toFixed(2)}%; --FRUIT-COLOR: var(--${name.toUpperCase().replaceAll(" ", "-")})"><span>${name}: ${Math.round(percent)}%</span></li>`;

        if(i === 0) {
            const resultText = document.querySelector(".result-text");
            const firstChar = name[0].toUpperCase();
            const isVowel = firstChar === "A" || firstChar === "E" || firstChar == "I" || firstChar === "O" || firstChar === "U";
            
            resultText.innerHTML = `Your Fruit is a${isVowel ? "n" : ""} <span style="--FRUIT-COLOR: var(--${name.toUpperCase().replaceAll(" ", "-")}">${name}</span>`;
        }
    }
}

async function predictCamera() {
    await initModel();
    let prediction = await model.predictTopK(webcam.canvas, maxPredictions);

    let labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {
        let name = prediction[i].className;
        if(name === "Pommelo") name = "Pomelo";
        const percent = (prediction[i].probability * 100);
        labelContainer.innerHTML += `<li style="--FRUIT-PERCENT: ${percent.toFixed(2)}%; --FRUIT-COLOR: var(--${name.toUpperCase().replaceAll(" ", "-")})"><span>${name}: ${Math.round(percent)}%</span></li>`;
    }
}

async function initModel() {
    model = await tmImage.load(modelURL, metadataURL);
}


/**********************************************************************************/
/*                                    UI States                                   */
/**********************************************************************************/

async function initialUI() {
    const content = `
        <span><h2>Upload Image</h2></span>
        <p class="error-message">Image type not supported</p>
        <div class="upload-btn-container">
            <button class="upload-btn" type="button">Upload Image</button>
            <input id="getFile" name="getFile" type="file" accept=".jpg, .jpeg, .png, .svg">
            <div class="divider">
                <p><span>or</span></p>
            </div>
        </div>
        <div class="camera-btn-container">
            <button class="camera-btn" type="button">Use Camera</button>
        </div>
    `;

    uploadContainer.innerHTML = content;

    let uploadBtn = document.querySelector(".upload-btn");
    let inputFile = document.getElementById('getFile');
    let cameraBtn = document.querySelector(".camera-btn");

    uploadBtn.addEventListener("click", () => {
        inputFile.click();
    });

    inputFile.addEventListener("change", () => {
        checkFile(inputFile.files[0]);
    });

    cameraBtn.addEventListener("click", initCamera);
}

async function resultUI(image) {
    uploadContainer.classList.add("result");

    const content = `
        <span><h2>Upload Image</h2></span>
        <p class="result-text">Your Fruit is</p>
        <div class="button-container">
            <div>
                <p class="error-message">Image type not supported</p>
                <p>Try Another</p>
            </div>
            <div class="upload-btn-container">
                <div>
                    <button class="upload-btn" type="button">Upload Image</button>
                    <input id="getFile" name="getFile" type="file" accept=".jpg, .jpeg, .png, .svg">
                </div>
                <div class="camera-btn-container">
                    <button class="camera-btn" type="button">Use Camera</button>
                </div>
            </div>
        </div>
        <div class="result-container">
            <div class="user-image"></div>
            <img src="" alt="">
            <ol id="label-container">
            </ol>
        </div>
    `;

    uploadContainer.innerHTML = content;

    let uploadBtn = document.querySelector(".upload-btn");
    let inputFile = document.getElementById('getFile');
    let cameraBtn = document.querySelector(".camera-btn");
    let inputImg = document.querySelector(".user-image");
    let tempImg = document.querySelector(".result-container img");

    tempImg.src = window.URL.createObjectURL(image);
    inputImg.style.setProperty("background-image", `url('${window.URL.createObjectURL(image)}')`);

    uploadBtn.addEventListener("click", () => {
        inputFile.click();
    });

    inputFile.addEventListener("change", () => {
        checkFile(inputFile.files[0]);
    });

    cameraBtn.addEventListener("click", () => {
        initCamera();
        uploadContainer.classList.remove("result");
    });
}

async function webcamUI() {
    const content = `
        <span><h2>Upload Image</h2></span>
        <div class="webcam-header">
            <button type="button">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">
                    <line x1="20" x2="80" y1="50" y2="50" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" />
                    <line x1="20" x2="20" y1="20" y2="50" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" transform="rotate(45, 20, 50)"/>
                    <line x1="20" x2="20" y1="20" y2="50" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" transform="rotate(135, 20, 50)"/>
                </svg>
                <p>Back</p>
            </button>
        </div>
        <div class="webcam-body">
            <div id="webcam"></div>
            <ol id="label-container">
            </ol>
        </div>
    `;

    uploadContainer.innerHTML = content;

    let backBtn = document.querySelector(".webcam-header button");
    backBtn.addEventListener("click", async () => {
        webcam.stop();
        await initialUI();
    });
}
}