import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SearchService, SearchSuggestion } from '../../../services/search-service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
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
export class SearchComponent implements OnInit, OnDestroy {
  suggestions$: BehaviorSubject<SearchSuggestion | null>;
  suggestionsQuery$: Subject<string>;
  private searchTimeout: any;
  showSuggestions = false;
  searchTerm: string = '';


  constructor(
    private router: Router,
    private searchService: SearchService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.suggestions$ = new BehaviorSubject<SearchSuggestion | null>(null);
    this.suggestionsQuery$ = new Subject();
  }

  ngOnDestroy(): void {
    this.suggestions$.unsubscribe();
    clearTimeout(this.searchTimeout);
  }

  ngOnInit(): void {
    this.suggestionsQuery$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.length === 0) {
            this.showSuggestions = false;
            return [];
          } else {
            return this.searchService.performSearch(query);
          }
        })
      )
      .subscribe((sugg) => {
        this.suggestions$.next(sugg)
        this.showSuggestions = true;
        this.changeDetector.markForCheck();
      });
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (query.length === 0) {
      this.showSuggestions = false;
    } else {
      this.suggestionsQuery$.next(query);
    }
  }

  navigate(link: string) {
    this.router.navigate([link]);
  }
}
