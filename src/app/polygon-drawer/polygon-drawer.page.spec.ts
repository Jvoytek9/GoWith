import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PolygonDrawerPage } from './polygon-drawer.page';

describe('PolygonDrawerPage', () => {
  let component: PolygonDrawerPage;
  let fixture: ComponentFixture<PolygonDrawerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolygonDrawerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PolygonDrawerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
