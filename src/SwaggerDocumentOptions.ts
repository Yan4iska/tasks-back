/* eslint-disable @typescript-eslint/ban-types */
import { OperationIdFactory } from "@nestjs/swagger";

export interface SwaggerDocumentOptions {
  include?: Function[];

  extraModels?: Function[];

  ignoreGlobalPrefix?: boolean;

  deepScanRoutes?: boolean;

  operationIdFactory?: OperationIdFactory;

  linkNameFactory?: (
    controllerKey: string,
    methodKey: string,
    fieldLey: string
  ) => string;


  autoTagControllers?: boolean;
}