import { NgModule } from '@angular/core';
import { AgmCoreModule } from 'ng-agm-core-lib';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyAsV8DLllskT26p40VVf_oex3fAswCc9cY' }),
  ],
  exports: [AgmCoreModule],
})
export class MapModule {}
