export default class Inventory {
    public serial_num: number;
    public container_id: number;
    public type_name: string;
    public weight: number;
    public manufacture_date?: Date;

    constructor(
        serial_num: number,
        container_id: number,
        type_name: string,
        weight: number,
        manufacture_date: Date | undefined = undefined)
    {
        this.serial_num = serial_num;
        this.container_id = container_id;
        this.type_name = type_name;
        this.weight = weight;
        this.manufacture_date = manufacture_date;
    }

    public getDateString(): string {
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.manufacture_date);
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(this.manufacture_date);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.manufacture_date);
        return `${ye}-${mo}-${da}`;
    }

}
