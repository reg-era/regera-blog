import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef, Query, OnDestroy } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchService, SearchSuggestion } from '../../../services/search-service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, map, Observable, Subject, switchMap, tap } from 'rxjs';
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
export class Search implements OnDestroy {
  suggestions$: BehaviorSubject<SearchSuggestion | null>;
  private searchTimeout: any;
  showSuggestions = false;


  constructor(private router: Router, private searchService: SearchService) {
    this.suggestions$ = new BehaviorSubject<SearchSuggestion | null>(null);
  }

  ngOnDestroy(): void {
    this.suggestions$.unsubscribe();
    clearTimeout(this.searchTimeout);
  }

  onSearchInput(event: Event): void {
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      const query = (event.target as HTMLInputElement).value.trim().toLowerCase();

      if (query.length === 0) {
        this.showSuggestions = false;
        return;
      }

      this.searchService.performSearch(query).subscribe((sugg) => {
        this.suggestions$.next(sugg);
        this.showSuggestions = true;
      });
    }, 300);
  }

  navigate(link: string) {
    this.router.navigate([link]);
  }
}
