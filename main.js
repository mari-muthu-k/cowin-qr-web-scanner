var mCameras,mSelectedCamera;

let opts = { video: document.getElementById('preview'),mirror:false};
let scanner = new Instascan.Scanner(opts);
scanner.addListener('scan', function (data) {
  const zip = new JSZip();
      zip.loadAsync(data).then((contents) => {
          return contents.files["certificate.json"].async('text')
      }).then(function (contents) {
          console.log(contents);
      }).catch(err => {
         console.log(err);
      }
    );
});

Instascan.Camera.getCameras().then(function (cameras) {
  if (cameras.length > 0) {
    mCameras = cameras;
    mSelectedCamera = (cameras[1] == undefined || cameras[1] ==null)? 0:1;
    scanner.start(cameras[mSelectedCamera]).then(()=>{
      document.getElementById("switch").style.opacity = 1;
    });
  } else {
   document.getElementById('error').innerHTML = "No cameras found";
  }
}).catch(function (e) {
  document.getElementById('error').innerHTML = "something went wrong";
});


function switchCamera(){
  if(mCameras.length <2){
    document.getElementById("error").innerHTML = 'unable to switch the camera';
    return false;
  }
  //If device have 3 or more cameras
  else if(mCameras.length >2 && mCameras.length%2 != 0){
      mSelectedCamera = (mCameras[mSelectedCamera+2] == undefined || mCameras[mSelectedCamera+2] == null) ? mSelectedCamera-1: mSelectedCamera+2;
  }
  //If device have only 2 camera
  else{
   mSelectedCamera = (mCameras[mSelectedCamera+1] == undefined || mCameras[mSelectedCamera+1] == null) ? 0: mSelectedCamera+1;   
  }
  scanner.start(mCameras[mSelectedCamera]);
  return true;
}