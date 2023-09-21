let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let transparentColor = "transparent";


let recorder;
let chunks = []; //media data in chunks


let constraints =  {
    video: true,
    audio: false
}
//navigator - global, gives browser info
//media devices - The MediaDevices interface provides access to connected media input devices like cameras and microphones, as well as screen sharing. In essence, it lets you obtain access to any hardware source of media data.
//getUserMedia - With the user's permission through a prompt, turns on a camera and/or a microphone on the system and provides a MediaStream containing a video track and/or an audio track with the input.

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;
 
    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start", (e) => {
        chunks = [];
    })
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop", (e) => {
        //conversion of media chunks data to video
        let blob = new Blob(chunks, {type: "video/mp4"}); //blob = represents data in type files

        if(db){
            let videoID = shortid();
            let dbTransaction = db.transaction("video", "readwrite");//transcation(request)performs forvideo objectStore
            let videoStore = dbTransaction.objectStore("video"); //access video objectStore
            let videoEntry = {
                id: `vid-${videoID}`,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }
        
        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "stream.mp4";
        // a.click();
    })
})

recordBtnCont.addEventListener("click", (e) => {
    if(!recorder) return;

    recordFlag = !recordFlag;
    if(recordFlag){ //start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    } 
    else{     //stop
       recorder.stop();
       recordBtn.classList.remove("scale-record");
       stopTimer();
    }
})

//The Canvas API provides a means for drawing graphics via JavaScript and the HTML <canvas> element. Among other things, it can be used for animation, game graphics, data visualization, photo manipulation, and real-time video processing.
captureBtnCont.addEventListener("click", (e) => {
    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");//HTMLCanvasElement.getContext() method returns a drawing on the canvas
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);//.drawImage() method of the Canvas 2D API provides different ways to draw an image onto the canvas

    //Filtering the image
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    if(db){
        let imageID = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image"); 
        let imageEntry = {
            id: `img-${imageID}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }

   setTimeout(() => {
    captureBtn.classList.remove("scale-capture");
   }, 500)

})

 let timerID;
 let counter = 0; //Represents total seconds
 let timer = document.querySelector(".timer");
 function startTimer(){
    timer.style.display = "block";
    function displayTimer(){
       let hours = Number.parseInt(counter / 3600);
       counter = counter % 3600;

       let minutes = Number.parseInt(counter / 60);
       counter = counter % 60;

       let seconds = counter;

       //for representing in this format 00: 00: 00
       hours = (hours < 10) ? `0${hours}` : hours;       
       minutes = (minutes < 10) ? `0${minutes}` : minutes;       
       seconds = (seconds < 10) ? `0${seconds}` : seconds;       


       timer.innerText = `${hours}:${minutes}:${seconds}`;
 
       counter++;

    }
    timerID = setInterval(displayTimer, 1000);
 }

 function stopTimer(){
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
 }

 //Filtering logic
 let filterLayer = document.querySelector(".filter-layer");
 let allFilters = document.querySelectorAll(".filter");
 allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        //get style (background color of filter elem)
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor; //set background color on filter layer
    })
 })

 