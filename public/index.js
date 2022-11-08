
let canvasSize = [640 * 2, 480]
let img;
let capture;
let predictions = [];
let handpose;
let indexFingerTip;
let thumbTip;
let mode = "default"
let bshowImage=false;
let pg;
let prevPoint=[];

function preload() {
    //load image
    img = loadImage("./assets/lake.jpg");
}

function setup() {
    //create canvas
    createCanvas(...canvasSize);
    //set up video capture
    let constraints = {
        video: {
            mandatory: {
                minWidth: 640,
                minHeight: 480
            },
            optional: [{ maxFrameRate: 30 }]
        },
        audio: false
    };
    capture = createCapture(constraints, function (stream) {
        console.log(stream)
    });
    capture.hide();
    //set up  ml5 model
    handpose = ml5.handpose(capture, { flipHorizontal: true }, () => {
        console.log("model Ready")
    });
    // got ml5 result
    handpose.on('hand', results => {
        if (results.handInViewConfidence < 0.8) return;
        predictions = results;
        if (results.length != 0) {
            indexFingerTip = results[0].annotations.indexFinger[3];
            thumbTip = results[0].annotations.thumb[3];
        }
    });

    //capture.size(640,480);
    //capture.hide();
}

function Update() {

}

function draw() {
    Update();
    switch (mode) {
        case 'view': //view image mode
            {
                image(img, 0, 0)
                filter(BLUR, 3);
                if (indexFingerTip) {
                    region = img.get(indexFingerTip[0] - 50, indexFingerTip[1] - 50, 100, 100);
                    image(region, indexFingerTip[0] - region.width / 2, indexFingerTip[1] - region.height / 2, region.width, region.height);
                }
            }
            break;
        case "freehand": //fresshand mode
            {
                if(bshowImage===false){
                    pg=createGraphics(...canvasSize)
                    pg.image(img, 0, 0)
                    bshowImage=true;
                }
                if(prevPoint.length==0){
                    prevPoint[0]=indexFingerTip[0];
                    prevPoint[1]=indexFingerTip[1];
                    break;
                }
                pg.line(prevPoint[0],prevPoint[1],indexFingerTip[0],indexFingerTip[1]);
                prevPoint[0]=indexFingerTip[0];
                prevPoint[1]=indexFingerTip[1]
                image(pg,0,0);
            }
            break;
        case "circle": //draw circle mode
            {
                if(bshowImage===false){
                    pg=createGraphics(...canvasSize)
                    pg.image(img, 0, 0)
                    bshowImage=true;
                }
                radius=map(dist(indexFingerTip[0],indexFingerTip[1],thumbTip[0],thumbTip[1]),0,100,1,20);
                pg.ellipse(indexFingerTip[0],indexFingerTip[1],radius);
                image(pg,0,0);
            }
            break;
        case 'default':
            image(img, 0, 0)
            break;
    }
    push() // draw capture video
    {
        translate(640 * 2, 0)
        scale(-1, 1)
        image(capture, 0, 0, 640, 480);
    }
    pop()
    // draw the indicator
    fill(255, 0, 0);
    if (indexFingerTip) {
        ellipse(indexFingerTip[0], indexFingerTip[1], 10); // for image
        ellipse(indexFingerTip[0] + 640, indexFingerTip[1], 10); //for video
    }


}

function keyPressed() { //keypress for switching mode
    console.log(indexFingerTip)
    console.log(predictions)
    switch (key) {
        case 'v':
            mode = "view"
            break;
        case 'f':
            mode = "freehand";
            bshowImage=false;
            prevPoint=[];
            break;
        case 'c':
            mode = 'circle'
            bshowImage=false;
            break;
        case 'e':
            mode = "default"
            break;
    }
}


