
export interface PlayerData {
  x: number;
  y: number;
}

export abstract class DataStore {

  private static instance: DataStore;

  public static getDataStore(): DataStore {
    if (DataStore.instance != null) {
      return DataStore.instance;
    } else if (typeof FBInstant !== 'undefined') {
      DataStore.instance = new FacebookInstantGamesDataStore();
      return DataStore.instance;
    } else if (typeof localStorage !== 'undefined') {
      DataStore.instance = new LocalStorageDataStore();
      return DataStore.instance;
    }
    throw Error('not DataStore implemented for this platform');
  }

  public abstract getPlayerName(): string | null;

  public abstract getPlayerData(): Promise<Partial<PlayerData>>;

  public abstract setPlayerData(playerData: Partial<PlayerData>): Promise<void>;

  public abstract prepareClose(): Promise<void>;

}

export class FacebookInstantGamesDataStore extends DataStore {

  public getPlayerName(): string {
    return FBInstant.player.getName();
  }

  public getPlayerData(): Promise<Partial<PlayerData>> {
    return FBInstant.player.getDataAsync(['x', 'y']) as Promise<Partial<PlayerData>>;
  }

  public setPlayerData(playerData: Partial<PlayerData>): Promise<void> {
    return FBInstant.player.setDataAsync(playerData);
  }

  public prepareClose(): Promise<void> {
    return FBInstant.player.flushDataAsync();
  }

}

export class LocalStorageDataStore extends DataStore {

  private static PLAYER_NAME_KEY: string = 'PLAYER_NAME';

  private static PLAYER_DATA_KEY: string = 'PLAYER_DATA';

  public getPlayerName(): string | null {
    return localStorage.getItem(LocalStorageDataStore.PLAYER_NAME_KEY) || 'dev player';
  }

  public setPlayerName(name: string): void {
    return localStorage.setItem(LocalStorageDataStore.PLAYER_NAME_KEY, name);
  }

  public getPlayerData(): Promise<Partial<PlayerData>> {
    return new Promise((resolve, reject) => {
      try {
        const playerDataString = localStorage.getItem(LocalStorageDataStore.PLAYER_DATA_KEY);
        const playerData = JSON.parse(playerDataString);
        resolve(playerData || {});
      } catch (error) {
        reject(error);
      }
    });
  }

  public setPlayerData(playerData: Partial<PlayerData>): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const playerDataString = JSON.stringify(playerData);
        localStorage.setItem(LocalStorageDataStore.PLAYER_DATA_KEY, playerDataString);
      } catch (error) {
        reject(error);
      } finally {
        resolve();
      }
    });
  }

  public prepareClose(): Promise<void> {
    return Promise.resolve();
  }

}
