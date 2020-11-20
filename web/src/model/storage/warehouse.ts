export default class Warehouse {
    public id: number;
    public total_volume: number;
    public occupied_volume: number;
    public streetAddress: string;
    public postalCode: string;

    constructor(
      id: number,
      total_volume: number = 0,
      occupied_volume: number = 0,
      streetAddress: string = "",
      postalCode: string = "")
    {
      this.id = id;
      this.total_volume = total_volume;
      this.occupied_volume = occupied_volume;
      this.streetAddress = streetAddress;
      this.postalCode = postalCode;
    }
}
