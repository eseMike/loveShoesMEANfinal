import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// import { InlineSVGModule } from 'ng-inline-svg';
import { NoticeComponent } from './notice/notice.component';
import { CodePreviewComponent } from './code-preview/code-preview.component';
import { CoreModule } from '../../../core';

import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [NoticeComponent, CodePreviewComponent],
  imports: [
    CommonModule,
    InlineSVGModule,
    CoreModule,
    HighlightModule,
    NgScrollbarModule,
    NgbNavModule,
    NgbTooltipModule,
  ],
  exports: [NoticeComponent, CodePreviewComponent],
})
export class GeneralModule {}