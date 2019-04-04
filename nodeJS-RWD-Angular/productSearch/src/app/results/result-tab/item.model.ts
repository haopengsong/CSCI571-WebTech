import {shippingInfo} from "./shippinginfo.model";
import {Sellerinfo} from "./sellerinfo.model";

export class Item {
  constructor(
    public indexNumber: number,
    public imagePath: string,
    public title: string,
    public price: string,
    public shippingOption: string,
    public zip: string,
    public seller: string,
    public titleCutted: string,
    public itemID: string,
    public inList: string,
    public inListFlag: boolean,
    public shippingInfo: shippingInfo,
    public sellerInfo: Sellerinfo
  ) {}
}
