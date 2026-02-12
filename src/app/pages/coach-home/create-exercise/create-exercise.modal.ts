import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-create-exercise-modal',
    templateUrl: './create-exercise.modal.html',
    styleUrls: ['./create-exercise.modal.scss'],
    standalone: false
})
export class CreateExerciseModalComponent implements OnInit {
    @Input() exercise: any;

    name: string = '';
    muscleGroup: string = '';
    isEdit: boolean = false;

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {
        if (this.exercise) {
            this.name = this.exercise.name;
            this.muscleGroup = this.exercise.muscleGroup;
            this.isEdit = true;
        }
    }

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
