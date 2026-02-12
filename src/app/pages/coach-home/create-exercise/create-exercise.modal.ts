import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-create-exercise-modal',
    templateUrl: './create-exercise.modal.html',
    styleUrls: ['./create-exercise.modal.scss'],
    standalone: false
})
export class CreateExerciseModalComponent {
    name: string = '';
    muscleGroup: string = '';

    constructor(private modalCtrl: ModalController) { }

    close() {
        this.modalCtrl.dismiss();
    }

    save() {
        if (!this.name || !this.muscleGroup) {
            return;
        }
        this.modalCtrl.dismiss({
            name: this.name,
            muscleGroup: this.muscleGroup
        }, 'confirm');
    }
}
