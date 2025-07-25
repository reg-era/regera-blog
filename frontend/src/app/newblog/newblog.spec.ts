import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Newblog } from './newblog';

describe('Newblog', () => {
  let component: Newblog;
  let fixture: ComponentFixture<Newblog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Newblog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Newblog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
