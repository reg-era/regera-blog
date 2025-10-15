import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './error.html',
  styleUrls: ['./error.scss'],
})
export class ErrorComponent implements OnInit {
  maxArray = [...Array(200).keys()].map(i => i + 1);
  message: string = 'Oops! Something went wrong.';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('status');
    if (!id || id == '') id = '404';
    switch (id) {
      case '404':
        this.message = '404 - Page Not Found';
        break;
      case '500':
        this.message = '500 - Internal Server Error';
        break;
      default:
        this.message = 'Unexpected Error. Please try again later.';
        break;
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
