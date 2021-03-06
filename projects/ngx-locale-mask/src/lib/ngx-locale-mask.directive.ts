import { Directive, Input, forwardRef, HostListener, HostBinding, Renderer2 } from '@angular/core';
import { NgxLocaleMaskService } from './ngx-locale-mask.service';
import { DateMask, CurrencyMask, NumberMask, PercentMask } from './ngx-locale-mask.modal';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { registerLocaleData, formatCurrency } from '@angular/common';

@Directive({
  selector: 'input[type=text][localeMask]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgxLocaleMaskDirective), multi: true } ]
})
export class NgxLocaleMaskDirective implements ControlValueAccessor {
  constructor(private _ngxLocaleMaskService: NgxLocaleMaskService, private renderer: Renderer2) { 
  }

  activeMask: string;
  preValue: string;

  @Input()
  public set locale(value: Object) {
    this._ngxLocaleMaskService.locale = value.toString();
    registerLocaleData(this._ngxLocaleMaskService.locale);
  }

  @Input()
  public set dateMask(value: DateMask) {
    this._ngxLocaleMaskService.maskCategoryAndOptions = value;
    this.activeMask = 'date';
  }
  @Input()
  public set currencyMask(value: CurrencyMask) {
    this._ngxLocaleMaskService.maskCategoryAndOptions = value;
    this.activeMask = 'currency';
  }
  @Input()
  public set numberMask(value: NumberMask) {
    this._ngxLocaleMaskService.maskCategoryAndOptions = value;
    this.activeMask = 'number';
  }
  @Input()
  public set percentMask(value: PercentMask) {
    this._ngxLocaleMaskService.maskCategoryAndOptions = value;
    this.activeMask = 'percent';
  }

  @HostListener('keyup', ['$event.target.value', '$event'])
  onTyping(value: string, e) {
    const { format = '', timezone = '', currency = '', currencyCode = '', digitsInfo = '' } = {
      ...this._ngxLocaleMaskService.maskCategoryAndOptions
    };
    const val: number = +value.replace(/[^0-9.]/g, '');
    const condition = formatCurrency(val, this._ngxLocaleMaskService.locale, currency, currencyCode, digitsInfo);
    console.log(condition);
    switch (this.activeMask) {
      case 'date': { break; }
      case 'currency': {
        if (condition === currency + '∞' || condition === '∞' || (condition === this.preValue && e.keyCode !== 190))  {
          this.valueOfTextBox = this.preValue;
        } else {
          if (condition !== '0' || condition !== currency + '0') {
            this.valueOfTextBox = condition;
            this.preValue = condition;
          }
        }
        break;
      }
      case 'number': { break; }
      case 'percent': { break; }
    }
  }

  @HostBinding('value') valueOfTextBox = '';




  // ControlValueAccessor implementation
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

}
