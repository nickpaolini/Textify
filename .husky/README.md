# Git Hooks with Husky

This project uses [Husky](https://typicode.github.io/husky/) to enforce code quality and consistency through Git hooks.

## Available Hooks

### 📝 pre-commit

**Runs before every commit**

Uses `lint-staged` to run checks only on staged files:

- **ESLint**: Automatically fixes linting errors
- **Prettier**: Formats code according to style guide
- **TypeScript**: Type checks staged TypeScript files

This ensures:

- Code follows project style guidelines
- No linting errors are committed
- Code is properly formatted
- Type errors are caught early

### ✅ commit-msg

**Validates commit message format**

Enforces [Conventional Commits](https://www.conventionalcommits.org/) specification:

**Format**: `<type>(<scope>): <subject>`

**Allowed types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (maintenance, etc.)
- `revert`: Revert previous commit

**Examples**:

```bash
feat: add user authentication
fix(api): resolve CORS issue
docs: update README with setup instructions
refactor(components): simplify button component
test: add unit tests for utils
```

**Also allows**:

- Merge commits: `Merge branch 'feature'`
- Revert commits: `Revert "commit message"`
- Initial commits: `Initial commit`

### 🚀 pre-push

**Runs before pushing to remote**

Performs comprehensive checks:

1. **Type checking**: `npm run type-check`
2. **Tests**: `npm run test:run`
3. **Linting**: `npm run lint`

This prevents:

- Broken code from being pushed
- Failing tests in CI/CD
- Type errors in production

**Note**: This hook can take some time. If you need to skip it in an emergency:

```bash
git push --no-verify
```

⚠️ Use sparingly and fix issues immediately after!

## Bypassing Hooks

### Skip pre-commit

```bash
git commit --no-verify -m "message"
# or
git commit -n -m "message"
```

### Skip pre-push

```bash
git push --no-verify
```

**Warning**: Bypassing hooks should be rare and only in emergencies. Always fix issues promptly!

## Troubleshooting

### Hooks not running

1. Ensure Husky is installed:

   ```bash
   npm install
   ```

2. Check if hooks are executable:

   ```bash
   ls -la .husky/
   ```

3. Reinstall Husky:
   ```bash
   npm run prepare
   ```

### lint-staged issues

If lint-staged fails on a file:

1. Check the error message
2. Fix the issue manually
3. Stage the file again: `git add <file>`
4. Retry commit

### Type check errors

Type errors must be fixed before commit. Common issues:

- Missing type annotations
- Incorrect prop types
- Unused variables

Run `npm run type-check` to see all type errors.

### Test failures

If tests fail during pre-push:

1. Run tests locally: `npm run test:run`
2. Fix failing tests
3. Retry push

## Customization

### Modify pre-commit checks

Edit `.husky/pre-commit` or update `lint-staged` config in `package.json`.

### Modify commit message rules

Edit `.husky/commit-msg` to change validation rules.

### Modify pre-push checks

Edit `.husky/pre-push` to add/remove checks.

## Benefits

✅ **Consistent Code Style**: All code follows the same formatting
✅ **Catch Errors Early**: Find issues before they reach CI/CD
✅ **Better Commit History**: Readable, semantic commit messages
✅ **Team Collaboration**: Everyone follows the same standards
✅ **Faster Code Reviews**: Less focus on style, more on logic
✅ **Automated Quality**: No manual checking required

## Performance Tips

- Pre-commit hooks only check staged files (fast)
- Pre-push hooks check everything (slower but thorough)
- Use `--no-verify` sparingly for urgent hotfixes
- Run tests locally before committing to save time

## CI/CD Integration

These hooks mirror what runs in CI/CD, so:

- If hooks pass locally, CI/CD should pass too
- Catches issues before they reach remote
- Faster feedback loop for developers

## Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
