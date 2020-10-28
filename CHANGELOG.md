## [2.0.0](https://github.com/sketch7/ngx.ux/compare/1.5.1...2.0.0) (2020-10-29)

### Features

- **deps:** update dependencies to support Angular v10
- **deps:** add dependency on `tslib: ^2.0.0`

### BREAKING CHANGES

- **command:** remove deprecated code
- **command:** change `ssvCommand` and `ssvCommandRef` when using `CommandCreator` e.g. this syntax only `[ssvCommandRef]="{host: this, execute: removeHero$}` to require `host: this`. 
    This was added due to a limitation (which previously was handled via hack and is not supported anymore). [See this issue](https://github.com/angular/angular/issues/8277).
- **module:** rename module to `SsvCommandModule` from `CommandModule`

## [1.5.1](https://github.com/sketch7/ngx.ux/compare/1.5.0...1.5.1) (2020-10-28)

### Bug Fixes

- **build:** down version several dev dependencies packages in order to support angular 8 (and possibly less)
- **deps:** revert dependency on tslib `^1.10.0`

## [1.5.0](https://github.com/sketch7/ngx.command/compare/1.4.1...1.5.0) (2020-10-25)

### Features

_This version is focused for maintenance rather than features_

- **export:** export `CommandCreator` `ICommand`
- **deps:** now depends on tslib `^1.10.0`

### Refactor

- **lint:** fix all lint errors
- **all:** minor refactoring
- **all:** remove rxjs deprecations

### Chore

- **deps:** update dev dependencies
- **ci:** update node version
- **lint:** migrate from tslint to eslint

## [1.4.1](https://github.com/sketch7/ngx.command/compare/1.4.0...1.4.1) (2019-09-11)

### Bug Fixes

- **directive:** `canExecute` when started as `false` was not working with material buttons
- **command:** `canExecute` when returning `undefined`/`null` or so its always converted to bool instead as truthy

### Chore

- **example:** add/move examples to project

## [1.4.0](https://github.com/sketch7/ngx.command/compare/1.3.0...1.4.0) (2019-09-11)

### Features

- **directive:** now supports `canExecute` with params for the command creator only e.g.
```html
<button [ssvCommand]="{execute: removeHero$, canExecute: canRemoveHero$, params: [hero, 1337, 'xx']}">Remove</button>
```

## [1.3.0](https://github.com/sketch7/ngx.command/compare/1.2.6...1.3.0) (2019-07-24)

### Features

- **util:** `canExecuteFromNgForm` now take `CanExecuteFormOptions` and defaults to check for dirty check (UI modified). Can optionally disable whether to check for `validity` and for `dirty`.

## [1.2.6](https://github.com/sketch7/ngx.command/compare/1.2.5...1.2.6) (2019-06-11)

### Chore

_No new fixes/features in this release_

- **deps:** update dev dependencies
- **ci:** update node version

## [1.2.5](https://github.com/sketch7/ngx.command/compare/1.2.4...1.2.5) (2019-04-18)

### Bug Fixes

- **util:** fix `canExecuteFromNgForm` initial value will now emit

## [1.2.4](https://github.com/sketch7/ngx.command/compare/1.2.3...1.2.4) (2019-04-18)

### Features

- **util:** `canExecuteFromNgForm` now takes `AbstractControl | AbstractControlDirective` instead of `NgForm` - to support reactive forms

## [1.2.3](https://github.com/sketch7/ngx.command/compare/1.2.2...1.2.3) (2019-03-10)

### Bug Fixes

- **command:** fix regression when using with observable which doesn't complete, on next click `isExecuting` was being set to `false` immediately

## [1.2.2](https://github.com/sketch7/ngx.command/compare/1.2.1...1.2.2) (2019-03-10)

### Bug Fixes

- **command:** when `executeFn` returned observable was complete e.g. `EMPTY` it was still marked as executing.
- **command:** `ssvCommandOptions` defaults were only applied on initial, now they are merged with every change.

## [1.2.1](https://github.com/sketch7/ngx.command/compare/1.2.0...1.2.1) (2019-02-21)

### Chore

update tooling

## [1.2.0](https://github.com/sketch7/ngx.command/compare/1.1.2...1.2.0) (2019-02-20)

### Features

- **util:** add util `canExecuteFromNgForm` which takes `NgForm` and returns observable
- **util:** utils are now exported
- **command:** add exportAs `ssvCommand`

### Bug Fixes

- **command:** when `executeFn` was throwing, it was completing the observable and won't handle any more clicks

### Marked for Deprecation

- **command:** `command`, `commandOptions` and `commandParams` in favor of `ssv` prefixed e.g. `ssvCommand`, `ssvCommandOptions` and `ssvCommandParams`

## [1.1.2](https://github.com/sketch7/ngx.command/compare/1.1.1...1.1.2) (2018-11-02)

### Bug Fixes

- **directive:** wrap vars in if, as sometimes might not initialize and they will throw

## [1.1.1](https://github.com/sketch7/ngx.command/compare/1.1.0...1.1.1) (2018-10-20)

### Features

- **deps:** now depends on `@angular/core >=6.0.0` to be compatible with v7

## [1.1.0](https://github.com/sketch7/ngx.command/compare/1.0.2...1.1.0) (2018-10-19)

### Features

- **command ref:** implement `ssvCommandRef` directive, which creates a new instance and able to share it in views (useful for loops)
- **command:** `execute` now take `...args: any[]`
- **command:** implement `subscribe`, `unsubscribe` to be able to auto destroy while still having control
- **command:** optionally set `autoDestroy` (defaults to `true`), to auto destroy when subscribers are `0`.
- **command directive:** add `commandParams` input, arguments which are passed as execute arguments
- **command directive:** now takes a command creator which is now able to create command `[command]="{execute: removeHero$, canExecute: isValid$, params: [hero, 1337, 'xx']}"`

  This is useful for collections (loops) or using multiple actions with different args, whilst not sharing `isExecuting`.

- **util:** export `isCommand` and `isCommandCreator` utils, which check type of object.

## [1.0.2](https://github.com/sketch7/ngx.command/compare/1.0.0...1.0.2) (2018-07-31)

### Bug Fixes

- **directive:** fix an issue when using in an OnPush component

## [1.0.0](https://github.com/sketch7/ngx.command/compare/1.0.0-rc.2...1.0.0) (2018-06-21)

### Features

- **deps:** now depends on `@angular/core 6.x` and `rxjs 6.x`

## [1.0.0-rc.2](https://github.com/sketch7/ngx.command/compare/1.0.0-rc.1...1.0.0-rc.2) (2018-02-03)

### Features

- **ts:** fix typescript in strict

## [1.0.0-rc.1](https://github.com/sketch7/ngx.command/compare/1.0.0-rc.0...1.0.0-rc.1) (2018-01-30)

### Bug Fixes

- **release:** fixed release

## [1.0.0-rc.0](https://github.com/sketch7/ngx.command) (2014-12-14)

Initial release
