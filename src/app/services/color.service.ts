import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ColorService {
  constructor() {}

  public getTextColor(backgroundColor: string): string {
    if (backgroundColor == null) {
      return 'white';
    }
    var r = parseInt(backgroundColor.substr(1, 2), 16);
    var g = parseInt(backgroundColor.substr(3, 2), 16);
    var b = parseInt(backgroundColor.substr(5, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  }
}
