import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  TemplateRef,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-drawer-wrapper',
  imports: [DrawerModule, ButtonModule, DialogModule],
  templateUrl: './drawer-wrapper.component.html',
  styleUrl: './drawer-wrapper.component.scss'
})
export class DrawerWrapperComponent implements OnInit {
  @Input() visible = false;
  @Input() title = "";
  @Output() close = new EventEmitter<void>();
  @ContentChild(TemplateRef) contentTemplate!: TemplateRef<any>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  onClose() {
    this.close.emit();
  }

  // Modal Close Btn
  isAndroid = false;
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
    }
  }
}
