import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimeToGatePage } from './time-to-gate.page';

describe('TimeToGatePage', () => {
  let component: TimeToGatePage;
  let fixture: ComponentFixture<TimeToGatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeToGatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeToGatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
