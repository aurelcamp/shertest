import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(
    private storage: AngularFireStorage
  ) { }

  upload(base64String: string, name: string): Promise<string> {
    const fileRef = this.storage.ref(`properties/${name}`);
    const task = fileRef.putString(base64String, 'base64');

    // observe percentage changes
    // this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    return new Promise ((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(async () => {
          const url = await fileRef.getDownloadURL().toPromise();
          resolve(url);
        })
     )
    .subscribe()
    })
  }

  removeFile(downloadUrl: string) {
    return this.storage.storage.refFromURL(downloadUrl).delete();
  }
  
}
