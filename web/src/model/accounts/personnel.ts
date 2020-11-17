import Permissions from "./permissions";

export default class Personnel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public permissions: Permissions;
    public birthDate?: Date;
    public responsibilities?: string;
    public employeesManaged?: number;

    constructor(
      id: number,
      firstName: string = "",
      lastName: string = "",
      permissions: Permissions = new Permissions(false, false, false),
      birthDate: Date | undefined = undefined,
      responsibilities: string | undefined = undefined,
      employeesManaged: number | undefined = undefined)
    {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.permissions = permissions;
      this.birthDate = birthDate;
      this.responsibilities = responsibilities;
      this.employeesManaged = employeesManaged;
    }

    public birthDateString(): string {
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.birthDate);
      const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(this.birthDate);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.birthDate);
      return `${ye}-${mo}-${da}`;
    }

    public static birthDateString(date: string | undefined): string {
      if (date == undefined) {
        return "";
      }
      const d = new Date(date);
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      return `${ye}-${mo}-${da}`;
    }
}
