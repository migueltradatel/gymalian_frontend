import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-session-detail-modal',
    templateUrl: './session-detail.modal.html',
    styleUrls: ['./session-detail.modal.scss'],
    standalone: false
})
export class SessionDetailModalComponent implements OnInit {
    @Input() log: any;
    @Input() planName: string = '';

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {
        console.log('Log detail for modal:', this.log);
    }

    close() {
        this.modalCtrl.dismiss();
    }
}
