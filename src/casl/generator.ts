import {
  OverrideSubjects,
  generateCaslSubjectsToFile,
} from 'casl-prisma-generator/dist';

const overrides: OverrideSubjects = {
  User: {
    typeName: 'TokenData',
    importPath: "import { TokenData } from 'src/auth/types-auth';",
  },
};
generateCaslSubjectsToFile('src/casl/generated/subjectsList.ts', overrides);
