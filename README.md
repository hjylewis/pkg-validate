# pkg-validate

Validate packages in parallel

## Getting Started

1. `npm install --save-dev pkg-validate husky`
1. Update your `package.json` like this:

```diff json
{
  "scripts": {
+   "prepush": "pkg-validate"
  },
+ "pkg-validate": {
+   foo: "bar"
+ }
}
```
