import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeofencingPage } from './geofencing.page';

describe('GeofencingPage', () => {
  let component: GeofencingPage;
  let fixture: ComponentFixture<GeofencingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofencingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeofencingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
