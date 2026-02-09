import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoachHomePage } from './coach-home.page';

describe('CoachHomePage', () => {
  let component: CoachHomePage;
  let fixture: ComponentFixture<CoachHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
