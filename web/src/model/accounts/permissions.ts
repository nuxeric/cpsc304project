export default class Permissions {
  public lineWorker: boolean;
  public inventoryManager: boolean;
  public personnelManager: boolean;

  constructor(
    lineWorker: boolean = false,
    inventoryManager: boolean = false,
    personnelManager: boolean = false)
  {
    this.lineWorker = lineWorker;
    this.inventoryManager = inventoryManager;
    this.personnelManager = personnelManager;
  }
};
