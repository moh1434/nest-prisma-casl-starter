import {
  OverrideSubjects,
  generateCaslSubjectsToFile,
} from 'casl-prisma-generator/dist';

const overrides: OverrideSubjects = {
  AuthUser: {
    typeName: 'TokenData',
    importPath: "import { TokenData } from 'src/auth/types-auth';",
  },
  User: null,
};
generateCaslSubjectsToFile('src/casl/generated/subjectsList.ts', overrides);
