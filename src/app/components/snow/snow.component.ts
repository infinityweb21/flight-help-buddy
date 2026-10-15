import {
  Component,
} from '@angular/core';
import { isPlatformBrowser, NgFor } from '@angular/common';



@Component({
  selector: 'app-snow',
  standalone: true,
  templateUrl: './snow.component.html',
  styleUrls: ['./snow.component.scss'],
  imports:[NgFor]
})
export class SnowComponent {

}
