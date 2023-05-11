import { OpenAPIObject } from '@nestjs/swagger';
import {
  ReferenceObject,
  ResponseObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function tsoaResponseToNestDocument(
  swaggerTsoa: OpenAPIObject,
  document: OpenAPIObject,
  pathPrefix: string,
) {
  const tsoaPathKeys = Object.keys(
    swaggerTsoa.paths,
  ) as (keyof typeof swaggerTsoa.paths)[];

  tsoaPathKeys.forEach((tsoaPathKey) => {
    const nestDocumentPathKey = pathPrefix + tsoaPathKey;

    if (!document.paths[nestDocumentPathKey]) {
      console.warn(
        `Tsoa path ${nestDocumentPathKey} not found on nest swagger document`,
      );
      return;
    }
    const tsoaPathMethods = Object.keys(
      swaggerTsoa.paths[tsoaPathKey],
    ) as Array<'get' | 'post' | 'patch' | 'put' | 'delete'>;

    tsoaPathMethods.forEach((tsoaPathMethod) => {
      if (!document.paths[nestDocumentPathKey][tsoaPathMethod]) {
        console.warn(
          `Tsoa path ${nestDocumentPathKey}, method ${tsoaPathMethod} not found on nest swagger document`,
        );
        return;
      }
      const tosaResponseStatusCodes = Object.keys(
        swaggerTsoa.paths[tsoaPathKey][tsoaPathMethod].responses,
      );

      //tsoa by default add only one statusCod(200), so if we not modified that, use nest-swagger-document statusCode(nest use 201 for post by default)
      let nestDocumentStatusCode: string[] = [];
      if (tosaResponseStatusCodes.length == 1) {
        nestDocumentStatusCode = Object.keys(
          document.paths[nestDocumentPathKey][tsoaPathMethod].responses,
        );
      }

      tosaResponseStatusCodes.forEach((tsoaResponseStatusCode, index) => {
        const responseStatusCode =
          nestDocumentStatusCode[index] || tsoaResponseStatusCode[index];
        if (
          !document.paths[nestDocumentPathKey][tsoaPathMethod].responses[
            responseStatusCode
          ]
        ) {
          console.warn(
            `Tsoa path ${tsoaPathKey}, method ${tsoaPathMethod}, statusCode ${responseStatusCode} not found on nest swagger document`,
          );
        } else {
          if (
            isNeedNewContent(
              document.paths?.[nestDocumentPathKey]?.[tsoaPathMethod]
                ?.responses?.[responseStatusCode]?.['content'],
            )
          ) {
            document.paths[nestDocumentPathKey][tsoaPathMethod].responses[
              responseStatusCode
            ]['content'] =
              swaggerTsoa.paths[tsoaPathKey][tsoaPathMethod].responses[
                tsoaResponseStatusCode
              ]['content'];
          }
        }
      });
    });
  });

  return document;
}

function isNeedNewContent(
  documentContent: ResponseObject | ReferenceObject | undefined,
) {
  return (
    !documentContent?.['application/json'] ||
    documentContent?.['application/json']?.['schema']?.['type']
  );
}
