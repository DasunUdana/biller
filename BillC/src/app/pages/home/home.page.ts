import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, AlertController, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { AppServiceService } from "../../services/app-service.service"
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { Crop } from '@ionic-native/crop/ngx';
import { AngularFireStorage } from '@angular/fire/storage';

const STORAGE_KEY = "my_images";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  base64Image = '';

  isLoading = false;

  images: any = [];
  propicurl: any;

  constructor(private camera: Camera, 
    private appService: AppServiceService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private httpClient: HttpClient,
    private loadingController: LoadingController,
    private webview: WebView,
    private ref: ChangeDetectorRef,
    private toastController: ToastController,
    public actionSheetController: ActionSheetController,
    public popoverController: PopoverController,
    private file: File,
    private crop: Crop,
    private storage: AngularFireStorage,
    ) { }

  ngOnInit() {
  }

  takePhoto(sourceType: number) {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType
    }

    this.camera.getPicture(options).then((imageData) => {
      this.cropImage(imageData);
    }, (err) => {
     console.log(err);
    });

  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
         console.log(error);
        }
      );
  }

  async showCroppedImage(ImagePath) {
    this.isLoading = true;

    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    await this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.propicurl = base64;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });

    this.copyFileToLocalDir(filePath, imageName, this.createFileName());
  }



  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }


  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.appService.appStorage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);

      if (!arr) {
        let newImages = [name];
        this.appService.appStorage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.appService.appStorage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
      this.startUpload(newEntry);
    });

  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }

  }

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        this.presentToast('Error while reading file.');
      });
  }

  readFile(file: any) {
    const reader = new FileReader();

    reader.onload = () => {
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });

      this.uploadImageData(imgBlob);
    };

    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(imgBlob: Blob) {

    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });

    await loading.present();

    const randomId = Math.random()
      .toString(36)
      .substring(2, 8);
 
    const uploadTask = this.storage.upload(
      `files/${new Date().getTime()}_${randomId}`,
      imgBlob
    );

    uploadTask.then(async res => {
      console.error(res);
      
      loading.dismiss();
      this.appService.showSuccessMsg('Upload Success')
    });
  }



  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Choose an image",
      buttons: [{
        text: "Choose from Gallery",
        handler: () => {
          this.takePhoto(0);
        }
      },
      {
        text: "Take a photo",
        handler: () => {
          this.takePhoto(1);
        }
      },
      {
        text: "Cancel",
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }




  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });

    toast.present();
  }




}
