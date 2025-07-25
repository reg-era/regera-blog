import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bloger } from './bloger';

describe('Bloger', () => {
  let component: Bloger;
  let fixture: ComponentFixture<Bloger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bloger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bloger);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
