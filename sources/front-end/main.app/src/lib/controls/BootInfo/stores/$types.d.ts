export type BootModuleStore = {
  /**
   * @constructor
   */
  constructor(name?: string): BootModuleStore;

  get ctor(): boolean;
  set ctor(value?: boolean): void;

  get init(): boolean;
  set init(value?: boolean): void;

  get run(): boolean;
  set run(value?: boolean): void;
}