import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-careers',
  imports: [RouterLink],
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss'
})
export class CareersComponent {
  jobs = [
    { id: 1, title: 'Sr. Executive – Data Analysis and Auditing', category: 'Development', type: 'Full Time', location: 'Remote' },
    { id: 2, title: 'Marketing Specialist', category: 'Marketing', type: 'Part Time', location: 'On-site' },
    { id: 3, title: 'UX Designer', category: 'Design', type: 'Internship', location: 'Hybrid' },
    { id: 4, title: 'Sr. Executive – Data Analysis and Auditing', category: 'Development', type: 'Full Time', location: 'Remote' },
    { id: 5, title: 'Marketing Specialist', category: 'Marketing', type: 'Part Time', location: 'On-site' },
    { id: 6, title: 'UX Designer', category: 'Design', type: 'Internship', location: 'Hybrid' }
  ];
}
