import { Injectable } from "@angular/core";
import { UserObject } from "./user-service";
import { BlogObject } from "./blog-service";
import { environment } from "../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";


export interface SearchSuggestion {
  users: UserObject[];
  blogs: BlogObject[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) { }

  performSearch(query: string): Observable<SearchSuggestion | null> {
    return this.http.post<SearchSuggestion>(
      `${environment.apiURL}/api/search`,
      query
    ).pipe(
      catchError(err => of(null))
    );
  }
}
