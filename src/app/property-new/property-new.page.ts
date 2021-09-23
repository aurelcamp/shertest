import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Property } from '../models/property';
import { CameraService } from '../services/camera.service';
import { UploadFileService } from '../services/upload-file.service';

@Component({
  selector: 'app-property-new',
  templateUrl: './property-new.page.html',
  styleUrls: ['./property-new.page.scss'],
})
export class PropertyNewPage implements OnInit {

  property: Property = new Property();

  photos: Photo[] = [];

  constructor(
    private afs: AngularFirestore,
    private cameraService: CameraService,
    private uploadFileService: UploadFileService,
  ) { }

  ngOnInit() {
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    console.log(image);
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
  
    // Can be set to the src of an image now
    // imageElement.src = imageUrl;

    // console.log(imageUrl);

    // this.photos.unshift({
    //   // filepath: "soon...",
    //   webPath: image.webPath
    // });

    this.photos.unshift(image);
  }

  async validate() {
    // upload file

    const promises = [];
    this.photos.forEach(async (photo: Photo) => {
      const promise = this.cameraService.readAsBase64(photo)
        .then((base64String: string) => {
          const name = `${'aa'}_${(new Date()).getTime()}.${photo.format}`;
          return this.uploadFileService.upload(base64String, name);
        })
      promises.push(promise);
    })
    // const photo = this.photos[0];
    // const base64String = await this.cameraService.readAsBase64(photo);
    // const name = `${'aa'}_${(new Date()).getTime()}.${photo.format}`;
    // const url = await this.uploadFileService.upload(base64String, name);

    const urls = await Promise.all(promises);
    console.log(urls);

    const property: Property = { ...this.property, imageUrls: urls };
    this.afs.collection<Property>('properties').add(property);
  }

}
