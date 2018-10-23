[projecturi]: https://github.com/sketch7/ngx.command
[projectgit]: https://github.com/sketch7/ngx.command.git
[changelog]: ./CHANGELOG.md
[releaseworkflowwiki]: ./docs/RELEASE-WORKFLOW.md

[npm]: https://www.npmjs.com
[commandpatternwiki]: https://en.wikipedia.org/wiki/Command_pattern

# @ssv/ngx.command
[![CircleCI](https://circleci.com/gh/sketch7/ngx.command.svg?style=shield)](https://circleci.com/gh/sketch7/ngx.command)
[![npm version](https://badge.fury.io/js/%40ssv%2Fngx.command.svg)](https://badge.fury.io/js/%40ssv%2Fngx.command)

[Command pattern][commandpatternwiki] implementation for angular. Command's are used to encapsulate information which is needed to perform an action.

Primary usage is to disable a button when an action is executing, or not in a valid state (e.g. busy, invalid), and also to show an activity progress while executing.

**Quick links**

[Change logs][changeLog] | [Project Repository][projectUri]

# Installation

Get library via [npm]

```bash
npm install @ssv/ngx.command
```

# Usage

## Register module

```ts
import { CommandModule } from "@ssv/ngx.command";

@NgModule({
  imports: [
    CommandModule
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
<button [command]="saveCmd">Save</button>

<!-- using isExecuting + showing spinner -->
<button [command]="saveCmd">
  <i *ngIf="saveCmd.isExecuting" class="ai-circled ai-indicator ai-dark-spin small"></i>
  Save
</button>
```

#### Usage with params
This is useful for collections (loops) or using multiple actions with different args.
*NOTE: This will share the `isExecuting` when used with multiple controls.*

```html
<!-- with single param -->
<button [command]="saveCmd" [commandParams]="{id: 1}">Save</button>
<!-- 
  NOTE: if you have only 1 argument as an array, it should be enclosed within an array e.g. [['apple', 'banana']], 
  else it will spread and you will arg1: "apple", arg2: "banana"
-->

 <!-- with multi params -->
<button [command]="saveCmd" [commandParams]="[{id: 1}, 'hello', hero]">Save</button>
```

#### Usage with command creator
This is useful for collections (loops) or using multiple actions with different args, whilst not sharing `isExecuting`.

```html
<button [command]="{execute: removeHero$, canExecute: isValid$, params: [hero, 1337, 'xx']}">Save</button>
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
  <div #actionCmd="ssvCommandRef" [ssvCommandRef]="{execute: removeHero$, canExecute: isValid$}" class="button-group">
    <button [command]="actionCmd.command" [commandParams]="hero">
      Remove
    </button>
    <button [command]="actionCmd.command" [commandParams]="hero">
      Remove
    </button>
  </div>
</div>
```

## Configure
In order to configure globally, you can do so as following:

```ts
import { CommandModule } from "@ssv/ngx.command";

    imports: [
        CommandModule.forRoot({ executingCssClass: "is-busy" })
    ],
```


## Getting Started

### Setup Machine for Development

Install/setup the following:

* NodeJS v10+
* Visual Studio Code or similar code editor
* TypeScript 3.1+
* Git + SourceTree, SmartGit or similar (optional)
* Ensure to install **global NPM modules** using the following:

```bash
npm install -g git gulp yarn devtool
```

#### Cloning Repo

* Run `git clone https://github.com/sketch7/ngx.command.git`

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

### Development utils

#### Watch

Builds on changes.

```bash
npm start
```

#### Running Continuous Tests

Spawns test runner and keep watching for changes.

```bash
npm run tdd
```

### Preparation for Release

```bash
npm run prepare-release -- --bump major|minor|patch|prerelease (default: patch)
```

Check out the [release workflow guide][releaseworkflowwiki] in order to guide you creating a release and publishing it.
