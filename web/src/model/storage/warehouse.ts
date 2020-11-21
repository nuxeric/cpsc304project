export default class Warehouse {
    public id:              number;
    public total_volume:    number | undefined;
    public occupied_volume: number | undefined;
    public streetAddress:   string | undefined;
    public postalCode:      string | undefined;

    constructor(
      id:              number,
      total_volume:    number | undefined = undefined,
      occupied_volume: number | undefined = undefined,
      streetAddress:   string | undefined = undefined,
      postalCode:      string | undefined = undefined)
    {
      this.id = id;
      this.total_volume = total_volume;
      this.occupied_volume = occupied_volume;
      this.streetAddress = streetAddress;
      this.postalCode = postalCode;
    }
}
