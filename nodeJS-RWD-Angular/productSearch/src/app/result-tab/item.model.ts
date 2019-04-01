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
  ) {}
}
