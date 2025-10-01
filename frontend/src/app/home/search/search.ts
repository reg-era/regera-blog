import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef, Query } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchService, SearchSuggestion } from '../../../services/search-service';
import { debounceTime, distinctUntilChanged, filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class Search {
  private searchInput$ = new Subject<string>();
  suggestions$: Observable<SearchSuggestion | null>;
  showSuggestions = false;

  constructor(private router: Router, private searchService: SearchService) {
    this.suggestions$ = this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => query.length > 2),
      tap(() => {
        this.showSuggestions = true;
      }),
      switchMap(query => this.searchService.performSearch(query))
    );
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (query.length == 0) {
      this.showSuggestions = false;
      return;
    }
    this.showSuggestions = true;
    this.searchInput$.next(query);
  }

  navigate(link: string) {
    this.router.navigate([link]);
  }
}
