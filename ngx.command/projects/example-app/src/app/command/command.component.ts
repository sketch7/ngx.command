import * as _ from "lodash";
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { BehaviorSubject, timer, Observable, of } from "rxjs";
import { tap, filter, map, distinctUntilChanged } from "rxjs/operators";
import { CommandAsync } from "@ssv/ngx.command";

interface Hero {
  key: string;
  name: string;

  isInvulnerable?: boolean;
}

enum Roles {
  Assassin = 0,
  Warrior = 1,
  Specialist = 2,
  BossFight = 5
}

interface HeroPausedState {
  [key: string]: { isPaused: boolean };
}

@Component({
  selector: "app-command",
  templateUrl: "./command.component.html",
  styleUrls: ["./command.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandComponent {
  isValid = true;
  isExecuting = false;

  isValid$ = new BehaviorSubject(true);
  isValidRedux$ = new BehaviorSubject(true);
  isValidHeroRemove$ = new BehaviorSubject(true);

  saveCmd = new CommandAsync(this.save$.bind(this), this.isValid$);
  removeHeroCmd = new CommandAsync(this.removeHero$.bind(this), this.isValidHeroRemove$);
  pauseHeroCmd = new CommandAsync(this.pauseHero$.bind(this), this.isValidHeroRemove$);
  saveReduxCmd = new CommandAsync(
    this.saveRedux.bind(this),
    this.isValidRedux$,
  );
  heroes: Hero[] = [
    // { key: "rexxar", name: "Rexxar" },
    // { key: "malthael", name: "Malthael" },
    { key: "diablo", name: "Diablo" },
  ];

  get invulnerableHero(): Hero {
    return this.invulnerableHeroState$.value;
  }
  invulnerableHeroState$ = new BehaviorSubject({
    key: "brahum",
    name: "Brahum",
    isInvulnerable: true
  } as Hero);

  // saveCmdSync: ICommand = new Command(this.save$.bind(this), this.isValid$, true);
  // saveCmd: ICommand = new Command(this.save$.bind(this), null, true);
  private _state = new BehaviorSubject({ isLoading: false });
  private _pauseState = new BehaviorSubject<HeroPausedState>({});

  constructor(
    private cdr: ChangeDetectorRef
  ) {
  }

  save() {
    this.isExecuting = true;
    setTimeout(() => {
      this.isExecuting = false;
      this.cdr.markForCheck();
      console.warn("save", "execute complete");
    }, 2000);
  }

  toggleValidity(): void {
    this.isValid = !this.isValid;
  }

  toggleValidity$(): void {
    this.isValid$.next(!this.isValid$.value);
  }

  toggleValidityRedux(): void {
    this.isValidRedux$.next(!this.isValidRedux$.value);
  }

  toggleValidityRemoveHero(): void {
    this.isValidHeroRemove$.next(!this.isValidHeroRemove$.value);
  }

  removeHero$(hero: Hero, param2: any, param3: any) {
    console.log("removeHero", { hero, param2, param3, heroes: this.heroes });

    return timer(2000).pipe(
      tap(() =>
        _.remove(this.heroes, {
          key: hero.key,
        }),
      ),
      tap(() => console.warn("removeHero$", "execute complete", this.heroes)),
    );
  }

  pauseHero$(hero: Hero, param2: any, param3: any) {
    console.log("pauseHero$", { hero, param2, param3, heroes: this.heroes });

    this.updateHeroPause(hero.key, { isPaused: true });
    return timer(2000).pipe(
      tap(() => console.warn("pauseHero$", "execute complete", this.heroes)),
      tap(() => this.updateHeroPause(hero.key, { isPaused: false })),
    );
  }

  canPauseHero$(hero: Hero, param2: any, param3: any): Observable<boolean> {
    console.log("canPauseHero$ - factory init", { hero, param2, param3, heroes: this.heroes });
    return this._pauseState.pipe(
      tap(x => console.warn(">>>> canPauseHero$ - pauseState emit #1", x, hero)),
      map(x => x[hero.key]),
      map(x => !x || !x.isPaused),
      distinctUntilChanged(),
      tap(x => console.warn(">>>> canPauseHero$ change", x, hero)),
      tap(() => this.cdr.markForCheck()),
    );
  }

  canRemoveHero$(hero: Hero): Observable<boolean> {
    console.log("canRemoveHero$ - factory init", { hero });

    return this.invulnerableHeroState$.pipe(
      map(x => !!x.isInvulnerable),
      tap(x => console.warn(">>>> canRemoveHero$ change", x, hero)),
    );
  }

  toggleHeroVulnerability(): void {
    console.info("toggleHeroVulnerability");
    const h = this.invulnerableHero;
    const newHero: Hero = { ...h, isInvulnerable: !h.isInvulnerable };
    this.invulnerableHeroState$.next(newHero);
  }

  private updateHeroPause(key: string, changes: { isPaused: boolean }) {
    const newState = Object.assign({}, this._pauseState.value, { [key]: { ...changes } });
    console.warn(">>> _pauseState change", newState);
    this._pauseState.next(newState);
  }

  private save$() {
    return timer(2000).pipe(
      tap(() => console.warn("save$", "execute complete")),
    );
  }

  private saveRedux() {
    // fake dispatch/epic
    this.fakeDispatch();

    console.warn(">>> saveRedux init");
    // selector
    return this._state.pipe(
      filter(x => !x.isLoading),
      tap(x => console.warn(">>>> isloading", x))
    );
  }

  private fakeDispatch() {
    this._state.next({ isLoading: true });
    timer(2000)
      .pipe(
        tap(() => console.warn("saveRedux$", "execute complete")),
        tap(() => this._state.next({ isLoading: false })),
      ).subscribe();
  }
}
