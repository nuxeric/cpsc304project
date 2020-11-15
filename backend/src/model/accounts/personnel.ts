export default class Personnel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public permissions: object;
    public birthDate?: Date;
    public responsibilities?: string;

    constructor(id: number,
      firstName: string = "",
      lastName: string = "",
      permissions: object = { lineWorker: false, inventoryManager: false, personnelManager: false },
      birthDate: Date | undefined = undefined,
      responsibilities: string | undefined = undefined)
    {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.permissions = permissions;
      this.birthDate = birthDate;
      this.responsibilities = responsibilities;
    }

    public birthDateString(): string {
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.birthDate);
      const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(this.birthDate);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.birthDate);
      return `${ye}-${mo}-${da}`;
    }
}
