export {};

declare global {
  type OmitStrict<ObjectType, KeysType extends keyof ObjectType> = Pick<
    ObjectType,
    Exclude<keyof ObjectType, KeysType>
  >;
}
