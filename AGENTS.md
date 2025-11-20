# Agent Development Guidelines

## Build Commands

- `npm run build` - Compile TypeScript to dist/
- `npm run dev` - Development mode with ts-node
- `npm test` - Run all tests with Bun
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - ESLint check
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Prettier formatting
- `npm run typecheck` - TypeScript type checking without emit

## Single Test Execution

Use Bun test filtering: `bun test --test-name-pattern "test name"` or `bun test path/to/test.test.ts`

## Code Style Guidelines

### TypeScript & Imports

- Use ES2022 target with CommonJS modules
- Import from `.js` extensions (TypeScript resolves them)
- Strict TypeScript enabled - always type parameters and returns
- Use interfaces for object shapes, types for unions/primitives

### Naming Conventions

- Classes: PascalCase (e.g., `VSTools`, `VerbalizedSamplingMcpServer`)
- Methods/variables: camelCase (e.g., `handleTool`, `defaultVSPrompt`)
- Constants: UPPER_SNAKE_CASE for static values
- File names: kebab-case for files, PascalCase for classes

### Error Handling

- Use try/catch blocks with proper error typing
- Wrap errors in McpError for MCP protocol responses
- Distinguish between InvalidParams and InternalError
- Always include meaningful error messages

### Testing Standards

- Use Bun test framework with describe/it/expect
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies in beforeEach
- Test both happy paths and error conditions
- Keep tests focused and atomic

### Code Organization

- Keep functions 10-30 lines when possible
- Use private methods for internal logic
- Separate interfaces from implementations
- Group related functionality in classes

### MCP Protocol

- All tools return { content: [{ type: "text", text: string }] }
- Use proper inputSchema validation
- Handle unknown tools with InvalidParams error
- Include required parameters in schemas
