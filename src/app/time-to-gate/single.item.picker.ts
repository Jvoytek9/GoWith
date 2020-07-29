import { Component } from "@angular/core";
import { PickerController } from "@ionic/angular";
import { PickerOptions } from "@ionic/core";

@Component({
  selector: "single-column-picker",
  templateUrl:"single.item.picker.html"
})
export class SingleItemPicker {
  animals: string[] = ["Tiger", "Lion", "Elephant", "Fox", "Wolf"];
  constructor(private pickerController: PickerController) {}

  async showPicker() {
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text:'Ok',
          handler:(value:any) => {
            console.log(value);
          }
        }
      ],
      columns:[{
        name:'Animals',
        options:this.getColumnOptions()
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  getColumnOptions(){
    let options = [];
    this.animals.forEach(x => {
      options.push({text:x,value:x});
    });
    return options;
  }
}

export interface PickerColumn {
    name: string;
    align?: string;
    selectedIndex?: number;
    prevSelected?: number;
    prefix?: string;
    suffix?: string;
    options: PickerColumnOption[];
    cssClass?: string | string[];
    columnWidth?: string;
    prefixWidth?: string;
    suffixWidth?: string;
    optionsWidth?: string;
    refresh?: () => void;
} 

export interface PickerColumnOption {
    text?: string;
    value?: any;
    disabled?: boolean;
    duration?: number;
    transform?: string;
    selected?: boolean;
}