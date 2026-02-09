import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AthleteHomePage } from './athlete-home.page';

describe('AthleteHomePage', () => {
  let component: AthleteHomePage;
  let fixture: ComponentFixture<AthleteHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
