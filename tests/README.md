# Testing

This project uses [Vitest](https://vitest.dev/) for unit testing and [Vue Test Utils](https://test-utils.vuejs.org/) for component testing.

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

```
tests/
├── setup.ts              # Test setup and global configuration
├── unit/
│   ├── utils/            # Utility function tests
│   │   ├── date.test.ts
│   │   ├── patterns.test.ts
│   │   ├── validation.test.ts
│   │   └── sanitize.test.ts
│   └── composables/      # Composable tests (if needed)
└── e2e/                  # E2E tests (to be added)
```

## Writing Tests

### Unit Tests for Utilities

Utility functions are pure functions and easy to test:

```typescript
import { describe, it, expect } from 'vitest'
import { addYears } from '@/utils/date'

describe('addYears', () => {
  it('should add years correctly', () => {
    const date = new Date(2020, 0, 1)
    const result = addYears(date, 5)
    expect(result.getFullYear()).toBe(2025)
  })
})
```

### Component Tests

For Vue components, use Vue Test Utils:

```typescript
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Expected text')
  })
})
```

### Composable Tests

Composables that use `provide/inject` require special setup. Consider testing them through components or simplifying the composable design.

## Test Coverage

Current coverage includes:
- ✅ Date utilities (addYears, addMonths, etc.)
- ✅ Pattern matching (isRounded, isRepdigit, etc.)
- ✅ Input validation (validateDate, validateTime, etc.)
- ✅ Input sanitization (escapeHtml, sanitizeLabel, etc.)

## Future Test Additions

- [ ] Component tests for Vue components
- [ ] E2E tests with Playwright
- [ ] Integration tests for ICS generation
- [ ] Visual regression tests
