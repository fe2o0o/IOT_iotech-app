import { TranslationsService } from './../../../shared/services/translation.service';
import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('overlay', [
      state('show', style({
        position: 'fixed',
        left: '0',
        display: 'block'
      })),
      state('hide', style({
        position: 'fixed',
        // left: '-100%'
      })),
      transition('show <=> hide', [
        style({})
        , animate('{{transitionParams}}'),
        transition('void => *', animate(0))
      ])
    ])
  ]
})
export class IndexComponent {
  constructor(private _SharedService:SharedService,private _TranslationsService: TranslationsService) {
    this._TranslationsService.selected_lan_sub.subscribe((res: string) => {
      if (res == 'ar') {
        this.is_ar.set(true)
      } else {
        this.is_ar.set(false);
      }
    })


    this._SharedService.sidebar_state.subscribe((res: boolean) => {
      this.sidebar_state.set(res)
    })

    this._SharedService.overlayStatus.subscribe((res:boolean)=>{
      this.isOverlay.set(res)
    })
  }

  handleCloseOverlay() {
    this._SharedService.overlayStatus.next(false)
  }

  is_ar = signal<boolean>(false)

  sidebar_state = signal<boolean>(false)
  isOverlay = signal<boolean>(false)


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const windowWidth = event.target.innerWidth
    if (windowWidth < 960 && !this.isOverlay()) {
      this._SharedService.sidebar_state.next(false)
    }

    if (windowWidth > 960) {
      this._SharedService.sidebar_state.next(true)
    }

    if (windowWidth >= 640) {
      this._SharedService.overlayStatus.next(false)
    }
  }

}
