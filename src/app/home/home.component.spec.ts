import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
/**
 * Unit tests for the HomeComponent.
 * This file contains tests to ensure that the component compiles correctly and behaves as expected.
 */
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  /**
   * Set up the testing module for HomeComponent.
   * This function initializes the testing environment and compiles the component.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: () => 1 } },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /**
   * Test to check if the HomeComponent compiles successfully.
   * This test ensures that the component can be instantiated without errors.
   */
  it('should compile', () => {
    // GIVEN
    // WHEN
    // THEN
    expect(component).toBeTruthy();
  });
  /**
   * Test to check if the HomeComponent renders the page correctly.
   * This test ensures that key labels and options are present in the DOM.
   */
  it('should render page', () => {
    // GIVEN
    // WHEN
    fixture.detectChanges();
    // THEN
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Home');
  });
});
