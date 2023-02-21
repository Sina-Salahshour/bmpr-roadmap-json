export interface IInfoEntries {
  SchemaVersion: string;
  ArchiveRevision: string;
  ArchiveRevisionUUID: string;
  ArchiveFormat: string;
  ArchiveAttributes: string;
}

export interface IParsedInfoArchiveAttributes {
  creationDate: number;
  name: string;
}
