import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-base',
  standalone: false,
  templateUrl: './auth-base.component.html',
  styleUrl: './auth-base.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AuthBaseComponent {

}
