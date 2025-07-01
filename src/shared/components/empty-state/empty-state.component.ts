import { Component, input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  standalone:false
})
export class EmptyStateComponent {
    loadingState = input<boolean>()

  isLoading: boolean = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loadingState'].currentValue) {
      this.isLoading = true
    } else {
      this.isLoading = false
    }
  }
}
