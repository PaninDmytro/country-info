import {
  ChangeDetectionStrategy,
  Component,
  forwardRef, HostListener,
  inject,
  Injector,
  Input,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor, FormControl, FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl
} from "@angular/forms";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input()
  type: 'text' | 'password' | 'email' = 'email';
  @Input()
  placeholder: string = '';

  private readonly injector: Injector = inject(Injector);
  protected control: FormControl | null = null;
  public focused: boolean = false;
  public isInputEmpty: boolean = false;

  @HostListener('focusin', ['$event]'])
  onFocusin(): void {
    this.focused = true;
  }

  @HostListener('focusout', ['$event]'])
  onFocusout(): void {
    this.focused = false;
  }

  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
  }

  ngOnInit(): void {
    this.getControl();
  }

  writeValue(value: string | null): void {
    this.value = value || '';
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  getControl(): void {
    try {
      const ngControl = this.injector.get(NgControl);
      if (ngControl instanceof FormControlName) {
        this.control = this.injector
          .get(FormGroupDirective)
          .getControl(ngControl);
        return;
      }
      this.control = (ngControl as FormControlDirective).form;
    } catch (error) {
      // No control
      this.control = null;
    }
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(target.value);
    this.onTouched();
  }
}
