import { Injectable } from '@angular/core';
// import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, 
//   CameraPhoto, CameraSource } from '@capacitor/core';
import { Platform } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
// import { Storage } from '@capacitor/storage';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(
    private platform: Platform
  ) { }

  async pickPhoto() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera, 
      quality: 80,
      width: 800,
      height: 800,
      correctOrientation: true,
      preserveAspectRatio: true,
    });

    return capturedPhoto;
  }

  private async savePicture(cameraPhoto: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    console.log(base64Data);
  
    // // Write the file to the data directory
    // const fileName = new Date().getTime() + '.jpeg';
    // const savedFile = await Filesystem.writeFile({
    //   path: fileName,
    //   data: base64Data,
    //   directory: FilesystemDirectory.Data
    // });
  
    // // Use webPath to display the new image instead of base64 since it's
    // // already loaded into memory
    // return {
    //   filepath: fileName,
    //   webviewPath: cameraPhoto.webPath
    // };
  }

  async readAsBase64(cameraPhoto: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });

      console.log(file);
  
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        const res = (reader.result as string).replace(/^data:image\/(png|jpg);base64,/, "");
        resolve(res);
    };
    reader.readAsDataURL(blob);
  });
}

// export interface Photo {
//   filepath: string;
//   webviewPath: string;
// }
