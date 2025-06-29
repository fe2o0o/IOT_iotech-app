import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-oulet',
  standalone: false,
  templateUrl: './auth-oulet.component.html',
  styleUrl: './auth-oulet.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AuthOuletComponent {

}
