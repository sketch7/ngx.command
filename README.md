[projectUri]: https://github.com/sketch7/ngx.command
[changeLog]: ./CHANGELOG.md
[releaseWorkflowWiki]: ./docs/RELEASE-WORKFLOW.md

[npm]: https://www.npmjs.com
[commandpatternwiki]: https://en.wikipedia.org/wiki/Command_pattern

# @ssv/ngx.command
[![CI](https://github.com/sketch7/ngx.command/actions/workflows/ci.yml/badge.svg)](https://github.com/sketch7/ngx.command/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/%40ssv%2Fngx.command.svg)](https://badge.fury.io/js/%40ssv%2Fngx.command)

[Command pattern][commandpatternwiki] implementation for angular. Command's are used to encapsulate information which is needed to perform an action.

Primary usage is to disable a button when an action is executing, or not in a valid state (e.g. busy, invalid), and also to show an activity progress while executing.

**Quick links**

[Change logs][changeLog] | [Project Repository][projectUri]

## Installation

Get library via [npm]

```bash
npm install @ssv/ngx.command
```

Choose the version corresponding to your Angular version:

 | Angular | library |
 | ------- | ------- |
 | 10+     | 2.x+    |
 | 4 to 9  | 1.x+    |


# Usage

## Register module

```ts
import { SsvCommandModule } from "@ssv/ngx.command";

@NgModule({
  imports: [
    SsvCommandModule
  ]
}
export class AppModule {
}
```

## Command
In order to start working with Command, you need to create a new instance of it.

```ts
import { CommandDirective, Command, CommandAsync, ICommand } from "@ssv/ngx.command";

isValid$ = new BehaviorSubject(false);

// use `CommandAsync` when execute function returns an observable/promise OR else 3rd argument must be true.
saveCmd = new Command(() => this.save()), this.isValid$);

// using CommandAsync
saveCmd = new CommandAsync(() => Observable.timer(2000), this.isValid$);

// using ICommand interface
saveCmd: ICommand = new CommandAsync(() => Observable.timer(2000), this.isValid$);
```

## Command Attribute (Directive)
Handles the command `canExecute$`, `isExecuting` and `execute` functions of the `Command`, in order to
enable/disable, add/remove a cssClass while executing in order alter styling during execution (if desired)
and execute when its enabled and clicked.

Generally used on a `<button>` as below.

### Usage

```html
<!-- simple usage -->
<button [ssvCommand]="saveCmd">Save</button>

<!-- using isExecuting + showing spinner -->
<button [ssvCommand]="saveCmd">
  <i *ngIf="saveCmd.isExecuting" class="ai-circled ai-indicator ai-dark-spin small"></i>
  Save
</button>
```

#### Usage with params
This is useful for collections (loops) or using multiple actions with different args.
*NOTE: This will share the `isExecuting` when used with multiple controls.*

```html
<!-- with single param -->
<button [ssvCommand]="saveCmd" [ssvCommandParams]="{id: 1}">Save</button>
<!-- 
  NOTE: if you have only 1 argument as an array, it should be enclosed within an array e.g. [['apple', 'banana']], 
  else it will spread and you will arg1: "apple", arg2: "banana"
-->

 <!-- with multi params -->
<button [ssvCommand]="saveCmd" [ssvCommandParams]="[{id: 1}, 'hello', hero]">Save</button>
```

#### Usage with command creator
This is useful for collections (loops) or using multiple actions with different args, whilst not sharing `isExecuting`.

```html
<button [ssvCommand]="{host: this, execute: removeHero$, canExecute: isValid$, params: [hero, 1337, 'xx']}">Remove</button>
```

##### canExecute with params
```html
<button [ssvCommand]="{host: this, execute: removeHero$, canExecute: canRemoveHero$, params: [hero, 1337, 'xx']}">Remove</button>
```

```ts
canRemoveHero$(hero: Hero, id: number, param2): Observable<boolean> {
  return of(id).pipe(
    map(x => x === "invulnerable")
  );
}
```

## Usage without Attribute
It can also be used as below without the command attribute.

```html
<button
    [disabled]="!saveCmd.canExecute"
    (click)="saveCmd.execute()">
    Save
</button>
```

## CommandRef Attribute (directive)
Command creator ref, directive which allows creating Command in the template and associate it to a command (in order to share executions).

```html
<div *ngFor="let hero of heroes">
  <div #actionCmd="ssvCommandRef" [ssvCommandRef]="{host: this, execute: removeHero$, canExecute: isValid$}" class="button-group">
    <button [ssvCommand]="actionCmd.command" [ssvCommandParams]="hero">
      Remove
    </button>
    <button [ssvCommand]="actionCmd.command" [ssvCommandParams]="hero">
      Remove
    </button>
  </div>
</div>
```

## Utils

### canExecuteFromNgForm
In order to use with `NgForm` easily, you can use the following utility method.
This will make canExecute respond to `form.valid` and for `form.dirty` - also can optionally disable validity or dirty.

```ts
import { CommandAsync, canExecuteFromNgForm } from "@ssv/ngx.command";

loginCmd = new CommandAsync(this.login.bind(this), canExecuteFromNgForm(this.form));

// options - disable dirty check
loginCmd = new CommandAsync(this.login.bind(this), canExecuteFromNgForm(this.form, {
  dirty: false
}));

```


## Configure
In order to configure globally, you can do so as following:

```ts
import { SsvCommandModule } from "@ssv/ngx.command";

    imports: [
        SsvCommandModule.forRoot({ executingCssClass: "is-busy" })
    ],
```


## Getting Started

### Setup Machine for Development
Install/setup the following:

- NodeJS v18.16.0+
- Visual Studio Code or similar code editor
- TypeScript 5.0+
- Git + SourceTree, SmartGit or similar (optional)
- Ensure to install **global NPM modules** using the following:


```bash
npm install -g git gulp devtool
```


### Project Setup
The following process need to be executed in order to get started.

```bash
npm install
```


### Building the code

```bash
npm run build
```

### Running the tests

```bash
npm test
```

#### Watch
Handles compiling of changes.

```bash
npm start
```


#### Running Continuous Tests
Spawns test runner and keep watching for changes.

```bash
npm run tdd
```


### Preparation for Release

- Update changelogs
- bump version


Check out the [release workflow guide][releaseWorkflowWiki] in order to guide you creating a release and publishing it.