import {
  OverrideSubjects,
  generateCaslSubjectsToFile,
} from 'casl-prisma-generator/dist';

const overrides: OverrideSubjects = {
  AuthUser: {
    typeName: 'TokenData',
    importPath: "import { TokenData } from 'src/auth/auth-utils/types-auth';",
  },
  User: null,
};
generateCaslSubjectsToFile(
  'src/-tools/casl/generated/subjectsList.ts',
  overrides,
);
