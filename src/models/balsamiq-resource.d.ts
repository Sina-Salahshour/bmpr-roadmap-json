export interface IResource {
  ID: string;
  BRANCHID: string;
  ATTRIBUTES: string;
  DATA: string;
}

export interface IParsedResourceAttributes {
  order: number;
  notes: null;
  kind: string;
  mimeType: string;
  thumbnailId: string;
  importedFrom: string;
  name: string;
  trashed: boolean;
  creationDate: number;
}

export interface IDataProperty {
  text?: string;
  [key: string]: any;
}

export interface IDataControls {
  controls: {
    control: {
      ID: string;
      measuredH: string;
      measuredW: string;
      properties?: IDataProperty;
      typeID: string;
      x: string;
      y: string;
      w?: string;
      h?: string;
      zOrder: string;
      children?: IDataControls;
    }[];
  };
}

export interface IParsedData {
  mockup: IDataControls & {
    measuredH: string;
    measuredW: string;
    mockupH: string;
    mockupW: string;
    version: string;
  };
}
