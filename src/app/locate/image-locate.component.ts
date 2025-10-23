import {
  inject,
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { combineLatest, Observable, of as observableOf, map, startWith } from 'rxjs';

import { ImageService } from 'services/image-service/image.service';
/**
 * ImageLocateComponent is an Angular component that locates images.
 * @title Tree with flat nodes (childrenAccessor)
 */
@Component({
  selector: 'app-image-locate',
  templateUrl: 'image-locate.component.html',
  styleUrl: './image-locate.component.css',
  imports: [
    AsyncPipe,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageLocateComponent implements OnInit {
  imageBoxes: ImageBox[] = [];
  imageNames$: Observable<string[]> | undefined;

  columnsToDisplay = ['group', 'name'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ImageBox | null | undefined;
  readonly fallbackImageUrl = 'images/placeholder-image.jpg';
  searchForm = new FormGroup({
    page: new FormControl(1),
    limit: new FormControl(20),
    name: new FormControl('')
  });
  private imageService: ImageService = inject(ImageService);
  /**
   * A callback method that is invoked immediately after the
   * default change detector has checked the directive's
   * data-bound properties for the first time,
   * and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  ngOnInit() {
    this.loadImages();
    this.setupAutocomplete();
  }
  /**
   * Loads images.
   */
  loadImages() {
    const page = this.searchForm.get('page')?.value || 1;
    const limit = this.searchForm.get('limit')?.value || 20;
    const crewImages$ = this.imageService.getCrewImages(page, limit);
    const launchpadImages$ = this.imageService.getLaunchpadImages(page, limit);
    const rocketImages$ = this.imageService.getRocketImages(page, limit);

    combineLatest([
      crewImages$,
      launchpadImages$,
      rocketImages$
    ]).pipe(
      map(([crew, launchpads, rockets]) => {
        const launchpadBoxes = launchpads.map(l => ({
          group: '🟩 Launchpad',
          name: l.name,
          image: l.images?.large || this.fallbackImageUrl
        }));
        const rocketBoxes = rockets.map(r => ({
          group: '🟥 Rocket',
          name: r.name,
          image: r.flickr_images?.[0] || this.fallbackImageUrl
        }));
        const crewBoxes = crew.map(c => ({
          group: '🟦 Crew',
          name: c.name,
          image: c.image || this.fallbackImageUrl
        }));
        crewBoxes.sort((a, b) => {
          const surnameA = a.name.split(" ").slice(-1)[0].toLowerCase();
          const surnameB = b.name.split(" ").slice(-1)[0].toLowerCase();
          return surnameA.localeCompare(surnameB);
        });
        const allBoxes = [...launchpadBoxes, ...rocketBoxes, ...crewBoxes];
        const allNames = allBoxes.map(box => box.name);
        return { boxes: allBoxes, names: allNames };
      })
    ).subscribe(({ boxes, names }) => {
      this.imageBoxes = boxes;
      this.imageNames$ = observableOf(names);
    });
  }
  /**
   * Sets up autocomplete functionality for image names.
   */
  setupAutocomplete() {
    const namesArray: string[] = this.imageBoxes.map(box => box.name);
    this.imageNames$ = this.searchForm.get('name')?.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterNames(namesArray, value || ''))
    );
  }
  /**
   * Filters image names based on the input value.
   */
  filterNames(namesArray: string[], value: string): string[] {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 2) {
      return []; // Return empty array if input is too short
    }
    return namesArray.filter((name) =>
      name.toLowerCase().includes(filterValue)
    );
  }
  /**
   * Locates and expands the image box with the given name
   * Handler for the expand button.
   * Expands the node with the name currently selected in the autocomplete.
   * This function retrieves the value from the form control,
   * checks if it is a non-empty string, and then calls the expandNodeByName
   * method to expand the corresponding node in the tree.
   * If the value is empty or not a string, it does nothing.
   */
  locateImage() {
    const name = this.searchForm.get('name')?.value;
    if (typeof name !== 'string' || !name.trim()) {
      console.warn('ImageLocateComponent.locateImage(): empty image name');
      return;
    }
    const foundBox = this.imageBoxes.find(box =>
      box.name.toLowerCase() === name.toLowerCase()
    );
    if (foundBox) {
      this.expandedElement = foundBox;
    }
    console.log('🟪ImageLocateComponent.locateImage():');
  }
  /**
   * Checks whether a box is expanded.
   */
  isExpanded(imageBox: ImageBox) {
    return this.expandedElement === imageBox;
  }
  /**
   * Toggles the expanded state of a box.
   */
  toggle(imageBox: ImageBox) {
    this.expandedElement = this.isExpanded(imageBox) ? null : imageBox;
  }
  /**
   * Normalizes image URLs to prevent CORS issues
   * Converts imgur URLs to i.imgur.com format which supports CORS
   */
  normalizeImageUrl(url: string | undefined): string {
    if (!url) return this.fallbackImageUrl;
    try {
      // Handle imgur URLs
      if (url.includes('imgur.com')) {
        const imgurPattern = /(?:https?:\/\/)?(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)\.?(?:jpg|jpeg|png|gif)?/i;
        const match = url.match(imgurPattern);
        if (match && match[1]) {
          // Always use https://i.imgur.com format with .png extension
          return `https://i.imgur.com/${match[1]}.png`;
        }
      }
      // Handle flickr URLs - they usually work fine as is
      if (url.includes('staticflickr.com')) {
        return url;
      }
      return url;
    } catch (error) {
      console.warn('Error normalizing image URL:', error);
      return this.fallbackImageUrl;
    }
  }
  /**
   * Handles image loading errors by replacing with fallback image
   */
  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.warn('Image failed to load:', img.src);
    img.src = this.fallbackImageUrl;
  }
}

export interface ImageBox {
  group: string;
  name: string;
  image: string;
}
