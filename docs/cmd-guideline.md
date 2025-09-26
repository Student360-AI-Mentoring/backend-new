# Command Reference

Quick reference guide for common development commands and scenarios.

## Database Migrations

| Scenario | Command | When to use |
| --- | --- | --- |
| Generate migration after entity changes | `npm run migration:generate -- src/database/migrations/<MigrationName>` | After adding/changing TypeORM entities |
| Inspect the generated migration | check the new file in `src/database/migrations/` | Always review before running migrations |
| Run pending migrations | `npm run migration:run` | Deploy schema changes to database |
| Roll back the last migration | `npm run migration:revert` | When migration causes issues |
| See which migrations are pending | `npm run migration:show` | Check migration status |
| Create an empty migration | `npm run migration:create -- src/database/migrations/<MigrationName>` | For custom SQL or data migrations |

## Data Seeding

| Scenario | Command | When to use |
| --- | --- | --- |
| Execute the seed script | `npm run migration:seed` | Populate database with initial/test data |
| Seed entry point | `src/database/seeds/run-seeds.ts` | Modify seed data or add new seeds |

## Build & Start Commands

| Scenario | Command | When to use |
| --- | --- | --- |
| Build the project for production | `npm run build` | Before deployment, after major changes |
| Start the application (production) | `npm start` | Quick start without hot reload |
| Start with hot reload (development) | `npm run start:dev` | Daily development work |
| Start with debugging enabled | `npm run start:debug` | When debugging issues |
| Start production build | `npm run start:prod` | Testing production build locally |

## Code Quality & Testing

| Scenario | Command | When to use |
| --- | --- | --- |
| Lint the project (auto-fix issues) | `npm run lint` | Before committing, after code changes |
| Format code with Prettier | `npm run format` | Before committing, to standardize formatting |
| Run the unit test suite | `npm test` | Regular testing, CI/CD |
| Run tests in band mode | `npm test -- --runInBand --passWithNoTests` | When tests fail due to parallel execution |
| Watch tests for changes | `npm run test:watch` | During test development |
| Generate test coverage report | `npm run test:cov` | To check test coverage metrics |
| Debug tests | `npm run test:debug` | When debugging failing tests |
| Run end-to-end tests | `npm run test:e2e` | Before deployment, integration testing |

(Husky runs Prettier + ESLint on staged files via `lint-staged`, enforces commit message conventions, and executes Jest before push.)

## Git Hooks & Commit Conventions

### Commit Message Format
Follow [Conventional Commits](https://conventionalcommits.org/) format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Git Hooks
Husky automatically runs the following checks:
- **Pre-commit**: ESLint + Prettier on staged files
- **Commit-msg**: Validates commit message format
- **Pre-push**: Runs full test suite

**Troubleshooting:**
- If hooks don't trigger: Run `npm run prepare`
- If tests fail before push: Fix tests or use `--no-verify` (not recommended)
