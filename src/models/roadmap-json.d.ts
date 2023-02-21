import { IDataControls } from "./balsamiq-resource";

export interface IRoadmapJson {
  mockup: {
    controls: IDataControls["controls"];
    attributes: {
      name: string;
      order: string;
      parentID: null;
      notes: string;
    };
    branchID: string;
    resourceID: string;
    measuredH: string;
    measuredW: string;
    mockupH: string;
    mockupW: string;
    version: string;
  };
  groupOffset: { x: number; y: number };
  dependencies: [];
  projectID: string;
}
