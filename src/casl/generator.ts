import * as fs from 'fs';

function extractModelsNames() {
  const schemaContent = fs.readFileSync('prisma/schema.prisma').toString();

  const regex = /model\s+(\w+)\s+{/g;
  const matches = [];
  let match;
  while ((match = regex.exec(schemaContent)) !== null) {
    matches.push(match[1]);
  }

  return matches; //['User', 'Post']
}

const models = extractModelsNames();

type defaultOverride = {
  [key in string]: { typeName: string; importPath: string };
};
function generateCaslSubjectsList(
  models: string[],
  extraOverrides: defaultOverride = {},
  defaultOverride: defaultOverride = {
    User: {
      typeName: 'TokenData',
      importPath: "import { TokenData } from './../../auth/types-auth';",
    },
  },
) {
  defaultOverride = Object.assign(defaultOverride, extraOverrides);
  //
  const customImports: string[] = [];
  const prismaImports: string[] = [];

  const content = ['export type SubjectsList = {'];
  models.map((model) => {
    if (model in defaultOverride) {
      customImports.push(defaultOverride[model].importPath);
      content.push(`  ${model}: ${defaultOverride[model].typeName};`);
    } else {
      prismaImports.push(model);
      content.push(`  ${model}: ${model};`);
    }
  });
  content.push('};');

  const stringCustomImports = customImports.join('\n');
  const stringPrismaImportsNames = prismaImports.join(', ');
  const allPrismaImports = `import { ${stringPrismaImportsNames} } from '@prisma/client';`;

  const result =
    allPrismaImports +
    '\n' +
    stringCustomImports +
    '\n\n' +
    content.join('\n') +
    '\n';

  return result;
}

fs.writeFileSync(
  'src/casl/generated/subjectsList.ts',
  generateCaslSubjectsList(models),
);
